import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ChevronLeft, MapPin, Store, Star, Clock, Info, X, Plus, Minus, Search, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getStorageUrl } from '../../lib/axios';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export default function DetailKantin() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { addItem, removeItem, getCanteenItems } = useCartStore();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Order state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customNotes, setCustomNotes] = useState('');
  const [customLocation, setCustomLocation] = useState(
    user ? `Santri: ${user.santri_name || user.name} | ${user.santri_room || ''} | ${user.santri_class || ''}/${user.santri_level || ''}` : ''
  );
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);

  const { data: canteen, isLoading: isLoadingCanteen } = useQuery({
    queryKey: ['canteen', id],
    queryFn: async () => {
      const res = await api.get(`/canteens/${id}`);
      return res.data;
    }
  });

  if (isLoadingCanteen) {
    return (
      <div className="space-y-4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-50 dark:border-gray-800">
        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!canteen) {
    return <div className="p-8 text-center text-gray-500">Kantin tidak ditemukan</div>;
  }

  // Cart from global store for this specific canteen
  const canteenCart = getCanteenItems(canteen.id);
  const cartItems = Object.values(canteenCart);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product) => {
    if (!canteen?.is_open) {
      toast.error('Kantin sedang tutup');
      return;
    }
    const current = canteenCart[String(product.id)];
    const currentQty = current?.quantity || 0;
    if (currentQty >= product.stock) {
      toast.error(`Stok ${product.name} hanya tersisa ${product.stock}`);
      return;
    }
    addItem(canteen, product);
  };

  const handleRemoveFromCart = (productId) => {
    removeItem(canteen.id, productId);
  };

  const handleGoToCart = () => {
    navigate({ to: '/dashboard/keranjang' });
  };

  const filteredProducts = canteen.products?.filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="bg-gray-50 h-full min-h-screen pb-32 dark:bg-gray-950 font-sans relative">
      {/* HEADER BANNER */}
      <div className="relative h-48 sm:h-56 bg-gray-200 dark:bg-gray-800">
        {canteen.image ? (
          <img src={getStorageUrl(canteen.image)} alt="Banner Toko" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-r from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-900">
            <Store className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-xs font-medium opacity-50">Belum ada foto</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <button
          onClick={() => navigate({ to: '/dashboard/kantin' })}
          className="absolute top-4 left-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        {/* Cart quick-access at top right */}
        {totalItems > 0 && (
          <button
            onClick={handleGoToCart}
            className="absolute top-4 right-4 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white z-10 shadow-lg relative"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {totalItems}
            </span>
          </button>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl font-bold text-white drop-shadow-md">{canteen.name}</h1>
          <div className="flex items-center gap-3 text-xs text-white/80 mt-1">
            <span className={`font-semibold px-2 py-0.5 rounded-full ${canteen.is_open ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
              {canteen.is_open ? '● Buka' : '● Tutup'}
            </span>
            <span>⭐ {parseFloat(canteen.rating || 0).toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* CANTEEN INFO */}
      <div className="bg-white dark:bg-gray-900 px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          {canteen.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{canteen.description}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            {canteen.distance && (
              <div className="flex items-center">
                <span className="mr-1 text-gray-400">📍</span>
                {parseFloat(canteen.distance).toFixed(2)} km
              </div>
            )}
            <div className="flex items-center">
               <span className="mr-1 text-gray-400">🛵</span>
               Rp{parseFloat(canteen.delivery_fee || 0).toLocaleString('id-ID')} (Ongkir)
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari menu..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="mt-6 px-4 md:px-8 max-w-7xl mx-auto">
        {/* CUSTOM ORDER BANNER */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 text-white mb-6 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">Barang Luar Menu</span>
            <h3 className="font-bold text-base mt-1">Pesanan Khusus / Titip Beli</h3>
            <p className="text-xs text-white/80 mt-0.5">Ingin barang yang tidak ada di menu? Kirim catatan & harga ditentukan oleh toko.</p>
          </div>
          <button 
            onClick={() => setShowCustomModal(true)}
            className="px-3 py-2 bg-white text-purple-700 hover:bg-purple-50 rounded-xl font-bold text-xs shrink-0 shadow-sm transition-transform active:scale-95"
          >
            ＋ Buat Pesanan
          </button>
        </div>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Daftar Menu</h2>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            {searchQuery ? `Tidak ada menu "${searchQuery}"` : 'Belum ada menu di kantin ini.'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const inCart = canteenCart[String(product.id)]?.quantity || 0;
              const isAvailable = product.is_available === 1 || product.is_available === true;
              
              return (
                <div 
                  key={product.id} 
                  className="flex gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => setSelectedProduct(product)}
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden relative">
                     {product.image ? (
                       <img src={getStorageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                     ) : (
                       <Store className="w-8 h-8 text-gray-300" />
                     )}
                     {!isAvailable && (
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                         <span className="text-white text-[10px] font-bold px-2 py-1 bg-black/60 rounded">HABIS</span>
                       </div>
                     )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className={`text-base font-semibold truncate ${!isAvailable ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500 line-clamp-1">{product.category || 'Makanan'}</p>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <p className={`font-bold text-sm ${!isAvailable ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                          Rp {parseFloat(product.price).toLocaleString('id-ID')}
                        </p>
                      </div>
                      
                      {/* Add to Cart Actions */}
                      {isAvailable && (
                        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                          {inCart > 0 ? (
                            <div className="flex items-center bg-green-50 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800">
                              <button onClick={(e) => { e.stopPropagation(); handleRemoveFromCart(product.id); }} className="w-8 h-8 flex items-center justify-center text-green-700 dark:text-green-400">
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold text-green-700 dark:text-green-400">{inCart}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} 
                                disabled={inCart >= product.stock}
                                className={`w-8 h-8 flex items-center justify-center ${inCart >= product.stock ? 'text-gray-300' : 'text-green-700 dark:text-green-400'}`}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white shadow-sm"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FLOATING CART SUMMARY */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                  {totalItems}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{totalItems} item dari toko ini</p>
                <p className="font-bold text-sm text-gray-900 dark:text-white">+ item dari toko lain</p>
              </div>
            </div>
            
            <button 
              onClick={handleGoToCart}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-green-600/30 flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Lihat Keranjang
            </button>
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL FULL-SCREEN MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-950 flex flex-col animate-in slide-in-from-bottom-full duration-300">
          {/* Header & Image */}
          <div className="relative h-64 sm:h-80 bg-gray-100 dark:bg-gray-900 shrink-0">
            {selectedProduct.image ? (
              <img src={getStorageUrl(selectedProduct.image)} alt={selectedProduct.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                <Store className="w-20 h-20" />
              </div>
            )}
            
            {/* Back Button Overlay */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 left-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white pr-4">{selectedProduct.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{selectedProduct.category || 'Makanan'}</span>
                </div>

              </div>
              
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                <span>{selectedProduct.category || 'Makanan'}</span>
                <span>•</span>
                <span>Disukai oleh banyak santri</span>
              </div>
              
              <div className="flex items-center mb-6">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    Rp {parseFloat(selectedProduct.price).toLocaleString('id-ID')}
                  </span>
              </div>
              
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Deskripsi Produk</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedProduct.description || 'Tidak ada deskripsi detail untuk produk ini.'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Bottom Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
            <div className="max-w-3xl mx-auto w-full flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Total Produk Ini</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  {canteenCart[String(selectedProduct.id)]?.quantity || 0} item
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {(canteenCart[String(selectedProduct.id)]?.quantity || 0) > 0 ? (
                  <div className="flex items-center bg-green-50 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800 shadow-sm w-[120px] justify-between">
                    <button onClick={() => handleRemoveFromCart(selectedProduct.id)} className="w-10 h-10 flex items-center justify-center text-green-700 dark:text-green-400 rounded-full active:bg-green-100 dark:active:bg-green-800">
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-bold text-green-700 dark:text-green-400 w-8 text-center">{(canteenCart[String(selectedProduct.id)]?.quantity || 0)}</span>
                    <button 
                      onClick={() => handleAddToCart(selectedProduct)} 
                      disabled={(canteenCart[String(selectedProduct.id)]?.quantity || 0) >= selectedProduct.stock}
                      className={`w-10 h-10 flex items-center justify-center rounded-full ${(canteenCart[String(selectedProduct.id)]?.quantity || 0) >= selectedProduct.stock ? 'text-gray-300' : 'text-green-700 dark:text-green-400 active:bg-green-100 dark:active:bg-green-800'}`}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAddToCart(selectedProduct)}
                    disabled={!(selectedProduct.is_available === 1 || selectedProduct.is_available === true) || selectedProduct.stock <= 0}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:bg-gray-400"
                  >
                    Tambah ke Keranjang
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* CUSTOM ORDER MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pesanan Khusus / Titip Beli</h3>
              <button onClick={() => setShowCustomModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900/50">
                <p className="text-xs text-purple-800 dark:text-purple-300">
                  Tuliskan barang atau pesanan khusus yang Anda perlukan di toko <strong>{canteen.name}</strong>. Pihak toko akan memeriksa dan menentukan total harganya.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Catatan Barang / Titipan <span className="text-red-500">*</span></label>
                <textarea
                  rows={4}
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  placeholder="Contoh: Tolong belikan Obat Maag 1 strip di apotek terdekat, atau Nasi Bungkus Lauk Ayam Goreng..."
                  className="w-full p-3 border rounded-xl text-sm dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Lokasi Pengantaran</label>
                <input
                  type="text"
                  value={customLocation}
                  onChange={e => setCustomLocation(e.target.value)}
                  className="w-full p-3 border rounded-xl text-sm dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 pt-0 flex gap-3">
              <button 
                onClick={() => setShowCustomModal(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                disabled={!customNotes.trim() || isSubmittingCustom}
                onClick={async () => {
                  if (!canteen.is_open) {
                    toast.error('Kantin sedang tutup');
                    return;
                  }
                  try {
                    setIsSubmittingCustom(true);
                    await api.post('/orders', {
                      canteen_id: canteen.id,
                      is_custom: true,
                      custom_notes: customNotes,
                      delivery_location: customLocation
                    });
                    toast.success('Pesanan khusus berhasil dibuat! Menunggu penentuan harga dari toko.');
                    setShowCustomModal(false);
                    setCustomNotes('');
                    navigate({ to: '/dashboard/pembayaran' });
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Gagal membuat pesanan khusus');
                  } finally {
                    setIsSubmittingCustom(false);
                  }
                }}
                className="flex-[2] py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2 shadow-sm"
              >
                {isSubmittingCustom ? 'Mengirim...' : 'Kirim Pesanan Khusus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
