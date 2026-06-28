import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit2, Check, X, Image as ImageIcon, Upload } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getStorageUrl } from '../../lib/axios';
import { toast } from 'react-hot-toast';

export default function PromoVoucher() {
  const queryClient = useQueryClient();
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [voucherForm, setVoucherForm] = useState({
    code: '',
    discount_amount: '',
    min_purchase: '',
    valid_until: '',
    is_active: true
  });

  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerData, setBannerData] = useState({ title: '' });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Fetch Canteen Profile for Banner Info
  const { data: canteen, isLoading: isLoadingCanteen } = useQuery({
    queryKey: ['my_canteen'],
    queryFn: async () => {
      const res = await api.get('/my-canteen');
      return res.data;
    }
  });

  // Fetch Vouchers
  const { data: vouchers = [], isLoading: isLoadingVouchers } = useQuery({
    queryKey: ['my_vouchers'],
    queryFn: async () => {
      const res = await api.get('/canteen/vouchers');
      return res.data;
    }
  });

  // Voucher Mutations
  const createVoucherMutation = useMutation({
    mutationFn: (data) => api.post('/canteen/vouchers', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['my_vouchers']);
      toast.success('Voucher berhasil dibuat');
      closeVoucherModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal membuat voucher');
    }
  });

  const updateVoucherMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/canteen/vouchers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['my_vouchers']);
      toast.success('Voucher berhasil diperbarui');
      closeVoucherModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui voucher');
    }
  });

  const deleteVoucherMutation = useMutation({
    mutationFn: (id) => api.delete(`/canteen/vouchers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['my_vouchers']);
      toast.success('Voucher berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus voucher')
  });

  // Banner Mutation
  const uploadBannerMutation = useMutation({
    mutationFn: (formData) => api.post('/canteen/banners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['my_canteen']);
      toast.success('Banner berhasil diunggah. Menunggu persetujuan admin.');
      closeBannerModal();
    },
    onError: () => toast.error('Gagal mengunggah banner')
  });

  const handleSaveVoucher = (e) => {
    e.preventDefault();
    if (editingVoucher) {
      updateVoucherMutation.mutate({ id: editingVoucher.id, data: voucherForm });
    } else {
      createVoucherMutation.mutate(voucherForm);
    }
  };

  const openEditVoucher = (voucher) => {
    setEditingVoucher(voucher);
    setVoucherForm({
      code: voucher.code,
      discount_amount: voucher.discount_amount,
      min_purchase: voucher.min_purchase,
      valid_until: voucher.valid_until ? voucher.valid_until.split('T')[0] : '',
      is_active: voucher.is_active
    });
    setShowVoucherModal(true);
  };

  const closeVoucherModal = () => {
    setEditingVoucher(null);
    setVoucherForm({ code: '', discount_amount: '', min_purchase: '', valid_until: '', is_active: true });
    setShowVoucherModal(false);
  };

  const handleUploadBanner = (e) => {
    e.preventDefault();
    if (!bannerFile) return toast.error('Gambar banner wajib diisi');
    
    const formData = new FormData();
    formData.append('title', bannerData.title);
    formData.append('image', bannerFile);
    uploadBannerMutation.mutate(formData);
  };

  const closeBannerModal = () => {
    setShowBannerModal(false);
    setBannerData({ title: '' });
    setBannerFile(null);
    setBannerPreview(null);
  };

  if (isLoadingCanteen || isLoadingVouchers) {
    return <div className="p-4 flex justify-center"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const pendingBanner = canteen?.banners?.find(b => b.status === 'pending');

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white shadow-lg rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-1">Promo & Voucher</h1>
        <p className="text-green-50 text-sm">Kelola diskon belanja dan ajukan banner kantin Anda</p>
      </div>

      <div className="p-4 space-y-6 -mt-4">
        {/* Banner Section */}
        <div className="glass-card rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-green-600" />
              Pengajuan Banner
            </h2>
            {pendingBanner ? (
              <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded-full">Menunggu Persetujuan</span>
            ) : (
              <button 
                onClick={() => setShowBannerModal(true)}
                className="text-sm px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-lg font-medium transition-colors"
              >
                Ajukan Baru
              </button>
            )}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
             {canteen?.image ? (
               <div className="relative aspect-[21/9] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                 <img src={getStorageUrl(canteen.image)} alt="Current Banner" className="w-full h-full object-cover" />
                 <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded font-medium">Banner Aktif</div>
               </div>
             ) : (
               <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Belum ada banner aktif.</p>
             )}
          </div>
        </div>

        {/* Voucher Section */}
        <div className="glass-card rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-green-600" />
              Voucher Diskon
            </h2>
            <button 
              onClick={() => setShowVoucherModal(true)}
              className="flex items-center gap-1 text-sm px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Buat
            </button>
          </div>

          {vouchers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Tag className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm">Belum ada voucher yang dibuat.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {vouchers.map(voucher => (
                <div key={voucher.id} className="border border-gray-100 dark:border-gray-700 p-4 rounded-xl flex justify-between items-center bg-white dark:bg-gray-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-green-700 dark:text-green-400 uppercase">{voucher.code}</span>
                      {!voucher.is_active ? (
                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">Nonaktif</span>
                      ) : (
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">Aktif</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Diskon: Rp {parseFloat(voucher.discount_amount).toLocaleString('id-ID')} | Min: Rp {parseFloat(voucher.min_purchase).toLocaleString('id-ID')}
                    </p>
                    {voucher.valid_until && (
                      <p className="text-[11px] text-red-500 mt-1">Berlaku s/d: {new Date(voucher.valid_until).toLocaleDateString('id-ID')}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditVoucher(voucher)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => {
                        if(window.confirm('Yakin ingin menghapus voucher ini?')) deleteVoucherMutation.mutate(voucher.id);
                      }} 
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL VOUCHER */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{editingVoucher ? 'Edit Voucher' : 'Buat Voucher Baru'}</h3>
              <button onClick={closeVoucherModal} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full bg-gray-50 dark:bg-gray-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveVoucher} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kode Voucher <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required 
                  maxLength={20}
                  className="w-full uppercase px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all dark:text-white"
                  placeholder="Contoh: PROMO10"
                  value={voucherForm.code}
                  onChange={e => setVoucherForm({...voucherForm, code: e.target.value.toUpperCase()})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nominal Diskon (Rp) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all dark:text-white"
                    value={voucherForm.discount_amount}
                    onChange={e => setVoucherForm({...voucherForm, discount_amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min. Belanja (Rp) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all dark:text-white"
                    value={voucherForm.min_purchase}
                    onChange={e => setVoucherForm({...voucherForm, min_purchase: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Berlaku Sampai</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all dark:text-white"
                  value={voucherForm.valid_until}
                  onChange={e => setVoucherForm({...voucherForm, valid_until: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="is_active" 
                  checked={voucherForm.is_active}
                  onChange={e => setVoucherForm({...voucherForm, is_active: e.target.checked})}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Voucher Aktif</label>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={createVoucherMutation.isPending || updateVoucherMutation.isPending}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all disabled:opacity-50"
                >
                  {createVoucherMutation.isPending || updateVoucherMutation.isPending ? 'Menyimpan...' : 'Simpan Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BANNER */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Upload Promo / Banner</h3>
              <button onClick={closeBannerModal} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full bg-gray-50 dark:bg-gray-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUploadBanner} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Promo <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all dark:text-white"
                  placeholder="Contoh: Promo Ramadhan"
                  value={bannerData.title}
                  onChange={e => setBannerData({...bannerData, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gambar Banner <span className="text-red-500">*</span></label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors overflow-hidden group">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setBannerFile(file);
                        setBannerPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {bannerPreview ? (
                    <div className="aspect-[21/9] relative">
                      <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Ganti Gambar</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm font-medium">Klik atau drop gambar disini</p>
                      <p className="text-xs mt-1">Format: JPG, PNG (Max. 2MB)</p>
                      <p className="text-[10px] mt-1 text-gray-400">Rekomendasi rasio: 21:9</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={uploadBannerMutation.isPending}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {uploadBannerMutation.isPending ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengunggah...</>
                  ) : (
                    <><Check className="w-5 h-5" /> Kirim Pengajuan Banner</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
