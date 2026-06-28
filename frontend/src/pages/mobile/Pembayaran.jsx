import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, ChevronLeft, CheckCircle, Clock, Store, MessageCircle, Image as ImageIcon, X, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getStorageUrl } from '../../lib/axios';

export default function Pembayaran() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProof, setSelectedProof] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');

  const queryClient = useQueryClient();

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const cancelMutation = useMutation({
    mutationFn: (orderId) => api.put(`/orders/${orderId}/cancel`),
    onSuccess: () => {
      toast.success('Pesanan berhasil dibatalkan');
      queryClient.invalidateQueries(['user_orders']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Gagal membatalkan pesanan');
    }
  });

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      cancelMutation.mutate(orderId);
    }
  };

  const { data: ordersRes, isLoading } = useQuery({
    queryKey: ['user_orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data;
    },
    refetchInterval: 30000 // auto refresh every 30s
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;
  }

  const orders = ordersRes || [];

  const filters = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Menunggu' },
    { key: 'processing', label: 'Diproses' },
    { key: 'completed', label: 'Selesai' },
    { key: 'cancelled', label: 'Dibatalkan' },
  ];

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === activeFilter);

  const formatPhoneWA = (phone) => {
    if (!phone) return '';
    let p = phone.toString().replace(/\D/g, '');
    if (p.startsWith('0')) p = '62' + p.substring(1);
    return `https://wa.me/${p}`;
  };

  const buildOrderWAText = (order) => {
    let text = `Pesanan #${order.id}\n`;
    order.items?.forEach(item => {
      text += `- ${item.quantity}x ${item.product?.name}\n`;
    });
    return text.trim();
  };

  return (
    <div className="bg-gray-50 h-full min-h-screen pb-24 dark:bg-gray-950 font-sans">
      <div className="bg-white dark:bg-gray-900 sticky top-0 z-20 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Riwayat Transaksi</h1>
        </div>
        {/* Filter Chips */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                activeFilter === f.key
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:px-8 max-w-7xl mx-auto space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-500 flex flex-col items-center">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
            <p>{activeFilter === 'all' ? 'Belum ada riwayat transaksi.' : 'Tidak ada pesanan dengan filter ini.'}</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Order #{order.id} • {new Date(order.created_at).toLocaleString('id-ID')}
                  </p>
                  <h3 className="font-bold text-gray-900 dark:text-white">{order.canteen?.name || 'Kantin'}</h3>
                  {order.delivery_location && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <span className="mr-1">📍</span> {order.delivery_location}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={`px-2 py-1 rounded text-[10px] font-bold ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.payment_status === 'paid' ? 'Sudah Dibayar' : 'Belum Bayar'}
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] font-bold ${
                    order.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'processing' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status === 'pending' ? 'Menunggu Konfirmasi' : 
                     order.status === 'processing' ? 'Sedang Diproses/Dikirim' : 
                     order.status === 'completed' ? 'Selesai' : 
                     order.status === 'cancelled' ? 'Dibatalkan' : order.status}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {order.items?.map(item => (
                  <div 
                    key={item.id} 
                    className="flex justify-between text-sm cursor-pointer p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg active:bg-gray-100 transition-colors"
                    onClick={() => setSelectedProduct(item.product)}
                  >
                    <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold px-1.5 py-0.5 rounded text-xs">{item.quantity}x</span>
                      {item.product?.name}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Rp {parseFloat(item.subtotal).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              {order.status === 'completed' && order.proof_of_delivery && (
                <div className="mb-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => setSelectedProof(getStorageUrl(order.proof_of_delivery))}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors font-semibold"
                  >
                    <ImageIcon className="w-4 h-4" /> Lihat Bukti Pengiriman
                  </button>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => toggleOrderDetails(order.id)}
                  className="w-full flex items-center justify-between py-1 mb-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <span>Rincian Biaya</span>
                  <span className="text-xs border px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    {expandedOrders[order.id] ? 'Tutup' : 'Lihat'}
                  </span>
                </button>
                
                {expandedOrders[order.id] && (
                  <div className="space-y-1 mb-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800/80">
                    <div className="flex justify-between">
                      <span>Subtotal Makanan</span>
                      <span>
                        Rp {
                          (order.items?.reduce((sum, item) => sum + parseFloat(item.subtotal), 0) || 0).toLocaleString('id-ID')
                        }
                      </span>
                    </div>
                    {(() => {
                      const subtotal = order.items?.reduce((sum, item) => sum + parseFloat(item.subtotal), 0) || 0;
                      const discount = parseFloat(order.discount_amount || 0);
                      const fees = parseFloat(order.total_price) - subtotal + discount;
                      return (
                        <>
                          {fees > 0 && (
                            <div className="flex justify-between">
                              <span>Ongkir & Biaya Admin</span>
                              <span>Rp {fees.toLocaleString('id-ID')}</span>
                            </div>
                          )}
                          {discount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Diskon Voucher</span>
                              <span>- Rp {discount.toLocaleString('id-ID')}</span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}

                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Belanja</p>
                  <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                    Rp {parseFloat(order.total_price).toLocaleString('id-ID')}
                  </p>
                </div>
                
                
                {/* Contact Buttons */}
                {(order.canteen?.whatsapp_number || order.courier?.phone) && (
                  <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                    {order.canteen?.whatsapp_number && (
                      <a 
                        href={formatPhoneWA(order.canteen.whatsapp_number) + `?text=${encodeURIComponent(buildOrderWAText(order))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" /> Hubungi Toko
                      </a>
                    )}
                    {order.courier?.phone && (
                      <a 
                        href={formatPhoneWA(order.courier.phone) + `?text=${encodeURIComponent(buildOrderWAText(order))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" /> Hubungi Kurir
                      </a>
                    )}
                  </div>
                )}
                
                {/* Cancel Button */}
                {order.status === 'pending' && (
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 mt-3">
                    <button 
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancelMutation.isPending}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> 
                      {cancelMutation.isPending ? 'Membatalkan...' : 'Batalkan Pesanan'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

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
              className="absolute top-4 left-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10 hover:bg-black/50 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white pr-4">{selectedProduct.name}</h2>
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
        </div>
      )}

      {/* PROOF OF DELIVERY FULL-SCREEN MODAL */}
      {selectedProof && (
        <div className="fixed inset-0 z-[70] bg-black/90 flex flex-col animate-in fade-in duration-200">
          <div className="flex justify-end p-4">
            <button 
              onClick={() => setSelectedProof(null)}
              className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10 hover:bg-white/20 active:scale-95 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden p-4 flex items-center justify-center">
            <img 
              src={selectedProof} 
              alt="Bukti Pengiriman" 
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
