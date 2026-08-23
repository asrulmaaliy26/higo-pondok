import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Trash2, Plus, Minus, Store, ChevronRight, ChevronLeft, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { getStorageUrl } from '../../lib/axios';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export default function Keranjang() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  const { cart, addItem, removeItem, clearCanteen, clearAll, updateItemNote } = useCartStore();

  const [deliveryLocation, setDeliveryLocation] = useState(user?.santri_room || '');
  const [canteenNotes, setCanteenNotes] = useState({}); // canteenId -> general note
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProfileAlert, setShowProfileAlert] = useState(false);

  const canteenEntries = Object.entries(cart); // [[canteenId, { canteen, items }], ...]

  const totalItems = canteenEntries.reduce(
    (sum, [, c]) => sum + Object.values(c.items).reduce((s, i) => s + i.quantity, 0), 0
  );

  // Calculate per-canteen totals based on category
  const canteenSummaries = canteenEntries.map(([canteenId, { canteen, items }]) => {
    const itemList = Object.values(items);
    const subtotal = itemList.reduce((s, i) => s + parseFloat(i.product.price) * i.quantity, 0);
    const qty = itemList.reduce((s, i) => s + i.quantity, 0);
    
    // Category pricing (Kauman vs Kota)
    const category = canteen.category || 'kauman';
    const baseDeliveryFee = category === 'kota' ? 3500 : 2000;
    const adminFee = category === 'kota' ? 1500 : 1000;

    // Quantity multiplier (+ Rp 3.000 for every 5 extra items after first 5)
    const extraBlocks = Math.max(0, Math.floor((qty - 1) / 5));
    const deliveryFee = baseDeliveryFee + (extraBlocks * 3000);

    const total = subtotal + deliveryFee + adminFee;
    return { canteenId, canteen, itemList, subtotal, deliveryFee, adminFee, total, qty };
  });

  const grandTotal = canteenSummaries.reduce((s, c) => s + c.total, 0);

  const finalLocation = deliveryLocation.trim();

  const handleCheckoutAll = async () => {
    // Validasi
    if (!user?.phone || !user?.santri_name || !user?.santri_room || !user?.santri_class || !user?.santri_level) {
      setShowProfileAlert(true);
      return;
    }
    if (!finalLocation) {
      window.alert('Silakan pilih atau ketik lokasi pengiriman Anda terlebih dahulu sebelum Checkout.');
      return;
    }



    setIsProcessing(true);

    // Buat order 1 per kantin secara berurutan
    const results = [];
    for (const { canteenId, canteen, itemList, subtotal, deliveryFee, total } of canteenSummaries) {
      try {
        const payload = {
          canteen_id: canteen.id,
          delivery_location: finalLocation,
          custom_notes: canteenNotes[canteenId] || '',
          items: itemList.map(i => ({
            product_id: i.product.id,
            quantity: i.quantity,
            notes: i.notes || ''
          }))
        };
        const res = await api.post('/orders', payload);
        results.push({ ok: true, canteen, order: res.data?.order, itemList, subtotal, deliveryFee, total });
      } catch (err) {
        const errorDetail = err.response?.data?.error;
        const errorMessage = err.response?.data?.message;
        results.push({ 
          ok: false, 
          canteen, 
          error: errorDetail || errorMessage || 'Gagal' 
        });
      }
    }

    setIsProcessing(false);

    const succeeded = results.filter(r => r.ok);
    const failed = results.filter(r => !r.ok);

    if (succeeded.length === 0) {
      // Jika semua gagal (termasuk kalau cuma checkout 1 toko dan gagal),
      // tampilkan alasan error dari API agar user tahu penyebabnya.
      const errorMessage = failed.length > 0 && failed[0].error && failed[0].error !== 'Gagal'
        ? failed[0].error
        : 'Semua pesanan gagal dibuat. Coba lagi.';
        
      toast.error(errorMessage);
      return;
    }

    if (failed.length > 0) {
      toast.error(failed[0].error || `${failed.length} pesanan gagal: ${failed.map(f => f.canteen.name).join(', ')}`);
    } else {
      toast.success(`${succeeded.length} pesanan berhasil dibuat!`);
    }

    // Hapus kantin yang sukses dari keranjang
    for (const r of succeeded) {
      clearCanteen(r.canteen.id);
    }

    queryClient.invalidateQueries({ queryKey: ['orders'] });
    toast.success('Pesanan masuk ke riwayat. Hubungi toko untuk konfirmasi via halaman Riwayat.');
    navigate({ to: '/dashboard/pembayaran' });
  };

  if (canteenEntries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        {/* Header with back button */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4 flex items-center gap-3 sticky top-0 z-20">
          <button
            onClick={() => navigate({ to: '/dashboard/kantin' })}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Keranjang</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-24 h-24 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Keranjang Masih Kosong</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Tambahkan menu favoritmu dari berbagai kantin ya!</p>
          <button
            onClick={() => navigate({ to: '/dashboard/kantin' })}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-green-600/30 transition-colors"
          >
            Jelajahi Kantin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate({ to: '/dashboard/kantin' })}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <ShoppingCart className="w-5 h-5 text-green-600" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Keranjang <span className="text-green-600">({totalItems})</span>
          </h1>
        </div>
        <button
          onClick={() => { if (window.confirm('Kosongkan semua keranjang?')) clearAll(); }}
          className="text-xs text-red-500 font-semibold flex items-center gap-1 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" /> Kosongkan
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4 max-w-2xl mx-auto">

        {/* Per-canteen groups */}
        {canteenSummaries.map(({ canteenId, canteen, itemList, subtotal, deliveryFee, adminFee, total }) => (
          <div key={canteenId} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Canteen header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Store className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{canteen.name}</p>

                </div>
              </div>
              <button
                onClick={() => clearCanteen(canteenId)}
                className="text-red-400 hover:text-red-600 transition-colors"
                title="Hapus kantin dari keranjang"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {itemList.map(({ product, quantity, notes }) => (
                <div key={product.id} className="p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0 overflow-hidden">
                      {product.image
                        ? <img src={getStorageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Store className="w-5 h-5 text-gray-300" /></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{product.name}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 font-bold mt-0.5">
                        Rp {parseFloat(product.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                    {/* Qty control */}
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800">
                      <button
                        onClick={() => removeItem(canteenId, product.id)}
                        className="w-8 h-8 flex items-center justify-center text-green-700 dark:text-green-400 rounded-full active:bg-green-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-green-700 dark:text-green-400">{quantity}</span>
                      <button
                        onClick={() => addItem(canteen, product)}
                        disabled={quantity >= 99}
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${quantity >= 99 ? 'text-gray-300' : 'text-green-700 dark:text-green-400 active:bg-green-100'}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Input Catatan Detail Produk */}
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700/60">
                    <span className="text-xs text-gray-400">📝</span>
                    <input
                      type="text"
                      placeholder="Catatan produk (misal: pedas level 2, es sedikit)..."
                      value={notes || ''}
                      onChange={e => updateItemNote(canteenId, product.id, e.target.value)}
                      className="w-full text-xs bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none placeholder-gray-400"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Canteen subtotal */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 space-y-1 text-sm">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Subtotal Produk</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>🛵 Ongkir</span>
                <span>Rp {deliveryFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>🛡️ Biaya Admin Layanan</span>
                <span>Rp {adminFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-1 border-t border-gray-200 dark:border-gray-700">
                <span>Total Toko</span>
                <span className="text-green-600 dark:text-green-400">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Delivery Location */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-900 dark:text-white">Lokasi Pengiriman</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Otomatis terisi dari data kamar Santri dan dapat Anda edit bebas di sini.
          </p>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Masukkan lokasi pengiriman (misal: Al Majid 1 / Asrama B)"
              value={deliveryLocation}
              onChange={e => setDeliveryLocation(e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
            />
          </div>
        </div>

        {/* Grand total info */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">{canteenEntries.length} Toko • {totalItems} Item</p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">Termasuk ongkir semua toko</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-600 dark:text-green-500">Total Keseluruhan</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-400">Rp {grandTotal.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom checkout button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleCheckoutAll}
            disabled={isProcessing}
            className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg shadow-green-600/30 transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses Pesanan...
              </>
            ) : (
              <>
                Checkout {canteenEntries.length} Toko <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-gray-400 mt-2">WA konfirmasi akan dikirim ke setiap toko</p>
        </div>
      </div>
      {/* Profil Belum Lengkap Modal */}
      {showProfileAlert && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl p-6 text-center my-auto">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Profil Belum Lengkap</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Silakan isi identitas santri dan nomor telepon (WhatsApp) di halaman Profil terlebih dahulu sebelum melakukan Checkout.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowProfileAlert(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 transition-colors"
              >
                Nanti Saja
              </button>
              <button 
                onClick={() => {
                  setShowProfileAlert(false);
                  navigate({ to: '/dashboard/profile' });
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Ke Profil
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
