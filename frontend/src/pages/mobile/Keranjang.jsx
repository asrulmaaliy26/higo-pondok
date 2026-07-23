import React, { useState } from 'react';
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
  const { cart, addItem, removeItem, clearCanteen, clearAll } = useCartStore();

  const [deliveryLocation, setDeliveryLocation] = useState(user?.santri_room || '');
  const [customLocation, setCustomLocation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const predefinedLocations = user?.santri_room ? [user.santri_room] : [];
  const canteenEntries = Object.entries(cart); // [[canteenId, { canteen, items }], ...]

  const totalItems = canteenEntries.reduce(
    (sum, [, c]) => sum + Object.values(c.items).reduce((s, i) => s + i.quantity, 0), 0
  );

  // Calculate per-canteen totals
  const canteenSummaries = canteenEntries.map(([canteenId, { canteen, items }]) => {
    const itemList = Object.values(items);
    const subtotal = itemList.reduce((s, i) => s + parseFloat(i.product.price) * i.quantity, 0);
    const qty = itemList.reduce((s, i) => s + i.quantity, 0);
    const baseDeliveryFee = parseFloat(canteen.delivery_fee || 0);
    const deliveryFee = qty > 5 ? baseDeliveryFee * 2 : baseDeliveryFee;
    // Tiered Admin Fee: < 20k -> 500, 20k-39.9k -> 1000, 40k-59.9k -> 1500, etc. (kelipatan 20rb + 500 perak)
    const adminFee = subtotal > 0 ? (Math.floor(subtotal / 25000) + 1) * 500 : 0;
    const total = subtotal + deliveryFee + adminFee;
    return { canteenId, canteen, itemList, subtotal, deliveryFee, adminFee, total, qty };
  });

  const grandTotal = canteenSummaries.reduce((s, c) => s + c.total, 0);

  const finalLocation = deliveryLocation === 'custom' ? customLocation.trim() : deliveryLocation;

  const handleCheckoutAll = async () => {
    // Validasi
    if (!user?.santri_name || !user?.santri_room || !user?.santri_class || !user?.santri_level) {
      toast.error('Lengkapi data santri di halaman Profil terlebih dahulu.');
      navigate({ to: '/dashboard/profile' });
      return;
    }
    if (!finalLocation) {
      toast.error('Silakan pilih atau masukkan lokasi pengiriman.');
      return;
    }

    // Check semua kantin masih buka
    const closedCanteen = canteenSummaries.find(c => !c.canteen.is_open);
    if (closedCanteen) {
      toast.error(`${closedCanteen.canteen.name} sedang tutup. Hapus dulu dari keranjang.`);
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
          items: itemList.map(i => ({ product_id: i.product.id, quantity: i.quantity }))
        };
        const res = await api.post('/orders', payload);
        results.push({ ok: true, canteen, order: res.data?.order, itemList, subtotal, deliveryFee, total });
      } catch (err) {
        results.push({ ok: false, canteen, error: err.response?.data?.message || 'Gagal' });
      }
    }

    setIsProcessing(false);

    const succeeded = results.filter(r => r.ok);
    const failed = results.filter(r => !r.ok);

    if (succeeded.length === 0) {
      toast.error('Semua pesanan gagal dibuat. Coba lagi.');
      return;
    }

    if (failed.length > 0) {
      toast.error(`${failed.length} pesanan gagal: ${failed.map(f => f.canteen.name).join(', ')}`);
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
                  {!canteen.is_open && (
                    <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Sedang Tutup
                    </p>
                  )}
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
              {itemList.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 px-4 py-3">
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
                      disabled={quantity >= product.stock}
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${quantity >= product.stock ? 'text-gray-300' : 'text-green-700 dark:text-green-400 active:bg-green-100'}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
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
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-900 dark:text-white">Lokasi Pengiriman</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Satu lokasi akan digunakan untuk semua toko dalam pesanan ini.
          </p>
          <div className="space-y-2">
            {predefinedLocations.map(loc => (
              <label key={loc} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${deliveryLocation === loc ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                <input
                  type="radio" name="loc" value={loc}
                  checked={deliveryLocation === loc}
                  onChange={e => setDeliveryLocation(e.target.value)}
                  className="w-4 h-4 text-green-600"
                />
                <span className="font-medium text-gray-800 dark:text-white text-sm capitalize">{loc}</span>
              </label>
            ))}
            <label className={`flex flex-col gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${deliveryLocation === 'custom' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
              <div className="flex items-center gap-3">
                <input
                  type="radio" name="loc" value="custom"
                  checked={deliveryLocation === 'custom'}
                  onChange={e => setDeliveryLocation(e.target.value)}
                  className="w-4 h-4 text-green-600"
                />
                <span className="font-medium text-gray-800 dark:text-white text-sm">Tulis Sendiri</span>
              </div>
              {deliveryLocation === 'custom' && (
                <input
                  type="text"
                  placeholder="Contoh: Gedung B Kamar 4"
                  value={customLocation}
                  onChange={e => setCustomLocation(e.target.value)}
                  autoFocus
                  className="ml-7 p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              )}
            </label>
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
            disabled={isProcessing || !finalLocation}
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
    </div>
  );
}
