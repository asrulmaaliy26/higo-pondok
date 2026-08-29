import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  ShoppingBag,
  Store,
  FileText,
  Trash2,
  Search,
  Calendar,
  ChevronLeft,
  X,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  Eye,
  RefreshCw,
  TrendingUp,
  CreditCard,
  User,
  Filter,
  RotateCcw,
  ArchiveRestore,
  AlertTriangle,
  ExternalLink,
  Download,
  Printer
} from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getStorageUrl } from '../../lib/axios';
import { getFileType, getFileNameFromPath } from '../../lib/fileUtils';
import ThermalReceiptModal from '../../components/receipt/ThermalReceiptModal';

function getWeeksInMonth(year, month) {
  const weeks = [];
  let currentDate = new Date(year, month, 1);
  let currentWeek = [];

  while (currentDate.getMonth() === month) {
    currentWeek.push(new Date(currentDate));
    if (currentDate.getDay() === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks.map((week, index) => ({
    name: `Minggu ${index + 1} (${week[0].getDate()}-${week[week.length - 1].getDate()})`,
    startDate: week[0],
    endDate: week[week.length - 1]
  }));
}

function getCurrentWeekIndex(year, month) {
  const weeks = getWeeksInMonth(year, month);
  const now = new Date();
  const todayDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const idx = weeks.findIndex(w => {
    const start = new Date(w.startDate.getFullYear(), w.startDate.getMonth(), w.startDate.getDate()).getTime();
    const end = new Date(w.endDate.getFullYear(), w.endDate.getMonth(), w.endDate.getDate()).getTime();
    return todayDateOnly >= start && todayDateOnly <= end;
  });

  return idx >= 0 ? idx : 0;
}

export default function AdminPesanan() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'recap'

  // Global Unified Filter States (Applies to both Orders list and Recap)
  const today = new Date();
  const [filterMode, setFilterMode] = useState('day'); // 'day', 'week', 'month', 'year', 'all'
  const [filterDate, setFilterDate] = useState(
    `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
  );
  const [filterMonth, setFilterMonth] = useState(today.getMonth());
  const [filterYear, setFilterYear] = useState(today.getFullYear());
  const [filterWeekIndex, setFilterWeekIndex] = useState(() => {
    return getCurrentWeekIndex(today.getFullYear(), today.getMonth());
  });

  const [selectedCanteenFilter, setSelectedCanteenFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state (Soft Delete / Move to Trash)
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [restoreOrderId, setRestoreOrderId] = useState(null);
  const [forceDeleteOrderId, setForceDeleteOrderId] = useState(null);

  // Receipt Modal State for Admin
  const [receiptModalConfig, setReceiptModalConfig] = useState({
    isOpen: false,
    mode: 'single', // 'single' | 'batch'
    order: null,
    orders: [],
    title: ''
  });

  const handlePrintSingleReceipt = (orderToPrint) => {
    setReceiptModalConfig({
      isOpen: true,
      mode: 'single',
      order: orderToPrint,
      orders: [],
      title: `Struk Pesanan #ORD-${orderToPrint.id}`
    });
  };

  const handlePrintBatchReceipt = () => {
    if (orders.length === 0) {
      toast.error('Tidak ada pesanan aktif pada filter saat ini.');
      return;
    }
    setReceiptModalConfig({
      isOpen: true,
      mode: 'batch',
      order: null,
      orders: orders,
      title: `Rekap Semua Pesanan (${orders.length} Pesanan)`
    });
  };

  // Recycle Bin Modal States (Permanent Delete & Empty Trash)
  const [orderToForceDelete, setOrderToForceDelete] = useState(null);
  const [showEmptyTrashModal, setShowEmptyTrashModal] = useState(false);

  // Proof viewer modal state
  const [selectedProofs, setSelectedProofs] = useState([]);

  // Fetch all canteens for dropdown filter
  const { data: rawCanteens = [] } = useQuery({
    queryKey: ['admin_all_canteens'],
    queryFn: async () => {
      const res = await api.get('/admin/canteens');
      return res.data.data || res.data || [];
    }
  });

  const canteensList = Array.isArray(rawCanteens)
    ? rawCanteens
    : (Array.isArray(rawCanteens?.data) ? rawCanteens.data : []);

  // Helper to compute start_date and end_date for API queries
  const getFilterParams = () => {
    if (filterMode === 'all') {
      return { start_date: '', end_date: '', period: 'all' };
    }
    const pad = n => n.toString().padStart(2, '0');
    const format = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (filterMode === 'day') {
      return { start_date: filterDate, end_date: filterDate, period: 'day' };
    } else if (filterMode === 'week') {
      const weeks = getWeeksInMonth(filterYear, filterMonth);
      const safeIndex = filterWeekIndex < weeks.length ? filterWeekIndex : 0;
      const week = weeks[safeIndex] || weeks[0];
      return { start_date: format(week.startDate), end_date: format(week.endDate), period: 'week' };
    } else if (filterMode === 'month') {
      const start = new Date(filterYear, filterMonth, 1);
      const end = new Date(filterYear, filterMonth + 1, 0);
      return { start_date: format(start), end_date: format(end), period: 'month' };
    } else if (filterMode === 'year') {
      const start = new Date(filterYear, 0, 1);
      const end = new Date(filterYear, 11, 31);
      return { start_date: format(start), end_date: format(end), period: 'year' };
    }
    return { start_date: '', end_date: '', period: 'all' };
  };

  const currentParams = getFilterParams();

  // Query Orders List
  const {
    data: rawOrders = [],
    isLoading: isLoadingOrders,
    isFetching: isFetchingOrders,
    refetch: refetchOrders
  } = useQuery({
    queryKey: [
      'admin_orders',
      selectedCanteenFilter,
      selectedStatusFilter,
      currentParams.start_date,
      currentParams.end_date,
      searchQuery
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCanteenFilter !== 'all') params.append('canteen_id', selectedCanteenFilter);
      if (selectedStatusFilter !== 'all') params.append('status', selectedStatusFilter);
      if (currentParams.start_date) params.append('start_date', currentParams.start_date);
      if (currentParams.end_date) params.append('end_date', currentParams.end_date);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await api.get(`/admin/orders?${params.toString()}`);
      return res.data.data || res.data || [];
    }
  });

  const orders = Array.isArray(rawOrders)
    ? rawOrders
    : (Array.isArray(rawOrders?.data) ? rawOrders.data : []);

  // Query Recap Data (Uses the exact same date & store filter)
  const {
    data: recapData,
    isLoading: isLoadingRecap,
    isFetching: isFetchingRecap,
    refetch: refetchRecap
  } = useQuery({
    queryKey: [
      'admin_orders_recap',
      selectedCanteenFilter,
      currentParams.period,
      currentParams.start_date,
      currentParams.end_date
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCanteenFilter !== 'all') params.append('canteen_id', selectedCanteenFilter);
      if (currentParams.period) params.append('period', currentParams.period);
      if (currentParams.start_date) params.append('start_date', currentParams.start_date);
      if (currentParams.end_date) params.append('end_date', currentParams.end_date);

      const res = await api.get(`/admin/orders/recap?${params.toString()}`);
      return res.data;
    }
  });

  // Human-readable active date label
  const getFilterLabel = () => {
    if (filterMode === 'all') return 'Semua Waktu';
    if (filterMode === 'day') {
      const d = new Date(filterDate);
      return isNaN(d) ? filterDate : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (filterMode === 'week') {
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const weeks = getWeeksInMonth(filterYear, filterMonth);
      const safeIndex = filterWeekIndex < weeks.length ? filterWeekIndex : 0;
      const weekName = (weeks[safeIndex] || weeks[0])?.name || `Minggu ${safeIndex + 1}`;
      return `${weekName} - ${months[filterMonth]} ${filterYear}`;
    }
    if (filterMode === 'month') {
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      return `${months[filterMonth]} ${filterYear}`;
    }
    if (filterMode === 'year') {
      return `Tahun ${filterYear}`;
    }
    return '';
  };

  // Query Recycle Bin / Trashed Orders
  const {
    data: rawTrash = [],
    isLoading: isLoadingTrash,
    isFetching: isFetchingTrash,
    refetch: refetchTrash
  } = useQuery({
    queryKey: ['admin_orders_trash'],
    queryFn: async () => {
      const res = await api.get('/admin/orders/trash');
      return res.data || [];
    }
  });

  const trashedOrders = Array.isArray(rawTrash) ? rawTrash : (rawTrash?.data || []);

  // Mutation Move to Trash (Soft Delete)
  const deleteOrderMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/admin/orders/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Pesanan dipindahkan ke Kotak Sampah');
      queryClient.invalidateQueries({ queryKey: ['admin_orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin_orders_trash'] });
      queryClient.invalidateQueries({ queryKey: ['admin_orders_recap'] });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
      setOrderToDelete(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal menghapus pesanan');
    }
  });

  // Mutation Restore Order from Trash
  const restoreOrderMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.post(`/admin/orders/${id}/restore`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Pesanan berhasil dipulihkan!');
      queryClient.invalidateQueries({ queryKey: ['admin_orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin_orders_trash'] });
      queryClient.invalidateQueries({ queryKey: ['admin_orders_recap'] });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memulihkan pesanan');
    }
  });

  // Mutation Permanently Delete Order (Force Delete)
  const forceDeleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/admin/orders/${id}/force`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Pesanan berhasil dihapus permanen');
      queryClient.invalidateQueries({ queryKey: ['admin_orders_trash'] });
      setOrderToForceDelete(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal menghapus permanen');
    }
  });

  // Mutation Empty Trash (Empty entire Recycle Bin)
  const emptyTrashMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/admin/orders/trash/empty');
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Kotak sampah berhasil dikosongkan');
      queryClient.invalidateQueries({ queryKey: ['admin_orders_trash'] });
      setShowEmptyTrashModal(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal mengosongkan kotak sampah');
    }
  });

  const handleDeleteConfirm = () => {
    if (!orderToDelete) return;
    deleteOrderMutation.mutate(orderToDelete.id);
  };

  return (
    <div className="space-y-6 pb-28 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Rekapitulasi & Manajemen Pesanan
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pantau seluruh arus pesanan di semua kantin, periksa rekapitulasi omzet per tanggal, dan kelola/hapus pesanan bermasalah.
          </p>
        </div>
      </div>

      {/* UNIFIED GLOBAL FILTER SECTION (DITARUH DI ATAS SEBELUM TAB) */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-green-600" />
            Filter Periode & Toko (Terpadu)
          </h3>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300 border border-green-200 dark:border-green-800">
            📅 Periode Aktif: <strong>{getFilterLabel()}</strong>
          </span>
        </div>

        {/* Mode Filter Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'day', label: 'Harian (Per Tanggal)' },
            { id: 'week', label: 'Mingguan' },
            { id: 'month', label: 'Bulanan' },
            { id: 'year', label: 'Tahunan' },
            { id: 'all', label: 'Semua Waktu' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setFilterMode(m.id);
                if (m.id === 'week') {
                  setFilterWeekIndex(getCurrentWeekIndex(filterYear, filterMonth));
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                filterMode === m.id
                  ? 'bg-green-600 text-white shadow-sm ring-2 ring-green-600/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Dynamic Inputs & Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* 1. Filter Toko / Kantin */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Pilih Toko / Kantin:
            </label>
            <select
              value={selectedCanteenFilter}
              onChange={(e) => setSelectedCanteenFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-gray-50 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="all">🏪 Semua Toko / Kantin</option>
              {canteensList.map((c) => (
                <option key={c.id} value={c.id}>
                  🏪 {c.name} ({c.category === 'kota' ? 'Zona Kota' : 'Zona Kauman'})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Date Input (Per Tanggal / Datepicker) */}
          {filterMode === 'day' && (
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Pilih Tanggal:
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white font-semibold focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Week Mode Inputs */}
          {filterMode === 'week' && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Pilih Bulan:
                </label>
                <select
                  value={filterMonth}
                  onChange={(e) => {
                    const newMonth = parseInt(e.target.value);
                    setFilterMonth(newMonth);
                    setFilterWeekIndex(getCurrentWeekIndex(filterYear, newMonth));
                  }}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white font-semibold focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(
                    (m, i) => (
                      <option key={i} value={i}>
                        {m}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Pilih Rentang Minggu:
                </label>
                <select
                  value={filterWeekIndex < getWeeksInMonth(filterYear, filterMonth).length ? filterWeekIndex : 0}
                  onChange={(e) => setFilterWeekIndex(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white font-semibold focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  {getWeeksInMonth(filterYear, filterMonth).map((w, i) => (
                    <option key={i} value={i}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Month Mode Input */}
          {filterMode === 'month' && (
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Pilih Bulan:
              </label>
              <select
                value={filterMonth}
                onChange={(e) => {
                  const newMonth = parseInt(e.target.value);
                  setFilterMonth(newMonth);
                  setFilterWeekIndex(getCurrentWeekIndex(filterYear, newMonth));
                }}
                className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white font-semibold focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(
                  (m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          {/* Year Mode or Month/Week Year Selector */}
          {(filterMode === 'week' || filterMode === 'month' || filterMode === 'year') && (
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Pilih Tahun:
              </label>
              <select
                value={filterYear}
                onChange={(e) => {
                  const newYear = parseInt(e.target.value);
                  setFilterYear(newYear);
                  setFilterWeekIndex(getCurrentWeekIndex(newYear, filterMonth));
                }}
                className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white font-semibold focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                {[2024, 2025, 2026, 2027, 2028].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Filter Status:
            </label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 border rounded-xl text-xs font-semibold bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="all">📋 Semua Status</option>
              <option value="waiting_confirmation">⏳ Menunggu Validasi Bayar</option>
              <option value="paid">💳 Sudah Bayar (Lunas)</option>
              <option value="unpaid">⚠️ Belum Bayar</option>
              <option value="pending">⏳ Belum Dikonfirmasi (Pending)</option>
              <option value="processing">🚚 Sedang Diproses</option>
              <option value="completed">✅ Selesai</option>
              <option value="cancelled">❌ Dibatalkan</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Pencarian Cepat:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ketik nama Santri / Wali / Toko / Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 border rounded-xl text-xs bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TAB SWITCHER (DITARUH DI BAWAH FILTER) */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-2 flex items-center justify-between gap-4 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-3 text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'orders'
                ? 'border-green-600 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Daftar Semua Pesanan ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('recap')}
            className={`py-2 px-3 text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'recap'
                ? 'border-green-600 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            Tab Rekap & Statistik
          </button>
          <button
            onClick={() => setActiveTab('trash')}
            className={`py-2 px-3 text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'trash'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Tong Sampah ({trashedOrders.length})
          </button>
        </div>

        {activeTab === 'orders' && orders.length > 0 && (
          <button
            onClick={handlePrintBatchReceipt}
            className="py-1.5 px-3 bg-gray-900 hover:bg-black text-white dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-95 shrink-0"
            title="Cetak Rekap Seluruh Pesanan ke Printer Thermal"
          >
            <Printer className="w-3.5 h-3.5 text-green-400" />
            <span>🖨️ Cetak Rekap ({orders.length})</span>
          </button>
        )}
      </div>

      {/* TAB 1: DAFTAR SEMUA PESANAN */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Orders Count & Refresh Bar */}
          <div className="flex items-center justify-between px-1 text-xs text-gray-500">
            <span>
              Menampilkan <strong>{orders.length}</strong> pesanan ({getFilterLabel()})
            </span>
            <button
              onClick={() => refetchOrders()}
              className="flex items-center gap-1 text-green-600 dark:text-green-400 hover:underline font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingOrders ? 'animate-spin' : ''}`} /> Refresh Data
            </button>
          </div>

          {/* Orders List */}
          {isLoadingOrders ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
              <ShoppingBag className="w-16 h-16 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
              <h3 className="font-bold text-gray-700 dark:text-gray-300 text-base">Tidak ada pesanan ditemukan</h3>
              <p className="text-xs text-gray-400 mt-1">
                Tidak ada pesanan yang sesuai dengan filter tanggal <strong>{getFilterLabel()}</strong>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {orders.map((order) => {
                const isPaid = order.payment_status === 'paid';
                const isWaiting = order.payment_status === 'waiting_confirmation';

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-4 sm:p-5 transition-all hover:border-gray-200 dark:hover:border-gray-700 flex flex-col justify-between"
                  >
                    {/* Header: Toko, Status, ID, Tanggal */}
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              🏪 {order.canteen?.name || `Kantin #${order.canteen_id}`}
                            </span>
                            {order.is_custom && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200">
                                ✨ Pesanan Khusus
                              </span>
                            )}
                            <span className="text-xs text-gray-500 font-medium">
                              Order #{order.id} • {new Date(order.created_at).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                          {/* Payment Status Badge */}
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              isPaid
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                : isWaiting
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 ring-1 ring-amber-300 animate-pulse'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                            }`}
                          >
                            {isPaid ? '✅ Lunas' : isWaiting ? '⏳ Menunggu Validasi' : '⚠️ Belum Bayar'}
                          </span>

                          {/* Order Status Badge */}
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              order.status === 'completed'
                                ? 'bg-green-50 text-green-800 dark:bg-green-950/60 dark:text-green-300 border border-green-200'
                                : order.status === 'processing'
                                ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200'
                                : order.status === 'cancelled'
                                ? 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                          >
                            {order.status === 'completed'
                              ? 'Selesai'
                              : order.status === 'processing'
                              ? 'Sedang Diproses'
                              : order.status === 'cancelled'
                              ? 'Dibatalkan'
                              : 'Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Body: Customer info & Items */}
                      <div className="py-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Pemesan & Pengantaran */}
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400 font-medium">Data Pemesan:</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            {order.user?.santri_name || order.user?.name || 'Santri'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Wali: {order.user?.name || '-'} {order.user?.santri_room ? `• Asrama: ${order.user.santri_room}` : ''}
                          </p>
                          {order.delivery_location && (
                            <p className="text-xs text-gray-500">📍 Lokasi: {order.delivery_location}</p>
                          )}
                          {order.courier && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 mt-1">
                              <Truck className="w-3.5 h-3.5" /> Kurir: {order.courier.name}
                            </p>
                          )}
                        </div>

                        {/* Detail Barang */}
                        <div className="md:col-span-2 space-y-1.5">
                          <p className="text-xs text-gray-400 font-medium">Daftar Item / Catatan:</p>
                          {order.custom_notes && (
                            <div className="bg-purple-50 dark:bg-purple-950/30 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900/50 text-xs text-purple-900 dark:text-purple-300">
                              <strong>Catatan Khusus:</strong> {order.custom_notes}
                            </div>
                          )}

                          <div className="space-y-1">
                            {order.items?.map((item) => (
                              <div key={item.id} className="flex justify-between text-xs text-gray-700 dark:text-gray-300">
                                <span>
                                  {item.quantity}x {item.product?.name || 'Produk'}
                                  {item.notes ? ` (${item.notes})` : ''}
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  Rp {parseFloat(item.subtotal).toLocaleString('id-ID')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Proof Buttons (If Available) */}
                      {((order.proof_of_payment && order.proof_of_payment.length > 0) ||
                        (order.proof_of_purchase && order.proof_of_purchase.length > 0) ||
                        (order.proof_of_delivery && order.proof_of_delivery.length > 0)) && (
                        <div className="flex gap-2 py-2 flex-wrap border-t border-gray-100 dark:border-gray-800">
                          {order.proof_of_payment && order.proof_of_payment.length > 0 && (
                            <button
                              onClick={() => {
                                const proofs = Array.isArray(order.proof_of_payment)
                                  ? order.proof_of_payment.map((p) => getStorageUrl(p))
                                  : [getStorageUrl(order.proof_of_payment)];
                                setSelectedProofs(proofs);
                              }}
                              className="px-2.5 py-1.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <ImageIcon className="w-3.5 h-3.5" /> Bukti Bayar
                            </button>
                          )}
                          {order.proof_of_purchase && order.proof_of_purchase.length > 0 && (
                            <button
                              onClick={() => {
                                const proofs = Array.isArray(order.proof_of_purchase)
                                  ? order.proof_of_purchase.map((p) => getStorageUrl(p))
                                  : [getStorageUrl(order.proof_of_purchase)];
                              setSelectedProofs(proofs);
                            }}
                            className="px-2.5 py-1.5 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 hover:bg-purple-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <ImageIcon className="w-3.5 h-3.5" /> Struk Pembelian
                          </button>
                        )}
                        {order.proof_of_delivery && order.proof_of_delivery.length > 0 && (
                          <button
                            onClick={() => {
                              const proofs = Array.isArray(order.proof_of_delivery)
                                ? order.proof_of_delivery.map((p) => getStorageUrl(p))
                                : [getStorageUrl(order.proof_of_delivery)];
                              setSelectedProofs(proofs);
                            }}
                            className="px-2.5 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <ImageIcon className="w-3.5 h-3.5" /> Bukti Antar
                          </button>
                        )}
                      </div>
                    )}
                    </div>

                    {/* Footer: Breakdown Ongkir/Admin + Total Price + Delete Button */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-2">
                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                        <span>Ongkir: Rp {parseFloat(order.delivery_fee || 0).toLocaleString('id-ID')}</span>
                        <span>•</span>
                        <span>Admin: Rp {parseFloat(order.admin_fee || 0).toLocaleString('id-ID')}</span>
                        <span>•</span>
                        <span className="text-sm font-black text-green-700 dark:text-green-400">
                          Total: Rp {parseFloat(order.total_price || 0).toLocaleString('id-ID')}
                        </span>
                      </div>

                      {/* Actions: Cetak Struk & Delete Button */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handlePrintSingleReceipt(order)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                          title="Cetak Struk Thermal iWare"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Cetak Struk</span>
                        </button>

                        <button
                          onClick={() => setOrderToDelete(order)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/50 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs border border-red-200 dark:border-red-800"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          Hapus Pesanan
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REKAPITULASI & STATISTIK */}
      {activeTab === 'recap' && (
        <div className="space-y-6">
          {/* Header Ringkasan Periode Aktif */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Rekapitulasi Penjualan & Keuangan ({getFilterLabel()})
            </h2>
            <button
              onClick={() => refetchRecap()}
              className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:underline font-semibold ml-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingRecap ? 'animate-spin' : ''}`} /> Refresh Rekap
            </button>
          </div>

          {isLoadingRecap ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <span className="text-xs text-gray-500 font-medium block mb-1">Total Produk (Belanjaan)</span>
                  <span className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                    Rp {(recapData?.summary?.total_products || 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <span className="text-xs text-gray-500 font-medium block mb-1">Total Ongkir</span>
                  <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">
                    Rp {(recapData?.summary?.total_delivery_fee || 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <span className="text-xs text-gray-500 font-medium block mb-1">Total Biaya Admin</span>
                  <span className="text-lg sm:text-xl font-black text-purple-600 dark:text-purple-400">
                    Rp {(recapData?.summary?.total_admin_fee || 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-green-50 dark:bg-green-950/40 p-4 rounded-2xl border border-green-200 dark:border-green-800/50 shadow-sm">
                  <span className="text-xs text-green-700 dark:text-green-300 font-medium block mb-1">
                    Grand Total ({recapData?.summary?.total_orders || 0} Order)
                  </span>
                  <span className="text-lg sm:text-xl font-black text-green-700 dark:text-green-300">
                    Rp {(recapData?.summary?.grand_total || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Rekapitulasi Per Toko / Kantin */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-blue-50/50 dark:bg-blue-950/20">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                    <Store className="w-4 h-4 text-blue-600" />
                    Rekapitulasi Per Toko / Kantin
                  </h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {!recapData?.canteen_recap || recapData.canteen_recap.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      Belum ada transaksi pada periode <strong>{getFilterLabel()}</strong>.
                    </div>
                  ) : (
                    recapData.canteen_recap.map((c) => (
                      <div
                        key={c.canteen_id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                            🏪 {c.canteen_name}
                            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold px-2 py-0.5 rounded capitalize">
                              Zona {c.category}
                            </span>
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">{c.order_count} Total Pesanan</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
                          <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                            Produk: Rp {c.total_products.toLocaleString('id-ID')}
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg">
                            Ongkir: Rp {c.total_delivery_fee.toLocaleString('id-ID')}
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-lg">
                            Admin: Rp {c.total_admin_fee.toLocaleString('id-ID')}
                          </span>
                          <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-2.5 py-1 rounded-lg font-bold ml-auto sm:ml-0">
                            Total: Rp {c.grand_total.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Rekapitulasi Per Santri / Wali */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Rekapitulasi Per Wali / Santri</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Format: Total Belanja Produk | Total Ongkir | Total Admin
                  </p>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-96 overflow-y-auto">
                  {!recapData?.user_recap || recapData.user_recap.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      Belum ada transaksi pada periode <strong>{getFilterLabel()}</strong>.
                    </div>
                  ) : (
                    recapData.user_recap.map((u) => (
                      <div
                        key={u.user_id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{u.santri_name}</h4>
                          <p className="text-xs text-gray-500">
                            Wali: {u.wali_name} {u.santri_room ? `• ${u.santri_room}` : ''} ({u.order_count} pesanan)
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
                          <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                            Produk: Rp {u.total_products.toLocaleString('id-ID')}
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg">
                            Ongkir: Rp {u.total_delivery_fee.toLocaleString('id-ID')}
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-lg">
                            Admin: Rp {u.total_admin_fee.toLocaleString('id-ID')}
                          </span>
                          <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-2.5 py-1 rounded-lg font-bold ml-auto sm:ml-0">
                            Total: Rp {u.grand_total.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Rekapitulasi Produk Terjual */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Rekapitulasi Kuantitas Produk Terjual</h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-96 overflow-y-auto">
                  {!recapData?.product_breakdown || recapData.product_breakdown.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      Belum ada produk terjual pada periode <strong>{getFilterLabel()}</strong>.
                    </div>
                  ) : (
                    recapData.product_breakdown.map((p) => (
                      <div key={p.product_id} className="p-3.5 px-4 flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium text-gray-800 dark:text-gray-200">{p.name}</span>
                          {p.canteen_name && (
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-2 font-normal bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                              {p.canteen_name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded text-xs">
                            {p.total_quantity}x terjual
                          </span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            Rp {p.total_subtotal.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 3: KOTAK SAMPAH / RECYCLE BIN */}
      {activeTab === 'trash' && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Header Bar */}
          <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-amber-600" />
                Kotak Sampah / Recycle Bin ({trashedOrders.length} Pesanan)
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300/90 mt-0.5">
                Pesanan yang dihapus sementara tersimpan di sini. Anda dapat memulihkannya kapan saja atau menghapusnya secara permanen.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => refetchTrash()}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingTrash ? 'animate-spin' : ''}`} /> Refresh
              </button>

              {trashedOrders.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowEmptyTrashModal(true)}
                  disabled={emptyTrashMutation.isPending}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Kosongkan Sampah
                </button>
              )}
            </div>
          </div>

          {/* Trashed Orders List */}
          {isLoadingTrash ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          ) : trashedOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Kotak Sampah Kosong</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Tidak ada pesanan yang tersimpan di dalam kotak sampah saat ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {trashedOrders.map((order) => {
                const deletedDate = order.deleted_at 
                  ? new Date(order.deleted_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) 
                  : '-';

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-amber-100 dark:border-amber-950/60 shadow-xs space-y-3 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                            Pesanan #{order.id}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                            Di Kotak Sampah
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5">
                          🏪 {order.canteen?.name || 'Toko / Kantin'}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-sm text-gray-900 dark:text-white">
                          Rp {parseFloat(order.total_price || 0).toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {order.payment_status === 'paid' ? '💳 Lunas' : '⚠️ Belum Lunas'}
                        </div>
                      </div>
                    </div>

                    {/* Customer & Item details */}
                    <div className="bg-gray-50 dark:bg-gray-800/60 p-2.5 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Pemesan / Santri:</span>
                        <strong className="text-gray-800 dark:text-gray-200">
                          {order.user?.santri_name || order.user?.name || 'Santri'}
                        </strong>
                      </div>
                      {order.user?.santri_room && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-500">Asrama / Kamar:</span>
                          <span className="text-gray-700 dark:text-gray-300">{order.user.santri_room}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[11px] pt-1 border-t border-gray-200/60 dark:border-gray-700/60">
                        <span className="text-gray-500">Waktu Dihapus:</span>
                        <span className="text-amber-700 dark:text-amber-300 font-medium">🕒 {deletedDate}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => restoreOrderMutation.mutate(order.id)}
                        disabled={restoreOrderMutation.isPending}
                        className="flex-1 py-2 px-3 bg-green-50 hover:bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Pulihkan (Restore)
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderToForceDelete(order)}
                        className="py-2 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        title="Hapus Permanen"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus Permanen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL KONFIRMASI PINDAHKAN KE SAMPAH (SOFT DELETE) */}
      {orderToDelete && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 my-auto">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pindahkan ke Kotak Sampah?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Pesanan <strong>#{orderToDelete.id}</strong> atas nama{' '}
                <strong className="text-gray-800 dark:text-gray-200">
                  {orderToDelete.user?.santri_name || orderToDelete.user?.name}
                </strong>{' '}
                dari toko{' '}
                <strong className="text-gray-800 dark:text-gray-200">{orderToDelete.canteen?.name}</strong> senilai{' '}
                <strong className="text-green-600">
                  Rp {parseFloat(orderToDelete.total_price || 0).toLocaleString('id-ID')}
                </strong>{' '}
                akan dipindahkan ke <strong>Kotak Sampah (Recycle Bin)</strong>.
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200 dark:border-amber-800">
                💡 Pesanan tidak akan muncul di daftar aktif atau perhitungan rekap, namun dapat Anda <strong>pulihkan (restore)</strong> kapan saja.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                disabled={deleteOrderMutation.isPending}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteOrderMutation.isPending}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                {deleteOrderMutation.isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memindahkan...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> Pindahkan ke Sampah
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL KONFIRMASI HAPUS PERMANEN (FORCE DELETE) */}
      {orderToForceDelete && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 my-auto">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Permanen Pesanan #{orderToForceDelete.id}?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Tindakan ini akan <strong>menghapus permanen</strong> data pesanan dan seluruh berkas bukti transfer/foto dari server. Tindakan ini <strong>tidak dapat dibatalkan</strong>.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOrderToForceDelete(null)}
                disabled={forceDeleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => forceDeleteMutation.mutate(orderToForceDelete.id)}
                disabled={forceDeleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                {forceDeleteMutation.isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> Ya, Hapus Permanen
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL KONFIRMASI KOSONGKAN SELURUH KOTAK SAMPAH */}
      {showEmptyTrashModal && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 my-auto">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Kosongkan Kotak Sampah?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Seluruh <strong>{trashedOrders.length} pesanan</strong> di dalam kotak sampah akan dihapus secara permanen beserta berkas buktinya. Tindakan ini <strong>tidak dapat dibatalkan</strong>.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEmptyTrashModal(false)}
                disabled={emptyTrashMutation.isPending}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => emptyTrashMutation.mutate()}
                disabled={emptyTrashMutation.isPending}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                {emptyTrashMutation.isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mengosongkan...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> Ya, Kosongkan Semua
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL VIEWER GAMBAR / BUKTI */}
      {selectedProofs.length > 0 && createPortal(
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xs flex flex-col animate-in fade-in duration-200">
          <div className="flex justify-between items-center px-4 py-3 bg-black/70 border-b border-white/10 shrink-0">
            <span className="text-white font-bold text-xs flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-green-400" />
              {selectedProofs.length} Foto / Berkas Bukti
            </span>
            <button
              onClick={() => setSelectedProofs([])}
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center gap-4 pb-12">
            {selectedProofs.map((proof, idx) => {
              const fileType = getFileType(proof);
              const fileName = getFileNameFromPath(proof);

              return (
                <div key={idx} className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-2.5 flex flex-col items-center gap-2">
                  <div className="w-full flex items-center justify-between px-2 text-xs text-gray-400">
                    <span className="font-medium">Bukti {idx + 1} dari {selectedProofs.length}</span>
                    <a 
                      href={proof} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-green-400 hover:text-green-300 flex items-center gap-1 text-[11px]"
                    >
                      Buka Resolusi Penuh <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <img
                    src={proof}
                    alt={`Bukti ${idx + 1}`}
                    className="w-full rounded-xl object-contain max-h-[75vh] bg-black/40"
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
                    <FileText className="w-10 h-10 opacity-40 text-green-400" />
                    <span>Pratinjau langsung tidak tersedia untuk format ini</span>
                    <a href={proof} target="_blank" rel="noreferrer" className="text-green-400 text-xs underline break-all px-4 text-center">Buka Berkas ({fileName})</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>,
        document.body
      )}
      {/* MODAL CETAK STRUK THERMAL IWARE UNTUK ADMIN */}
      <ThermalReceiptModal
        isOpen={receiptModalConfig.isOpen}
        onClose={() => setReceiptModalConfig(prev => ({ ...prev, isOpen: false }))}
        mode={receiptModalConfig.mode}
        order={receiptModalConfig.order}
        orders={receiptModalConfig.orders}
        courierName={receiptModalConfig.order?.courier?.name || 'Administrator'}
        title={receiptModalConfig.title}
      />
    </div>
  );
}
