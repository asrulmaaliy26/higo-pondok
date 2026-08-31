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
  SlidersHorizontal,
  Wallet,
  User,
  Phone,
  Building2,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Pertokoan() {
  const queryClient = useQueryClient();
  
  // Selected detail canteen modal
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  
  // Quick Hours Edit modal for a single canteen
  const [quickHoursCanteen, setQuickHoursCanteen] = useState(null);
  const [quickOpenTime, setQuickOpenTime] = useState('08:00');
  const [quickCloseTime, setQuickCloseTime] = useState('22:00');

  // Bulk Hours Edit modal
  const [isBulkHoursModalOpen, setIsBulkHoursModalOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('all');
  const [bulkOpenTime, setBulkOpenTime] = useState('06:00');
  const [bulkCloseTime, setBulkCloseTime] = useState('23:59');
  const [bulkReopenForceClosed, setBulkReopenForceClosed] = useState(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // all, open, schedule_closed, force_closed, pending, kauman, kota

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

  const invalidateAllCanteenQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-canteens'] });
    queryClient.invalidateQueries({ queryKey: ['admin-canteens-status'] });
    queryClient.invalidateQueries({ queryKey: ['canteens'] });
    queryClient.invalidateQueries({ queryKey: ['public_canteens_list'] });
    queryClient.invalidateQueries({ queryKey: ['my_canteens_list'] });
  };

  // --- MUTATIONS ---

  // Bulk Close Mutation (Master Switch Close)
  const bulkCloseMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/admin/canteens/bulk-close');
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Semua toko berhasil ditutup langsung!');
      invalidateAllCanteenQueries();
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
      invalidateAllCanteenQueries();
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
      invalidateAllCanteenQueries();
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
      invalidateAllCanteenQueries();
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
      invalidateAllCanteenQueries();
      if (selectedCanteen && selectedCanteen.id === data.canteen?.id) {
        setSelectedCanteen(data.canteen);
      }
      setQuickHoursCanteen(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui jam operasional');
    }
  });

  // Approve Canteen Mutation
  const approveCanteenMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.post(`/admin/canteens/${id}/approve`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Kantin berhasil disetujui');
      invalidateAllCanteenQueries();
      if (selectedCanteen && selectedCanteen.id === data.canteen?.id) {
        setSelectedCanteen(data.canteen);
      }
    }
  });

  // Reject Canteen Mutation
  const rejectCanteenMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.post(`/admin/canteens/${id}/reject`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Izin kantin dinonaktifkan');
      invalidateAllCanteenQueries();
      if (selectedCanteen && selectedCanteen.id === data.canteen?.id) {
        setSelectedCanteen(data.canteen);
      }
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
      invalidateAllCanteenQueries();
      if (selectedCanteen && selectedCanteen.id === data.canteen?.id) {
        setSelectedCanteen(data.canteen);
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal mengubah tarif zona');
    }
  });

  // Withdraw Canteen Balance
  const withdrawMutation = useMutation({
    mutationFn: async ({ id, amount, notes }) => {
      const res = await axios.post(`/admin/canteens/${id}/withdraw`, { amount, notes });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Pencairan dana berhasil diproses');
      invalidateAllCanteenQueries();
      setWithdrawalAmount('');
      setWithdrawalNotes('');
      if (selectedCanteen && selectedCanteen.id === data.canteen?.id) {
        setSelectedCanteen(data.canteen);
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memproses pencairan dana');
    }
  });

  // --- HANDLERS ---
  const handleOpenDetail = (canteen) => {
    setSelectedCanteen(canteen);
    setDetailCategory(canteen.category || 'kauman');
    setDetailOpenTime(canteen.open_time?.substring(0, 5) || '08:00');
    setDetailCloseTime(canteen.close_time?.substring(0, 5) || '22:00');
    setWithdrawalAmount('');
    setWithdrawalNotes('');
  };

  const handleOpenQuickHours = (e, canteen) => {
    e.stopPropagation();
    setQuickHoursCanteen(canteen);
    setQuickOpenTime(canteen.open_time?.substring(0, 5) || '08:00');
    setQuickCloseTime(canteen.close_time?.substring(0, 5) || '22:00');
  };

  const handleDirectToggleClose = (e, canteen) => {
    e.stopPropagation();
    const isCurrentlyForceClosed = canteen.is_force_closed;
    const confirmMsg = isCurrentlyForceClosed
      ? `Buka kembali toko "${canteen.name}" agar beroperasi sesuai jam (${canteen.open_time?.substring(0,5) || '08:00'} - ${canteen.close_time?.substring(0,5) || '22:00'})?`
      : `Tutup langsung toko "${canteen.name}" sekarang juga? Santri tidak dapat memesan hingga toko dibuka kembali.`;
    
    if (window.confirm(confirmMsg)) {
      toggleDirectCloseMutation.mutate({
        id: canteen.id,
        force_close: !isCurrentlyForceClosed
      });
    }
  };

  const handleBulkClose = () => {
    if (window.confirm('⚠️ PERINGATAN DARURAT: Apakah Anda yakin ingin MENUTUP SELURUH TOKO secara langsung? Seluruh toko akan ditutup seketika dan santri tidak dapat memesan.')) {
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
      <div className="space-y-5 animate-fade-in-up pb-24 max-w-7xl mx-auto px-1 sm:px-2">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800/60 flex items-center justify-center text-green-600 dark:text-green-400 shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Manajemen Toko & Jam Operasional
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Kelola status buka/tutup, jam operasional massal, serta zona tarif toko secara fleksibel & langsung.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold border border-gray-200 dark:border-gray-700">
              Total {totalCount} Toko
            </span>
          </div>
        </div>

        {/* EMERGENCY ALERT (If All Stores Closed) */}
        {isGlobalForceClosed && (
          <div className="bg-red-500/10 border-2 border-red-500/40 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-red-700 dark:text-red-300">
                  Seluruh Toko Sedang Ditutup Langsung oleh Admin
                </h4>
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mt-0.5">
                  Santri tidak dapat membuat pesanan di semua toko saat ini.
                </p>
              </div>
            </div>
            <button
              onClick={handleBulkOpen}
              disabled={bulkOpenMutation.isPending}
              className="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${bulkOpenMutation.isPending ? 'animate-spin' : ''}`} />
              <span>Buka Kembali Semua Toko</span>
            </button>
          </div>
        )}

        {/* MASTER CONTROL ACTIONS BAR */}
        <div className="bg-gradient-to-br from-green-500/10 via-white to-emerald-500/5 dark:from-gray-900 dark:via-gray-900 dark:to-green-950/30 p-4 sm:p-6 rounded-3xl border border-green-200/80 dark:border-green-800/40 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-green-600 dark:text-green-400" />
              <h2 className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white">
                Aksi Cepat Master Jam & Penutupan
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-green-700 dark:text-green-400 bg-green-100/70 dark:bg-green-950/80 px-2.5 py-0.5 rounded-full border border-green-200 dark:border-green-800">
              Live Realtime
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Action 1: Atur Jam Semua Toko */}
            <button
              type="button"
              onClick={() => setIsBulkHoursModalOpen(true)}
              className="p-3.5 sm:p-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 bg-green-600 hover:bg-green-700 active:scale-98 text-white shadow-sm hover:shadow-md transition-all group"
            >
              <Clock className="w-4 h-4 transition-transform group-hover:rotate-12" />
              <span>Atur Jam Semua Toko</span>
            </button>

            {/* Action 2: Buka Semua (Ikuti Jadwal) */}
            <button
              type="button"
              onClick={handleBulkOpen}
              disabled={bulkOpenMutation.isPending}
              className="p-3.5 sm:p-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-xs hover:shadow-sm transition-all"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{bulkOpenMutation.isPending ? 'Membuka...' : 'Buka Semua (Ikuti Jadwal)'}</span>
            </button>

            {/* Action 3: Tutup Semua Toko Darurat */}
            <button
              type="button"
              onClick={handleBulkClose}
              disabled={bulkCloseMutation.isPending || isGlobalForceClosed}
              className={`p-3.5 sm:p-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs ${
                isGlobalForceClosed 
                  ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 border border-transparent cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 hover:shadow-sm'
              }`}
            >
              <Power className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>{bulkCloseMutation.isPending ? 'Menutup...' : 'Tutup Semua Toko (Langsung)'}</span>
            </button>
          </div>
        </div>

        {/* STATUS COUNTER CARDS (Interactive Filter) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card: Sedang Buka */}
          <div 
            onClick={() => setFilterTab('open')}
            className={`cursor-pointer p-4 sm:p-5 rounded-3xl border transition-all duration-200 relative overflow-hidden ${
              filterTab === 'open' 
                ? 'bg-emerald-500/10 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20' 
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-700 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sedang Buka</span>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20"></div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{openCount}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Dapat menerima order</p>
          </div>

          {/* Card: Tutup Jadwal */}
          <div 
            onClick={() => setFilterTab('schedule_closed')}
            className={`cursor-pointer p-4 sm:p-5 rounded-3xl border transition-all duration-200 relative overflow-hidden ${
              filterTab === 'schedule_closed' 
                ? 'bg-gray-500/10 border-gray-400 dark:border-gray-500 shadow-sm ring-2 ring-gray-400/20' 
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-700 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tutup Jadwal</span>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-700 dark:text-gray-300">{scheduleClosedCount}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Di luar jam buka</p>
          </div>

          {/* Card: Tutup Langsung */}
          <div 
            onClick={() => setFilterTab('force_closed')}
            className={`cursor-pointer p-4 sm:p-5 rounded-3xl border transition-all duration-200 relative overflow-hidden ${
              filterTab === 'force_closed' 
                ? 'bg-red-500/10 border-red-500 shadow-sm ring-2 ring-red-500/20' 
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-700 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tutup Langsung</span>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400">{forceClosedCount}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Dikunci manual admin</p>
          </div>

          {/* Card: Menunggu Review */}
          <div 
            onClick={() => setFilterTab('pending')}
            className={`cursor-pointer p-4 sm:p-5 rounded-3xl border transition-all duration-200 relative overflow-hidden ${
              filterTab === 'pending' 
                ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-2 ring-amber-500/20' 
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-700 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Review Baru</span>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Pengajuan toko baru</p>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari toko, pemilik, atau kamar santri..."
              className="w-full pl-11 pr-10 py-3 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xs focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white transition-all placeholder:text-gray-400"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Pills Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1 text-xs font-bold">
            {[
              { id: 'all', label: `Semua (${totalCount})` },
              { id: 'open', label: `Buka (${openCount})` },
              { id: 'schedule_closed', label: `Tutup Jadwal (${scheduleClosedCount})` },
              { id: 'force_closed', label: `Tutup Langsung (${forceClosedCount})` },
              { id: 'kauman', label: 'Zona Kauman' },
              { id: 'kota', label: 'Zona Kota' },
              { id: 'pending', label: `Review (${pendingCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  filterTab === tab.id
                    ? 'bg-green-600 text-white shadow-xs'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CANTEEN CARDS GRID */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-36 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
              ))}
            </div>
          ) : filteredCanteens.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5">
              {filteredCanteens.map((canteen) => {
                const isKota = canteen.category === 'kota';
                const openFormatted = canteen.open_time?.substring(0, 5) || '08:00';
                const closeFormatted = canteen.close_time?.substring(0, 5) || '22:00';

                return (
                  <div 
                    key={canteen.id} 
                    className="bg-white dark:bg-gray-900 rounded-2xl p-3 sm:p-3.5 border border-green-300/90 dark:border-green-800 shadow-sm hover:border-green-500 dark:hover:border-green-600 hover:shadow-md transition-all flex flex-col justify-between gap-2 relative overflow-hidden group"
                  >
                    {/* Upper Row: Image, Store Name, Zone, Owner, Balance */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-950/50 border border-green-100 dark:border-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 overflow-hidden relative shadow-xs">
                          {canteen.image ? (
                            <img src={getStorageUrl(canteen.image)} alt={canteen.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <Store className="w-5 h-5" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                              {canteen.name}
                            </h3>
                            <span className={`px-2 py-0.2 text-[9px] font-extrabold rounded-full border shrink-0 ${
                              isKota 
                                ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800' 
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            }`}>
                              {isKota ? 'Kota' : 'Kauman'}
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5 flex items-center gap-1">
                            <User className="w-3 h-3 text-gray-400" />
                            <span>{canteen.user?.name || '-'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Saldo Badge */}
                      <div className="flex flex-col items-end shrink-0 bg-gray-50 dark:bg-gray-800/60 px-2 py-1 rounded-xl border border-gray-200 dark:border-gray-700/60">
                        <span className="text-[9px] font-semibold text-gray-400">Saldo</span>
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                          Rp {parseFloat(canteen.balance || 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Operational Status Badge */}
                    <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-gray-200 dark:border-gray-700/60">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        {canteen.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-bold rounded-full border border-amber-200 dark:border-amber-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Review
                          </span>
                        ) : canteen.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-[10px] font-bold rounded-full">
                            <XCircle className="w-3 h-3" />
                            Nonaktif
                          </span>
                        ) : canteen.is_force_closed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 text-[10px] font-bold rounded-full border border-red-200 dark:border-red-800">
                            <Power className="w-3 h-3 text-red-600" />
                            Tutup Paksa
                          </span>
                        ) : canteen.is_open ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Buka ({openFormatted}-{closeFormatted})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-[10px] font-semibold rounded-full border border-gray-200 dark:border-gray-700">
                            <Clock className="w-3 h-3 text-gray-500" />
                            Tutup ({openFormatted}-{closeFormatted})
                          </span>
                        )}
                      </div>

                      {/* Action Buttons Group */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Direct Toggle Close / Open */}
                        {canteen.status === 'approved' && (
                          <button
                            type="button"
                            onClick={(e) => handleDirectToggleClose(e, canteen)}
                            disabled={toggleDirectCloseMutation.isPending}
                            title={canteen.is_force_closed ? 'Buka toko kembali' : 'Tutup toko sekarang'}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all shadow-xs ${
                              canteen.is_force_closed
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800'
                            }`}
                          >
                            <Power className="w-3 h-3" />
                            <span>{canteen.is_force_closed ? 'Buka' : 'Tutup'}</span>
                          </button>
                        )}

                        {/* Quick Edit Hours */}
                        <button
                          type="button"
                          onClick={(e) => handleOpenQuickHours(e, canteen)}
                          title="Atur jam buka/tutup toko ini"
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-gray-200 dark:border-gray-700"
                        >
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          <span>Jam</span>
                        </button>

                        {/* Full Detail */}
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(canteen)}
                          className="px-3.5 py-1.5 bg-green-50 hover:bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/60 rounded-xl text-xs font-bold transition-colors"
                        >
                          Detail
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 p-10 sm:p-14 flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 text-center shadow-xs">
              <Store className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">Tidak ada toko ditemukan</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                {searchTerm ? 'Coba ubah kata kunci pencarian Anda.' : 'Belum ada data toko pada kategori ini.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL 1: ATUR JAM SEMUA TOKO (BULK HOURS MODAL) --- */}
      {isBulkHoursModalOpen && createPortal(
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Atur Jam Semua Toko</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Terapkan jadwal buka/tutup serentak</p>
                </div>
              </div>
              <button 
                onClick={() => setIsBulkHoursModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBulkHours} className="space-y-4 text-xs sm:text-sm">
              {/* Target Zona */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Terapkan ke Kategori Toko:
                </label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full rounded-2xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-3 font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Semua Toko ({totalCount} Toko)</option>
                  <option value="kauman">Hanya Zona Kauman</option>
                  <option value="kota">Hanya Zona Kota</option>
                </select>
              </div>

              {/* Jam Buka & Jam Tutup */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Jam Buka
                  </label>
                  <input
                    type="time"
                    value={bulkOpenTime}
                    onChange={(e) => setBulkOpenTime(e.target.value)}
                    required
                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-2.5 font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-center text-base"
                  />
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Jam Tutup
                  </label>
                  <input
                    type="time"
                    value={bulkCloseTime}
                    onChange={(e) => setBulkCloseTime(e.target.value)}
                    required
                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-2.5 font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-center text-base"
                  />
                </div>
              </div>

              {/* Checkbox Reopen */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200/60 dark:border-green-900/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bulkReopenForceClosed}
                  onChange={(e) => setBulkReopenForceClosed(e.target.checked)}
                  className="mt-0.5 rounded text-green-600 focus:ring-green-500"
                />
                <span className="text-xs text-green-900 dark:text-green-300 font-medium leading-relaxed">
                  Buka kembali toko yang sedang dalam status <strong>Tutup Langsung</strong> agar langsung aktif mengikuti jam baru ini.
                </span>
              </label>

              {/* Submit Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBulkHoursModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 text-gray-700 font-bold rounded-2xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={bulkUpdateHoursMutation.isPending}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 active:scale-98 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  <Save size={18} />
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
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Atur Jam Toko</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{quickHoursCanteen.name}</p>
              </div>
              <button 
                onClick={() => setQuickHoursCanteen(null)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl"
              >
                <X size={20} />
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
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Jam Buka
                  </label>
                  <input
                    type="time"
                    value={quickOpenTime}
                    onChange={(e) => setQuickOpenTime(e.target.value)}
                    required
                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-2 font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-center text-base"
                  />
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Jam Tutup
                  </label>
                  <input
                    type="time"
                    value={quickCloseTime}
                    onChange={(e) => setQuickCloseTime(e.target.value)}
                    required
                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-2 font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-center text-base"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setQuickHoursCanteen(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updateHoursMutation.isPending}
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 active:scale-98 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
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
          <div className="sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex items-center gap-3">
            <button 
              onClick={() => setSelectedCanteen(null)}
              className="p-2 -ml-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft size={22} className="text-gray-600 dark:text-gray-300" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="font-black text-base sm:text-lg text-gray-900 dark:text-white truncate">Detail & Pengaturan Toko</h2>
              <p className="text-xs text-gray-500 truncate">{selectedCanteen.name}</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 space-y-5 max-w-3xl mx-auto w-full">
            
            {/* Quick Status Bar */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3 shadow-xs">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status Operasional</span>
                <div className="flex items-center gap-2 mt-1">
                  {selectedCanteen.is_force_closed ? (
                    <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 text-xs font-bold rounded-full border border-red-200 dark:border-red-800">
                      ● Ditutup Langsung oleh Admin
                    </span>
                  ) : selectedCanteen.is_open ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                      ● Sedang Buka
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs font-semibold rounded-full border border-gray-300 dark:border-gray-700">
                      ● Tutup di Luar Jadwal
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
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all ${
                    selectedCanteen.is_force_closed
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  <Power size={15} />
                  <span>{selectedCanteen.is_force_closed ? 'Buka Toko Ini' : 'Tutup Toko Ini Langsung'}</span>
                </button>
              )}
            </div>

            {/* Profil Pemilik Toko */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xs">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                Profil Pemilik Toko
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl">
                  <span className="block text-gray-400 text-[11px] font-semibold mb-0.5">Nama Pemilik:</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{selectedCanteen.user?.name || '-'}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl">
                  <span className="block text-gray-400 text-[11px] font-semibold mb-0.5">Nomor WhatsApp:</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {selectedCanteen.user?.phone ? (
                      <a href={`https://wa.me/${selectedCanteen.user.phone}`} target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                        {selectedCanteen.user.phone}
                      </a>
                    ) : (
                      <span className="text-red-500">Belum diisi</span>
                    )}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl">
                  <span className="block text-gray-400 text-[11px] font-semibold mb-0.5">Nama Santri:</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{selectedCanteen.user?.santri_name || <span className="text-red-500">Belum diisi</span>}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl">
                  <span className="block text-gray-400 text-[11px] font-semibold mb-0.5">Kamar / Asrama:</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{selectedCanteen.user?.santri_room || <span className="text-red-500">Belum diisi</span>}</span>
                </div>
              </div>
            </div>

            {/* Zona Lokasi & Tarif */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                Zona Lokasi & Tarif Layanan
              </h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                  Pilih Zona Toko:
                </label>
                <select
                  value={detailCategory}
                  onChange={(e) => setDetailCategory(e.target.value)}
                  className="w-full rounded-2xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-xs text-gray-900 dark:text-white text-xs sm:text-sm font-bold p-3 focus:ring-2 focus:ring-green-500"
                >
                  <option value="kauman">Zona Kauman (Ongkir Rp 2.000 + Admin Rp 1.000 = Rp 3.000)</option>
                  <option value="kota">Zona Kota (Ongkir Rp 3.500 + Admin Rp 1.500 = Rp 5.000)</option>
                </select>
              </div>

              <div className="bg-green-50 dark:bg-green-950/30 p-3.5 rounded-2xl border border-green-100 dark:border-green-900/50 text-xs font-semibold flex items-center justify-between flex-wrap gap-2">
                <span className="text-green-800 dark:text-green-300">
                  Tarif: 🛵 Ongkir Rp {detailCategory === 'kota' ? '3.500' : '2.000'} | 🛡️ Admin Rp {detailCategory === 'kota' ? '1.500' : '1.000'}
                </span>
                <span className="text-green-700 dark:text-green-400 font-extrabold text-sm">
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
                className="w-full bg-green-600 hover:bg-green-700 active:scale-98 text-white p-3 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
              >
                <Save size={16} />
                <span>{updateCategoryMutation.isPending ? 'Menyimpan...' : 'Simpan Zona & Tarif'}</span>
              </button>
            </div>

            {/* Jam Operasional */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                Jam Operasional Toko
              </h3>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  updateHoursMutation.mutate({
                    id: selectedCanteen.id,
                    open_time: detailOpenTime,
                    close_time: detailCloseTime
                  });
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Jam Buka</label>
                    <input
                      type="time"
                      value={detailOpenTime}
                      onChange={(e) => setDetailOpenTime(e.target.value)}
                      className="w-full rounded-2xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-xs text-gray-900 dark:text-white font-bold p-2.5 text-center"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Jam Tutup</label>
                    <input
                      type="time"
                      value={detailCloseTime}
                      onChange={(e) => setDetailCloseTime(e.target.value)}
                      className="w-full rounded-2xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-xs text-gray-900 dark:text-white font-bold p-2.5 text-center"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={updateHoursMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 active:scale-98 text-white p-3 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
                >
                  <Save size={16} />
                  <span>{updateHoursMutation.isPending ? 'Menyimpan...' : 'Simpan Jam Operasional'}</span>
                </button>
              </form>
            </div>

            {/* Tarik Saldo Section */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-green-600 dark:text-green-400" />
                Pencairan Saldo Toko (Withdrawal)
              </h3>
              
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Saldo Toko Saat Ini:</span>
                <span className="text-base font-black text-emerald-700 dark:text-emerald-400">
                  Rp {parseFloat(selectedCanteen.balance || 0).toLocaleString('id-ID')}
                </span>
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
                className="space-y-3 text-xs sm:text-sm"
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Nominal Pencairan (Rp)</label>
                  <input
                    type="number"
                    min="1000"
                    max={selectedCanteen.balance || 0}
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="w-full rounded-2xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-3 font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    placeholder="Contoh: 50000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Catatan / Keterangan Transfer</label>
                  <input
                    type="text"
                    value={withdrawalNotes}
                    onChange={(e) => setWithdrawalNotes(e.target.value)}
                    className="w-full rounded-2xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    placeholder="Transfer ke BSI / Tunai kas..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={withdrawMutation.isPending || !withdrawalAmount || withdrawalAmount > (selectedCanteen.balance || 0)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white p-3 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-xs"
                >
                  {withdrawMutation.isPending ? 'Memproses...' : 'Cairkan Saldo'}
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
