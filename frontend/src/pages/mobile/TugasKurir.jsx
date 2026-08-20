import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Camera, CheckCircle, Upload, X, MessageCircle, Trash2, RotateCcw, FileText, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getStorageUrl } from '../../lib/axios';

export default function TugasKurir() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [uploadType, setUploadType] = useState('purchase'); // 'purchase' | 'delivery'
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [selectedProofs, setSelectedProofs] = useState([]);
  const [confirmCompleteOrder, setConfirmCompleteOrder] = useState(null);

  const { data: ordersRes, isLoading } = useQuery({
    queryKey: ['courier_orders'],
    queryFn: async () => {
      const res = await api.get('/courier/orders');
      return res.data;
    },
    refetchInterval: 5000 // auto refresh every 5s for near real-time
  });

  const uploadProofMutation = useMutation({
    mutationFn: async ({ id, files, type }) => {
      const formData = new FormData();
      const fieldName = type === 'delivery' ? 'proof_of_delivery[]' : 'proof_of_purchase[]';
      const endpoint = type === 'delivery' ? `/courier/orders/${id}/upload-delivery` : `/courier/orders/${id}/upload-receipt`;
      
      files.forEach(file => {
        formData.append(fieldName, file);
      });
      
      const res = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courier_orders'] });
      toast.success(variables.type === 'delivery' ? 'Bukti serah terima berhasil ditambahkan!' : 'Struk pembelian berhasil ditambahkan!');
      handleCloseModal();
    },
    onError: () => {
      toast.error('Gagal mengunggah bukti foto');
    }
  });

  const deleteProofMutation = useMutation({
    mutationFn: async ({ id, type, path }) => {
      const res = await api.delete(`/courier/orders/${id}/proof`, {
        data: { type, path }
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courier_orders'] });
      toast.success('Foto berhasil dihapus!');
      // Update local selectedOrder state if open
      if (selectedOrder && data.order) {
        setSelectedOrder(data.order);
      }
    },
    onError: () => {
      toast.error('Gagal menghapus foto');
    }
  });

  const markCompleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.post(`/courier/orders/${id}/complete`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courier_orders'] });
      toast.success('Pesanan berhasil diselesaikan!');
    },
    onError: () => {
      toast.error('Gagal menyelesaikan pesanan');
    }
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        if (file.size > 2 * 1024 * 1024) {
          toast.error(`Ukuran foto ${file.name} melebihi 2MB`);
          return false;
        }
        return true;
      });
      setPhotoFiles(prev => [...prev, ...validFiles]);
      setPhotoPreviews(prev => [...prev, ...validFiles.map(file => URL.createObjectURL(file))]);
    }
  };

  const handleRemoveNewPhoto = (index, e) => {
    e.stopPropagation();
    setPhotoFiles(prev => prev.filter((_, idx) => idx !== index));
    setPhotoPreviews(prev => prev.filter((_, idx) => idx !== index));
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
      toast.error(`Nomor WhatsApp ${name} tidak tersedia di profil`);
      return;
    }
    let cleaned = phone.replace(/\D/g, ''); // Remove non-digits
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    } else if (!cleaned.startsWith('62') && cleaned.length > 5) {
      cleaned = '62' + cleaned;
    }
    window.open(`https://wa.me/${cleaned}`, '_blank');
  };

  const handleSubmitProof = () => {
    if (photoFiles.length === 0 || !selectedOrder) {
      toast.error('Silakan pilih atau ambil foto terlebih dahulu');
      return;
    }
    uploadProofMutation.mutate({ id: selectedOrder.id, files: photoFiles, type: uploadType });
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
                <div key={order.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-blue-200 dark:border-blue-900 shadow-sm relative overflow-hidden space-y-4">
                  <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 px-3 py-1 rounded-bl-lg text-xs font-bold">
                    PROSES ANTAR
                  </div>
                  
                  <div className="pr-20">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{order.user?.name || 'User'}</h3>
                    </div>
                    <div className="flex items-start gap-2 mt-1.5">
                      <span className="text-red-500 mt-0.5">📍</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-tight">
                        {order.delivery_location || 'Lokasi tidak disebutkan'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-gray-500 text-xs font-semibold">DARI KANTIN: {order.canteen?.name}</p>
                      <button onClick={() => handleContact(order.canteen?.whatsapp_number, order.canteen?.name)} className="text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 p-1 rounded-full ml-auto" title="Hubungi Kantin">
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <ul className="space-y-1.5">
                      {order.items?.map(item => (
                        <li key={item.id} className="text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <span className="font-bold">{item.quantity}x</span>
                            <span className="flex-1 font-medium">{item.product?.name}</span>
                          </div>
                          {item.notes && (
                            <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded mt-0.5 inline-block font-medium">
                              📝 Catatan: {item.notes}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* PROOF VIEW BUTTONS IF ANY ALREADY UPLOADED */}
                  {((order.proof_of_purchase && order.proof_of_purchase.length > 0) ||
                    (order.proof_of_delivery && order.proof_of_delivery.length > 0) ||
                    (order.proof_of_payment && order.proof_of_payment.length > 0)) && (
                    <div className="flex gap-2 flex-wrap">
                      {order.proof_of_purchase && order.proof_of_purchase.length > 0 && (
                        <button
                          onClick={() => {
                            let proofs = Array.isArray(order.proof_of_purchase)
                              ? order.proof_of_purchase.map(p => getStorageUrl(p))
                              : [getStorageUrl(order.proof_of_purchase)];
                            setSelectedProofs(proofs);
                          }}
                          className="flex-1 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          📄 Lihat Struk Terunggah ({Array.isArray(order.proof_of_purchase) ? order.proof_of_purchase.length : 1})
                        </button>
                      )}

                      {order.proof_of_delivery && order.proof_of_delivery.length > 0 && (
                        <button
                          onClick={() => {
                            let proofs = Array.isArray(order.proof_of_delivery)
                              ? order.proof_of_delivery.map(p => getStorageUrl(p))
                              : [getStorageUrl(order.proof_of_delivery)];
                            setSelectedProofs(proofs);
                          }}
                          className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          📷 Bukti Serah Terima ({Array.isArray(order.proof_of_delivery) ? order.proof_of_delivery.length : 1})
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* UPLOAD ACTION BUTTONS */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setUploadType('purchase');
                        setPhotoFiles([]);
                        setPhotoPreviews([]);
                      }}
                      className="py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Camera className="w-4 h-4" />
                      + Upload Struk
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setUploadType('delivery');
                        setPhotoFiles([]);
                        setPhotoPreviews([]);
                      }}
                      className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      + Upload Bukti
                    </button>
                    
                    <button 
                      onClick={() => setConfirmCompleteOrder(order)}
                      disabled={markCompleteMutation.isPending}
                      className="col-span-2 py-2.5 px-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-1 disabled:opacity-50"
                    >
                      {markCompleteMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <><CheckCircle className="w-4 h-4" /> Selesaikan Pesanan</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* COMPLETED / SUBMITTED ORDERS */}
        {completedOrders.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1 mt-8">Riwayat Selesai</h2>
            <div className="space-y-3">
              {completedOrders.map(order => (
                <div key={order.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm opacity-90 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{order.user?.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs text-gray-500 truncate bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{order.canteen?.name}</p>
                        <button onClick={() => handleContact(order.canteen?.whatsapp_number, order.canteen?.name)} className="text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 p-1 rounded-full shrink-0" title="Hubungi Kantin">
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 truncate">📍 {order.delivery_location}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-gray-400 block">{new Date(order.updated_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</span>
                      <span className="text-[10px] font-bold text-green-600 block">
                        SELESAI
                      </span>
                    </div>
                  </div>

                  {/* PROOF OF PURCHASE & DELIVERY VIEW BUTTONS */}
                  {((order.proof_of_purchase && order.proof_of_purchase.length > 0) ||
                    (order.proof_of_delivery && order.proof_of_delivery.length > 0) ||
                    (order.proof_of_payment && order.proof_of_payment.length > 0)) && (
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex gap-2 flex-wrap">
                      {order.proof_of_purchase && order.proof_of_purchase.length > 0 && (
                        <button
                          onClick={() => {
                            let proofs = Array.isArray(order.proof_of_purchase)
                              ? order.proof_of_purchase.map(p => getStorageUrl(p))
                              : [getStorageUrl(order.proof_of_purchase)];
                            setSelectedProofs(proofs);
                          }}
                          className="flex-1 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          📄 Struk ({Array.isArray(order.proof_of_purchase) ? order.proof_of_purchase.length : 1} Foto)
                        </button>
                      )}

                      {order.proof_of_delivery && order.proof_of_delivery.length > 0 && (
                        <button
                          onClick={() => {
                            let proofs = Array.isArray(order.proof_of_delivery)
                              ? order.proof_of_delivery.map(p => getStorageUrl(p))
                              : [getStorageUrl(order.proof_of_delivery)];
                            setSelectedProofs(proofs);
                          }}
                          className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          📷 Bukti Antar ({Array.isArray(order.proof_of_delivery) ? order.proof_of_delivery.length : 1})
                        </button>
                      )}
                    </div>
                  )}
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
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Upload Foto Kurir</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              {/* Upload Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUploadType('purchase')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${uploadType === 'purchase' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
                >
                  <FileText className="w-3.5 h-3.5" /> Struk Kantin
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('delivery')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${uploadType === 'delivery' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
                >
                  <Camera className="w-3.5 h-3.5" /> Bukti Serah Terima
                </button>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300">
                Upload <span className="font-bold text-gray-900 dark:text-white">{uploadType === 'delivery' ? 'Bukti Serah Terima (Antar Santri)' : 'Struk Pembelian Kantin'}</span> untuk <span className="font-bold text-gray-900 dark:text-white">{selectedOrder.user?.name}</span>.
              </p>

              {/* CURRENTLY SAVED PHOTOS FOR THIS TYPE */}
              {(() => {
                const currentField = uploadType === 'delivery' ? 'proof_of_delivery' : 'proof_of_purchase';
                const currentPhotos = Array.isArray(selectedOrder[currentField]) ? selectedOrder[currentField] : (selectedOrder[currentField] ? [selectedOrder[currentField]] : []);
                
                if (currentPhotos.length === 0) return null;

                return (
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Foto Terunggah ({currentPhotos.length}):
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto">
                      {currentPhotos.map((path, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 group">
                          <img src={getStorageUrl(path)} alt={`Saved ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Hapus foto ini dari database?')) {
                                deleteProofMutation.mutate({ id: selectedOrder.id, type: currentField, path });
                              }
                            }}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition-transform active:scale-95 z-10"
                            title="Hapus foto ini"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">
                      *Foto baru yang Anda pilih di bawah akan **ditambahkan** (di-accumulate) ke daftar foto di atas.
                    </p>
                  </div>
                );
              })()}
              
              {/* UPLOAD NEW PHOTOS FILE INPUTS */}
              <div className="space-y-3">
                {photoPreviews.length > 0 ? (
                  <div className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-colors border-green-500 bg-green-50/50 dark:bg-green-900/10`}>
                    <div className="w-full space-y-3">
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                        {photoPreviews.map((preview, idx) => (
                          <div key={idx} className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                            <img src={preview} alt={`New Preview ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={(e) => handleRemoveNewPhoto(idx, e)}
                              className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition-transform active:scale-95 z-10"
                              title="Batal upload foto ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById('cameraInput').click()}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center rounded-full">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Kamera Langsung</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => document.getElementById('galleryInput').click()}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center rounded-full">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Pilih dari Galeri</span>
                  </button>
                </div>

                <input 
                  id="cameraInput"
                  type="file" 
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange} 
                  className="hidden"
                />
                <input 
                  id="galleryInput"
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={handleFileChange} 
                  className="hidden"
                />
              </div>
            </div>
            
            <div className="p-4 sm:p-6 pt-0 flex gap-3">
              <button 
                onClick={handleCloseModal}
                className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 transition-colors text-xs"
              >
                Batal
              </button>
              <button 
                onClick={handleSubmitProof}
                disabled={photoFiles.length === 0 || uploadProofMutation.isPending}
                className={`flex-[2] py-2.5 rounded-xl font-bold text-white disabled:opacity-50 transition-colors flex justify-center items-center gap-2 text-xs ${uploadType === 'delivery' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {uploadProofMutation.isPending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Tambah Foto {uploadType === 'delivery' ? 'Bukti Antar' : 'Struk'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL SCREEN PHOTO VIEWER MODAL */}
      {selectedProofs.length > 0 && (
        <div className="fixed inset-0 z-[70] bg-black flex flex-col animate-in fade-in duration-200">
          <div className="flex justify-between items-center px-4 py-3 bg-black/80 shrink-0">
            <span className="text-white font-bold text-sm">Foto Bukti Terunggah ({selectedProofs.length} Foto)</span>
            <button 
              onClick={() => setSelectedProofs([])}
              className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto flex flex-col items-center gap-4 p-4 pb-10">
            {selectedProofs.map((proof, idx) => (
              <div key={idx} className="w-full max-w-xl">
                <p className="text-white/50 text-xs mb-1 text-center">Foto {idx + 1}</p>
                <img 
                  src={proof}
                  alt={`Foto ${idx + 1}`}
                  className="w-full rounded-xl shadow-2xl object-contain bg-gray-900"
                  style={{ maxHeight: '80vh' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR COMPLETING ORDER */}
      {confirmCompleteOrder && (
        <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl p-5 text-center">
            {/* Warning Icon if no proofs uploaded */}
            {!(confirmCompleteOrder.proof_of_purchase?.length > 0 || confirmCompleteOrder.proof_of_delivery?.length > 0) ? (
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
            ) : (
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
            )}
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Selesaikan Pesanan?</h3>
            
            {!(confirmCompleteOrder.proof_of_purchase?.length > 0 || confirmCompleteOrder.proof_of_delivery?.length > 0) ? (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 font-medium">
                <span className="text-amber-600 dark:text-amber-400 font-bold">Peringatan:</span> Anda belum mengunggah foto Struk ataupun Bukti Antar!<br/><br/>
                Apakah Anda yakin ingin menyelesaikan pesanan ini tanpa bukti foto sama sekali?
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Apakah Anda yakin pesanan atas nama <span className="font-bold">{confirmCompleteOrder.user?.name}</span> ini sudah selesai dan makanan telah diserahkan dengan benar?
              </p>
            )}

            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmCompleteOrder(null)}
                className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 transition-colors text-sm"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  markCompleteMutation.mutate(confirmCompleteOrder.id);
                  setConfirmCompleteOrder(null);
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors text-sm"
              >
                Ya, Selesaikan!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
