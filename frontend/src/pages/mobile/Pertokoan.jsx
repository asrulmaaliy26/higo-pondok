import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { getStorageUrl } from '../../lib/axios';
import { 
  Store, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  Save, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Power, 
  Search, 
  X, 
  RefreshCw, 
  SlidersHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Pertokoan() {
  const queryClient = useQueryClient();
  
  // Selected detail canteen modal
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  
  // Quick Hours Edit modal for a single canteen
  const [quickHoursCanteen, setQuickHoursCanteen] = useState(null);
  const [quickOpenTime, setQuickOpenTime] = useState('08:00');
  const [quickCloseTime, setQuickCloseTime] = useState('17:00');

  // Bulk Hours Edit modal
  const [isBulkHoursModalOpen, setIsBulkHoursModalOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('all');
  const [bulkOpenTime, setBulkOpenTime] = useState('08:00');
  const [bulkCloseTime, setBulkCloseTime] = useState('21:00');
  const [bulkReopenForceClosed, setBulkReopenForceClosed] = useState(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // all, open, force_closed, schedule_closed, pending, kauman, kota

  // Detail Modal specific states
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalNotes, setWithdrawalNotes] = useState('');
  const [detailOpenTime, setDetailOpenTime] = useState('');
  const [detailCloseTime, setDetailCloseTime] = useState('');
  const [detailCategory, setDetailCategory] = useState('kauman');

  // 1. Fetch Canteens List
  const { data: canteens, isLoading } = useQuery({
    queryKey: ['admin-canteens'],
    queryFn: async () => {
      const res = await axios.get('/admin/canteens');
      return res.data.data || res.data;
    }
  });

  // 2. Fetch Global Emergency Status
  const { data: globalStatus } = useQuery({
    queryKey: ['admin-canteens-status'],
    queryFn: async () => {
      const res = await axios.get('/admin/canteens/status');
      return res.data;
    }
  });

  const isGlobalForceClosed = Boolean(globalStatus?.is_global_force_closed);

  // --- MUTATIONS ---

  // Bulk Close Mutation (Master Switch Close)
  const bulkCloseMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/admin/canteens/bulk-close');
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Semua toko berhasil ditutup langsung!');
      queryClient.invalidateQueries(['admin-canteens']);
      queryClient.invalidateQueries(['admin-canteens-status']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal menutup semua toko');
    }
  });

  // Bulk Open Mutation (Master Switch Open)
  const bulkOpenMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/admin/canteens/bulk-open', { reset_all: true });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Semua toko berhasil dibuka kembali (mengikuti jadwal operasional)!');
      queryClient.invalidateQueries(['admin-canteens']);
      queryClient.invalidateQueries(['admin-canteens-status']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal membuka semua toko');
    }
  });

  // Bulk Update Operating Hours Mutation
  const bulkUpdateHoursMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post('/admin/canteens/bulk-hours', payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Jam operasional massal berhasil diperbarui!');
      queryClient.invalidateQueries(['admin-canteens']);
      queryClient.invalidateQueries(['admin-canteens-status']);
      setIsBulkHoursModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui jam operasional massal');
    }
  });

  // Toggle Direct Close for a Single Canteen
  const toggleDirectCloseMutation = useMutation({
    mutationFn: async ({ id, force_close }) => {
      const res = await axios.put(`/admin/canteens/${id}/toggle-direct-close`, { force_close });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Status penutupan toko berhasil diperbarui');
      queryClient.invalidateQueries(['admin-canteens']);
      queryClient.invalidateQueries(['admin-canteens-status']);
      if (selectedCanteen && selectedCanteen.id === data.canteen?.id) {
        setSelectedCanteen(data.canteen);
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal mengubah status penutupan toko');
    }
  });

  // Update Single Canteen Operating Hours
  const updateHoursMutation = useMutation({
    mutationFn: async ({ id, open_time, close_time }) => {
      const res = await axios.put(`/admin/canteens/${id}/hours`, { open_time, close_time });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Jam operasional berhasil diperbarui');
      queryClient.invalidateQueries(['admin-canteens']);
      if (selectedCanteen && selectedCanteen.id === data.canteen?.id) {
        setSelectedCanteen(data.canteen);
      }
      setQuickHoursCanteen(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui jam operasional');
    }
  });

  // Approve Canteen
  const approveCanteenMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.post(`/admin/canteens/${id}/approve`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Kantin disetujui');
      queryClient.invalidateQueries(['admin-canteens']);
      setSelectedCanteen(prev => prev ? { ...prev, status: 'approved' } : prev);
    }
  });

  // Reject Canteen
  const rejectCanteenMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.post(`/admin/canteens/${id}/reject`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Kantin dinonaktifkan / ditolak');
      queryClient.invalidateQueries(['admin-canteens']);
      setSelectedCanteen(null);
    }
  });

  // Update Category & Fees
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, category }) => {
      const res = await axios.put(`/admin/canteens/${id}/fees`, { category });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Zona lokasi & tarif berhasil diperbarui');
      queryClient.invalidateQueries(['admin-canteens']);
      setSelectedCanteen(prev => prev ? { ...prev, category: data.canteen?.category || detailCategory } : prev);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui zona toko');
    }
  });

  // Withdrawal
  const withdrawMutation = useMutation({
    mutationFn: async ({ id, amount, notes }) => {
      const res = await axios.post(`/admin/canteens/${id}/withdraw`, { amount, notes });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Pencairan berhasil');
      queryClient.invalidateQueries(['admin-canteens']);
      setSelectedCanteen(prev => prev ? { ...prev, balance: data.canteen?.balance } : prev);
      setWithdrawalAmount('');
      setWithdrawalNotes('');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memproses pencairan');
    }
  });

  // --- HANDLERS ---

  const handleOpenDetail = (canteen) => {
    setSelectedCanteen(canteen);
    setDetailOpenTime(canteen.open_time?.substring(0, 5) || '09:00');
    setDetailCloseTime(canteen.close_time?.substring(0, 5) || '17:00');
    setDetailCategory(canteen.category || 'kauman');
  };

  const handleOpenQuickHours = (e, canteen) => {
    e.stopPropagation();
    setQuickHoursCanteen(canteen);
    setQuickOpenTime(canteen.open_time?.substring(0, 5) || '08:00');
    setQuickCloseTime(canteen.close_time?.substring(0, 5) || '17:00');
  };

  const handleDirectToggleClose = (e, canteen) => {
    e.stopPropagation();
    const willForceClose = !canteen.is_force_closed;
    const confirmMsg = willForceClose 
      ? `Tutup langsung toko "${canteen.name}" sekarang juga? Santri tidak dapat memesan hingga toko dibuka kembali.`
      : `Buka kembali toko "${canteen.name}" agar aktif mengikuti jam operasionalnya?`;

    if (window.confirm(confirmMsg)) {
      toggleDirectCloseMutation.mutate({
        id: canteen.id,
        force_close: willForceClose
      });
    }
  };

  const handleBulkClose = () => {
    if (window.confirm('⚠️ PERINGATAN: Apakah Anda yakin ingin MENUTUP SELURUH TOKO secara langsung? Seluruh toko akan ditutup seketika dan santri tidak dapat memesan.')) {
      bulkCloseMutation.mutate();
    }
  };

  const handleBulkOpen = () => {
    if (window.confirm('Aktifkan dan Buka kembali semua toko agar beroperasi sesuai jadwal jam operasional masing-masing?')) {
      bulkOpenMutation.mutate();
    }
  };

  const handleSaveBulkHours = (e) => {
    e.preventDefault();
    const categoryName = bulkCategory === 'kauman' ? 'Zona Kauman' : bulkCategory === 'kota' ? 'Zona Kota' : 'Semua Toko';
    if (window.confirm(`Terapkan jam operasional ${bulkOpenTime} - ${bulkCloseTime} ke ${categoryName}?`)) {
      bulkUpdateHoursMutation.mutate({
        open_time: bulkOpenTime,
        close_time: bulkCloseTime,
        category: bulkCategory,
        reopen_force_closed: bulkReopenForceClosed
      });
    }
  };

  // --- STATS CALCULATION ---
  const canteensList = Array.isArray(canteens) ? canteens : [];
  const totalCount = canteensList.length;
  const openCount = canteensList.filter(c => c.status === 'approved' && c.is_open).length;
  const forceClosedCount = canteensList.filter(c => c.status === 'approved' && c.is_force_closed).length;
  const scheduleClosedCount = canteensList.filter(c => c.status === 'approved' && !c.is_open && !c.is_force_closed).length;
  const pendingCount = canteensList.filter(c => c.status === 'pending').length;

  // --- FILTERED CANTEENS ---
  const filteredCanteens = canteensList.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterTab === 'open') return c.status === 'approved' && c.is_open;
    if (filterTab === 'force_closed') return c.status === 'approved' && c.is_force_closed;
    if (filterTab === 'schedule_closed') return c.status === 'approved' && !c.is_open && !c.is_force_closed;
    if (filterTab === 'pending') return c.status === 'pending';
    if (filterTab === 'kauman') return c.category === 'kauman';
    if (filterTab === 'kota') return c.category === 'kota';
    return true;
  });

  return (
    <>
      <div className="space-y-5 animate-fade-in-up pb-20">
        
        {/* HEADER TITLE */}
        <div className="flex flex-col gap-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Store className="w-6 h-6 text-green-600 dark:text-green-400" />
            Manajemen Toko & Jam Operasional
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Tutup toko secara langsung / darurat, atur jam buka-tutup semua toko, dan kelola tarif zona.
          </p>
        </div>

        {/* GLOBAL EMERGENCY ALERT BANNER (If All Stores Force Closed) */}
        {isGlobalForceClosed && (
          <div className="bg-red-500/10 border-2 border-red-500/30 dark:border-red-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-red-700 dark:text-red-300">
                  Seluruh Toko Sedang Ditutup Langsung oleh Admin
                </h4>
                <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                  Santri tidak dapat membuat pesanan di semua toko saat ini.
                </p>
              </div>
            </div>
            <button
              onClick={handleBulkOpen}
              disabled={bulkOpenMutation.isPending}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all shrink-0 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${bulkOpenMutation.isPending ? 'animate-spin' : ''}`} />
              <span>Buka Semua Toko</span>
            </button>
          </div>
        )}

        {/* MASTER CONTROL PANEL (Action Buttons) */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-green-100 dark:border-green-900/30 bg-gradient-to-br from-green-50/50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-green-950/20 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-green-600 dark:text-green-400" />
              Aksi Master Jam & Penutupan Toko
            </h3>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">Kontrol Langsung</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Button 1: Tutup Semua Toko */}
            <button
              type="button"
              onClick={handleBulkClose}
              disabled={bulkCloseMutation.isPending || isGlobalForceClosed}
              className={`p-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
                isGlobalForceClosed 
                  ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/50 hover:shadow-sm'
              }`}
            >
              <Power className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>{bulkCloseMutation.isPending ? 'Menutup...' : 'Tutup Semua Toko (Langsung)'}</span>
            </button>

            {/* Button 2: Buka Semua Toko */}
            <button
              type="button"
              onClick={handleBulkOpen}
              disabled={bulkOpenMutation.isPending}
              className="p-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50 hover:shadow-sm transition-all shadow-xs"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{bulkOpenMutation.isPending ? 'Membuka...' : 'Buka Semua (Ikuti Jadwal)'}</span>
            </button>

            {/* Button 3: Atur Jam Semua Toko */}
            <button
              type="button"
              onClick={() => setIsBulkHoursModalOpen(true)}
              className="p-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all"
            >
              <Clock className="w-4 h-4" />
              <span>Atur Jam Semua Toko</span>
            </button>
          </div>
        </div>

        {/* STATUS COUNTER PILLS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div 
            onClick={() => setFilterTab('open')}
            className={`cursor-pointer p-3 rounded-xl border transition-all ${
              filterTab === 'open' 
                ? 'bg-emerald-50 border-emerald-400 dark:bg-emerald-950/60 dark:border-emerald-700' 
                : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Sedang Buka</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{openCount} Toko</p>
          </div>

          <div 
            onClick={() => setFilterTab('force_closed')}
            className={`cursor-pointer p-3 rounded-xl border transition-all ${
              filterTab === 'force_closed' 
                ? 'bg-red-50 border-red-400 dark:bg-red-950/60 dark:border-red-700' 
                : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Tutup Langsung</span>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400 mt-1">{forceClosedCount} Toko</p>
          </div>

          <div 
            onClick={() => setFilterTab('schedule_closed')}
            className={`cursor-pointer p-3 rounded-xl border transition-all ${
              filterTab === 'schedule_closed' 
                ? 'bg-gray-100 border-gray-400 dark:bg-gray-800 dark:border-gray-600' 
                : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Tutup Jadwal</span>
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-300 mt-1">{scheduleClosedCount} Toko</p>
          </div>

          <div 
            onClick={() => setFilterTab('pending')}
            className={`cursor-pointer p-3 rounded-xl border transition-all ${
              filterTab === 'pending' 
                ? 'bg-amber-50 border-amber-400 dark:bg-amber-950/60 dark:border-amber-700' 
                : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Menunggu Review</span>
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{pendingCount} Toko</p>
          </div>
        </div>

        {/* SEARCH & FILTER TABS */}
        <div className="space-y-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama toko atau pemilik..."
              className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xs focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1 text-xs font-semibold">
            {[
              { id: 'all', label: `Semua (${totalCount})` },
              { id: 'open', label: `Buka (${openCount})` },
              { id: 'force_closed', label: `Tutup Langsung (${forceClosedCount})` },
              { id: 'schedule_closed', label: `Tutup Jadwal (${scheduleClosedCount})` },
              { id: 'kauman', label: 'Zona Kauman' },
              { id: 'kota', label: 'Zona Kota' },
              { id: 'pending', label: `Review (${pendingCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  filterTab === tab.id
                    ? 'bg-green-600 text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CANTEENS LIST */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
              ))}
            </div>
          ) : filteredCanteens.length > 0 ? (
            filteredCanteens.map((canteen) => {
              const isKota = canteen.category === 'kota';
              const openFormatted = canteen.open_time?.substring(0, 5) || '08:00';
              const closeFormatted = canteen.close_time?.substring(0, 5) || '17:00';

              return (
                <div 
                  key={canteen.id} 
                  className="glass-card rounded-2xl p-4 flex flex-col gap-3 transition-all hover:shadow-md border border-gray-100 dark:border-gray-800/80"
                >
                  {/* Row 1: Toko Info & Saldo */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 overflow-hidden relative">
                        {canteen.image ? (
                          <img src={getStorageUrl(canteen.image)} alt={canteen.name} className="w-full h-full object-cover" />
                        ) : (
                          <Store size={24} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
                            {canteen.name}
                          </h3>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border shrink-0 ${
                            isKota 
                              ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300' 
                              : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}>
                            {isKota ? 'Zona Kota' : 'Zona Kauman'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          Pemilik: {canteen.user?.name || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xs text-gray-400">Saldo</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        Rp {parseFloat(canteen.balance || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Status Realtime & Operational Hours Badge */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-50 dark:border-gray-800/60 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Status Badge */}
                      {canteen.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-200 dark:border-amber-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Menunggu Review
                        </span>
                      ) : canteen.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs font-bold rounded-full">
                          <XCircle className="w-3 h-3" />
                          Nonaktif
                        </span>
                      ) : canteen.is_force_closed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 text-xs font-bold rounded-full border border-red-200 dark:border-red-800">
                          <Power className="w-3 h-3 text-red-600" />
                          Tutup Langsung (Admin)
                        </span>
                      ) : canteen.is_open ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Buka ({openFormatted} - {closeFormatted})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs font-semibold rounded-full border border-gray-200 dark:border-gray-700">
                          <Clock className="w-3 h-3" />
                          Tutup Jadwal ({openFormatted} - {closeFormatted})
                        </span>
                      )}
                    </div>

                    {/* Quick Direct Actions on the card */}
                    <div className="flex items-center gap-1.5">
                      {/* Direct Toggle Close / Open */}
                      {canteen.status === 'approved' && (
                        <button
                          type="button"
                          onClick={(e) => handleDirectToggleClose(e, canteen)}
                          disabled={toggleDirectCloseMutation.isPending}
                          title={canteen.is_force_closed ? 'Buka toko kembali' : 'Tutup toko sekarang'}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                            canteen.is_force_closed
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{canteen.is_force_closed ? 'Buka Toko' : 'Tutup Langsung'}</span>
                        </button>
                      )}

                      {/* Quick Edit Hours Button */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenQuickHours(e, canteen)}
                        title="Atur jam operasional toko ini"
                        className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <span>Jam</span>
                      </button>

                      {/* Detail Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(canteen)}
                        className="px-3 py-1.5 bg-green-50 hover:bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/50 rounded-lg text-xs font-bold transition-colors"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="glass-card p-8 sm:p-12 flex flex-col items-center justify-center rounded-2xl border-dashed border-2 border-gray-200 dark:border-gray-800 text-center">
              <Store className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">Tidak ada toko ditemukan</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                {searchTerm ? 'Coba ubah kata kunci pencarian Anda.' : 'Belum ada toko pada kategori ini.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL 1: ATUR JAM SEMUA TOKO (BULK HOURS MODAL) --- */}
      {isBulkHoursModalOpen && createPortal(
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="font-bold text-base text-gray-900 dark:text-white">Atur Jam Semua Toko</h3>
              </div>
              <button 
                onClick={() => setIsBulkHoursModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBulkHours} className="space-y-4 text-xs sm:text-sm">
              {/* Target Zona */}
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Terapkan ke:
                </label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-2.5 font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Semua Toko ({totalCount} Toko)</option>
                  <option value="kauman">Hanya Zona Kauman</option>
                  <option value="kota">Hanya Zona Kota</option>
                </select>
              </div>

              {/* Jam Buka & Jam Tutup */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Jam Buka:
                  </label>
                  <input
                    type="time"
                    value={bulkOpenTime}
                    onChange={(e) => setBulkOpenTime(e.target.value)}
                    required
                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-2.5 font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-center"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Jam Tutup:
                  </label>
                  <input
                    type="time"
                    value={bulkCloseTime}
                    onChange={(e) => setBulkCloseTime(e.target.value)}
                    required
                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-2.5 font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-center"
                  />
                </div>
              </div>

              {/* Checkbox Reopen */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bulkReopenForceClosed}
                  onChange={(e) => setBulkReopenForceClosed(e.target.checked)}
                  className="mt-0.5 rounded text-green-600 focus:ring-green-500"
                />
                <span className="text-xs text-green-900 dark:text-green-300 leading-snug">
                  Buka kembali toko yang sedang dalam status <strong>Tutup Langsung</strong> agar langsung aktif mengikuti jam baru ini.
                </span>
              </label>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBulkHoursModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 text-gray-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={bulkUpdateHoursMutation.isPending}
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{bulkUpdateHoursMutation.isPending ? 'Menerapkan...' : 'Terapkan Jam'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL 2: QUICK EDIT JAM 1 TOKO --- */}
      {quickHoursCanteen && createPortal(
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Atur Jam Operasional</h3>
                <p className="text-xs text-gray-500 truncate max-w-[200px]">{quickHoursCanteen.name}</p>
              </div>
              <button 
                onClick={() => setQuickHoursCanteen(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                updateHoursMutation.mutate({
                  id: quickHoursCanteen.id,
                  open_time: quickOpenTime,
                  close_time: quickCloseTime
                });
              }}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Jam Buka:
                  </label>
                  <input
                    type="time"
                    value={quickOpenTime}
                    onChange={(e) => setQuickOpenTime(e.target.value)}
                    required
                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-2.5 font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-center"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Jam Tutup:
                  </label>
                  <input
                    type="time"
                    value={quickCloseTime}
                    onChange={(e) => setQuickCloseTime(e.target.value)}
                    required
                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-2.5 font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-center"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setQuickHoursCanteen(null)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updateHoursMutation.isPending}
                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{updateHoursMutation.isPending ? 'Menyimpan...' : 'Simpan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL 3: DETAIL TOKO LENGKAP --- */}
      {selectedCanteen && createPortal(
        <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-950 flex flex-col animate-in slide-in-from-bottom-full duration-300">
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
            
            {/* Quick Status Bar inside Modal */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-xs text-gray-500">Status Operasional Toko:</span>
                <div className="flex items-center gap-2 mt-1">
                  {selectedCanteen.is_force_closed ? (
                    <span className="px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 text-xs font-bold rounded-full">
                      ● Ditutup Langsung oleh Admin
                    </span>
                  ) : selectedCanteen.is_open ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold rounded-full">
                      ● Sedang Buka
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
                      ● Tutup di Luar Jam
                    </span>
                  )}
                </div>
              </div>

              {selectedCanteen.status === 'approved' && (
                <button
                  type="button"
                  onClick={() => {
                    const willForceClose = !selectedCanteen.is_force_closed;
                    toggleDirectCloseMutation.mutate({
                      id: selectedCanteen.id,
                      force_close: willForceClose
                    });
                  }}
                  disabled={toggleDirectCloseMutation.isPending}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all ${
                    selectedCanteen.is_force_closed
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  <Power size={14} />
                  <span>{selectedCanteen.is_force_closed ? 'Buka Toko Ini' : 'Tutup Toko Ini Langsung'}</span>
                </button>
              )}
            </div>

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
                    value={detailCategory}
                    onChange={(e) => setDetailCategory(e.target.value)}
                    className="w-full rounded-xl border-green-200 dark:border-green-800/50 dark:bg-green-900/30 shadow-xs focus:border-green-500 focus:ring-green-500 text-gray-900 dark:text-white text-xs sm:text-sm font-semibold p-2.5"
                  >
                    <option value="kauman">Zona Kauman (Ongkir Rp 2.000 + Admin Rp 1.000 = Rp 3.000)</option>
                    <option value="kota">Zona Kota (Ongkir Rp 3.500 + Admin Rp 1.500 = Rp 5.000)</option>
                  </select>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-xl border border-green-100 dark:border-green-800 text-xs font-semibold flex items-center justify-between flex-wrap gap-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    Tarif Dasar: 🛵 Ongkir Rp {detailCategory === 'kota' ? '3.500' : '2.000'} | 🛡️ Admin Rp {detailCategory === 'kota' ? '1.500' : '1.000'}
                  </span>
                  <span className="text-green-700 dark:text-green-300 font-bold">
                    Total Rp {detailCategory === 'kota' ? '5.000' : '3.000'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateCategoryMutation.mutate({
                      id: selectedCanteen.id,
                      category: detailCategory
                    });
                  }}
                  disabled={updateCategoryMutation.isPending}
                  className="w-full mt-1 bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
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
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
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
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-lg shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Status Izin Operasional Toko</h3>
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
                      open_time: detailOpenTime,
                      close_time: detailCloseTime
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
                      value={detailOpenTime}
                      onChange={(e) => setDetailOpenTime(e.target.value)}
                      className="w-full rounded-xl border-orange-200 dark:border-orange-800/50 dark:bg-orange-900/30 shadow-xs focus:border-orange-500 focus:ring-orange-500 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-orange-800 dark:text-orange-300 mb-1">Jam Tutup</label>
                    <input
                      type="time"
                      value={detailCloseTime}
                      onChange={(e) => setDetailCloseTime(e.target.value)}
                      className="w-full rounded-xl border-orange-200 dark:border-orange-800/50 dark:bg-orange-900/30 shadow-xs focus:border-orange-500 focus:ring-orange-500 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={updateHoursMutation.isPending}
                  className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  <span>{updateHoursMutation.isPending ? 'Menyimpan...' : 'Simpan Jam Operasional'}</span>
                </button>
              </form>
            </div>

            {/* Tarik Saldo Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50">
              <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-2">Pencairan Dana (Withdrawal)</h3>
              <div className="mb-3">
                <span className="text-xs text-blue-700 dark:text-blue-300">Saldo Toko Saat Ini:</span>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-200">
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
                    className="w-full rounded-xl border-blue-200 dark:border-blue-800/50 dark:bg-blue-900/30 shadow-xs focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white"
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
                    className="w-full rounded-xl border-blue-200 dark:border-blue-800/50 dark:bg-blue-900/30 shadow-xs focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white"
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
        </div>,
        document.body
      )}
    </>
  );
}
