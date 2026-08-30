import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, ChevronLeft, CheckCircle, Clock, Store, MessageCircle, Image as ImageIcon, X, XCircle, FileText, Download, ExternalLink, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getStorageUrl, getPublicUrl } from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import { getFileType, isImageFile, isHeifFile, isPdfFile, formatFileSize, getFileNameFromPath, compressImageFiles } from '../../lib/fileUtils';

export default function Pembayaran() {
  const user = useAuthStore(state => state.user);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProofs, setSelectedProofs] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');

  const [showPaymentProofModal, setShowPaymentProofModal] = useState(false);
  const [activeOrderForPaymentProof, setActiveOrderForPaymentProof] = useState(null);
  const [paymentProofFiles, setPaymentProofFiles] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const isPaymentTime = (order) => {
    if (!order?.canteen?.open_time || !order?.canteen?.close_time) {
      // Default fallback jika data jam buka/tutup tidak tersedia
      const hour = new Date().getHours();
      return hour >= 9 && hour < 17;
    }
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    // Parse open_time (e.g. "09:00:00" atau "09:00")
    const openParts = order.canteen.open_time.split(':');
    const openTime = parseInt(openParts[0]) * 60 + parseInt(openParts[1]);
    
    // Parse close_time (e.g. "17:00:00" atau "17:00")
    const closeParts = order.canteen.close_time.split(':');
    const closeTime = parseInt(closeParts[0]) * 60 + parseInt(closeParts[1]);
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

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

  const uploadPaymentProofMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await api.post(`/orders/${id}/payment-proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user_orders']);
      toast.success('Bukti transfer berhasil diunggah!');
      setShowPaymentProofModal(false);
      setPaymentProofFiles([]);
      setActiveOrderForPaymentProof(null);
    },
    onError: () => {
      toast.error('Gagal mengunggah bukti transfer');
    }
  });

  const { data: ordersRes, isLoading } = useQuery({
    queryKey: ['user_orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data;
    },
    refetchInterval: 5000 // auto refresh every 5s for near real-time
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
    const subtotal = order.is_custom 
      ? Math.max(0, parseFloat(order.total_price) - parseFloat(order.delivery_fee || 0) - parseFloat(order.admin_fee || 0))
      : (order.items?.reduce((sum, item) => sum + parseFloat(item.subtotal), 0) || 0);
    const ongkir = parseFloat(order.delivery_fee || 0);
    const admin = parseFloat(order.admin_fee || 0);

    let text = `Assalamu'alaikum Warahmatullahi Wabarakatuh, ${order.canteen?.name || 'Kantin'}.\n`;
    text += `Saya ingin mengonfirmasi pesanan saya:\n`;
    text += `*ID Pesanan*: #${order.id}\n\n`;
    text += `*Data Penerima*:\n`;
    text += `👤 Santri: ${user?.santri_name || user?.name || '-'}\n`;
    text += `📚 Kelas/Jenjang: ${user?.santri_class || '-'} / ${user?.santri_level || '-'}\n`;
    if (order.delivery_location) text += `🏠 Lokasi: ${order.delivery_location}\n`;
    text += `\n*Rincian Pesanan*:\n`;
    if (order.is_custom) {
      text += `🔸 1x Pesanan Khusus (${order.custom_notes || 'Titipan'})\n`;
    } else {
      order.items?.forEach(item => {
        text += `🔸 ${item.quantity}x ${item.product?.name} @ Rp ${Math.round(parseFloat(item.price_per_item || (parseFloat(item.subtotal)/item.quantity))).toLocaleString('id-ID')}\n`;
      });
    }
    text += `\n*Ringkasan Biaya*:`;
    text += `\n- Subtotal: Rp ${Math.round(subtotal).toLocaleString('id-ID')}`;
    if (ongkir > 0) text += `\n- Ongkos Kirim: Rp ${Math.round(ongkir).toLocaleString('id-ID')}`;
    if (admin > 0) text += `\n- Biaya Admin: Rp ${Math.round(admin).toLocaleString('id-ID')}`;
    text += `\n\n*Total Tagihan: Rp ${Math.round(parseFloat(order.total_price)).toLocaleString('id-ID')}*\n\n`;
    text += `Mohon segera diproses ya, Syukron Jazakumullah Khairan. 🙏`;
    return text;
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
                  <div className={`px-2 py-1 rounded text-[10px] font-bold ${
                    order.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' 
                      : order.payment_status === 'waiting_confirmation'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 ring-1 ring-amber-400 animate-pulse'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                  }`}>
                    {order.payment_status === 'paid' 
                      ? 'Sudah Dibayar' 
                      : order.payment_status === 'waiting_confirmation' 
                        ? 'Menunggu Validasi Toko' 
                        : 'Belum Bayar'}
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] font-bold ${
                    order.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'processing' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.is_custom && parseFloat(order.total_price) === 0 ? 'Menunggu Penentuan Harga Toko' :
                     order.status === 'pending' ? 'Menunggu Konfirmasi' : 
                     order.status === 'processing' ? 'Sedang Diproses/Dikirim' : 
                     order.status === 'completed' ? 'Selesai' : 
                     order.status === 'cancelled' ? 'Dibatalkan' : order.status}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {order.custom_notes && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900/50 mb-2">
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase block mb-0.5">Catatan Pesanan:</span>
                    <p className="text-xs font-medium text-purple-900 dark:text-purple-200 whitespace-pre-wrap">
                      {order.custom_notes}
                    </p>
                    {order.is_custom && parseFloat(order.total_price) === 0 && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-2">
                        ⏳ Pihak toko sedang menghitung & menentukan total harga pesanan ini.
                      </p>
                    )}
                  </div>
                )}

                {order.is_custom && parseFloat(order.total_price) > 0 && (
                  <div className="text-sm p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-700 dark:text-purple-300 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-bold px-1.5 py-0.5 rounded text-xs">1x</span>
                        <span className="font-medium">Pesanan Khusus / Titip Beli</span>
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        Rp {Math.round(Math.max(0, parseFloat(order.total_price) - parseFloat(order.delivery_fee || 0) - parseFloat(order.admin_fee || 0))).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                )}

                {order.items?.map(item => (
                  <div key={item.id} className="text-sm p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => setSelectedProduct(item.product)}>
                      <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold px-1.5 py-0.5 rounded text-xs">{item.quantity}x</span>
                        <span className="font-medium">{item.product?.name}</span>
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Rp {Math.round(parseFloat(item.subtotal)).toLocaleString('id-ID')}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded mt-1 inline-block font-medium ml-8">
                        📝 Catatan: {item.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {order.proof_of_purchase && order.proof_of_purchase.length > 0 && (
                <div className="mb-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => {
                      let proofs = [];
                      if (Array.isArray(order.proof_of_purchase)) {
                        proofs = order.proof_of_purchase.map(path => getStorageUrl(path));
                      } else {
                        proofs = [getStorageUrl(order.proof_of_purchase)];
                      }
                      setSelectedProofs(proofs);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40 rounded-lg transition-colors font-semibold"
                  >
                    <ImageIcon className="w-4 h-4" /> Lihat Struk Pembelian (Kurir)
                  </button>
                </div>
              )}

              {order.status === 'completed' && order.proof_of_delivery && (
                <div className="mb-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => {
                      let proofs = [];
                      if (Array.isArray(order.proof_of_delivery)) {
                        proofs = order.proof_of_delivery.map(path => getStorageUrl(path));
                      } else {
                        proofs = [getStorageUrl(order.proof_of_delivery)];
                      }
                      setSelectedProofs(proofs);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors font-semibold"
                  >
                    <ImageIcon className="w-4 h-4" /> Lihat Bukti Serah Terima
                  </button>
                </div>
              )}

              {/* Section Upload Pertama Kali */}
              {order.status !== 'cancelled' && order.payment_status === 'unpaid' && !order.proof_of_payment && (
                <div className="mb-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  {isPaymentTime(order) ? (
                    <button 
                      onClick={() => {
                        setActiveOrderForPaymentProof(order);
                        setShowPaymentProofModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 rounded-lg transition-colors font-semibold"
                    >
                      <ImageIcon className="w-4 h-4" /> Upload Bukti Transfer
                    </button>
                  ) : (
                    <div className="w-full flex flex-col items-center justify-center gap-1 py-3 px-3 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-lg border border-amber-100 dark:border-amber-900/50 text-center">
                      <Clock className="w-5 h-5 mb-1" />
                      <span className="font-semibold">Toko Sedang Tutup</span>
                      <span className="text-xs">
                        Pembayaran dilayani saat toko buka 
                        {order.canteen?.open_time ? ` (${order.canteen.open_time.substring(0,5)} - ${order.canteen.close_time.substring(0,5)})` : ''}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Section Lihat Bukti & Tambah Bukti */}
              {order.proof_of_payment && (
                <div className="mb-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                  {order.payment_status === 'waiting_confirmation' && (
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 font-medium">
                      <span className="text-base">⏳</span>
                      <span>Bukti transfer telah dikirim. Menunggu pihak kantin memvalidasi pembayaran Anda.</span>
                    </div>
                  )}
                  {order.payment_status === 'paid' && (
                    <div className="p-2.5 bg-green-50 dark:bg-green-950/40 rounded-xl border border-green-200 dark:border-green-800 flex items-center gap-2 text-xs text-green-800 dark:text-green-300 font-medium">
                      <span className="text-base">✅</span>
                      <span>Pembayaran telah divalidasi Lunas oleh kantin.</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        let proofs = [];
                        if (Array.isArray(order.proof_of_payment)) {
                          proofs = order.proof_of_payment.map(path => getStorageUrl(path));
                        } else {
                          proofs = [getStorageUrl(order.proof_of_payment)];
                        }
                        setSelectedProofs(proofs);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40 rounded-lg transition-colors font-semibold"
                    >
                      <ImageIcon className="w-4 h-4" /> Lihat Bukti Transfer
                    </button>
                    {isPaymentTime(order) && order.status !== 'cancelled' && order.payment_status !== 'paid' && (
                      <button 
                        onClick={() => {
                          setActiveOrderForPaymentProof(order);
                          setShowPaymentProofModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 rounded-lg transition-colors font-semibold"
                      >
                        <ImageIcon className="w-4 h-4" /> Tambah Bukti
                      </button>
                    )}
                  </div>
                  {!isPaymentTime(order) && order.status !== 'cancelled' && (
                    <div className="w-full mt-1 text-center text-xs text-amber-600 dark:text-amber-400">
                      Upload tambahan tidak tersedia (toko sedang tutup)
                    </div>
                  )}
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
                      <span>Subtotal {order.is_custom ? 'Pesanan Khusus' : 'Makanan'}</span>
                      <span>
                        Rp {
                          (() => {
                            const sub = order.is_custom
                              ? Math.max(0, parseFloat(order.total_price) - parseFloat(order.delivery_fee || 0) - parseFloat(order.admin_fee || 0))
                              : (order.items?.reduce((sum, item) => sum + parseFloat(item.subtotal), 0) || 0);
                            return Math.round(sub).toLocaleString('id-ID');
                          })()
                        }
                      </span>
                    </div>
                    {parseFloat(order.delivery_fee) > 0 && (
                      <div className="flex justify-between">
                        <span>Ongkos Kirim</span>
                        <span>Rp {Math.round(parseFloat(order.delivery_fee)).toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    {parseFloat(order.admin_fee) > 0 && (
                      <div className="flex justify-between">
                        <span>Biaya Layanan & Admin</span>
                        <span>Rp {Math.round(parseFloat(order.admin_fee)).toLocaleString('id-ID')}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Belanja</p>
                  <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                    Rp {Math.round(parseFloat(order.total_price)).toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Contact Buttons — always visible */}
                {(order.canteen?.whatsapp_number || order.courier?.phone) && (
                  <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 mt-0 mb-3">
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
                    {order.courier?.phone && order.status !== 'cancelled' && (
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
      {selectedProduct && createPortal(
        <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-950 flex flex-col animate-in slide-in-from-bottom-full duration-300">
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
        </div>,
        document.body
      )}

      {/* PROOF OF DELIVERY / PAYMENT FULL-SCREEN MODAL */}
      {selectedProofs.length > 0 && createPortal(
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xs flex flex-col animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-black/70 border-b border-white/10 shrink-0">
            <span className="text-white font-bold text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-400" />
              {selectedProofs.length} Berkas Bukti
            </span>
            <button 
              onClick={() => setSelectedProofs([])}
              className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Images & Documents */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center gap-4 p-4 pb-12">
            {selectedProofs.map((proof, idx) => {
              const fileType = getFileType(proof);
              const fileName = getFileNameFromPath(proof);

              if (fileType === 'pdf') {
                return (
                  <div key={idx} className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-xl">
                    <div className="w-full flex items-center justify-between text-xs text-gray-400 border-b border-gray-800 pb-2">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-red-400" /> Bukti {idx + 1}: {fileName}
                      </span>
                      <span className="px-2 py-0.5 bg-red-900/40 text-red-300 rounded font-mono text-[10px]">PDF</span>
                    </div>
                    <iframe 
                      src={proof} 
                      title={`Bukti PDF ${idx + 1}`} 
                      className="w-full h-[55vh] rounded-xl bg-white border border-gray-700" 
                    />
                    <a
                      href={proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <ExternalLink className="w-4 h-4" /> Buka / Unduh Dokumen PDF
                    </a>
                  </div>
                );
              }

              if (fileType === 'image') {
                return (
                  <div key={idx} className="w-full max-w-xl bg-gray-900/60 border border-white/5 rounded-2xl p-2.5 flex flex-col items-center gap-2">
                    <div className="w-full flex items-center justify-between px-2 text-xs text-gray-400">
                      <span>Bukti {idx + 1}</span>
                      <a 
                        href={proof} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-green-400 hover:text-green-300 flex items-center gap-1 text-[11px]"
                      >
                        Buka Gambar Penuh <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <img 
                      src={proof}
                      alt={`Bukti ${idx + 1}`}
                      className="w-full rounded-xl shadow-2xl object-contain bg-black/40"
                      style={{ maxHeight: '75vh' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div
                      style={{ display: 'none' }}
                      className="w-full h-48 rounded-xl bg-gray-800 flex flex-col items-center justify-center text-gray-400 text-sm gap-2"
                    >
                      <ImageIcon className="w-10 h-10 opacity-40" />
                      <span>Gambar tidak dapat dimuat langsung</span>
                      <a href={proof} target="_blank" rel="noreferrer" className="text-green-400 text-xs underline break-all px-4 text-center">Buka Berkas ({fileName})</a>
                    </div>
                  </div>
                );
              }

              // HEIF / Document / Spreadsheet / Archive / Other File
              return (
                <div key={idx} className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col items-center gap-4 text-center shadow-xl">
                  <div className="w-16 h-16 rounded-2xl bg-green-950/60 border border-green-800/50 flex items-center justify-center text-green-400">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm break-all">{fileName}</p>
                    <p className="text-gray-400 text-xs mt-1">Berkas Bukti Pembayaran #{idx + 1}</p>
                  </div>
                  <a
                    href={proof}
                    target="_blank"
                    download
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Download className="w-4 h-4" /> Unduh / Buka Berkas
                  </a>
                </div>
              );
            })}
          </div>
        </div>,
        document.body
      )}

      {/* UPLOAD PAYMENT PROOF MODAL */}
      {showPaymentProofModal && activeOrderForPaymentProof && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Upload Bukti Transfer</h3>
                <p className="text-xs text-gray-500 mt-0.5">Order #{activeOrderForPaymentProof.id}</p>
              </div>
              <button onClick={() => {setShowPaymentProofModal(false); setPaymentProofFiles([]);}} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Silakan scan QRIS di bawah ini untuk membayar sebesar
                </p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400 mb-3">
                  Rp {parseFloat(activeOrderForPaymentProof.total_price).toLocaleString('id-ID')}
                </p>
                <div 
                  onClick={() => setSelectedProofs([getPublicUrl('QRISkantinalhidayah.jpeg')])}
                  className="border-2 border-dashed border-green-400 dark:border-green-600 p-3 rounded-2xl inline-block bg-white shadow-md hover:shadow-lg cursor-pointer group transition-all"
                  title="Klik untuk memperbesar QRIS"
                >
                  <img src={getPublicUrl('QRISkantinalhidayah.jpeg')} alt="QRIS Pembayaran" className="w-52 h-52 object-contain group-hover:scale-105 transition-transform rounded-lg" />
                  <p className="text-xs font-bold text-green-600 dark:text-green-500 mt-2 flex items-center justify-center gap-1">
                    🔍 Klik QRIS untuk Memperbesar
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Foto Bukti Transfer <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-green-600 dark:text-green-400 font-medium">
                      Semua format foto & bebas ukuran
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.heic,.heif"
                    multiple
                    disabled={isCompressing}
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) {
                        setIsCompressing(true);
                        const toastId = toast.loading('Mengompresi foto otomatis...');
                        try {
                          const compressed = await compressImageFiles(files);
                          setPaymentProofFiles(prev => [...prev, ...compressed]);
                          toast.success('Foto berhasil disiapkan & dikompresi', { id: toastId });
                        } catch (err) {
                          setPaymentProofFiles(prev => [...prev, ...files]);
                          toast.dismiss(toastId);
                        } finally {
                          setIsCompressing(false);
                        }
                      }
                      e.target.value = '';
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900/30 dark:file:text-green-400 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-1 disabled:opacity-60"
                  />
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 flex items-center gap-1">
                    <span>✨ Otomatis dikompresi agar hemat ukuran & cepat terunggah.</span>
                  </p>
                </div>

                {paymentProofFiles.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Berkas Dipilih ({paymentProofFiles.length}):
                    </p>
                    <div className="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {paymentProofFiles.map((file, idx) => {
                        const isImg = isImageFile(file);
                        const isPdf = isPdfFile(file);
                        const isHeif = isHeifFile(file);

                        return (
                          <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-2 flex flex-col justify-between group">
                            {isImg ? (
                              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/5 mb-1.5">
                                <img src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="aspect-video w-full rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/40 flex flex-col items-center justify-center text-green-600 dark:text-green-400 mb-1.5">
                                <FileText className="w-6 h-6" />
                                <span className="text-[10px] font-mono font-bold mt-0.5 uppercase">
                                  {isPdf ? 'PDF' : isHeif ? 'HEIF' : file.name.split('.').pop() || 'FILE'}
                                </span>
                              </div>
                            )}

                            <div className="pr-6">
                              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate" title={file.name}>
                                {file.name}
                              </p>
                              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                <span>{formatFileSize(file.size)}</span>
                                {file.originalSize && file.originalSize > file.size && (
                                  <span className="text-green-600 dark:text-green-400 font-bold">
                                    (Hemat {Math.round((1 - file.size / file.originalSize) * 100)}%)
                                  </span>
                                )}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => setPaymentProofFiles(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition-transform active:scale-95 z-10"
                              title="Hapus berkas ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 sticky bottom-0 bg-white dark:bg-gray-900">
              <button 
                onClick={() => {setShowPaymentProofModal(false); setPaymentProofFiles([]);}}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm"
              >
                Batal
              </button>
              <button 
                type="button"
                disabled={paymentProofFiles.length === 0 || uploadPaymentProofMutation.isPending || isCompressing}
                onClick={() => {
                  const formData = new FormData();
                  paymentProofFiles.forEach((file) => {
                    formData.append('proof_of_payment[]', file);
                  });
                  uploadPaymentProofMutation.mutate({ id: activeOrderForPaymentProof.id, formData });
                }}
                className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm text-sm"
              >
                {uploadPaymentProofMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                    <span>Mengunggah ({paymentProofFiles.length} berkas)...</span>
                  </span>
                ) : isCompressing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                    <span>Mengompresi...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>{paymentProofFiles.length > 0 ? `Unggah (${paymentProofFiles.length}) Bukti` : 'Unggah Bukti'}</span>
                    <CheckCircle className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
