import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, ShoppingBag, CheckCircle, Clock, Truck, MessageCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function PesananToko() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCouriers, setSelectedCouriers] = useState({});
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [activeOrderForCourier, setActiveOrderForCourier] = useState(null);

  const [showProofModal, setShowProofModal] = useState(false);
  const [activeOrderForProof, setActiveOrderForProof] = useState(null);
  const [proofFile, setProofFile] = useState(null);

  const { data: ordersRes, isLoading } = useQuery({
    queryKey: ['canteen_orders'],
    queryFn: async () => {
      const res = await api.get('/canteen/orders');
      return res.data;
    },
    refetchInterval: 30000 // auto refresh every 30s
  });

  const { data: couriersRes } = useQuery({
    queryKey: ['couriers'],
    queryFn: async () => {
      const res = await api.get('/couriers');
      return res.data;
    }
  });

  const updatePaymentMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/canteen/orders/${id}/payment`, { payment_status: status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      toast.success('Status pembayaran berhasil diperbarui!');
    },
    onError: () => {
      toast.error('Gagal memperbarui status');
    }
  });

  const completeOrderMutation = useMutation({
    mutationFn: ({ id, formData }) => api.post(`/canteen/orders/${id}/complete`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      toast.success('Pesanan berhasil diselesaikan dan Lunas!');
      setShowProofModal(false);
      setProofFile(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal menyelesaikan pesanan');
    }
  });

  const assignCourierMutation = useMutation({
    mutationFn: async ({ id, courier_id }) => {
      const res = await api.put(`/canteen/orders/${id}/courier`, { courier_id });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      toast.success('Berhasil menugaskan kurir!');
      setShowCourierModal(false);
      
      // Auto-redirect to WhatsApp
      const selectedCourier = couriers.find(c => c.id === variables.courier_id);
      if (selectedCourier && selectedCourier.phone) {
        const phone = selectedCourier.phone.replace(/^0/, '62');
        const msg = encodeURIComponent(`Halo ${selectedCourier.name}, ada pesanan baru untuk diantar atas nama ${activeOrderForCourier?.user?.name || 'Santri'}. Tolong segera ambil di Kantin ya!`);
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
      }
      
      setActiveOrderForCourier(null);
    },
    onError: () => toast.error('Gagal menugaskan kurir')
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.put(`/canteen/orders/${id}/cancel`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      toast.success('Pesanan berhasil dibatalkan');
    },
    onError: () => toast.error('Gagal membatalkan pesanan')
  });

  const handleContact = (phone, name) => {
    if (!phone) {
      toast.error(`Nomor telepon ${name} tidak tersedia`);
      return;
    }
    const formatted = phone.replace(/^0/, '62');
    window.open(`https://wa.me/${formatted}`, '_blank');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;
  }

  const orders = ordersRes || [];
  const couriers = couriersRes || [];

  return (
    <div className="bg-gray-50 h-full min-h-screen pb-24 dark:bg-gray-950 font-sans">
      <div className="bg-white dark:bg-gray-900 sticky top-0 z-20 shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate({ to: '/dashboard/toko-saya' })} className="p-2 -ml-2 text-gray-700 dark:text-gray-300">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Pesanan Masuk</h1>
      </div>

      <div className="p-4 md:px-8 max-w-7xl mx-auto space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500 flex flex-col items-center">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
            <p>Belum ada pesanan masuk.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Order #{order.id} • {new Date(order.created_at).toLocaleString('id-ID')}
                  </p>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">{order.user?.name || 'User'}</h3>
                    <button onClick={() => handleContact(order.user?.phone, order.user?.name)} className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 p-1.5 rounded-full" title="Hubungi Pembeli">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                  {order.courier && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-blue-600 font-medium">Kurir: {order.courier.name}</span>
                      <button onClick={() => handleContact(order.courier.phone, order.courier.name)} className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-1 rounded-full" title="Hubungi Kurir">
                        <MessageCircle className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {order.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {order.items?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.quantity}x {item.product?.name}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Rp {parseFloat(item.subtotal).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}

                {/* Calculate Additional Fees (Ongkir + Admin) */}
                {(() => {
                  const subtotalProducts = order.items?.reduce((sum, item) => sum + parseFloat(item.subtotal), 0) || 0;
                  const additionalFees = parseFloat(order.total_price) - subtotalProducts;
                  
                  if (additionalFees > 0) {
                    return (
                      <div className="flex justify-between text-sm pt-2 mt-2 border-t border-gray-50 dark:border-gray-800/50 text-gray-500 dark:text-gray-400">
                        <span>Ongkir & Biaya Admin</span>
                        <span>Rp {additionalFees.toLocaleString('id-ID')}</span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
                <p className="font-bold text-gray-900 dark:text-white flex flex-col">
                  <span>Total: Rp {parseFloat(order.total_price).toLocaleString('id-ID')}</span>
                </p>
                {order.status === 'pending' ? (
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <button 
                      onClick={() => {
                        if(window.confirm('Tolak pesanan ini (misal stok habis)?')) {
                          cancelOrderMutation.mutate(order.id);
                        }
                      }}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <X className="w-4 h-4" /> Tolak
                    </button>
                    
                    <button 
                      onClick={() => {
                        setActiveOrderForCourier(order);
                        setShowCourierModal(true);
                      }}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Truck className="w-4 h-4" /> Pilih Kurir
                    </button>

                    <button 
                      onClick={() => {
                        setActiveOrderForProof(order);
                        setShowProofModal(true);
                      }}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" /> Lunas & Selesai
                    </button>
                  </div>
                ) : order.status === 'cancelled' ? (
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    Dibatalkan
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {order.status === 'processing' ? 'Sedang Diproses Kurir' : order.status === 'completed' ? 'Selesai' : order.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* COURIER SELECTION MODAL */}
      {showCourierModal && activeOrderForCourier && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-950 flex flex-col animate-in slide-in-from-bottom-full duration-300">
          <div className="bg-white dark:bg-gray-900 sticky top-0 z-20 shadow-sm px-4 py-3 flex items-center gap-3">
            <button 
              onClick={() => {
                setShowCourierModal(false);
                setActiveOrderForCourier(null);
              }} 
              className="p-2 -ml-2 text-gray-700 dark:text-gray-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Pilih Kurir</h1>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:px-8 max-w-3xl mx-auto w-full">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6 border border-blue-100 dark:border-blue-900">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Pilih kurir untuk mengantarkan pesanan <strong>#{activeOrderForCourier.id}</strong> atas nama <strong>{activeOrderForCourier.user?.name}</strong>.
              </p>
              <p className="text-sm font-semibold mt-2 flex items-center text-blue-900 dark:text-blue-200">
                <span className="mr-1">📍 Tujuan:</span> {activeOrderForCourier.delivery_location || 'Belum ada data alamat (Order Lama)'}
              </p>
            </div>

            <h2 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider text-gray-500">Daftar Kurir Tersedia</h2>

            <div className="space-y-3">
              {couriers.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Belum ada kurir yang terdaftar.</p>
              ) : (
                couriers.map(c => {
                  const isSelected = selectedCouriers[activeOrderForCourier.id] === c.id;
                  return (
                    <label 
                      key={c.id} 
                      className={`flex items-center p-4 rounded-xl border cursor-pointer transition-colors ${
                        isSelected 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="courier" 
                        value={c.id}
                        checked={isSelected}
                        onChange={(e) => setSelectedCouriers({ ...selectedCouriers, [activeOrderForCourier.id]: e.target.value })}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="ml-4 flex-1">
                        <span className="font-bold text-gray-900 dark:text-white text-base">{c.name}</span>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Truck className="w-3 h-3"/> Kurir Aktif</p>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleContact(c.phone, c.name);
                        }}
                        className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-full z-10 transition-colors"
                        title={`Tanya Kurir ${c.name}`}
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </label>
                  );
                })
              )}
            </div>
          </div>
          
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] pb-safe">
            <div className="max-w-3xl mx-auto flex gap-3">
              <button 
                onClick={() => {
                  setShowCourierModal(false);
                  setActiveOrderForCourier(null);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                disabled={!selectedCouriers[activeOrderForCourier.id] || assignCourierMutation.isPending}
                onClick={() => assignCourierMutation.mutate({ id: activeOrderForCourier.id, courier_id: selectedCouriers[activeOrderForCourier.id] })}
                className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {assignCourierMutation.isPending ? 'Menugaskan...' : (
                  <>Konfirmasi Kurir <CheckCircle className="w-5 h-5"/></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROOF OF DELIVERY MODAL */}
      {showProofModal && activeOrderForProof && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Upload Bukti Pengiriman</h3>
                <p className="text-xs text-gray-500 mt-0.5">Order #{activeOrderForProof.id}</p>
              </div>
              <button onClick={() => {setShowProofModal(false); setProofFile(null);}} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Untuk menyelesaikan pesanan ini <strong>(Tanpa Kurir)</strong>, Anda diwajibkan untuk mengunggah foto bukti pengiriman/pengambilan makanan.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Foto Bukti <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => setProofFile(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900/30 dark:file:text-green-400 dark:text-gray-400"
                  />
                </div>
                {proofFile && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={URL.createObjectURL(proofFile)} alt="Preview" className="w-full h-48 object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 sticky bottom-0 bg-white dark:bg-gray-900">
              <button 
                onClick={() => {setShowProofModal(false); setProofFile(null);}}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold"
              >
                Batal
              </button>
              <button 
                disabled={!proofFile || completeOrderMutation.isPending}
                onClick={() => {
                  const formData = new FormData();
                  formData.append('_method', 'PUT');
                  formData.append('proof_of_delivery', proofFile);
                  completeOrderMutation.mutate({ id: activeOrderForProof.id, formData });
                }}
                className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:bg-gray-400 flex items-center justify-center gap-2 shadow-sm"
              >
                {completeOrderMutation.isPending ? 'Memproses...' : (
                  <>Selesaikan Pesanan <CheckCircle className="w-5 h-5"/></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
