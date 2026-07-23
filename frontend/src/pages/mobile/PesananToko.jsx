import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, ShoppingBag, CheckCircle, Clock, Truck, MessageCircle, X, Image as ImageIcon, ChevronDown, ChevronRight, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getStorageUrl } from '../../lib/axios';
import { useCanteenStore } from '../../store/canteenStore';

function getWeeksInMonth(year, month) {
  // month is 0-indexed
  const weeks = [];
  let currentDate = new Date(year, month, 1);
  let currentWeek = [];

  while (currentDate.getMonth() === month) {
    currentWeek.push(new Date(currentDate));
    // If it's Sunday (0), the week ends
    if (currentDate.getDay() === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  return weeks.map((week, index) => {
    return {
      name: `Minggu ${index + 1} (${week[0].getDate()}-${week[week.length - 1].getDate()})`,
      startDate: week[0],
      endDate: week[week.length - 1]
    };
  });
}

export default function PesananToko() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { activeCanteenId, setActiveCanteenId, isStoreSelected, setIsStoreSelected } = useCanteenStore();
  const [selectedCouriers, setSelectedCouriers] = useState({});

  // Fetch all canteens owned by this user
  const { data: canteensList } = useQuery({
    queryKey: ['my_canteens_list'],
    queryFn: async () => {
      const res = await api.get('/my-canteens');
      return res.data.data || res.data;
    }
  });


  const [showCourierModal, setShowCourierModal] = useState(false);
  const [activeOrderForCourier, setActiveOrderForCourier] = useState(null);

  const [showProofModal, setShowProofModal] = useState(false);
  const [activeOrderForProof, setActiveOrderForProof] = useState(null);
  const [proofFiles, setProofFiles] = useState([]);
  
  const [selectedProofs, setSelectedProofs] = useState([]);

  // Manual Order by Canteen State
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualUserId, setManualUserId] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [manualPrice, setManualPrice] = useState('');

  // Set Custom Order Price State
  const [showSetPriceModal, setShowSetPriceModal] = useState(false);
  const [activeOrderForSetPrice, setActiveOrderForSetPrice] = useState(null);
  const [newPriceInput, setNewPriceInput] = useState('');

  // Fetch Santri List for Manual Order
  const { data: santriList = [] } = useQuery({
    queryKey: ['santri_list'],
    queryFn: async () => {
      const res = await api.get('/canteen/santri-list');
      return res.data;
    },
    enabled: showManualModal
  });

  const createManualOrderMutation = useMutation({
    mutationFn: (data) => api.post('/canteen/orders/manual', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      toast.success('Pesanan manual berhasil dibuat untuk santri!');
      setShowManualModal(false);
      setManualUserId('');
      setManualNotes('');
      setManualPrice('');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal membuat pesanan manual');
    }
  });

  const setCustomPriceMutation = useMutation({
    mutationFn: ({ id, price }) => api.put(`/canteen/orders/${id}/custom-price`, { total_price: price }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      toast.success('Harga pesanan khusus berhasil diperbarui!');
      setShowSetPriceModal(false);
      setActiveOrderForSetPrice(null);
      setNewPriceInput('');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui harga');
    }
  });

  const today = new Date();
  const [filterMode, setFilterMode] = useState('day'); // 'day', 'week', 'month', 'year'
  const [filterDate, setFilterDate] = useState(
    `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
  );
  const [filterMonth, setFilterMonth] = useState(today.getMonth());
  const [filterYear, setFilterYear] = useState(today.getFullYear());
  const [filterWeekIndex, setFilterWeekIndex] = useState(() => {
    const weeks = getWeeksInMonth(today.getFullYear(), today.getMonth());
    const idx = weeks.findIndex(w => today >= w.startDate && today <= w.endDate);
    return idx >= 0 ? idx : 0;
  });

  const getFilterParams = () => {
    const pad = n => n.toString().padStart(2, '0');
    const format = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  
    if (filterMode === 'day') {
      return { start_date: filterDate, end_date: filterDate };
    } 
    else if (filterMode === 'week') {
      const weeks = getWeeksInMonth(filterYear, filterMonth);
      const week = weeks[filterWeekIndex] || weeks[0];
      return { start_date: format(week.startDate), end_date: format(week.endDate) };
    }
    else if (filterMode === 'month') {
      const start = new Date(filterYear, filterMonth, 1);
      const end = new Date(filterYear, filterMonth + 1, 0); // last day
      return { start_date: format(start), end_date: format(end) };
    }
    else if (filterMode === 'year') {
      const start = new Date(filterYear, 0, 1);
      const end = new Date(filterYear, 11, 31);
      return { start_date: format(start), end_date: format(end) };
    }
    return {};
  };

  const [selectedCanteenFilter, setSelectedCanteenFilter] = useState('all');

  const currentParams = getFilterParams();

  const { data: ordersRes, isLoading } = useQuery({
    queryKey: ['canteen_orders', selectedCanteenFilter, currentParams.start_date, currentParams.end_date],
    queryFn: async () => {
      const res = await api.get(`/canteen/orders?canteen_id=${selectedCanteenFilter}&start_date=${currentParams.start_date}&end_date=${currentParams.end_date}`);
      return res.data;
    },
    refetchInterval: 30000, // auto refresh every 30s
  });

  const { data: couriersRes } = useQuery({
    queryKey: ['couriers'],
    queryFn: async () => {
      const res = await api.get('/couriers');
      return res.data;
    }
  });

  const updatePaymentMutation = useMutation({
    mutationFn: ({ id, status, canteen_id }) => api.put(`/canteen/orders/${id}/payment?canteen_id=${canteen_id}`, { payment_status: status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      toast.success('Status pembayaran berhasil diperbarui!');
    },
    onError: () => {
      toast.error('Gagal memperbarui status');
    }
  });

  const completeOrderMutation = useMutation({
    mutationFn: ({ id, formData, canteen_id }) => api.post(`/canteen/orders/${id}/complete?canteen_id=${canteen_id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      toast.success('Pesanan berhasil diselesaikan dan Lunas!');
      setShowProofModal(false);
      setProofFiles([]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal menyelesaikan pesanan');
    }
  });

  const [showPayCourierModal, setShowPayCourierModal] = useState(false);
  const [activeOrderForPayCourier, setActiveOrderForPayCourier] = useState(null);
  const [payCourierFile, setPayCourierFile] = useState(null);

  const payCourierMutation = useMutation({
    mutationFn: ({ id, formData, canteen_id }) => api.post(`/canteen/orders/${id}/pay-courier?canteen_id=${canteen_id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      toast.success('Berhasil menandai kurir telah dibayar!');
      setShowPayCourierModal(false);
      setPayCourierFile(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memproses pembayaran kurir');
    }
  });

  const assignCourierMutation = useMutation({
    mutationFn: async ({ id, courier_id, canteen_id }) => {
      const res = await api.put(`/canteen/orders/${id}/courier?canteen_id=${canteen_id}`, { courier_id });
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
    mutationFn: async ({ id, canteen_id }) => {
      const res = await api.put(`/canteen/orders/${id}/cancel?canteen_id=${canteen_id}`);
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
      <div className="bg-white dark:bg-gray-900 sticky top-0 z-20 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate({ to: '/dashboard' })} className="p-2 -ml-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Pesanan Masuk</h1>
        </div>
        <button 
          onClick={() => setShowManualModal(true)}
          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
        >
          ＋ Pesanan Manual
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-sm border-t border-gray-100 dark:border-gray-800 px-4 py-3 sticky top-[52px] z-10 space-y-3">
        {/* Filter Mode Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['day', 'week', 'month', 'year'].map(mode => (
            <button 
              key={mode} 
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${filterMode === mode ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
            >
              {mode === 'day' ? 'Harian' : mode === 'week' ? 'Mingguan' : mode === 'month' ? 'Bulanan' : 'Tahunan'}
            </button>
          ))}
        </div>
        
        {/* Specific Inputs based on Mode & Store Filter */}
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={selectedCanteenFilter}
            onChange={e => setSelectedCanteenFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-blue-50 text-blue-800 border-blue-200 font-semibold dark:bg-gray-800 dark:text-blue-400 dark:border-gray-700 shrink-0"
          >
            <option value="all">🏪 Semua Toko</option>
            {canteensList?.map(c => (
              <option key={c.id} value={c.id}>🏪 {c.name}</option>
            ))}
          </select>

          {filterMode === 'day' && (
            <input 
              type="date" 
              value={filterDate} 
              onChange={e => setFilterDate(e.target.value)} 
              className="px-3 py-2 border rounded-lg text-sm flex-1 dark:bg-gray-800 dark:border-gray-700" 
            />
          )}
          
          {(filterMode === 'week' || filterMode === 'month') && (
            <select 
              value={filterMonth} 
              onChange={e => {
                  setFilterMonth(parseInt(e.target.value));
                  setFilterWeekIndex(0); // reset week index when month changes
              }} 
              className="px-3 py-2 border rounded-lg text-sm flex-1 dark:bg-gray-800 dark:border-gray-700"
            >
              {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          )}

          {filterMode === 'week' && (
            <select 
              value={filterWeekIndex} 
              onChange={e => setFilterWeekIndex(parseInt(e.target.value))} 
              className="px-3 py-2 border rounded-lg text-sm flex-1 dark:bg-gray-800 dark:border-gray-700"
            >
              {getWeeksInMonth(filterYear, filterMonth).map((w, i) => (
                <option key={i} value={i}>{w.name}</option>
              ))}
            </select>
          )}
          
          {(filterMode === 'week' || filterMode === 'month' || filterMode === 'year') && (
            <select 
              value={filterYear} 
              onChange={e => setFilterYear(parseInt(e.target.value))} 
              className="px-3 py-2 border rounded-lg text-sm w-24 dark:bg-gray-800 dark:border-gray-700"
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}
        </div>
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
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {order.canteen?.name || 'Toko'}
                    </span>
                    {order.is_custom && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                        ✨ Pesanan Khusus
                      </span>
                    )}
                    <p className="text-xs text-gray-500">
                      Order #{order.id} • {new Date(order.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
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
                {order.is_custom && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-900/50 mb-2">
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase block mb-1">Catatan Titipan / Pesanan Khusus:</span>
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-200 whitespace-pre-wrap">
                      {order.custom_notes || 'Tidak ada catatan.'}
                    </p>
                  </div>
                )}

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
                  
                  if (additionalFees > 0 && order.items && order.items.length > 0) {
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

              {((order.proof_of_payment && order.proof_of_payment.length !== 0) || 
                (order.proof_of_purchase && order.proof_of_purchase.length !== 0) || 
                (order.proof_of_delivery && order.proof_of_delivery.length !== 0) || 
                order.proof_courier_paid) && (
                <div className="flex gap-2 mb-3 flex-wrap">
                  {order.proof_of_payment && order.proof_of_payment.length !== 0 && (
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
                      className="flex-1 py-2 px-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Bukti Transfer
                    </button>
                  )}
                  {order.proof_of_purchase && order.proof_of_purchase.length !== 0 && (
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
                      className="flex-1 py-2 px-3 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Struk Kurir
                    </button>
                  )}
                  {order.proof_of_delivery && order.proof_of_delivery.length !== 0 && (
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
                      className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Bukti Serah Terima
                    </button>
                  )}
                  {order.proof_courier_paid && (
                    <button 
                      onClick={() => {
                        let proofs = [getStorageUrl(order.proof_courier_paid)];
                        setSelectedProofs(proofs);
                      }}
                      className="flex-1 py-2 px-3 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Bukti Kurir
                    </button>
                  )}
                </div>
              )}



              <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
                <p className="font-bold text-gray-900 dark:text-white flex flex-col">
                  <span>Total: Rp {parseFloat(order.total_price).toLocaleString('id-ID')}</span>
                  {order.is_custom && parseFloat(order.total_price) === 0 && (
                    <span className="text-[10px] text-amber-600 font-semibold">(Harga belum ditentukan)</span>
                  )}
                </p>
                {order.status === 'pending' || order.status === 'processing' ? (
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {order.is_custom && (
                      <button 
                        onClick={() => {
                          setActiveOrderForSetPrice(order);
                          setNewPriceInput(order.total_price || '');
                          setShowSetPriceModal(true);
                        }}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 shadow-sm"
                      >
                        🏷️ {parseFloat(order.total_price) === 0 ? 'Set Harga Toko' : 'Edit Harga'}
                      </button>
                    )}
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => {
                          if(window.confirm('Tolak pesanan ini (misal stok habis)?')) {
                            cancelOrderMutation.mutate({ id: order.id, canteen_id: order.canteen_id });
                          }
                        }}
                        className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <X className="w-4 h-4" /> Tolak
                      </button>
                    )}
                    
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => {
                          setActiveOrderForCourier(order);
                          setShowCourierModal(true);
                        }}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Truck className="w-4 h-4" /> Pilih Kurir
                      </button>
                    )}

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
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Selesai
                  </span>
                )}
              </div>
              
              {/* Extra action for processing order: Pay Courier */}
              {order.status === 'processing' && order.courier_id && !order.is_courier_paid_by_canteen && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                  <button 
                    onClick={() => {
                      setActiveOrderForPayCourier(order);
                      setShowPayCourierModal(true);
                    }}
                    className="px-3 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> Talangi Kurir
                  </button>
                </div>
              )}
              {Boolean(order.is_courier_paid_by_canteen) && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    Kurir Telah Ditalangi
                  </span>
                </div>
              )}
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
                onClick={() => assignCourierMutation.mutate({ id: activeOrderForCourier.id, courier_id: selectedCouriers[activeOrderForCourier.id], canteen_id: activeOrderForCourier.canteen_id })}
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
              <button onClick={() => {setShowProofModal(false); setProofFiles([]);}} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
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
                    multiple
                    capture="environment"
                    onChange={(e) => setProofFiles(Array.from(e.target.files))}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900/30 dark:file:text-green-400 dark:text-gray-400"
                  />
                </div>
                {proofFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                    {proofFiles.map((file, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 aspect-square">
                        <img src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 sticky bottom-0 bg-white dark:bg-gray-900">
              <button 
                onClick={() => {setShowProofModal(false); setProofFiles([]);}}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold"
              >
                Batal
              </button>
              <button 
                disabled={proofFiles.length === 0 || completeOrderMutation.isPending}
                onClick={() => {
                  const formData = new FormData();
                  formData.append('_method', 'PUT');
                  proofFiles.forEach((file) => {
                    formData.append('proof_of_delivery[]', file);
                  });
                  completeOrderMutation.mutate({ id: activeOrderForProof.id, formData, canteen_id: activeOrderForProof.canteen_id });
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

      {/* PAY COURIER MODAL */}
      {showPayCourierModal && activeOrderForPayCourier && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Talangi Kurir</h3>
                <p className="text-xs text-gray-500 mt-0.5">Order #{activeOrderForPayCourier.id}</p>
              </div>
              <button onClick={() => {setShowPayCourierModal(false); setPayCourierFile(null);}} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Unggah bukti bahwa Anda (Kantin) telah memberikan upah/ongkir kepada Kurir (<strong>{activeOrderForPayCourier.courier?.name}</strong>) secara tunai. Saldo ongkir nanti akan masuk ke saldo Kantin Anda.
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
                    onChange={(e) => setPayCourierFile(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/30 dark:file:text-orange-400 dark:text-gray-400"
                  />
                </div>
                {payCourierFile && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 w-48 h-48">
                    <img src={URL.createObjectURL(payCourierFile)} alt="Preview Bukti" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 sticky bottom-0 bg-white dark:bg-gray-900">
              <button 
                onClick={() => {setShowPayCourierModal(false); setPayCourierFile(null);}}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold"
              >
                Batal
              </button>
              <button 
                disabled={!payCourierFile || payCourierMutation.isPending}
                onClick={() => {
                  const formData = new FormData();
                  formData.append('proof_courier_paid', payCourierFile);
                  payCourierMutation.mutate({ id: activeOrderForPayCourier.id, formData, canteen_id: activeOrderForPayCourier.canteen_id });
                }}
                className="flex-[2] py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {payCourierMutation.isPending ? 'Memproses...' : (
                  <>Konfirmasi <CheckCircle className="w-5 h-5"/></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL ORDER MODAL */}
      {showManualModal && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Buat Pesanan Manual</h3>
              <button onClick={() => setShowManualModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-900/50">
                <p className="text-xs text-green-800 dark:text-green-300">
                  Buatkan tagihan/pesanan tambahan atas nama Santri. Pesanan ini akan langsung muncul di HP Santri untuk dibayar.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Pilih Santri <span className="text-red-500">*</span></label>
                <select
                  value={manualUserId}
                  onChange={e => setManualUserId(e.target.value)}
                  className="w-full p-3 border rounded-xl text-sm dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="">-- Pilih Santri --</option>
                  {santriList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.santri_name || s.name} ({s.santri_room || 'Asrama?'} - {s.santri_class || ''}/{s.santri_level || ''})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Catatan Pesanan / Barang <span className="text-red-500">*</span></label>
                <textarea
                  rows={3}
                  value={manualNotes}
                  onChange={e => setManualNotes(e.target.value)}
                  placeholder="Contoh: Pembelian Obat Maag + Biaya Pengantaran..."
                  className="w-full p-3 border rounded-xl text-sm dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Total Price (Rp) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={manualPrice}
                  onChange={e => setManualPrice(e.target.value)}
                  placeholder="Contoh: 15000"
                  className="w-full p-3 border rounded-xl text-sm dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 pt-0 flex gap-3">
              <button 
                onClick={() => setShowManualModal(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                disabled={!manualUserId || !manualNotes.trim() || !manualPrice || createManualOrderMutation.isPending}
                onClick={() => {
                  createManualOrderMutation.mutate({
                    user_id: manualUserId,
                    custom_notes: manualNotes,
                    total_price: manualPrice,
                  });
                }}
                className="flex-[2] py-2.5 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2 shadow-sm"
              >
                {createManualOrderMutation.isPending ? 'Membuat...' : 'Buat Pesanan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SET CUSTOM ORDER PRICE MODAL */}
      {showSetPriceModal && activeOrderForSetPrice && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tentukan Harga Pesanan</h3>
              <button onClick={() => setShowSetPriceModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900/50">
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase block mb-1">Catatan dari Santri ({activeOrderForSetPrice.user?.name}):</span>
                <p className="text-sm font-medium text-purple-900 dark:text-purple-200 whitespace-pre-wrap">
                  {activeOrderForSetPrice.custom_notes || 'Tidak ada catatan.'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Total Harga Barang + Ongkir (Rp) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={newPriceInput}
                  onChange={e => setNewPriceInput(e.target.value)}
                  placeholder="Masukkan nominal harga..."
                  className="w-full p-3 border rounded-xl text-sm dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 pt-0 flex gap-3">
              <button 
                onClick={() => setShowSetPriceModal(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                disabled={!newPriceInput || setCustomPriceMutation.isPending}
                onClick={() => {
                  setCustomPriceMutation.mutate({
                    id: activeOrderForSetPrice.id,
                    price: newPriceInput
                  });
                }}
                className="flex-[2] py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2 shadow-sm"
              >
                {setCustomPriceMutation.isPending ? 'Simpan...' : 'Set & Setujui Harga'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROOF OF DELIVERY / PAYMENT FULL-SCREEN MODAL */}
      {selectedProofs.length > 0 && (
        <div className="fixed inset-0 z-[70] bg-black flex flex-col animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-black/80 shrink-0">
            <span className="text-white font-bold text-sm">{selectedProofs.length} Foto</span>
            <button 
              onClick={() => setSelectedProofs([])}
              className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Images */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center gap-4 p-4 pb-10">
            {selectedProofs.map((proof, idx) => (
              <div key={idx} className="w-full max-w-xl">
                <p className="text-white/50 text-xs mb-1 text-center">Bukti {idx + 1}</p>
                <img 
                  src={proof}
                  alt={`Bukti ${idx + 1}`}
                  className="w-full rounded-xl shadow-2xl object-contain bg-gray-900"
                  style={{ maxHeight: '80vh' }}
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
                  <span>Gambar tidak dapat dimuat</span>
                  <a href={proof} target="_blank" rel="noreferrer" className="text-green-400 text-xs underline break-all px-4 text-center">{proof}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
