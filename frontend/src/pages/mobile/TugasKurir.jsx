import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Camera, CheckCircle, Upload, X, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getStorageUrl } from '../../lib/axios';

export default function TugasKurir() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);

  const { data: ordersRes, isLoading } = useQuery({
    queryKey: ['courier_orders'],
    queryFn: async () => {
      const res = await api.get('/courier/orders');
      return res.data;
    },
    refetchInterval: 30000 // auto refresh every 30s
  });

  const completeOrderMutation = useMutation({
    mutationFn: async ({ id, files }) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('proof_of_delivery[]', file);
      });
      
      const res = await api.post(`/courier/orders/${id}/complete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courier_orders'] });
      toast.success('Pesanan berhasil diselesaikan!');
      handleCloseModal();
    },
    onError: () => {
      toast.error('Gagal menyelesaikan pesanan');
    }
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Ukuran foto ${file.name} melebihi 5MB`);
          return false;
        }
        return true;
      });
      setPhotoFiles(validFiles);
      setPhotoPreviews(validFiles.map(file => URL.createObjectURL(file)));
    }
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setPhotoFiles([]);
    setPhotoPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContact = (phone, name) => {
    if (!phone) {
      toast.error(`Nomor telepon ${name} tidak tersedia`);
      return;
    }
    const formatted = phone.replace(/^0/, '62');
    window.open(`https://wa.me/${formatted}`, '_blank');
  };

  const handleSubmitProof = () => {
    if (photoFiles.length === 0 || !selectedOrder) {
      toast.error('Silakan unggah foto bukti pengiriman terlebih dahulu');
      return;
    }
    completeOrderMutation.mutate({ id: selectedOrder.id, files: photoFiles });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;
  }

  const orders = ordersRes || [];
  const activeOrders = orders.filter(o => o.status === 'processing');
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <div className="bg-gray-50 h-full min-h-screen pb-24 dark:bg-gray-950 font-sans">
      <div className="bg-white dark:bg-gray-900 sticky top-0 z-20 shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-green-600" />
          Tugas Kurir
        </h1>
      </div>

      <div className="p-4 md:px-8 max-w-7xl mx-auto space-y-6">
        {/* ACTIVE ORDERS */}
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Perlu Diantar</h2>
          
          {activeOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center border border-gray-100 dark:border-gray-800">
              <p className="text-gray-500">Tidak ada pesanan aktif saat ini.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map(order => (
                <div key={order.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-blue-200 dark:border-blue-900 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 px-3 py-1 rounded-bl-lg text-xs font-bold">
                    PROSES ANTAR
                  </div>
                  
                  <div className="mb-3 pr-20">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{order.user?.name || 'User'}</h3>
                      <button onClick={() => handleContact(order.user?.phone, order.user?.name)} className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 p-1.5 rounded-full" title="Hubungi Pembeli">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-start gap-2 mt-1.5">
                      <span className="text-red-500 mt-0.5">📍</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-tight">
                        {order.delivery_location || 'Lokasi tidak disebutkan'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-gray-500 text-xs font-semibold">DARI KANTIN: {order.canteen?.name}</p>
                      <button onClick={() => handleContact(order.canteen?.whatsapp_number, order.canteen?.name)} className="text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 p-1 rounded-full ml-auto" title="Hubungi Kantin">
                        <MessageCircle className="w-3 h-3" />
                      </button>
                    </div>
                    <ul className="space-y-1">
                      {order.items?.map(item => (
                        <li key={item.id} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="font-bold">{item.quantity}x</span>
                          <span className="flex-1">{item.product?.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Selesaikan Pesanan
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* COMPLETED ORDERS */}
        {completedOrders.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1 mt-8">Riwayat Selesai</h2>
            <div className="space-y-3">
              {completedOrders.map(order => (
                <div key={order.id} className="bg-white dark:bg-gray-900 p-3 md:p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3 opacity-75">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">{order.user?.name}</h3>
                      <button onClick={() => handleContact(order.user?.phone, order.user?.name)} className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 p-1 rounded-full shrink-0" title="Hubungi Pembeli">
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-gray-500 truncate bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{order.canteen?.name}</p>
                      <button onClick={() => handleContact(order.canteen?.whatsapp_number, order.canteen?.name)} className="text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 p-1 rounded-full shrink-0" title="Hubungi Kantin">
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 truncate">📍 {order.delivery_location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-gray-400 block">{new Date(order.updated_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</span>
                    <span className="text-[10px] font-bold text-green-600 block">SELESAI</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mt-0.5">+ Rp {parseFloat(order.canteen?.delivery_fee || 0).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* UPLOAD PROOF MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Selesaikan Pesanan</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Unggah foto bukti pengiriman untuk order atas nama <span className="font-bold text-gray-900 dark:text-white">{selectedOrder.user?.name}</span> di lokasi <span className="font-bold text-gray-900 dark:text-white">{selectedOrder.delivery_location}</span>.
              </p>
              
              <div 
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${photoPreviews.length > 0 ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {photoPreviews.length > 0 ? (
                  <div className="w-full grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                    {photoPreviews.map((preview, idx) => (
                      <div key={idx} className="relative w-full aspect-square rounded-lg overflow-hidden group">
                        <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-semibold flex items-center gap-1"><Camera className="w-3 h-3"/> Ganti</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center text-gray-500">
                    <Upload className="w-10 h-10 mb-2 opacity-50" />
                    <span className="font-medium text-sm">Ambil / Pilih Foto Bukti</span>
                    <span className="text-xs opacity-70 mt-1">Maksimal 5MB (JPG/PNG)</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  multiple
                  capture="environment" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden"
                />
              </div>
            </div>
            
            <div className="p-4 sm:p-6 pt-0 flex gap-3">
              <button 
                onClick={handleCloseModal}
                className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSubmitProof}
                disabled={photoFiles.length === 0 || completeOrderMutation.isPending}
                className="flex-[2] py-2.5 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
              >
                {completeOrderMutation.isPending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>Kirim & Selesaikan <CheckCircle className="w-5 h-5"/></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
