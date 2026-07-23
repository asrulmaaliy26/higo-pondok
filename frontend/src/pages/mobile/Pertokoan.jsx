import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { getStorageUrl } from '../../lib/axios';
import { Store, CheckCircle, XCircle, ChevronLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Pertokoan() {
  const queryClient = useQueryClient();
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalNotes, setWithdrawalNotes] = useState('');

  const { data: canteens, isLoading } = useQuery({
    queryKey: ['admin-canteens'],
    queryFn: async () => {
      const res = await axios.get('/admin/canteens');
      return res.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      await axios.post(`/admin/banners/${id}/approve`);
    },
    onSuccess: () => {
      toast.success('Banner disetujui');
      queryClient.invalidateQueries(['admin-canteens']);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      await axios.post(`/admin/banners/${id}/reject`);
    },
    onSuccess: () => {
      toast.success('Banner ditolak');
      queryClient.invalidateQueries(['admin-canteens']);
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

  const handleOpenDetail = (canteen) => {
    setSelectedCanteen(canteen);
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-col justify-between items-start gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Manajemen Toko</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola daftar kantin, atur biaya ongkir, dan setujui promo/banner.
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
            const pendingBanner = canteen.banners?.find(b => b.status === 'pending');
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
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      {canteen.name}
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
                  {pendingBanner && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-full animate-pulse">
                      Banner Pending
                    </span>
                  )}
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
            
            {/* Approval Section */}
            {selectedCanteen.status === 'pending' && (
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
            )}

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

            {/* Banner Section */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Promo / Banner Kantin</h3>
              
              {(() => {
                // Get the most recent pending or approved banner
                const banner = selectedCanteen.banners?.[0];
                
                if (!banner) {
                  return <p className="text-gray-500 text-sm">Kantin ini belum mengunggah banner promo.</p>;
                }

                return (
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                    <img src={getStorageUrl(banner.image_path)} alt={banner.title} className="w-full h-40 sm:h-48 object-cover" />
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 dark:text-white">{banner.title}</h4>
                      <p className="text-xs mt-1 text-gray-500">Status: <span className="font-semibold uppercase">{banner.status}</span></p>
                      
                      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                        {banner.status !== 'rejected' && (
                          <button 
                            onClick={() => {
                              rejectMutation.mutate(banner.id);
                              setSelectedCanteen(prev => ({
                                ...prev,
                                banners: prev.banners.map(b => b.id === banner.id ? { ...b, status: 'rejected' } : b)
                              }));
                            }}
                            disabled={rejectMutation.isPending || approveMutation.isPending}
                            className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 text-sm font-medium transition-colors"
                          >
                            <XCircle size={16} />
                            <span>Tolak / Batalkan</span>
                          </button>
                        )}
                        {banner.status !== 'approved' && (
                          <button 
                            onClick={() => {
                              approveMutation.mutate(banner.id);
                              // Optimistically update local selectedCanteen state
                              setSelectedCanteen(prev => ({
                                ...prev,
                                banners: prev.banners.map(b => b.id === banner.id ? { ...b, status: 'approved' } : b)
                              }));
                            }}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 text-sm font-medium transition-colors"
                          >
                            <CheckCircle size={16} />
                            <span>Setujui</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
