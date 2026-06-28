import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ChevronLeft, MapPin, Store, Star, Clock, Info, CheckCircle2, X, Plus, Minus, Search, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getStorageUrl } from '../../lib/axios';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { LocationModal } from '../../components/modals/LocationModal';

export default function DetailKantin() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [cart, setCart] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Location state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');

  // Voucher
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  const predefinedLocations = [
    'asmah 1', 'asmah 2', 'aminah 1', 'aminah 2', 'al majdi 1', 'al majdi 2'
  ];

  const { data: canteen, isLoading: isLoadingCanteen } = useQuery({
    queryKey: ['canteen', id],
    queryFn: async () => {
      const res = await api.get(`/canteens/${id}`);
      return res.data;
    }
  });

  const checkoutMutation = useMutation({
    mutationFn: (payload) => api.post('/orders', payload),
    onSuccess: (res) => {
      toast.success('Pesanan berhasil dibuat!');
      
      // Build WhatsApp Message with location
      const order = res.data?.order;
      const orderIdText = order ? `\n*ID Pesanan*: #${order.id}` : '';

      let waText = `Assalamu'alaikum Warahmatullahi Wabarakatuh, ${canteen.name}.\n\nSaya ingin mengonfirmasi pesanan saya:${orderIdText}\n\n`;
      waText += `*Rincian Pesanan*:\n`;
      Object.values(cart).forEach(item => {
        waText += `🔸 ${item.quantity}x ${item.product.name} @ Rp ${parseFloat(item.product.discount_price || item.product.price).toLocaleString('id-ID')}\n`;
      });
      const location = deliveryLocation === 'custom' ? customLocation : deliveryLocation;
      waText += `\n*Lokasi Pengiriman*: ${location}`;
      
      waText += `\n\n*Ringkasan Biaya*:`;
      waText += `\n- Subtotal: Rp ${subtotalPrice.toLocaleString('id-ID')}`;
      waText += `\n- Ongkos Kirim: Rp ${deliveryFee.toLocaleString('id-ID')}`;
      if (adminFee > 0) {
        waText += `\n- Biaya Admin: Rp ${adminFee.toLocaleString('id-ID')}`;
      }
      
      if (appliedVoucher) {
        waText += `\n- Diskon (${appliedVoucher.code}): -Rp ${parseFloat(appliedVoucher.discount_amount).toLocaleString('id-ID')}`;
      }
      
      waText += `\n\n*Total Tagihan: Rp ${totalPrice.toLocaleString('id-ID')}*\n\n`;
      waText += `Mohon segera diproses ya, Syukron Jazakumullah Khairan. 🙏`;
      
      // Normalize phone: strip non-digits, convert 08xxx -> 628xxx
      let waPhone = (canteen.whatsapp_number || '').replace(/\D/g, '');
      if (waPhone.startsWith('0')) waPhone = '62' + waPhone.substring(1);
      const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`;
      
      setCart({});
      setShowLocationModal(false);
      window.open(waUrl, '_blank');
      
      navigate({ to: '/dashboard/pembayaran' });
    },
    onError: () => {
      toast.error('Gagal membuat pesanan');
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

  const handleAddToCart = (product) => {
    if (!canteen?.is_open) {
      toast.error('Kantin sedang tutup');
      return;
    }
    
    setCart(prev => {
      const existing = prev[product.id];
      const newQuantity = existing ? existing.quantity + 1 : 1;
      
      if (newQuantity > product.stock) {
        toast.error(`Stok ${product.name} hanya tersisa ${product.stock}`);
        return prev;
      }
      
      return {
        ...prev,
        [product.id]: {
          product,
          quantity: newQuantity
        }
      };
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prev => {
      const existing = prev[productId];
      if (!existing) return prev;
      
      const newCart = { ...prev };
      if (existing.quantity > 1) {
        newCart[productId] = { ...existing, quantity: existing.quantity - 1 };
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const cartItems = Object.values(cart);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate Subtotal (only products)
  const subtotalPrice = cartItems.reduce((sum, item) => {
    const price = item.product.discount_price || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  // Determine current delivery fee based on selected location
  // Map predefined locations to capitalized ones matching the database format
  const getMappedLocation = (loc) => {
    if (!loc) return null;
    if (loc === 'custom') return 'Lainnya';
    // Title case the location to match DB keys ('Asmah 1', etc)
    return loc.replace(/\b\w/g, l => l.toUpperCase());
  };
  
  const mappedLocation = getMappedLocation(deliveryLocation);
  
  const currentRate = mappedLocation 
    ? canteen.delivery_rates?.[mappedLocation]
    : null;
    
  const deliveryFee = currentRate !== null && currentRate !== undefined 
    ? parseFloat(currentRate) 
    : parseFloat(canteen.delivery_fee || 0);

  const adminFee = parseFloat(canteen?.admin_fee || 0);

  let discountAmount = 0;
  if (appliedVoucher) {
    discountAmount = parseFloat(appliedVoucher.discount_amount);
  }

  const rawTotal = totalItems > 0 ? subtotalPrice + deliveryFee + adminFee : 0;
  const totalPrice = totalItems > 0 ? Math.max(0, rawTotal - discountAmount) : 0;

  const handleApplyVoucher = () => {
    setVoucherError('');
    if (!voucherCode.trim()) return;
    
    const code = voucherCode.trim().toUpperCase();
    const found = canteen.vouchers?.find(v => v.code === code && v.is_active);
    
    if (!found) {
      setVoucherError('Voucher tidak ditemukan atau tidak aktif');
      setAppliedVoucher(null);
      return;
    }
    
    if (parseFloat(found.min_purchase) > subtotalPrice) {
      setVoucherError(`Minimal belanja Rp ${parseFloat(found.min_purchase).toLocaleString('id-ID')} untuk menggunakan voucher ini`);
      setAppliedVoucher(null);
      return;
    }
    
    setAppliedVoucher(found);
    toast.success('Voucher berhasil digunakan!');
  };

  const handleCheckoutClick = () => {
    if (totalItems === 0) return;
    setShowLocationModal(true);
  };

  const handleConfirmCheckout = () => {
    if (!deliveryLocation || (deliveryLocation === 'custom' && !customLocation.trim())) {
      toast.error('Silakan pilih atau masukkan lokasi pengiriman');
      return;
    }
    
    const finalLocation = deliveryLocation === 'custom' ? customLocation : deliveryLocation;
    
    const payload = {
      canteen_id: canteen.id,
      delivery_location: finalLocation,
      voucher_id: appliedVoucher ? appliedVoucher.id : null,
      items: cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }))
    };
    
    checkoutMutation.mutate(payload);
  };

  return (
    <div className="bg-gray-50 h-full min-h-screen pb-32 dark:bg-gray-950 font-sans relative">
      {/* HEADER BANNER */}
      <div className="relative h-48 sm:h-56 bg-gray-200 dark:bg-gray-800">
        {canteen.image ? (
          <img src={getStorageUrl(canteen.image)} alt="Banner Toko" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-r from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-900">
            <Store className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-medium text-green-800/50 dark:text-green-200/50">Tidak ada foto</span>
          </div>
        )}
        
        {/* Top Navbar overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <button onClick={() => navigate({ to: '/dashboard' })} className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white backdrop-blur-sm transition-colors hover:bg-black/50">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* STORE INFO CARD */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto -mt-12 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 md:p-6 border border-gray-100 dark:border-gray-800">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-2">
            {canteen.name}
            {!canteen.is_open && (
              <span className="px-2 py-0.5 bg-gray-500 text-white text-xs rounded font-medium">TUTUP</span>
            )}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {canteen.description || 'Kantin Higopondok'}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-3">
            <div className="flex items-center font-medium">
              <span className="text-yellow-400 mr-1">★</span>
              {parseFloat(canteen.rating || 0).toFixed(1)} <span className="text-gray-400 ml-1 font-normal">({canteen.rating_count || 0})</span>
            </div>
            {canteen.distance && (
              <div className="flex items-center">
                <span className="mr-1 text-gray-400">📍</span>
                {parseFloat(canteen.distance).toFixed(2)} km
              </div>
            )}
            <div className="flex items-center">
               <span className="mr-1 text-gray-400">🛵</span>
               Rp{deliveryFee.toLocaleString('id-ID')} (Ongkir)
            </div>
            {adminFee > 0 && (
               <div className="flex items-center">
                 <span className="mr-1 text-gray-400">⚙️</span>
                 Rp{adminFee.toLocaleString('id-ID')} (Biaya Admin)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="mt-6 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Daftar Menu</h2>
        
        {(!canteen.products || canteen.products.length === 0) ? (
          <div className="text-center py-10 text-gray-500">Belum ada menu di kantin ini.</div>
        ) : (
          <div className="space-y-4">
            {canteen.products.map((product) => {
              const inCart = cart[product.id]?.quantity || 0;
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
                      <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200">
                        Sisa: {product.stock}
                      </span>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        {product.discount_price ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 line-through">Rp {parseFloat(product.price).toLocaleString('id-ID')}</span>
                            <span className="font-bold text-sm text-green-600 dark:text-green-400">
                              Rp {parseFloat(product.discount_price).toLocaleString('id-ID')}
                            </span>
                          </div>
                        ) : (
                          <p className={`font-bold text-sm ${!isAvailable ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            Rp {parseFloat(product.price).toLocaleString('id-ID')}
                          </p>
                        )}
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
                            <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} className="px-4 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 rounded-full text-sm font-semibold transition-colors">
                              Tambah
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
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Pembayaran</p>
                <p className="font-bold text-lg text-gray-900 dark:text-white">Rp {totalPrice.toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Termasuk ongkir & admin</p>
              </div>
            </div>
            
            <button 
              onClick={handleCheckoutClick}
              disabled={checkoutMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-green-600/30 disabled:opacity-70 flex items-center"
            >
              {checkoutMutation.isPending ? 'Memproses...' : 'Checkout & WA'}
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
                  <span className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-200">Sisa Stok: {selectedProduct.stock}</span>
                </div>
                {selectedProduct.discount_price && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">PROMO</span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                <span>{selectedProduct.category || 'Makanan'}</span>
                <span>•</span>
                <span>Disukai oleh banyak santri</span>
              </div>
              
              <div className="flex items-center mb-6">
                {selectedProduct.discount_price ? (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400 line-through">Rp {parseFloat(selectedProduct.price).toLocaleString('id-ID')}</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      Rp {parseFloat(selectedProduct.discount_price).toLocaleString('id-ID')}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    Rp {parseFloat(selectedProduct.price).toLocaleString('id-ID')}
                  </span>
                )}
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
                  {cart[selectedProduct.id]?.quantity || 0} item
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {(cart[selectedProduct.id]?.quantity || 0) > 0 ? (
                  <div className="flex items-center bg-green-50 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800 shadow-sm w-[120px] justify-between">
                    <button onClick={() => handleRemoveFromCart(selectedProduct.id)} className="w-10 h-10 flex items-center justify-center text-green-700 dark:text-green-400 rounded-full active:bg-green-100 dark:active:bg-green-800">
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-bold text-green-700 dark:text-green-400 w-8 text-center">{(cart[selectedProduct.id]?.quantity || 0)}</span>
                    <button 
                      onClick={() => handleAddToCart(selectedProduct)} 
                      disabled={(cart[selectedProduct.id]?.quantity || 0) >= selectedProduct.stock}
                      className={`w-10 h-10 flex items-center justify-center rounded-full ${(cart[selectedProduct.id]?.quantity || 0) >= selectedProduct.stock ? 'text-gray-300' : 'text-green-700 dark:text-green-400 active:bg-green-100 dark:active:bg-green-800'}`}
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

      {/* LOCATION SELECTION MODAL */}
      <LocationModal 
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        canteen={canteen}
        predefinedLocations={predefinedLocations}
        getMappedLocation={getMappedLocation}
        deliveryLocation={deliveryLocation}
        setDeliveryLocation={setDeliveryLocation}
        customLocation={customLocation}
        setCustomLocation={setCustomLocation}
        voucherCode={voucherCode}
        setVoucherCode={setVoucherCode}
        appliedVoucher={appliedVoucher}
        setAppliedVoucher={setAppliedVoucher}
        voucherError={voucherError}
        setVoucherError={setVoucherError}
        handleApplyVoucher={handleApplyVoucher}
        totalPrice={totalPrice}
        handleConfirmCheckout={handleConfirmCheckout}
        isPending={checkoutMutation.isPending}
      />
    </div>
  );
}
