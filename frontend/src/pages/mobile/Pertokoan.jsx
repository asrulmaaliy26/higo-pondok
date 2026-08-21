import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { getStorageUrl } from '../../lib/axios';
import { Store, CheckCircle, XCircle, ChevronLeft, Save, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Pertokoan() {
  const queryClient = useQueryClient();
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalNotes, setWithdrawalNotes] = useState('');
  
  // Jam Operasional states
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');

  // Zona / Category state
  const [canteenCategory, setCanteenCategory] = useState('kauman');

  const { data: canteens, isLoading } = useQuery({
    queryKey: ['admin-canteens'],
    queryFn: async () => {
      const res = await axios.get('/admin/canteens');
      return res.data;
    }
  });

  const approveCanteenMutation = useMutation({
    mutationFn: async (id) => {
      await axios.post(`/admin/canteens/${id}/approve`);
    },
    onSuccess: () => {
      toast.success('Kantin disetujui');
      queryClient.invalidateQueries(['admin-canteens']);
      setSelectedCanteen(prev => prev ? { ...prev, status: 'approved' } : prev);
    }
  });

  const rejectCanteenMutation = useMutation({
    mutationFn: async (id) => {
      await axios.post(`/admin/canteens/${id}/reject`);
    },
    onSuccess: () => {
      toast.success('Kantin ditolak');
      queryClient.invalidateQueries(['admin-canteens']);
      setSelectedCanteen(null);
    }
  });

  const withdrawMutation = useMutation({
    mutationFn: async ({ id, amount, notes }) => {
      const res = await axios.post(`/admin/canteens/${id}/withdraw`, { amount, notes });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Pencairan berhasil');
      queryClient.invalidateQueries(['admin-canteens']);
      setSelectedCanteen(prev => prev ? { ...prev, balance: data.canteen.balance } : prev);
      setWithdrawalAmount('');
      setWithdrawalNotes('');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memproses pencairan');
    }
  });

  const updateHoursMutation = useMutation({
    mutationFn: async ({ id, open_time, close_time }) => {
      const res = await axios.put(`/admin/canteens/${id}/hours`, { open_time, close_time });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Jam operasional berhasil diperbarui');
      queryClient.invalidateQueries(['admin-canteens']);
      setSelectedCanteen(prev => prev ? { ...prev, open_time: data.canteen.open_time, close_time: data.canteen.close_time } : prev);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui jam operasional');
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, category }) => {
      const res = await axios.put(`/admin/canteens/${id}/fees`, { category });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Zona lokasi & tarif berhasil diperbarui');
      queryClient.invalidateQueries(['admin-canteens']);
      setSelectedCanteen(prev => prev ? { ...prev, category: data.canteen.category, delivery_fee: data.canteen.delivery_fee, admin_fee: data.canteen.admin_fee } : prev);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui zona toko');
    }
  });

  const handleOpenDetail = (canteen) => {
    setSelectedCanteen(canteen);
    setOpenTime(canteen.open_time?.substring(0, 5) || '09:00');
    setCloseTime(canteen.close_time?.substring(0, 5) || '17:00');
    setCanteenCategory(canteen.category || 'kauman');
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-col justify-between items-start gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Manajemen Toko</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola daftar kantin, atur zona lokasi (Kauman vs Kota), dan biaya ongkir/admin.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            ))}
          </div>
        ) : Array.isArray(canteens) && canteens.length > 0 ? (
          canteens.map((canteen) => {
            const isKota = canteen.category === 'kota';

            return (
              <div 
                key={canteen.id} 
                onClick={() => handleOpenDetail(canteen)}
                className="glass-card rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                    <Store size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 flex-wrap">
                      {canteen.name}
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${isKota ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300' : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'}`}>
                        {isKota ? 'Zona Kota (3.5k + 1.5k)' : 'Zona Kauman (2k + 1k)'}
                      </span>
                      {canteen.status === 'pending' && (
                        <span className="px-2 py-0.5 bg-yellow-500 text-white text-[10px] rounded animate-pulse">PENDING REVIEW</span>
                      )}
                      {canteen.status === 'approved' && !canteen.is_open && (
                        <span className="px-2 py-0.5 bg-gray-500 text-white text-[10px] rounded">TUTUP</span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{canteen.user?.name}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    Rp {parseFloat(canteen.balance || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-card p-6 sm:p-12 flex flex-col items-center justify-center rounded-2xl border-dashed border-2 border-gray-200 dark:border-gray-800">
            <Store className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Belum ada kantin</h3>
            <p className="text-gray-500 text-center max-w-md mt-2">Daftar kantin masih kosong.</p>
          </div>
        )}
      </div>
    </div>

    {/* MODAL DETAIL KANTIN */}
      {selectedCanteen && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-950 flex flex-col animate-in slide-in-from-bottom-full duration-300">
          <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
            <button 
              onClick={() => setSelectedCanteen(null)}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <h2 className="font-bold text-gray-900 dark:text-white flex-1 truncate">Detail {selectedCanteen.name}</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 space-y-6">
            {/* Data Profil Pemilik Toko */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Profil Pemilik Toko</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="block text-gray-500 dark:text-gray-400 text-xs mb-0.5">Nama Pemilik:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{selectedCanteen.user?.name || '-'}</span>
                </div>
                <div>
                  <span className="block text-gray-500 dark:text-gray-400 text-xs mb-0.5">WhatsApp:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedCanteen.user?.whatsapp_number ? (
                      <a href={`https://wa.me/${selectedCanteen.user.whatsapp_number}`} target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                        {selectedCanteen.user.whatsapp_number}
                      </a>
                    ) : (
                      <span className="text-red-500">Belum diisi</span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500 dark:text-gray-400 text-xs mb-0.5">Nama Santri:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{selectedCanteen.user?.santri_name || <span className="text-red-500 text-xs">Belum diisi</span>}</span>
                </div>
                <div>
                  <span className="block text-gray-500 dark:text-gray-400 text-xs mb-0.5">Kamar/Asrama:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{selectedCanteen.user?.santri_room || <span className="text-red-500 text-xs">Belum diisi</span>}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-gray-500 dark:text-gray-400 text-xs mb-0.5">Kelas/Jenjang:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedCanteen.user?.santri_class ? `${selectedCanteen.user.santri_class} - ${selectedCanteen.user.santri_level}` : <span className="text-red-500 text-xs">Belum diisi</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Zona Lokasi & Tarif Section */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-800/50">
              <h3 className="font-bold text-green-900 dark:text-green-400 mb-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-green-600" />
                Zona Lokasi & Tarif Layanan
              </h3>
              <p className="text-xs text-green-700 dark:text-green-300 mb-3">
                Atur zona toko untuk menentukan tarif ongkir dan biaya admin otomatis.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-green-800 dark:text-green-300 mb-1">
                    Pilih Zona Toko:
                  </label>
                  <select
                    value={canteenCategory}
                    onChange={(e) => setCanteenCategory(e.target.value)}
                    className="w-full rounded-xl border-green-200 dark:border-green-800/50 dark:bg-green-900/30 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900 dark:text-white text-xs sm:text-sm font-semibold p-2.5"
                  >
                    <option value="kauman">Zona Kauman (Ongkir Rp 2.000 + Admin Rp 1.000 = Rp 3.000)</option>
                    <option value="kota">Zona Kota (Ongkir Rp 3.500 + Admin Rp 1.500 = Rp 5.000)</option>
                  </select>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-xl border border-green-100 dark:border-green-800 text-xs font-semibold flex items-center justify-between flex-wrap gap-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    Tarif Dasar: 🛵 Ongkir Rp {canteenCategory === 'kota' ? '3.500' : '2.000'} | 🛡️ Admin Rp {canteenCategory === 'kota' ? '1.500' : '1.000'}
                  </span>
                  <span className="text-green-700 dark:text-green-300 font-bold">
                    Total Rp {canteenCategory === 'kota' ? '5.000' : '3.000'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateCategoryMutation.mutate({
                      id: selectedCanteen.id,
                      category: canteenCategory
                    });
                  }}
                  disabled={updateCategoryMutation.isPending}
                  className="w-full mt-1 bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Save size={18} />
                  <span>{updateCategoryMutation.isPending ? 'Menyimpan...' : 'Simpan Zona & Tarif'}</span>
                </button>
              </div>
            </div>

            {/* Status & Approval Section */}
            {selectedCanteen.status === 'pending' ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-2xl border border-yellow-200 dark:border-yellow-800/50">
                <h3 className="font-bold text-yellow-900 dark:text-yellow-400 mb-2">Review Toko Baru</h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-4">Toko ini masih berstatus "Menunggu Review" dan belum bisa diakses oleh Santri. Setujui agar toko bisa beroperasi.</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (window.confirm(`Setujui kantin ${selectedCanteen.name} untuk beroperasi?`)) {
                        approveCanteenMutation.mutate(selectedCanteen.id);
                      }
                    }}
                    disabled={approveCanteenMutation.isPending || rejectCanteenMutation.isPending}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    <span>Setujui</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Tolak dan hapus pengajuan kantin ${selectedCanteen.name}?`)) {
                        rejectCanteenMutation.mutate(selectedCanteen.id);
                      }
                    }}
                    disabled={approveCanteenMutation.isPending || rejectCanteenMutation.isPending}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-lg shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Status Persetujuan</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedCanteen.status === 'approved' 
                        ? 'Kantin aktif dan memiliki izin untuk membuka toko.' 
                        : 'Kantin dinonaktifkan (Izin dicabut).'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (selectedCanteen.status === 'approved') {
                        if (window.confirm(`Nonaktifkan izin kantin ${selectedCanteen.name}? Kantin tidak akan bisa membuka tokonya.`)) {
                          rejectCanteenMutation.mutate(selectedCanteen.id);
                        }
                      } else {
                        if (window.confirm(`Aktifkan kembali izin kantin ${selectedCanteen.name}?`)) {
                          approveCanteenMutation.mutate(selectedCanteen.id);
                        }
                      }
                    }}
                    disabled={approveCanteenMutation.isPending || rejectCanteenMutation.isPending}
                    className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      selectedCanteen.status === 'approved' ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                    } disabled:opacity-50`}
                    role="switch"
                    aria-checked={selectedCanteen.status === 'approved'}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        selectedCanteen.status === 'approved' ? 'translate-x-6' : 'translate-x-0'
                      }`} 
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Jam Operasional Section */}
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-800/50">
              <h3 className="font-bold text-orange-900 dark:text-orange-400 mb-2">Jam Operasional Toko</h3>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (window.confirm(`Perbarui jam operasional kantin ${selectedCanteen.name}?`)) {
                    updateHoursMutation.mutate({
                      id: selectedCanteen.id,
                      open_time: openTime,
                      close_time: closeTime
                    });
                  }
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-orange-800 dark:text-orange-300 mb-1">Jam Buka</label>
                    <input
                      type="time"
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                      className="w-full rounded-xl border-orange-200 dark:border-orange-800/50 dark:bg-orange-900/30 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-orange-800 dark:text-orange-300 mb-1">Jam Tutup</label>
                    <input
                      type="time"
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      className="w-full rounded-xl border-orange-200 dark:border-orange-800/50 dark:bg-orange-900/30 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={updateHoursMutation.isPending}
                  className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  <span>{updateHoursMutation.isPending ? 'Menyimpan...' : 'Simpan Jam Operasional'}</span>
                </button>
              </form>
            </div>

            {/* Fund Withdrawal (Pencairan Dana) Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50">
              <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-2">Pencairan Dana Kantin</h3>
              <div className="mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">Total Saldo (Bisa Dicairkan):</p>
                <p className="text-2xl font-black text-blue-700 dark:text-blue-500">
                  Rp {parseFloat(selectedCanteen.balance || 0).toLocaleString('id-ID')}
                </p>
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (window.confirm(`Proses pencairan dana sebesar Rp ${parseFloat(withdrawalAmount).toLocaleString('id-ID')}?`)) {
                    withdrawMutation.mutate({
                      id: selectedCanteen.id,
                      amount: parseFloat(withdrawalAmount),
                      notes: withdrawalNotes
                    });
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    min="1000"
                    max={selectedCanteen.balance || 0}
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="w-full rounded-xl border-blue-200 dark:border-blue-800/50 dark:bg-blue-900/30 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white"
                    placeholder="Contoh: 50000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">Catatan (Opsional)</label>
                  <input
                    type="text"
                    value={withdrawalNotes}
                    onChange={(e) => setWithdrawalNotes(e.target.value)}
                    className="w-full rounded-xl border-blue-200 dark:border-blue-800/50 dark:bg-blue-900/30 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white"
                    placeholder="Transfer ke BNI / Kas Harian..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={withdrawMutation.isPending || !withdrawalAmount || withdrawalAmount > (selectedCanteen.balance || 0)}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {withdrawMutation.isPending ? 'Memproses...' : 'Cairkan Dana'}
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
