import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, ShoppingBag, CheckCircle, Clock, Truck, MessageCircle, X, Image as ImageIcon, ChevronDown, ChevronRight, Store, Upload, Trash2, RotateCcw, FileText, Filter, Search, AlertTriangle, AlertCircle, Download, ExternalLink, Printer, User, UploadCloud, Camera, FileUp, Plus, Calendar, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getStorageUrl } from '../../lib/axios';
import { useCanteenStore } from '../../store/canteenStore';
import { getFileType, isImageFile, isHeifFile, isPdfFile, formatFileSize, getFileNameFromPath, compressImageFiles } from '../../lib/fileUtils';
import ThermalReceiptModal from '../../components/receipt/ThermalReceiptModal';
import santriData from '../../data/santri.json';
import { PRICING_CONFIG } from '../../config/pricing';

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

function formatFullDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
}

const formatRupiah = (num) => {
  return Math.round(Number(num) || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 });
};

function getOrderPriorityScore(order) {
  // 1. Paling Bawah: Dibatalkan / Ditolak
  if (order.status === 'cancelled') {
    return 10;
  }

  // 2. Selesai
  if (order.status === 'completed') {
    return 30;
  }

  // 3. SUDAH DILANJUTKAN (status === 'processing' - Sedang Diproses / Diantar Kurir)
  // Pesanan ini baru turun ke bawah setelah diklik "Lanjutkan Pesanan"
  if (order.status === 'processing') {
    if (order.payment_status === 'waiting_confirmation') return 70; // jika pembeli upload bukti saat processing
    if (order.payment_status === 'unpaid') return 65; // COD / belum bayar tapi sudah jalan
    return 60; // processing & sudah lunas
  }

  // 4. BELUM DILANJUTKAN (status === 'pending' - PALING UTAMA DI ATAS!)
  // Pesanan butuh tindakan toko: Validasi Bayar & Klik "Lanjutkan Pesanan"
  if (order.status === 'pending') {
    // 4a. Pembeli baru upload bukti -> Prioritas Teratas 1 (Skor 100)
    if (order.payment_status === 'waiting_confirmation') {
      return 100;
    }
    // 4b. Kantin baru klik "Konfirmasi Lunas", tapi BELUM klik "Lanjutkan Pesanan" -> TETAP DI ATAS! (Skor 95)
    if (order.payment_status === 'paid') {
      return 95;
    }
    // 4c. Belum Bayar / Belum Set Harga -> Tetap di atas sebelum dilanjutkan (Skor 90)
    return 90;
  }

  return 50;
}

// Optimistic Update Helper for React Query caches
// Optimistic Update Helper for React Query caches
const mutateOrderInCaches = async (queryClient, queryKeyPrefix, targetIds, updateFn, syncCheckout = false) => {
  await queryClient.cancelQueries({ queryKey: [queryKeyPrefix] });
  const previousQueries = queryClient.getQueriesData({ queryKey: [queryKeyPrefix] });

  const ids = Array.isArray(targetIds) ? targetIds : [targetIds];

  // Find if target order has a checkout_id to sync across sibling orders in bundle (ONLY when syncCheckout is true, e.g. for payments)
  let checkoutIds = new Set();
  if (syncCheckout) {
    for (const [, data] of previousQueries) {
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      for (const item of list) {
        if (item && ids.includes(item.id) && item.checkout_id) {
          checkoutIds.add(item.checkout_id);
        }
      }
    }
  }

  queryClient.setQueriesData({ queryKey: [queryKeyPrefix] }, (oldData) => {
    if (!oldData) return oldData;
    const isTarget = (item) => item && (ids.includes(item.id) || (syncCheckout && item.checkout_id && checkoutIds.has(item.checkout_id)));
    if (Array.isArray(oldData)) {
      return oldData.map(item => isTarget(item) ? updateFn(item) : item);
    }
    if (Array.isArray(oldData?.data)) {
      return {
        ...oldData,
        data: oldData.data.map(item => isTarget(item) ? updateFn(item) : item)
      };
    }
    return oldData;
  });

  return { previousQueries, targetIds: ids };
};


const rollbackCaches = (queryClient, context, failedId = null) => {
  if (context?.previousQueries) {
    if (failedId) {
      let previousItem = null;
      for (const [, data] of context.previousQueries) {
        const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        const match = list.find(item => item && item.id === failedId);
        if (match) {
          previousItem = match;
          break;
        }
      }
      if (previousItem) {
        mutateOrderInCaches(queryClient, 'canteen_orders', failedId, () => previousItem, false);
        return;
      }
    }
    context.previousQueries.forEach(([queryKey, previousData]) => {
      queryClient.setQueryData(queryKey, previousData);
    });
  }
};

export default function PesananToko() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { activeCanteenId, setActiveCanteenId, isStoreSelected, setIsStoreSelected } = useCanteenStore();
  const [selectedCouriers, setSelectedCouriers] = useState({});

  // Fetch all canteens owned by this user
  const { data: rawCanteensList } = useQuery({
    queryKey: ['my_canteens_list'],
    queryFn: async () => {
      const res = await api.get('/my-canteens');
      return res.data.data || res.data || [];
    }
  });

  const canteensList = Array.isArray(rawCanteensList)
    ? rawCanteensList
    : (Array.isArray(rawCanteensList?.data) ? rawCanteensList.data : []);


  const [showCourierModal, setShowCourierModal] = useState(false);
  const [activeOrderForCourier, setActiveOrderForCourier] = useState(null);

  const [showProofModal, setShowProofModal] = useState(false);
  const [activeOrderForProof, setActiveOrderForProof] = useState(null);
  const [proofFiles, setProofFiles] = useState([]);
  const [isCompressingProof, setIsCompressingProof] = useState(false);
  
  const [selectedProofs, setSelectedProofs] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Receipt Modal State for Canteen
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
      title: `Rekap Pesanan Toko (${orders.length} Pesanan)`
    });
  };

  // Manual Order by Canteen State
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualUserId, setManualUserId] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [manualPrice, setManualPrice] = useState('');

  // Set Custom Order Price State
  const [showSetPriceModal, setShowSetPriceModal] = useState(false);
  const [activeOrderForSetPrice, setActiveOrderForSetPrice] = useState(null);
  const [newPriceInput, setNewPriceInput] = useState('');
  
  // Recap Modal State
  const [showRecapModal, setShowRecapModal] = useState(false);

  // Unpaid Proceed Confirmation Modal State
  const [unpaidProceedOrder, setUnpaidProceedOrder] = useState(null);

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
    mutationFn: ({ id, price, canteen_id }) => api.put(`/canteen/orders/${id}/custom-price?canteen_id=${canteen_id || ''}`, { total_price: price }),
    onMutate: async (variables) => {
      const deliveryFee = parseFloat(activeOrderForSetPrice?.delivery_fee || 0);
      const adminFee = parseFloat(activeOrderForSetPrice?.admin_fee || 0);
      const total = parseFloat(variables.price || 0) + deliveryFee + adminFee;
      return await mutateOrderInCaches(queryClient, 'canteen_orders', variables.id, (order) => ({
        ...order,
        total_price: total
      }));
    },
    onError: (err, variables, context) => {
      rollbackCaches(queryClient, context);
      toast.error(err.response?.data?.message || 'Gagal memperbarui harga');
    },
    onSuccess: () => {
      toast.success('Harga pesanan khusus berhasil diperbarui!');
      setShowSetPriceModal(false);
      setActiveOrderForSetPrice(null);
      setNewPriceInput('');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      queryClient.invalidateQueries({ queryKey: ['canteen_recap'] });
    }
  });

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

  const selectedCanteenFilter = 'all';
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getFilterParams = () => {
    if (filterMode === 'all') {
      return { start_date: '', end_date: '', period: 'all' };
    }
    const pad = n => n.toString().padStart(2, '0');
    const format = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  
    if (filterMode === 'day') {
      return { start_date: filterDate, end_date: filterDate, period: 'day' };
    } 
    else if (filterMode === 'week') {
      const weeks = getWeeksInMonth(filterYear, filterMonth);
      const safeIndex = filterWeekIndex < weeks.length ? filterWeekIndex : 0;
      const week = weeks[safeIndex] || weeks[0];
      return { start_date: format(week.startDate), end_date: format(week.endDate), period: 'week' };
    }
    else if (filterMode === 'month') {
      const start = new Date(filterYear, filterMonth, 1);
      const end = new Date(filterYear, filterMonth + 1, 0); // last day
      return { start_date: format(start), end_date: format(end), period: 'month' };
    }
    else if (filterMode === 'year') {
      const start = new Date(filterYear, 0, 1);
      const end = new Date(filterYear, 11, 31);
      return { start_date: format(start), end_date: format(end), period: 'year' };
    }
    return { start_date: '', end_date: '', period: 'all' };
  };

  const getFilterLabel = () => {
    if (filterMode === 'all') return 'Semua Waktu';
    if (filterMode === 'day') {
      return formatFullDate(filterDate);
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

  const currentParams = getFilterParams();

  const { data: ordersRes, isLoading } = useQuery({
    queryKey: ['canteen_orders', selectedCanteenFilter, currentParams.start_date, currentParams.end_date, currentParams.period],
    queryFn: async () => {
      const canteenParam = selectedCanteenFilter !== 'all' ? `canteen_id=${selectedCanteenFilter}&` : '';
      const dateParams = currentParams.start_date ? `start_date=${currentParams.start_date}&end_date=${currentParams.end_date}&` : '';
      const periodParam = currentParams.period ? `period=${currentParams.period}` : '';
      const res = await api.get(`/canteen/orders?${canteenParam}${dateParams}${periodParam}`);
      return res.data;
    },
    refetchInterval: 5000,
  });

  const { data: couriersRes } = useQuery({
    queryKey: ['couriers', selectedCanteenFilter],
    queryFn: async () => {
      const canteenParam = selectedCanteenFilter !== 'all' ? `?canteen_id=${selectedCanteenFilter}` : '';
      const res = await api.get(`/couriers${canteenParam}`);
      return res.data;
    }
  });

  const [activeTab, setActiveTab] = useState('orders');

  const { data: recapData, isLoading: isLoadingRecap } = useQuery({
    queryKey: ['canteen_recap', selectedCanteenFilter, currentParams.period, currentParams.start_date, currentParams.end_date],
    queryFn: async () => {
      const canteenParam = selectedCanteenFilter !== 'all' ? `canteen_id=${selectedCanteenFilter}&` : '';
      const dateParams = currentParams.start_date ? `start_date=${currentParams.start_date}&end_date=${currentParams.end_date}&` : '';
      const periodParam = currentParams.period ? `period=${currentParams.period}` : '';
      const res = await api.get(`/canteen/orders/recap?${canteenParam}${dateParams}${periodParam}`);
      return res.data;
    },
    enabled: activeTab === 'recap',
  });

  const rawOrders = ordersRes || [];
  const orders = React.useMemo(() => {
    const list = rawOrders.filter(order => {
      // 1. Status Filter
      if (selectedStatusFilter !== 'all') {
        if (selectedStatusFilter === 'waiting_confirmation') {
          if (order.payment_status !== 'waiting_confirmation') return false;
        } else if (selectedStatusFilter === 'paid') {
          if (order.payment_status !== 'paid') return false;
        } else if (selectedStatusFilter === 'unpaid') {
          if (order.payment_status !== 'unpaid') return false;
        } else {
          if (order.status !== selectedStatusFilter) return false;
        }
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const idMatch = order.id?.toString().includes(q);
        const userMatch = order.user?.name?.toLowerCase().includes(q);
        const santriMatch = order.user?.santri_name?.toLowerCase().includes(q);
        const canteenMatch = order.canteen?.name?.toLowerCase().includes(q);
        const notesMatch = order.custom_notes?.toLowerCase().includes(q);
        const itemsMatch = order.items?.some(i => i.product?.name?.toLowerCase().includes(q));

        if (!idMatch && !userMatch && !santriMatch && !canteenMatch && !notesMatch && !itemsMatch) {
          return false;
        }
      }

      return true;
    });

    // Smart Priority Sorting:
    // 1. Menunggu Validasi Bayar (Score 100) -> Paling Atas
    // 2. Belum Lunas (Score 80) -> Di atas pesanan lunas
    // 3. Sudah Lunas & Aktif (Score 60)
    // 4. Selesai (Score 30)
    // 5. Dibatalkan (Score 10) -> Paling Bawah
    return [...list].sort((a, b) => {
      const scoreA = getOrderPriorityScore(a);
      const scoreB = getOrderPriorityScore(b);

      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Skor tertinggi lebih dulu
      }

      // Jika skor prioritas sama, urutkan berdasarkan order terbaru
      return (b.id || 0) - (a.id || 0);
    });
  }, [rawOrders, selectedStatusFilter, searchQuery]);

  const updatePaymentMutation = useMutation({
    mutationFn: ({ id, status, canteen_id }) => api.put(`/canteen/orders/${id}/payment?canteen_id=${canteen_id}`, { payment_status: status }),
    onMutate: async (variables) => {
      return await mutateOrderInCaches(queryClient, 'canteen_orders', variables.id, (order) => ({
        ...order,
        payment_status: variables.status
      }), true);
    },
    onError: (err, variables, context) => {
      rollbackCaches(queryClient, context);
      toast.error('Gagal memperbarui status pembayaran');
    },
    onSuccess: () => {
      toast.success('Status pembayaran berhasil diperbarui!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      if (activeTab === 'recap') {
        queryClient.invalidateQueries({ queryKey: ['canteen_recap'] });
      }
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, canteen_id }) => api.put(`/canteen/orders/${id}/status?canteen_id=${canteen_id}`, { status }),
    onMutate: async (variables) => {
      return await mutateOrderInCaches(queryClient, 'canteen_orders', variables.id, (order) => ({
        ...order,
        status: variables.status
      }), false);
    },
    onError: (err, variables, context) => {
      rollbackCaches(queryClient, context, variables.id);
      toast.error(err.response?.data?.message || 'Gagal memperbarui status');
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
    },
    onSuccess: (res, variables) => {
      toast.success(res.data?.message || 'Status pesanan berhasil diperbarui!');
      if (res.data?.order) {
        mutateOrderInCaches(queryClient, 'canteen_orders', variables.id, () => res.data.order, false);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      if (activeTab === 'recap') {
        queryClient.invalidateQueries({ queryKey: ['canteen_recap'] });
      }
    }
  });

  const batchUpdateStatusMutation = useMutation({
    mutationFn: ({ order_ids, status, canteen_id }) => 
      api.put(`/canteen/orders/batch-status${canteen_id ? `?canteen_id=${canteen_id}` : ''}`, { order_ids, status }),
    onMutate: async (variables) => {
      return await mutateOrderInCaches(queryClient, 'canteen_orders', variables.order_ids, (order) => ({
        ...order,
        status: variables.status
      }), false);
    },
    onError: (err, variables, context) => {
      rollbackCaches(queryClient, context);
      toast.error(err.response?.data?.message || 'Gagal memperbarui status paket pesanan');
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
    },
    onSuccess: (res) => {
      const data = res.data;
      if (data.skipped_count > 0 && data.success_count > 0) {
        toast.success(`${data.success_count} pesanan berhasil diproses!`);
        toast.error(data.message, { duration: 5000 });
      } else if (data.skipped_count > 0 && data.success_count === 0) {
        toast.error(data.message, { duration: 5000 });
      } else {
        toast.success(data.message || 'Status pesanan berhasil diperbarui!');
      }

      if (data.updated_orders && data.updated_orders.length > 0) {
        const updateMap = new Map(data.updated_orders.map(o => [o.id, o]));
        queryClient.setQueriesData({ queryKey: ['canteen_orders'] }, (oldData) => {
          if (!oldData) return oldData;
          const updateItem = (item) => updateMap.has(item?.id) ? { ...item, ...updateMap.get(item.id) } : item;
          if (Array.isArray(oldData)) return oldData.map(updateItem);
          if (Array.isArray(oldData?.data)) return { ...oldData, data: oldData.data.map(updateItem) };
          return oldData;
        });
      }

      if (data.skipped_orders && data.skipped_orders.length > 0) {
        const skippedIds = data.skipped_orders.map(s => s.id);
        mutateOrderInCaches(queryClient, 'canteen_orders', skippedIds, (order) => ({
          ...order,
          status: 'pending'
        }), false);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      if (activeTab === 'recap') {
        queryClient.invalidateQueries({ queryKey: ['canteen_recap'] });
      }
    }
  });

  const completeOrderMutation = useMutation({
    mutationFn: ({ id, formData, canteen_id }) => api.post(`/canteen/orders/${id}/complete?canteen_id=${canteen_id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onMutate: async (variables) => {
      return await mutateOrderInCaches(queryClient, 'canteen_orders', variables.id, (order) => ({
        ...order,
        status: 'completed',
        payment_status: 'paid'
      }));
    },
    onError: (err, variables, context) => {
      rollbackCaches(queryClient, context);
      toast.error(err.response?.data?.message || 'Gagal menyelesaikan pesanan');
    },
    onSuccess: () => {
      toast.success('Pesanan berhasil diselesaikan dan Lunas!');
      setShowProofModal(false);
      setProofFiles([]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      queryClient.invalidateQueries({ queryKey: ['canteen_recap'] });
    }
  });

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [activeOrderForReceipt, setActiveOrderForReceipt] = useState(null);
  const [receiptFiles, setReceiptFiles] = useState([]);
  const [isCompressingReceipt, setIsCompressingReceipt] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({}); // Track which completed orders are expanded

  const uploadReceiptMutation = useMutation({
    mutationFn: ({ id, formData, canteen_id }) => api.post(`/canteen/orders/${id}/upload-receipt?canteen_id=${canteen_id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      toast.success('Bukti pesanan / struk berhasil diunggah!');
      setShowReceiptModal(false);
      setReceiptFiles([]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal mengunggah bukti pesanan');
    }
  });

  // Payment Proof Upload States & Mutations for Canteen
  const [orderToUploadPaymentProof, setOrderToUploadPaymentProof] = useState(null);
  const [canteenPaymentProofFiles, setCanteenPaymentProofFiles] = useState([]);
  const [isCompressingPaymentProof, setIsCompressingPaymentProof] = useState(false);
  const [canteenPaymentStatus, setCanteenPaymentStatus] = useState('paid');
  const canteenPaymentFileInputRef = React.useRef(null);
  const canteenPaymentCameraInputRef = React.useRef(null);

  const handleOpenUploadPaymentModal = (order) => {
    setOrderToUploadPaymentProof(order);
    setCanteenPaymentProofFiles([]);
    setCanteenPaymentStatus('paid');
  };

  const handleCanteenProofFilesSelected = async (filesList) => {
    if (!filesList || filesList.length === 0) return;
    const incomingFiles = Array.from(filesList);

    const remainingSlots = 5 - canteenPaymentProofFiles.length;
    if (remainingSlots <= 0) {
      toast.error('Maksimal 5 berkas bukti pembayaran.');
      return;
    }

    const filesToProcess = incomingFiles.slice(0, remainingSlots);
    setIsCompressingPaymentProof(true);

    try {
      const compressed = await compressImageFiles(filesToProcess, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.8
      });
      setCanteenPaymentProofFiles((prev) => [...prev, ...compressed]);
    } catch (err) {
      console.error('Gagal mengompresi gambar bukti:', err);
      setCanteenPaymentProofFiles((prev) => [...prev, ...filesToProcess]);
    } finally {
      setIsCompressingPaymentProof(false);
      if (canteenPaymentFileInputRef.current) canteenPaymentFileInputRef.current.value = '';
      if (canteenPaymentCameraInputRef.current) canteenPaymentCameraInputRef.current.value = '';
    }
  };

  const uploadCanteenPaymentProofMutation = useMutation({
    mutationFn: ({ id, formData, canteen_id }) =>
      api.post(`/canteen/orders/${id}/payment-proof?canteen_id=${canteen_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 45000,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      queryClient.invalidateQueries({ queryKey: ['canteen_recap'] });
      toast.success('Bukti pembayaran santri berhasil diunggah!');
      setOrderToUploadPaymentProof(null);
      setCanteenPaymentProofFiles([]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal mengunggah bukti pembayaran');
    }
  });

  const deleteCanteenProofMutation = useMutation({
    mutationFn: async ({ id, type, path }) => {
      const res = await api.delete(`/canteen/orders/${id}/proof`, {
        data: { type, path }
      });
      return { ...res.data, deletedPath: path };
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Berkas bukti berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      queryClient.invalidateQueries({ queryKey: ['canteen_recap'] });
      if (data.order && orderToUploadPaymentProof && orderToUploadPaymentProof.id === data.order.id) {
        setOrderToUploadPaymentProof(data.order);
      }
      setSelectedProofs((prev) => prev.filter((p) => !p.includes(data.deletedPath || '')));
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal menghapus berkas bukti');
    }
  });

  const assignCourierMutation = useMutation({
    mutationFn: async ({ id, courier_id, canteen_id }) => {
      const res = await api.put(`/canteen/orders/${id}/courier?canteen_id=${canteen_id}`, { courier_id });
      return res.data;
    },
    onMutate: async (variables) => {
      const selectedCourier = couriers.find(c => c.id === variables.courier_id);
      return await mutateOrderInCaches(queryClient, 'canteen_orders', variables.id, (order) => ({
        ...order,
        courier_id: variables.courier_id === 'self' ? null : variables.courier_id,
        courier: selectedCourier || order.courier,
        status: 'processing'
      }));
    },
    onError: (err, variables, context) => {
      rollbackCaches(queryClient, context);
      toast.error('Gagal menugaskan kurir');
    },
    onSuccess: (data, variables) => {
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      queryClient.invalidateQueries({ queryKey: ['canteen_recap'] });
    }
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async ({ id, canteen_id }) => {
      const res = await api.put(`/canteen/orders/${id}/cancel?canteen_id=${canteen_id}`);
      return res.data;
    },
    onMutate: async (variables) => {
      return await mutateOrderInCaches(queryClient, 'canteen_orders', variables.id, (order) => ({
        ...order,
        status: 'cancelled'
      }));
    },
    onError: (err, variables, context) => {
      rollbackCaches(queryClient, context);
      toast.error('Gagal membatalkan pesanan');
    },
    onSuccess: () => {
      toast.success('Pesanan berhasil dibatalkan');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen_orders'] });
      queryClient.invalidateQueries({ queryKey: ['canteen_recap'] });
    }
  });

  const handleContact = (phone, name) => {
    if (!phone) {
      toast.error(`Nomor telepon ${name} tidak tersedia`);
      return;
    }
    let formatted = phone.toString().replace(/\D/g, '');
    if (formatted.startsWith('08')) formatted = '628' + formatted.substring(2);
    else if (formatted.startsWith('8')) formatted = '628' + formatted.substring(1);
    else if (formatted.startsWith('0')) formatted = '62' + formatted.substring(1);
    window.open(`https://wa.me/${formatted}`, '_blank');
  };

  const couriers = couriersRes || [];

  const productRecap = React.useMemo(() => {
    const recap = {};
    const customMap = {};
    let customOrderTotal = 0;
    let customOrderHpp = 0;
    let customOrderCount = 0;
    let grandTotalProducts = 0;
    let grandTotalHpp = 0;
    
    // Hanya hitung pesanan yang sudah dilanjutkan (processing / completed)
    const validOrders = (rawOrders || []).filter(o => o.status === 'processing' || o.status === 'completed');
    
    validOrders.forEach(order => {
      const isCustom = Boolean(order.is_custom) || (Boolean(order.custom_notes) && (!order.items || order.items.length === 0));
      if (isCustom) {
        const delFee = parseFloat(order.delivery_fee || 0);
        const admFee = parseFloat(order.admin_fee || 0);
        const customProductPrice = Math.max(0, parseFloat(order.total_price || 0) - delFee - admFee);
        const customHpp = customProductPrice > 1000 ? (customProductPrice - 1000) : customProductPrice;

        customOrderCount++;
        customOrderTotal += customProductPrice;
        customOrderHpp += customHpp;
        grandTotalProducts += customProductPrice;
        grandTotalHpp += customHpp;

        const customName = order.custom_notes?.trim() ? `Titip Beli: ${order.custom_notes.trim()}` : 'Pesanan Khusus / Titip Beli';
        if (!customMap[customName]) {
          customMap[customName] = { 
            name: customName, 
            quantity: 0, 
            total: 0, 
            hpp: customHpp, 
            total_hpp: 0, 
            profit: 0 
          };
        }
        customMap[customName].quantity += 1;
        customMap[customName].total += customProductPrice;
        customMap[customName].total_hpp += customHpp;
        customMap[customName].profit += (customProductPrice - customHpp);
      } else if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          const name = item.product?.name || item.product_name || 'Produk Tidak Diketahui';
          const qty = parseInt(item.quantity || 0, 10);
          const price = parseFloat(item.price || 0);
          const defaultItemHpp = price > 1000 ? (price - 1000) : price;
          const rawItemHpp = item.product?.hpp;
          const hpp = parseFloat(
            rawItemHpp !== undefined && rawItemHpp !== null && parseFloat(rawItemHpp) > 0 
              ? rawItemHpp 
              : defaultItemHpp
          );
          const subtotal = parseFloat(item.subtotal || (price * qty));
          const totalHpp = hpp * qty;
          const profit = subtotal - totalHpp;

          if (!recap[name]) {
            recap[name] = { 
              name, 
              quantity: 0, 
              total: 0, 
              hpj: price, 
              hpp, 
              total_hpp: 0, 
              profit: 0 
            };
          }
          recap[name].quantity += qty;
          recap[name].total += subtotal;
          recap[name].total_hpp += totalHpp;
          recap[name].profit += profit;

          grandTotalProducts += subtotal;
          grandTotalHpp += totalHpp;
        });
      }
    });

    // Convert to sorted arrays
    const recapArray = Object.values(recap).sort((a, b) => b.quantity - a.quantity);
    const customArray = Object.values(customMap).sort((a, b) => b.quantity - a.quantity);

    return {
      items: recapArray,
      customItems: customArray,
      customCount: customOrderCount,
      customTotal: customOrderTotal,
      customHpp: customOrderHpp,
      customProfit: customOrderTotal - customOrderHpp,
      totalProducts: grandTotalProducts,
      totalHpp: grandTotalHpp,
      totalProfit: grandTotalProducts - grandTotalHpp
    };
  }, [rawOrders]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;
  }

  // Jika Kantin Baru Belum Memiliki Toko
  if (canteensList && canteensList.length === 0) {
    return (
      <div className="bg-gray-50 h-full min-h-screen p-6 flex items-center justify-center dark:bg-gray-950 font-sans">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-xl text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Store className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Anda Belum Memiliki Toko</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              Sebagai Akun Kantin, Anda perlu mendaftarkan nama & profil toko terlebih dahulu sebelum dapat mengelola pesanan.
            </p>
          </div>
          <button
            onClick={() => navigate({ to: '/dashboard/profile' })}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            <Store className="w-5 h-5" />
            Buka Profil & Buat Toko
          </button>
        </div>
      </div>
    );
  }

  const groupOrders = (orderList) => {
    const groups = [];
    const map = new Map();

    (orderList || []).forEach(order => {
      const key = order.checkout_id ? `chk_${order.checkout_id}` : `ord_${order.id}`;
      if (!map.has(key)) {
        const groupObj = {
          key,
          checkoutId: order.checkout_id || null,
          created_at: order.created_at,
          user: order.user,
          delivery_location: order.delivery_location,
          orders: []
        };
        map.set(key, groupObj);
        groups.push(groupObj);
      }
      map.get(key).orders.push(order);
    });

    return groups.map(group => {
      const gOrders = group.orders;
      const isMultiStore = gOrders.length > 1;

      const grandTotal = gOrders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
      const totalDeliveryFee = gOrders.reduce((sum, o) => sum + parseFloat(o.delivery_fee || 0), 0);
      const totalAdminFee = gOrders.reduce((sum, o) => sum + parseFloat(o.admin_fee || 0), 0);

      const isAllPaid = gOrders.every(o => o.payment_status === 'paid');
      const isAnyWaiting = gOrders.some(o => o.payment_status === 'waiting_confirmation');
      const payment_status = isAllPaid ? 'paid' : (isAnyWaiting ? 'waiting_confirmation' : 'unpaid');

      const isAllCompleted = gOrders.every(o => o.status === 'completed');
      const isAllCancelled = gOrders.every(o => o.status === 'cancelled');
      const isAllProcessing = gOrders.every(o => o.status === 'processing');
      const isAnyProcessing = gOrders.some(o => o.status === 'processing');
      const isAnyPending = gOrders.some(o => o.status === 'pending');

      let overallStatus = 'pending';
      if (isAllCompleted) overallStatus = 'completed';
      else if (isAllCancelled) overallStatus = 'cancelled';
      else if (isAllProcessing) overallStatus = 'processing';
      else if (isAnyProcessing && isAnyPending) overallStatus = 'partial';
      else if (isAnyProcessing) overallStatus = 'processing';
      else if (isAnyPending) overallStatus = 'pending';

      const primaryOrder = gOrders.find(o => o.proof_of_payment && (Array.isArray(o.proof_of_payment) ? o.proof_of_payment.length > 0 : !!o.proof_of_payment)) || gOrders[0];

      return {
        ...group,
        isMultiStore,
        grandTotal,
        totalDeliveryFee,
        totalAdminFee,
        payment_status,
        overallStatus,
        primaryOrder
      };
    });
  };

  const renderOrderCard = (order) => {
    const isCompleted = order.status === 'completed';
    const isPending = order.status === 'pending';
    const isProcessing = order.status === 'processing';
    const isCancelled = order.status === 'cancelled';
    const isPaid = order.payment_status === 'paid';
    const isWaiting = order.payment_status === 'waiting_confirmation';
    const santriName = order.user?.santri_name || order.user?.name || 'Pembeli';
    const waliName = order.user?.name || 'Wali';
    let santriClass = order.user?.santri_class || '';
    let santriLevel = order.user?.santri_level || '';
    let santriRoom = order.user?.santri_room || order.delivery_location || '';

    if (santriName && santriData?.data) {
      const sName = santriName.toLowerCase().trim();
      const match = santriData.data.find(r => {
        if (!r || !r[1]) return false;
        const rawName = r[1].toLowerCase().replace(/\s+(laki-laki|perempuan)$/i, '').trim();
        return rawName === sName || sName.includes(rawName) || rawName.includes(sName);
      });
      if (match) {
        if (!santriLevel && match[4]) santriLevel = match[4];
        const tingkat = match[5] || '';
        const rombel = match[6] || '';
        const program = match[7] && match[7] !== '-' ? match[7] : '';
        const fullClass = [tingkat, rombel, program].filter(Boolean).join(' ');
        if (!santriClass || santriClass === tingkat) {
          santriClass = fullClass || santriClass;
        }
        if ((!santriRoom || santriRoom === '-') && match[10]) {
          santriRoom = match[10];
        }
      }
    }

    return (
      <div 
        key={order.id} 
        className={`rounded-2xl border shadow-sm hover:shadow-md transition-all p-3.5 sm:p-4.5 flex flex-col justify-between gap-3 ${
          isCompleted 
            ? 'bg-gray-50/70 dark:bg-gray-900/40 border-green-200 dark:border-green-900/50' 
            : isProcessing
            ? 'bg-white dark:bg-gray-900 border-green-400 dark:border-green-600 ring-1 ring-green-500/20'
            : isPending
            ? 'bg-white dark:bg-gray-900 border-amber-300 dark:border-amber-700 ring-1 ring-amber-500/20'
            : 'bg-white dark:bg-gray-900 border-green-300/80 dark:border-green-800'
        }`}
      >
        {/* 1. Header: Toko, ID, Jam & Status Badges */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700/80 pb-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 truncate">
              🏪 {order.canteen?.name || 'Toko'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
              #{order.id}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400">
              • {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isPending && (!order.canteen?.couriers || order.canteen.couriers.length === 0) && (
              <span className="text-[9px] sm:text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                ⚠️ Belum ada kurir
              </span>
            )}

            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
              isPaid
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                : isWaiting
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 ring-1 ring-amber-300 animate-pulse'
                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
            }`}>
              {isPaid ? 'Lunas' : isWaiting ? 'Verifikasi' : 'COD / Belum'}
            </span>

            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
              isCompleted
                ? 'bg-green-50 text-green-800 dark:bg-green-950/60 dark:text-green-300 border border-green-200 dark:border-green-800'
                : isProcessing
                ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : isCancelled
                ? 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800'
                : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            }`}>
              {isCompleted ? 'Selesai' : isProcessing ? 'Diproses' : isCancelled ? 'Batal' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Responsive Body for Web: Left Customer & Payment, Right Items */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-start flex-1">
          {/* Left Column (sm: 5 cols): Santri, Wali, Kontak, Bukti, Pembayaran */}
          <div className="sm:col-span-5 space-y-2.5">
            <div className="text-xs space-y-1 bg-gray-50/70 dark:bg-gray-800/40 p-2.5 rounded-xl border border-gray-200/70 dark:border-gray-700/70">
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 min-w-0">
                  <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate sm:whitespace-normal">{santriName}</span>
                </span>
                <span className="text-[11px] text-gray-600 dark:text-gray-300 font-semibold shrink-0">
                  📍 {santriRoom || '-'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 pt-0.5 flex-wrap gap-1">
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span className="truncate">Wali: {waliName}</span>
                  {(santriLevel || santriClass) && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 text-[10px] font-bold">
                      🎓 {santriLevel ? `${santriLevel} ` : ''}{santriClass ? `Kelas ${santriClass}` : ''}
                    </span>
                  )}
                </div>
                {order.user?.phone && (
                  <button
                    type="button"
                    onClick={() => handleContact(order.user?.phone, order.user?.name)}
                    className="text-green-600 dark:text-green-400 font-bold hover:underline flex items-center gap-0.5 shrink-0 text-[10px] sm:text-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WA Pembeli
                  </button>
                )}
              </div>
            </div>

            {/* Proof Buttons (If uploaded) & Quick Upload */}
            <div className="flex gap-1.5 flex-wrap items-center pt-0.5">
              {order.proof_of_payment && order.proof_of_payment.length !== 0 ? (
                <div className="inline-flex items-center gap-1">
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
                    className="px-2 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 hover:bg-indigo-100 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors border border-indigo-200 dark:border-indigo-800"
                  >
                    <ImageIcon className="w-3 h-3" /> Bukti Transfer ({Array.isArray(order.proof_of_payment) ? order.proof_of_payment.length : 1})
                  </button>
                  {!isCancelled && (
                    <button
                      type="button"
                      onClick={() => handleOpenUploadPaymentModal(order)}
                      title="Tambah / perbarui bukti transfer santri"
                      className="px-1.5 py-0.5 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300 hover:bg-green-100 rounded-md text-[10px] font-bold flex items-center gap-0.5 transition-colors border border-green-200 dark:border-green-800"
                    >
                      <Plus className="w-2.5 h-2.5" /> Bukti
                    </button>
                  )}
                </div>
              ) : (
                !isCancelled && (
                  <button 
                    type="button"
                    onClick={() => handleOpenUploadPaymentModal(order)}
                    className="px-2 py-0.5 bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors border border-green-200 dark:border-green-800"
                    title="Unggah bukti pembayaran santri"
                  >
                    <UploadCloud className="w-3 h-3 text-green-600 dark:text-green-400" />
                    <span>+ Bukti Transfer</span>
                  </button>
                )
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
                  className="px-2 py-0.5 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 hover:bg-purple-100 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors border border-purple-200 dark:border-purple-800"
                >
                  <ImageIcon className="w-3 h-3" /> Struk ({Array.isArray(order.proof_of_purchase) ? order.proof_of_purchase.length : 1})
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
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors border border-blue-200 dark:border-blue-800"
                >
                  <ImageIcon className="w-3 h-3" /> Serah Terima ({Array.isArray(order.proof_of_delivery) ? order.proof_of_delivery.length : 1})
                </button>
              )}
            </div>

            {/* Payment Validation Bar */}
            <div className="flex items-center justify-between gap-1.5 p-2 bg-gray-50/80 dark:bg-gray-800/40 rounded-xl border border-gray-200/80 dark:border-gray-700/80 flex-wrap">
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                💳 Pembayaran:
              </span>

              {!isCancelled ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenUploadPaymentModal(order)}
                    className="py-1 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                    title="Unggah Bukti Transfer Santri"
                  >
                    <UploadCloud className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Unggah Bukti</span>
                  </button>

                  {!isPaid ? (
                    <button
                      type="button"
                      disabled={updatePaymentMutation.isPending}
                      onClick={() => updatePaymentMutation.mutate({ id: order.id, status: 'paid', canteen_id: order.canteen_id })}
                      className="py-1 px-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 shadow-2xs disabled:opacity-50 cursor-pointer"
                    >
                      <CheckCircle className="w-3 h-3" /> Konfirmasi Lunas
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={updatePaymentMutation.isPending}
                      onClick={() => {
                        if (window.confirm('Batalkan status lunas dan kembalikan ke Belum Bayar?')) {
                          updatePaymentMutation.mutate({ id: order.id, status: 'unpaid', canteen_id: order.canteen_id });
                        }
                      }}
                      className="py-0.5 px-2 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" /> Batal Lunas
                    </button>
                  )}
                </div>
              ) : (
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900/50">
                  Pesanan Dibatalkan
                </span>
              )}
            </div>
          </div>

          {/* Right Column (sm: 7 cols): Items List Box & Courier */}
          <div className="sm:col-span-7 space-y-2">
            <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-xl p-2.5 space-y-1 text-xs border border-gray-200 dark:border-gray-700">
              {order.custom_notes && (
                <div className="text-[11px] sm:text-xs font-medium text-purple-800 dark:text-purple-300 pb-1 border-b border-purple-100 dark:border-purple-900/40">
                  ✨ {order.custom_notes}
                </div>
              )}
              {order.items && order.items.length > 0 ? (
                order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-xs py-0.5">
                    <span className="text-gray-800 dark:text-gray-200 truncate pr-2">
                      <strong className="text-gray-900 dark:text-white font-bold">{item.quantity}x</strong> {item.product?.name || 'Produk'}
                      {item.notes && <span className="text-gray-400 italic text-[10px]"> ({item.notes})</span>}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white shrink-0">
                      Rp {formatRupiah(item.subtotal || (parseFloat(item.price) * item.quantity))}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between items-center text-xs text-gray-500 py-0.5">
                  <span>1x Pesanan Khusus</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    Rp {formatRupiah(Math.max(0, parseFloat(order.total_price || 0) - parseFloat(order.delivery_fee || 0) - parseFloat(order.admin_fee || 0)))}
                  </span>
                </div>
              )}

              {/* Kurir info badge if present */}
              {order.courier && (
                <div className="pt-1 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 dark:text-gray-400">Petugas Antar:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                    <Truck className="w-3 h-3" /> {order.courier.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 6. Footer: Total Price & Canteen Operational Actions */}
        <div className="pt-2.5 border-t border-gray-200 dark:border-gray-700/80 flex items-center justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <span className="text-sm sm:text-base font-black text-green-700 dark:text-green-400 block leading-tight">
              Rp {formatRupiah(order.total_price)}
            </span>
            {Boolean(order.is_custom) && parseFloat(order.total_price) === 0 && (
              <span className="text-[10px] sm:text-xs text-amber-600 font-semibold block">Harga belum diset</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            {/* Tombol Cetak Struk */}
            <button 
              onClick={() => handlePrintSingleReceipt(order)}
              className="p-1.5 sm:px-2.5 sm:py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              title="Cetak Struk Thermal / A4"
            >
              <Printer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Cetak</span>
            </button>

            {/* Set Harga Khusus */}
            {Boolean(order.is_custom) && order.payment_status !== 'paid' && (isPending || isProcessing) && (
              <button 
                onClick={() => {
                  setActiveOrderForSetPrice(order);
                  const deliveryFee = parseFloat(order.delivery_fee || 0);
                  const adminFee = parseFloat(order.admin_fee || 0);
                  const curProductPrice = Math.max(0, parseFloat(order.total_price || 0) - deliveryFee - adminFee);
                  setNewPriceInput(curProductPrice > 0 ? Math.round(curProductPrice).toString() : '');
                  setShowSetPriceModal(true);
                }}
                className="py-1 px-2.5 sm:py-1.5 sm:px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] sm:text-xs font-bold transition-colors shadow-2xs"
              >
                🏷️ {parseFloat(order.total_price) === 0 ? 'Set Harga' : 'Edit'}
              </button>
            )}

            {/* Pending Actions: Tolak / Lanjutkan */}
            {isPending && (
              <>
                <button 
                  onClick={() => {
                    if(window.confirm('Yakin ingin MENOLAK pesanan ini? Pesanan akan dibatalkan.')) {
                      cancelOrderMutation.mutate({ id: order.id, canteen_id: order.canteen_id });
                    }
                  }}
                  className="p-1.5 sm:px-2 sm:py-1 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 rounded-lg text-xs font-bold transition-colors border border-red-200 dark:border-red-800 flex items-center gap-1"
                  title="Tolak Pesanan"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Tolak</span>
                </button>

                <button 
                  disabled={updateStatusMutation.isPending || updatePaymentMutation.isPending}
                  onClick={() => {
                    if (order.payment_status !== 'paid') {
                      setUnpaidProceedOrder(order);
                    } else {
                      updateStatusMutation.mutate({ id: order.id, status: 'processing', canteen_id: order.canteen_id });
                    }
                  }}
                  className="py-1 px-2.5 sm:py-1.5 sm:px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[11px] sm:text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs disabled:opacity-50"
                >
                  <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Lanjutkan
                </button>
              </>
            )}

            {/* Processing Actions */}
            {isProcessing && (
              <>
                {!order.courier_id && (!order.proof_of_purchase || order.proof_of_purchase.length === 0) && (
                  <button 
                    onClick={() => {
                      setActiveOrderForReceipt(order);
                      setShowReceiptModal(true);
                    }}
                    className="py-1 px-2.5 sm:py-1.5 sm:px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] sm:text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> + Struk
                  </button>
                )}
                {!order.courier_id && (
                  <button 
                    onClick={() => {
                      if(window.confirm('Yakin pesanan ini sudah selesai diantar ke santri?')) {
                        updateStatusMutation.mutate({ id: order.id, status: 'completed', canteen_id: order.canteen_id });
                      }
                    }}
                    className="py-1 px-2.5 sm:py-1.5 sm:px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] sm:text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Selesaikan
                  </button>
                )}
                {order.courier_id && (
                  <span className="text-[10px] sm:text-xs font-semibold text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> {order.courier?.name || 'Kurir'}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderBundledOrderCard = (group) => {
    const isCompleted = group.overallStatus === 'completed';
    const isPending = group.overallStatus === 'pending';
    const isProcessing = group.overallStatus === 'processing';
    const isPartial = group.overallStatus === 'partial';
    const isCancelled = group.overallStatus === 'cancelled';
    const isPaid = group.payment_status === 'paid';
    const isWaiting = group.payment_status === 'waiting_confirmation';

    const pOrder = group.primaryOrder;
    const santriName = pOrder.user?.santri_name || pOrder.user?.name || 'Pembeli';
    const waliName = pOrder.user?.name || 'Wali';
    let santriClass = pOrder.user?.santri_class || '';
    let santriLevel = pOrder.user?.santri_level || '';
    let santriRoom = pOrder.user?.santri_room || pOrder.delivery_location || group.delivery_location || '';

    if (santriName && santriData?.data) {
      const sName = santriName.toLowerCase().trim();
      const match = santriData.data.find(r => {
        if (!r || !r[1]) return false;
        const rawName = r[1].toLowerCase().replace(/\s+(laki-laki|perempuan)$/i, '').trim();
        return rawName === sName || sName.includes(rawName) || rawName.includes(sName);
      });
      if (match) {
        if (!santriLevel && match[4]) santriLevel = match[4];
        const tingkat = match[5] || '';
        const rombel = match[6] || '';
        const program = match[7] && match[7] !== '-' ? match[7] : '';
        const fullClass = [tingkat, rombel, program].filter(Boolean).join(' ');
        if (!santriClass || santriClass === tingkat) {
          santriClass = fullClass || santriClass;
        }
        if ((!santriRoom || santriRoom === '-') && match[10]) {
          santriRoom = match[10];
        }
      }
    }

    const allPaymentProofs = Array.from(new Set(
      group.orders.flatMap(o => {
        if (!o.proof_of_payment) return [];
        return Array.isArray(o.proof_of_payment) ? o.proof_of_payment : [o.proof_of_payment];
      }).filter(Boolean)
    ));

    const allPurchaseProofs = Array.from(new Set(
      group.orders.flatMap(o => {
        if (!o.proof_of_purchase) return [];
        return Array.isArray(o.proof_of_purchase) ? o.proof_of_purchase : [o.proof_of_purchase];
      }).filter(Boolean)
    ));

    const allDeliveryProofs = Array.from(new Set(
      group.orders.flatMap(o => {
        if (!o.proof_of_delivery) return [];
        return Array.isArray(o.proof_of_delivery) ? o.proof_of_delivery : [o.proof_of_delivery];
      }).filter(Boolean)
    ));

    const assignedCouriers = group.orders.map(o => o.courier).filter(Boolean);

    return (
      <div 
        key={group.key} 
        className={`rounded-2xl border shadow-sm hover:shadow-md transition-all p-3.5 sm:p-4.5 flex flex-col justify-between gap-3 col-span-1 lg:col-span-2 ${
          isCompleted 
            ? 'bg-gray-50/70 dark:bg-gray-900/40 border-green-200 dark:border-green-900/50' 
            : isProcessing
            ? 'bg-white dark:bg-gray-900 border-green-400 dark:border-green-600 ring-1 ring-green-500/20'
            : isPending
            ? 'bg-white dark:bg-gray-900 border-amber-300 dark:border-amber-700 ring-1 ring-amber-500/20'
            : isPartial
            ? 'bg-white dark:bg-gray-900 border-purple-300 dark:border-purple-700 ring-1 ring-purple-500/20'
            : 'bg-white dark:bg-gray-900 border-green-300/80 dark:border-green-800'
        }`}
      >
        {/* 1. Header: Multi-Toko Badge, Order IDs, Jam & Status Badges */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700/80 pb-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 truncate">
              📦 {group.orders.length} Toko Pesanan
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
              #{group.orders.map(o => o.id).join(', #')}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400">
              • {new Date(group.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
              isPaid
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                : isWaiting
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 ring-1 ring-amber-300 animate-pulse'
                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
            }`}>
              {isPaid ? 'Lunas' : isWaiting ? 'Verifikasi' : 'COD / Belum'}
            </span>

            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
              isCompleted
                ? 'bg-green-50 text-green-800 dark:bg-green-950/60 dark:text-green-300 border border-green-200 dark:border-green-800'
                : isProcessing
                ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : isPartial
                ? 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                : isCancelled
                ? 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800'
                : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            }`}>
              {isCompleted ? 'Selesai' : isProcessing ? 'Diproses' : isPartial ? 'Sebagian Diproses' : isCancelled ? 'Batal' : 'Pending'}
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Body for Web: Left info & payment, Right store breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start flex-1">
          {/* Left Column (5 of 12 cols on lg+): Santri, Room, Wali, WA, Proofs, Payment */}
          <div className="lg:col-span-5 space-y-2.5">
            {/* Customer, Santri & WhatsApp Contact Info */}
            <div className="text-xs space-y-1 bg-gray-50/70 dark:bg-gray-800/40 p-2.5 rounded-xl border border-gray-200/70 dark:border-gray-700/70">
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 min-w-0">
                  <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate lg:whitespace-normal">{santriName}</span>
                </span>
                <span className="text-[11px] text-gray-600 dark:text-gray-300 font-semibold shrink-0">
                  📍 {santriRoom || '-'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 pt-0.5 flex-wrap gap-1">
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span className="truncate">Wali: {waliName}</span>
                  {(santriLevel || santriClass) && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 text-[10px] font-bold">
                      🎓 {santriLevel ? `${santriLevel} ` : ''}{santriClass ? `Kelas ${santriClass}` : ''}
                    </span>
                  )}
                </div>
                {pOrder.user?.phone && (
                  <button
                    type="button"
                    onClick={() => handleContact(pOrder.user?.phone, pOrder.user?.name)}
                    className="text-green-600 dark:text-green-400 font-bold hover:underline flex items-center gap-0.5 shrink-0 text-[10px] sm:text-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WA Pembeli
                  </button>
                )}
              </div>
            </div>

            {/* Proof Buttons & Quick Upload */}
            <div className="flex gap-1.5 flex-wrap items-center pt-0.5">
              {allPaymentProofs.length > 0 ? (
                <div className="inline-flex items-center gap-1">
                  <button 
                    onClick={() => {
                      setSelectedProofs(allPaymentProofs.map(p => getStorageUrl(p)));
                    }}
                    className="px-2 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 hover:bg-indigo-100 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors border border-indigo-200 dark:border-indigo-800"
                  >
                    <ImageIcon className="w-3 h-3" /> Bukti Transfer ({allPaymentProofs.length})
                  </button>
                  {!isCancelled && (
                    <button
                      type="button"
                      onClick={() => handleOpenUploadPaymentModal({ ...pOrder, _groupOrders: group.orders, _groupGrandTotal: group.grandTotal })}
                      title="Tambah / perbarui bukti transfer santri"
                      className="px-1.5 py-0.5 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300 hover:bg-green-100 rounded-md text-[10px] font-bold flex items-center gap-0.5 transition-colors border border-green-200 dark:border-green-800"
                    >
                      <Plus className="w-2.5 h-2.5" /> Bukti
                    </button>
                  )}
                </div>
              ) : (
                !isCancelled && (
                  <button 
                    type="button"
                    onClick={() => handleOpenUploadPaymentModal({ ...pOrder, _groupOrders: group.orders, _groupGrandTotal: group.grandTotal })}
                    className="px-2 py-0.5 bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors border border-green-200 dark:border-green-800"
                    title="Unggah bukti pembayaran santri"
                  >
                    <UploadCloud className="w-3 h-3 text-green-600 dark:text-green-400" />
                    <span>+ Bukti Transfer</span>
                  </button>
                )
              )}

              {allPurchaseProofs.length > 0 && (
                <button 
                  onClick={() => {
                    setSelectedProofs(allPurchaseProofs.map(p => getStorageUrl(p)));
                  }}
                  className="px-2 py-0.5 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 hover:bg-purple-100 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors border border-purple-200 dark:border-purple-800"
                >
                  <ImageIcon className="w-3 h-3" /> Struk ({allPurchaseProofs.length})
                </button>
              )}
              {allDeliveryProofs.length > 0 && (
                <button 
                  onClick={() => {
                    setSelectedProofs(allDeliveryProofs.map(p => getStorageUrl(p)));
                  }}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors border border-blue-200 dark:border-blue-800"
                >
                  <ImageIcon className="w-3 h-3" /> Serah Terima ({allDeliveryProofs.length})
                </button>
              )}
            </div>

            {/* Payment Validation Bar */}
            <div className="flex items-center justify-between gap-1.5 p-2 bg-gray-50/80 dark:bg-gray-800/40 rounded-xl border border-gray-200/80 dark:border-gray-700/80 flex-wrap">
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                💳 Pembayaran:
              </span>

              {!isCancelled ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenUploadPaymentModal({ ...pOrder, _groupOrders: group.orders, _groupGrandTotal: group.grandTotal })}
                    className="py-1 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                    title="Unggah Bukti Transfer Santri"
                  >
                    <UploadCloud className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Unggah Bukti</span>
                  </button>

                  {!isPaid ? (
                    <button
                      type="button"
                      disabled={updatePaymentMutation.isPending}
                      onClick={() => {
                        updatePaymentMutation.mutate({ id: pOrder.id, status: 'paid', canteen_id: pOrder.canteen_id });
                      }}
                      className="py-1 px-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 shadow-2xs disabled:opacity-50 cursor-pointer"
                    >
                      <CheckCircle className="w-3 h-3" /> Konfirmasi Lunas
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={updatePaymentMutation.isPending}
                      onClick={() => {
                        if (window.confirm('Batalkan status lunas untuk paket checkout ini dan kembalikan ke Belum Bayar?')) {
                          updatePaymentMutation.mutate({ id: pOrder.id, status: 'unpaid', canteen_id: pOrder.canteen_id });
                        }
                      }}
                      className="py-0.5 px-2 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" /> Batal Lunas
                    </button>
                  )}
                </div>
              ) : (
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900/50">
                  Pesanan Dibatalkan
                </span>
              )}
            </div>
          </div>

          {/* Right Column (7 of 12 cols on md+): Per-Toko Breakdown Box */}
          <div className="md:col-span-7 space-y-2">
            {group.orders.map((o, oIdx) => (
              <div key={o.id} className="bg-gray-50/80 dark:bg-gray-800/50 rounded-xl p-2.5 space-y-1.5 text-xs border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between pb-1.5 border-b border-gray-200/70 dark:border-gray-700/70">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                      🏪 {o.canteen?.name || `Toko ${oIdx + 1}`}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 font-semibold shrink-0">
                      #{o.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {o.status === 'pending' && (!o.canteen?.couriers || o.canteen.couriers.length === 0) && (
                      <span className="text-[9px] sm:text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800 flex items-center gap-0.5">
                        ⚠️ Belum ada kurir
                      </span>
                    )}
                    {o.courier && (
                      <span className="text-[9px] sm:text-[10px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                        <Truck className="w-2.5 h-2.5" /> {o.courier.name}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold ${
                      o.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                      o.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                      o.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}>
                      {o.status === 'completed' ? 'Selesai' : o.status === 'processing' ? 'Diproses' : o.status === 'cancelled' ? 'Batal' : 'Pending'}
                    </span>
                  </div>
                </div>

                {o.custom_notes && (
                  <div className="text-[11px] sm:text-xs font-medium text-purple-800 dark:text-purple-300 pb-0.5">
                    ✨ {o.custom_notes}
                  </div>
                )}

                {o.items && o.items.length > 0 ? (
                  o.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs py-0.5">
                      <span className="text-gray-800 dark:text-gray-200 truncate pr-2">
                        <strong className="text-gray-900 dark:text-white font-bold">{item.quantity}x</strong> {item.product?.name || 'Produk'}
                        {item.notes && <span className="text-gray-400 italic text-[10px]"> ({item.notes})</span>}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white shrink-0">
                        Rp {formatRupiah(item.subtotal || (parseFloat(item.price) * item.quantity))}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-center text-xs text-gray-500 py-0.5">
                    <span>1x Pesanan Khusus</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      Rp {formatRupiah(Math.max(0, parseFloat(o.total_price || 0) - parseFloat(o.delivery_fee || 0) - parseFloat(o.admin_fee || 0)))}
                    </span>
                  </div>
                )}

                {/* Subtotal Toko & Custom Price Setting */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-200/50 dark:border-gray-700/50 text-[10px] sm:text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">Subtotal Toko:</span>
                  <div className="flex items-center gap-1.5">
                    {Boolean(o.is_custom) && o.payment_status !== 'paid' && (o.status === 'pending' || o.status === 'processing') && (
                      <button 
                        onClick={() => {
                          setActiveOrderForSetPrice(o);
                          const deliveryFee = parseFloat(o.delivery_fee || 0);
                          const adminFee = parseFloat(o.admin_fee || 0);
                          const curProductPrice = Math.max(0, parseFloat(o.total_price || 0) - deliveryFee - adminFee);
                          setNewPriceInput(curProductPrice > 0 ? Math.round(curProductPrice).toString() : '');
                          setShowSetPriceModal(true);
                        }}
                        className="py-0.5 px-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-[9px] sm:text-[10px] font-bold transition-colors shadow-2xs"
                      >
                        🏷️ {parseFloat(o.total_price) === 0 ? 'Set Harga' : 'Edit'}
                      </button>
                    )}
                    <span className="font-bold text-gray-900 dark:text-white">
                      Rp {formatRupiah(o.total_price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Footer: Total Price & Actions */}
        <div className="pt-2.5 border-t border-gray-200 dark:border-gray-700/80 flex items-center justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-black text-green-700 dark:text-green-400 block leading-tight">
                Rp {formatRupiah(group.grandTotal)}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-semibold">
                ({group.orders.length} Toko)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            {/* Tombol Cetak Struk Batch untuk Checkout Group */}
            <button 
              onClick={() => {
                setReceiptModalConfig({
                  isOpen: true,
                  mode: 'batch',
                  order: null,
                  orders: group.orders,
                  title: `Struk Paket Checkout (${group.orders.length} Toko)`
                });
              }}
              className="p-1.5 sm:px-2.5 sm:py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              title="Cetak Struk Semua Toko dalam Paket Ini"
            >
              <Printer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Cetak Struk</span>
            </button>

            {/* Pending & Partial Actions: Tolak / Lanjutkan */}
            {(isPending || isPartial) && (
              <>
                {isPending && (
                  <button 
                    disabled={batchUpdateStatusMutation.isPending}
                    onClick={() => {
                      if (window.confirm('Yakin ingin MENOLAK semua pesanan dalam paket ini? Pesanan akan dibatalkan.')) {
                        const pendingOrders = group.orders.filter(o => o.status === 'pending');
                        if (pendingOrders.length > 0) {
                          batchUpdateStatusMutation.mutate({ 
                            order_ids: pendingOrders.map(o => o.id), 
                            status: 'cancelled', 
                            canteen_id: selectedCanteenFilter !== 'all' ? selectedCanteenFilter : undefined 
                          });
                        }
                      }
                    }}
                    className="p-1.5 sm:px-2 sm:py-1 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 rounded-lg text-xs font-bold transition-colors border border-red-200 dark:border-red-800 disabled:opacity-50 flex items-center gap-1"
                    title="Tolak Semua Pesanan Paket Ini"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Tolak</span>
                  </button>
                )}

                <button 
                  disabled={batchUpdateStatusMutation.isPending || updatePaymentMutation.isPending}
                  onClick={() => {
                    const pendingOrders = group.orders.filter(o => o.status === 'pending');
                    if (pendingOrders.length === 0) return;

                    if (!isPaid) {
                      setUnpaidProceedOrder({ 
                        ...pOrder, 
                        _groupOrders: group.orders, 
                        _groupGrandTotal: group.grandTotal 
                      });
                    } else {
                      batchUpdateStatusMutation.mutate({ 
                        order_ids: pendingOrders.map(o => o.id), 
                        status: 'processing', 
                        canteen_id: selectedCanteenFilter !== 'all' ? selectedCanteenFilter : undefined 
                      });
                    }
                  }}
                  className="py-1 px-2.5 sm:py-1.5 sm:px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[11px] sm:text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs disabled:opacity-50"
                >
                  <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {isPartial ? 'Lanjutkan Sisa' : 'Lanjutkan'}
                </button>
              </>
            )}

            {/* Processing Actions */}
            {(isProcessing || isPartial) && (
              <button 
                disabled={batchUpdateStatusMutation.isPending}
                onClick={() => {
                  if (window.confirm('Yakin semua pesanan yang sedang diproses dalam paket ini sudah selesai diantar ke santri?')) {
                    const procOrders = group.orders.filter(o => o.status === 'processing');
                    if (procOrders.length > 0) {
                      batchUpdateStatusMutation.mutate({ 
                        order_ids: procOrders.map(o => o.id), 
                        status: 'completed', 
                        canteen_id: selectedCanteenFilter !== 'all' ? selectedCanteenFilter : undefined 
                      });
                    }
                  }
                }}
                className="py-1 px-2.5 sm:py-1.5 sm:px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] sm:text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs disabled:opacity-50"
              >
                <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Selesaikan
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-28 dark:bg-gray-950 font-sans animate-fade-in-up">
      <div className="max-w-7xl mx-auto p-2.5 sm:p-4 space-y-2.5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-white dark:bg-gray-900 p-2.5 sm:p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate({ to: '/dashboard' })} 
              className="p-1.5 -ml-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Kembali ke Dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                Pesanan Masuk & Rekap Toko
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                Kelola pesanan santri, atur harga pesanan titip beli, dan pantau rekapitulasi omzet toko Anda.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end flex-wrap">
            <button
              onClick={handlePrintBatchReceipt}
              className="px-2.5 py-1.5 bg-gray-900 hover:bg-black text-white dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
              title="Cetak Rekap Pesanan Toko ke Printer Thermal"
            >
              <Printer className="w-3.5 h-3.5 text-green-400" /> 🖨️ Cetak Rekap ({orders.length})
            </button>
            <button
              onClick={() => setShowRecapModal(true)}
              className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-green-600" /> Rekap per Produk
            </button>
            <button 
              onClick={() => setShowManualModal(true)}
              className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              ＋ Pesanan Manual
            </button>
          </div>
        </div>

        {/* UNIFIED GLOBAL FILTER SECTION */}
        <div className="bg-white dark:bg-gray-900 p-2.5 sm:p-3 rounded-xl border border-green-300/80 dark:border-green-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700 pb-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-green-600" />
              Filter Periode
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300 border border-green-200 dark:border-green-800">
              📅 Periode Aktif: <strong>{getFilterLabel()}</strong>
            </span>
          </div>

          {/* Mode Filter Selector */}
          <div className="flex gap-1 overflow-x-auto pb-0.5 no-scrollbar">
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
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap transition-all shadow-xs ${
                  filterMode === m.id
                    ? 'bg-green-600 text-white shadow-xs ring-1 ring-green-600/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Dynamic Inputs & Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 pt-0.5">
            {/* 1. Date Input (Per Tanggal / Datepicker) - KIRI */}
            {filterMode === 'day' && (
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                  PILIH TANGGAL:
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    onClick={(e) => {
                      try {
                        e.target.showPicker();
                      } catch {
                        // Fallback for older browsers
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    title="Klik untuk memilih hari / tanggal / bulan / tahun"
                  />
                  <div className="w-full flex items-center justify-between px-2.5 py-1.5 border rounded-lg text-xs bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white font-semibold group-hover:border-green-500 group-hover:bg-green-50/20 dark:group-hover:bg-green-950/20 transition-all shadow-xs">
                    <span className="truncate">
                      {formatFullDate(filterDate)}
                    </span>
                    <Calendar className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0 ml-1.5 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            )}

            {/* Week Mode Inputs */}
            {filterMode === 'week' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                    PILIH BULAN:
                  </label>
                  <select
                    value={filterMonth}
                    onChange={(e) => {
                      const newMonth = parseInt(e.target.value);
                      setFilterMonth(newMonth);
                      setFilterWeekIndex(getCurrentWeekIndex(filterYear, newMonth));
                    }}
                    className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-green-500 focus:outline-none"
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
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                    PILIH RENTANG MINGGU:
                  </label>
                  <select
                    value={filterWeekIndex < getWeeksInMonth(filterYear, filterMonth).length ? filterWeekIndex : 0}
                    onChange={(e) => setFilterWeekIndex(parseInt(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-green-500 focus:outline-none"
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
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                  PILIH BULAN:
                </label>
                <select
                  value={filterMonth}
                  onChange={(e) => {
                    const newMonth = parseInt(e.target.value);
                    setFilterMonth(newMonth);
                    setFilterWeekIndex(getCurrentWeekIndex(filterYear, newMonth));
                  }}
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-green-500 focus:outline-none"
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
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                  PILIH TAHUN:
                </label>
                <select
                  value={filterYear}
                  onChange={(e) => {
                    const newYear = parseInt(e.target.value);
                    setFilterYear(newYear);
                    setFilterWeekIndex(getCurrentWeekIndex(newYear, filterMonth));
                  }}
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-green-500 focus:outline-none"
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
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                FILTER STATUS:
              </label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-semibold bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="all">📋 Semua Status</option>
                <option value="waiting_confirmation">⏳ Menunggu Validasi Bayar</option>
                <option value="paid">💳 Sudah Bayar (Lunas)</option>
                <option value="unpaid">⚠️ Belum Bayar</option>
                <option value="pending">⏳ Belum Dikonfirmasi (Pending)</option>
                <option value="processing">🚚 Sedang Diproses</option>
                <option value="completed">✅ Selesai</option>
                <option value="cancelled">❌ Ditolak / Dibatalkan</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                PENCARIAN CEPAT:
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ketik nama Santri / Wali / Toko / Order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 border rounded-lg text-xs bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN TAB SWITCHER */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-1.5 flex gap-2 rounded-2xl shadow-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-green-600 text-white shadow-sm ring-2 ring-green-600/30'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Daftar Pesanan</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black ${
              activeTab === 'orders'
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}>
              {orders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('recap')}
            className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'recap'
                ? 'bg-green-600 text-white shadow-sm ring-2 ring-green-600/30'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Tab Rekap & Statistik</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'recap' ? (
          <div className="space-y-6">
            {isLoadingRecap ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <>
                {/* Summary Metric Cards (Khusus Kantin: Total Belanja, Total Modal, Laba Toko, Total Ongkir) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs">
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium block mb-0.5">Total Belanja (HPJ)</span>
                    <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                      Rp {(recapData?.summary?.total_products || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="bg-amber-50/60 dark:bg-amber-950/20 p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-800/40 shadow-xs">
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium block mb-0.5">Total Modal (HPP)</span>
                    <span className="text-base sm:text-lg font-black text-amber-700 dark:text-amber-300">
                      Rp {(recapData?.summary?.total_hpp || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/50 shadow-xs">
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold block mb-0.5">Laba Bersih Toko</span>
                    <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-300">
                      Rp {(recapData?.summary?.total_profit || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs">
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium block mb-0.5">Total Ongkir</span>
                    <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">
                      Rp {(recapData?.summary?.total_delivery_fee || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Rekap Per Toko / Kantin */}
                {recapData?.canteen_recap && recapData.canteen_recap.length > 0 && (
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xs border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-3.5 border-b border-gray-200 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-950/20">
                      <h3 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm flex items-center gap-2">
                        <Store className="w-4 h-4 text-blue-600" />
                        Rekapitulasi Per Toko / Kantin
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {recapData.canteen_recap.map(c => (
                        <div key={c.canteen_id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm flex items-center gap-2">
                              🏪 {c.canteen_name}
                              <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold px-2 py-0.5 rounded capitalize">
                                Zona {c.category}
                              </span>
                            </h4>
                            <p className="text-[11px] text-gray-500 mt-0.5">{c.order_count} Total Pesanan</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap text-xs font-semibold">
                            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                              Produk: Rp {c.total_products.toLocaleString('id-ID')}
                            </span>
                            <span className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-lg">
                              HPP: Rp {(c.total_hpp || 0).toLocaleString('id-ID')}
                            </span>
                            <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-lg font-bold">
                              Laba: +Rp {(c.total_profit || 0).toLocaleString('id-ID')}
                            </span>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg">
                              Ongkir: Rp {c.total_delivery_fee.toLocaleString('id-ID')}
                            </span>
                            <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-2 py-1 rounded-lg font-bold ml-auto sm:ml-0">
                              Total Belanja: Rp {c.total_products.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rekap Per Wali / Santri */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xs border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-3.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                      Rekap Per Wali / Santri
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Format ringkas: Total Belanja | Total Ongkir
                    </p>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {(!recapData?.user_recap || recapData.user_recap.length === 0) ? (
                      <div className="p-6 text-center text-gray-500 text-sm">Belum ada transaksi di periode ini.</div>
                    ) : (
                      recapData.user_recap.map(u => (
                        <div key={u.user_id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{u.santri_name}</h4>
                            <p className="text-[11px] text-gray-500">Wali: {u.wali_name} {u.santri_room ? `• ${u.santri_room}` : ''}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap text-xs font-semibold">
                            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                              Belanja: Rp {u.total_products.toLocaleString('id-ID')}
                            </span>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg">
                              Ongkir: Rp {u.total_delivery_fee.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Rekap Per Produk */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xs border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-3.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                      Rekap Kuantitas & Laba Per Produk
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {(!recapData?.product_breakdown || recapData.product_breakdown.length === 0) ? (
                      <div className="p-6 text-center text-gray-500 text-sm">Belum ada produk terjual.</div>
                    ) : (
                      recapData.product_breakdown.map(p => (
                        <div key={p.product_id} className="p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-800 dark:text-gray-200">{p.name}</span>
                              {p.is_custom && (
                                <span className="text-[10px] bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-bold">
                                  Titip Beli
                                </span>
                              )}
                              {p.canteen_name && (
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                  {p.canteen_name}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                              <span>HPJ: <strong className="text-gray-700 dark:text-gray-300">Rp {(p.hpj || 0).toLocaleString('id-ID')}</strong></span>
                              <span>•</span>
                              <span>HPP (Modal): <strong className="text-amber-700 dark:text-amber-400">Rp {(p.hpp || 1000).toLocaleString('id-ID')}</strong></span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded text-xs">
                              {p.total_quantity}x terjual
                            </span>
                            <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded text-xs font-semibold">
                              Subtotal: Rp {p.total_subtotal.toLocaleString('id-ID')}
                            </span>
                            <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded text-xs font-bold">
                              Laba: +Rp {(p.total_profit || 0).toLocaleString('id-ID')}
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
        ) : (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 text-center py-16 text-gray-500 flex flex-col items-center">
                <ShoppingBag className="w-14 h-14 mb-3 opacity-20 text-green-600" />
                <p className="font-semibold text-gray-700 dark:text-gray-300">Belum ada pesanan yang sesuai filter.</p>
                <p className="text-xs text-gray-400 mt-1">Coba ganti filter tanggal, toko, status, atau kata kunci pencarian.</p>
              </div>
            ) : selectedStatusFilter === 'all' && !searchQuery.trim() ? (
              (() => {
                const activeOrders = orders.filter(o => o.status !== 'completed');
                const completedOrders = orders.filter(o => o.status === 'completed');
                
                return (
                  <div className="space-y-6">
                    {activeOrders.length === 0 && completedOrders.length > 0 && (
                      <div className="p-4 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 rounded-2xl border border-green-200 dark:border-green-800/50 text-xs font-semibold text-center">
                        Semua pesanan aktif di periode ini telah selesai diproses! 🎉
                      </div>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                      {groupOrders(activeOrders).map(group => 
                        group.isMultiStore ? renderBundledOrderCard(group) : renderOrderCard(group.orders[0])
                      )}
                    </div>
                    
                    {completedOrders.length > 0 && (
                      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-5">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
                          Riwayat Selesai ({completedOrders.length})
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                          {groupOrders(completedOrders).map(group => 
                            group.isMultiStore ? renderBundledOrderCard(group) : renderOrderCard(group.orders[0])
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {groupOrders(orders).map(group => 
                  group.isMultiStore ? renderBundledOrderCard(group) : renderOrderCard(group.orders[0])
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* COURIER SELECTION MODAL */}
      {showCourierModal && activeOrderForCourier && createPortal(
        <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-950 flex flex-col animate-in slide-in-from-bottom-full duration-300">
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
              {/* OPSI KANTIN SENDIRI */}
              {(() => {
                const isSelfSelected = String(selectedCouriers[activeOrderForCourier.id]) === 'self';
                return (
                  <label 
                    className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelfSelected 
                      ? 'border-green-500 bg-green-50/50 dark:bg-green-950/30 dark:border-green-500 shadow-sm ring-1 ring-green-500' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="courier" 
                      value="self"
                      checked={isSelfSelected}
                      onChange={(e) => setSelectedCouriers({ ...selectedCouriers, [activeOrderForCourier.id]: e.target.value })}
                      className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <div className="ml-4 flex-1">
                      <span className="font-bold text-gray-900 dark:text-white text-base">Kantin Sendiri (Antar Sendiri)</span>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Store className="w-3 h-3"/> Diantarkan oleh pihak Kantin</p>
                    </div>
                  </label>
                );
              })()}

              {couriers.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Belum ada kurir yang terdaftar.</p>
              ) : (
                couriers.map(c => {
                  const isSelected = String(selectedCouriers[activeOrderForCourier.id]) === String(c.id);
                  return (
                    <label 
                      key={c.id} 
                      className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                        ? 'border-green-500 bg-green-50/50 dark:bg-green-950/30 dark:border-green-500 shadow-sm ring-1 ring-green-500' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="courier" 
                        value={c.id}
                        checked={isSelected}
                        onChange={(e) => setSelectedCouriers({ ...selectedCouriers, [activeOrderForCourier.id]: e.target.value })}
                        className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
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
                        className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/40 dark:text-green-300 p-2 rounded-full z-10 transition-colors"
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
          
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] pb-safe">
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
                className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {assignCourierMutation.isPending ? 'Memproses...' : (
                  <>Konfirmasi <CheckCircle className="w-5 h-5"/></>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* PROOF OF DELIVERY MODAL */}
      {showProofModal && activeOrderForProof && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
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
                Silakan unggah foto/berkas bukti serah terima pesanan ke Santri untuk menyelesaikan pesanan ini {activeOrderForProof.courier?.name ? <span>(Kurir: <strong>{activeOrderForProof.courier.name}</strong>)</span> : <span>(Pengiriman oleh <strong>Kantin</strong>)</span>}.
              </p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Foto Bukti Serah Terima <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-green-600 dark:text-green-400 font-medium">
                      Semua format foto & bebas ukuran
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.heic,.heif"
                    multiple
                    disabled={isCompressingProof}
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) {
                        setIsCompressingProof(true);
                        const toastId = toast.loading('Mengompresi foto bukti...');
                        try {
                          const compressed = await compressImageFiles(files);
                          setProofFiles(prev => [...prev, ...compressed]);
                          toast.success('Foto bukti dikompresi otomatis', { id: toastId });
                        } catch (err) {
                          setProofFiles(prev => [...prev, ...files]);
                          toast.dismiss(toastId);
                        } finally {
                          setIsCompressingProof(false);
                        }
                      }
                      e.target.value = '';
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900/30 dark:file:text-green-400 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-1 disabled:opacity-60"
                  />
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 flex items-center gap-1">
                    <span>✨ Otomatis dikompresi agar hemat ukuran & cepat terunggah.</span>
                  </p>
                </div>
                {proofFiles.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Berkas Dipilih ({proofFiles.length}):
                    </p>
                    <div className="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {proofFiles.map((file, idx) => {
                        const isImg = isImageFile(file);
                        const isPdf = isPdfFile(file);
                        const isHeif = isHeifFile(file);

                        return (
                          <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-2 flex flex-col justify-between group">
                            {isImg ? (
                              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/5 mb-1.5">
                                <img src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="aspect-video w-full rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/40 flex flex-col items-center justify-center text-green-600 dark:text-green-400 mb-1.5">
                                <FileText className="w-6 h-6" />
                                <span className="text-[10px] font-mono font-bold mt-0.5 uppercase">
                                  {isPdf ? 'PDF' : isHeif ? 'HEIF' : file.name.split('.').pop() || 'FILE'}
                                </span>
                              </div>
                            )}

                            <div className="pr-6">
                              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate" title={file.name}>
                                {file.name}
                              </p>
                              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                <span>{formatFileSize(file.size)}</span>
                                {file.originalSize && file.originalSize > file.size && (
                                  <span className="text-green-600 dark:text-green-400 font-bold">
                                    (Hemat {Math.round((1 - file.size / file.originalSize) * 100)}%)
                                  </span>
                                )}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => setProofFiles(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition-transform active:scale-95 z-10"
                              title="Hapus berkas ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 sticky bottom-0 bg-white dark:bg-gray-900">
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
                {completeOrderMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                    <span>Memproses...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>Selesaikan Pesanan</span>
                    <CheckCircle className="w-5 h-5" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}


      {/* UPLOAD RECEIPT / BUKTI PESANAN MODAL */}
      {showReceiptModal && activeOrderForReceipt && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Upload Bukti Pesanan / Struk</h3>
                <p className="text-xs text-gray-500 mt-0.5">Order #{activeOrderForReceipt.id}</p>
              </div>
              <button onClick={() => {setShowReceiptModal(false); setReceiptFiles([]);}} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Unggah berkas/foto struk atau bukti pesanan siap diantar untuk pesanan #{activeOrderForReceipt.id}.
              </p>

              {activeOrderForReceipt.proof_of_purchase && activeOrderForReceipt.proof_of_purchase.length > 0 && receiptFiles.length === 0 && (
                <div className="mb-4 bg-purple-50 dark:bg-purple-950/40 p-3 rounded-xl border border-purple-100 dark:border-purple-900/50">
                  <p className="text-xs font-bold text-purple-800 dark:text-purple-300 mb-2">
                    Berkas Struk Terunggah Saat Ini ({Array.isArray(activeOrderForReceipt.proof_of_purchase) ? activeOrderForReceipt.proof_of_purchase.length : 1} Berkas):
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(Array.isArray(activeOrderForReceipt.proof_of_purchase) ? activeOrderForReceipt.proof_of_purchase : [activeOrderForReceipt.proof_of_purchase]).map((path, idx) => {
                      const fileType = getFileType(path);
                      const isImg = fileType === 'image';
                      return (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-purple-200 dark:border-purple-800 bg-black/10 flex items-center justify-center">
                          {isImg ? (
                            <img src={getStorageUrl(path)} alt={`Current ${idx + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-1 text-center text-purple-600 dark:text-purple-300">
                              <FileText className="w-6 h-6" />
                              <span className="text-[9px] font-mono mt-1 uppercase truncate max-w-full px-1">{fileType}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-2 italic">
                    *Memilih berkas baru di bawah akan ditambahkan ke daftar bukti pesanan.
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Foto Struk / Bukti Pesanan <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                      Semua format foto & bebas ukuran
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.heic,.heif"
                    multiple
                    disabled={isCompressingReceipt}
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) {
                        setIsCompressingReceipt(true);
                        const toastId = toast.loading('Mengompresi foto struk...');
                        try {
                          const compressed = await compressImageFiles(files);
                          setReceiptFiles(prev => [...prev, ...compressed]);
                          toast.success('Foto struk dikompresi otomatis', { id: toastId });
                        } catch (err) {
                          setReceiptFiles(prev => [...prev, ...files]);
                          toast.dismiss(toastId);
                        } finally {
                          setIsCompressingReceipt(false);
                        }
                      }
                      e.target.value = '';
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-900/30 dark:file:text-purple-400 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-1 disabled:opacity-60"
                  />
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 flex items-center gap-1">
                    <span>✨ Otomatis dikompresi agar hemat ukuran & cepat terunggah.</span>
                  </p>
                </div>

                {receiptFiles.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Berkas Dipilih ({receiptFiles.length}):
                    </p>
                    <div className="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {receiptFiles.map((file, idx) => {
                        const isImg = isImageFile(file);
                        const isPdf = isPdfFile(file);
                        const isHeif = isHeifFile(file);

                        return (
                          <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-2 flex flex-col justify-between group">
                            {isImg ? (
                              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/5 mb-1.5">
                                <img src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="aspect-video w-full rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 flex flex-col items-center justify-center text-purple-600 dark:text-purple-400 mb-1.5">
                                <FileText className="w-6 h-6" />
                                <span className="text-[10px] font-mono font-bold mt-0.5 uppercase">
                                  {isPdf ? 'PDF' : isHeif ? 'HEIF' : file.name.split('.').pop() || 'FILE'}
                                </span>
                              </div>
                            )}

                            <div className="pr-6">
                              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate" title={file.name}>
                                {file.name}
                              </p>
                              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                <span>{formatFileSize(file.size)}</span>
                                {file.originalSize && file.originalSize > file.size && (
                                  <span className="text-purple-600 dark:text-purple-400 font-bold">
                                    (Hemat {Math.round((1 - file.size / file.originalSize) * 100)}%)
                                  </span>
                                )}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => setReceiptFiles(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition-transform active:scale-95 z-10"
                              title="Hapus berkas ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 sticky bottom-0 bg-white dark:bg-gray-900">
              <button 
                onClick={() => {setShowReceiptModal(false); setReceiptFiles([]);}}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold"
              >
                Batal
              </button>
              <button 
                disabled={receiptFiles.length === 0 || uploadReceiptMutation.isPending}
                onClick={() => {
                  const formData = new FormData();
                  receiptFiles.forEach((file) => {
                    formData.append('proof_of_purchase[]', file);
                  });
                  uploadReceiptMutation.mutate({ id: activeOrderForReceipt.id, formData, canteen_id: activeOrderForReceipt.canteen_id });
                }}
                className="flex-[2] py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:bg-gray-400 flex items-center justify-center gap-2 shadow-sm"
              >
                {uploadReceiptMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                    <span>Memproses...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>Unggah Bukti</span>
                    <CheckCircle className="w-5 h-5" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MANUAL ORDER MODAL */}
      {showManualModal && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl my-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
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
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Harga Produk / Barang Asli (Rp) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={manualPrice}
                  onChange={e => setManualPrice(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Contoh: 12000"
                  className="w-full p-3 border rounded-xl text-sm dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {/* DYNAMIC FEE CALCULATION PREVIEW */}
              {(() => {
                const prodPrice = parseFloat(manualPrice || 0);
                const delFee = 2000;
                const admFee = 1000;
                const grandTotal = prodPrice > 0 ? (prodPrice + delFee + admFee) : 0;

                return (
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Harga Produk / Barang:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">Rp {formatRupiah(prodPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ongkos Kirim (Otomatis):</span>
                      <span className="font-semibold text-gray-900 dark:text-white">+ Rp {formatRupiah(delFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Admin (Otomatis):</span>
                      <span className="font-semibold text-gray-900 dark:text-white">+ Rp {formatRupiah(admFee)}</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-gray-200 dark:border-gray-700 text-sm font-bold text-green-700 dark:text-green-400">
                      <span>Total Tagihan Santri:</span>
                      <span>Rp {formatRupiah(grandTotal)}</span>
                    </div>
                  </div>
                );
              })()}
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
        </div>,
        document.body
      )}

      {/* CONFIRMATION ALERT MODAL WHEN PROCEEDING UNPAID ORDER */}
      {unpaidProceedOrder && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200 my-auto text-left">
            {/* Header Icon & Title */}
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  Konfirmasi Lanjutkan Pesanan
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Pembayaran pesanan ini belum lunas
                </p>
              </div>
              <button 
                onClick={() => setUnpaidProceedOrder(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 -mr-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Info Card */}
            <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {unpaidProceedOrder._groupOrders?.length > 1
                    ? `#${unpaidProceedOrder._groupOrders.map(o => o.id).join(', #')} (${unpaidProceedOrder._groupOrders.length} Toko)`
                    : `#${unpaidProceedOrder.id}`}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 dark:text-gray-400">Nama Pemesan:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {unpaidProceedOrder.user?.name || 'Santri'}
                  {unpaidProceedOrder.user?.santri_name ? ` (${unpaidProceedOrder.user.santri_name})` : ''}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 dark:text-gray-400">Status Pembayaran:</span>
                <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                  unpaidProceedOrder.payment_status === 'waiting_confirmation'
                    ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 ring-1 ring-amber-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                }`}>
                  {unpaidProceedOrder.payment_status === 'waiting_confirmation'
                    ? '⏳ Menunggu Validasi'
                    : '⚠️ Belum Bayar'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-amber-200/60 dark:border-amber-900/50 text-sm font-bold text-gray-900 dark:text-white">
                <span>Total Tagihan:</span>
                <span className="text-green-600 dark:text-green-400">
                  Rp {formatRupiah(unpaidProceedOrder._groupGrandTotal || unpaidProceedOrder.total_price)}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Pesanan ini belum dikonfirmasi lunas oleh toko. Apakah Anda yakin ingin tetap melanjutkan pesanan ini ke tahap proses?
            </p>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={batchUpdateStatusMutation.isPending || updateStatusMutation.isPending || updatePaymentMutation.isPending}
                onClick={async () => {
                  const ord = unpaidProceedOrder;
                  setUnpaidProceedOrder(null);
                  const targetOrders = ord._groupOrders || [ord];
                  const pendingOrders = targetOrders.filter(o => o.status === 'pending');
                  try {
                    await updatePaymentMutation.mutateAsync({ id: ord.id, status: 'paid', canteen_id: ord.canteen_id });
                    if (pendingOrders.length > 1) {
                      batchUpdateStatusMutation.mutate({
                        order_ids: pendingOrders.map(o => o.id),
                        status: 'processing',
                        canteen_id: selectedCanteenFilter !== 'all' ? selectedCanteenFilter : undefined
                      });
                    } else if (pendingOrders.length === 1) {
                      updateStatusMutation.mutate({ id: pendingOrders[0].id, status: 'processing', canteen_id: pendingOrders[0].canteen_id });
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-green-600/20 active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" /> Tandai Lunas & Lanjutkan
              </button>

              <button
                type="button"
                disabled={batchUpdateStatusMutation.isPending || updateStatusMutation.isPending || updatePaymentMutation.isPending}
                onClick={() => {
                  const ord = unpaidProceedOrder;
                  setUnpaidProceedOrder(null);
                  const targetOrders = ord._groupOrders || [ord];
                  const pendingOrders = targetOrders.filter(o => o.status === 'pending');
                  if (pendingOrders.length > 1) {
                    batchUpdateStatusMutation.mutate({
                      order_ids: pendingOrders.map(o => o.id),
                      status: 'processing',
                      canteen_id: selectedCanteenFilter !== 'all' ? selectedCanteenFilter : undefined
                    });
                  } else if (pendingOrders.length === 1) {
                    updateStatusMutation.mutate({ id: pendingOrders[0].id, status: 'processing', canteen_id: pendingOrders[0].canteen_id });
                  }
                }}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Tetap Lanjutkan (Belum Lunas)
              </button>

              <button
                type="button"
                onClick={() => setUnpaidProceedOrder(null)}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* SET CUSTOM ORDER PRICE MODAL */}
      {showSetPriceModal && activeOrderForSetPrice && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl my-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
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
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Harga Produk / Barang Asli (Rp) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={newPriceInput}
                  onChange={e => setNewPriceInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Contoh: 12300"
                  className="w-full p-3 border rounded-xl text-sm dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* DYNAMIC FEE CALCULATION PREVIEW */}
              {(() => {
                const prodPrice = parseFloat(newPriceInput || 0);
                const canteenCat = activeOrderForSetPrice.canteen?.category || 'kauman';
                const delFee = parseFloat(activeOrderForSetPrice.delivery_fee) > 0 
                  ? parseFloat(activeOrderForSetPrice.delivery_fee) 
                  : (canteenCat === 'kota' ? PRICING_CONFIG.BASE_DELIVERY_FEE : 2000);
                const admFee = parseFloat(activeOrderForSetPrice.admin_fee) > 0 
                  ? parseFloat(activeOrderForSetPrice.admin_fee) 
                  : (canteenCat === 'kota' ? PRICING_CONFIG.BASE_ADMIN_FEE : 1000);
                const grandTotal = prodPrice > 0 ? (prodPrice + delFee + admFee) : 0;

                return (
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Harga Produk / Barang:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">Rp {formatRupiah(prodPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ongkos Kirim (Otomatis):</span>
                      <span className="font-semibold text-gray-900 dark:text-white">+ Rp {formatRupiah(delFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Admin (Otomatis):</span>
                      <span className="font-semibold text-gray-900 dark:text-white">+ Rp {formatRupiah(admFee)}</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-gray-200 dark:border-gray-700 text-sm font-bold text-green-700 dark:text-green-400">
                      <span>Total Tagihan Santri:</span>
                      <span>Rp {formatRupiah(grandTotal)}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-4 sm:p-6 pt-0 flex gap-3">
              <button 
                onClick={() => setShowSetPriceModal(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                disabled={!newPriceInput || setCustomPriceMutation.isPending || activeOrderForSetPrice.payment_status === 'paid'}
                onClick={() => {
                  setCustomPriceMutation.mutate({
                    id: activeOrderForSetPrice.id,
                    price: newPriceInput,
                    canteen_id: activeOrderForSetPrice.canteen_id
                  });
                }}
                className="flex-[2] py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2 shadow-sm"
              >
                {setCustomPriceMutation.isPending ? 'Simpan...' : 'Set & Setujui Harga'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* PROOF OF DELIVERY / PAYMENT FULL-SCREEN MODAL */}
      {selectedProofs.length > 0 && createPortal(
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xs flex flex-col animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-black/70 border-b border-white/10 shrink-0">
            <span className="text-white font-bold text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-400" />
              {selectedProofs.length} Berkas Bukti
            </span>
            <button 
              onClick={() => setSelectedProofs([])}
              className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Images & Documents */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center gap-4 p-4 pb-12">
            {selectedProofs.map((proof, idx) => {
              const fileType = getFileType(proof);
              const fileName = getFileNameFromPath(proof);

              if (fileType === 'pdf') {
                return (
                  <div key={idx} className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-xl">
                    <div className="w-full flex items-center justify-between text-xs text-gray-400 border-b border-gray-800 pb-2">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-red-400" /> Bukti {idx + 1}: {fileName}
                      </span>
                      <span className="px-2 py-0.5 bg-red-900/40 text-red-300 rounded font-mono text-[10px]">PDF</span>
                    </div>
                    <iframe 
                      src={proof} 
                      title={`Bukti PDF ${idx + 1}`} 
                      className="w-full h-[55vh] rounded-xl bg-white border border-gray-700" 
                    />
                    <a
                      href={proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <ExternalLink className="w-4 h-4" /> Buka / Unduh Dokumen PDF
                    </a>
                  </div>
                );
              }

              if (fileType === 'image') {
                return (
                  <div key={idx} className="w-full max-w-xl bg-gray-900/60 border border-white/5 rounded-2xl p-2.5 flex flex-col items-center gap-2">
                    <div className="w-full flex items-center justify-between px-2 text-xs text-gray-400">
                      <span className="font-semibold text-white/90">Bukti {idx + 1}</span>
                      <div className="flex items-center gap-1.5">
                        <button 
                          type="button"
                          onClick={() => setFullscreenImage(proof)}
                          className="px-2.5 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 border border-green-500/30"
                          title="Buka Pratinjau Layar Penuh"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Buka Gambar Penuh</span>
                        </button>
                        <a 
                          href={proof} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                          title="Buka di Tab Baru"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                    <img 
                      src={proof}
                      alt={`Bukti ${idx + 1}`}
                      onClick={() => setFullscreenImage(proof)}
                      className="w-full rounded-xl shadow-2xl object-contain bg-black/40 cursor-zoom-in hover:brightness-105 transition-all"
                      style={{ maxHeight: '75vh' }}
                      title="Klik gambar untuk memperbesar"
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
                      <span>Gambar tidak dapat dimuat langsung</span>
                      <a href={proof} target="_blank" rel="noreferrer" className="text-green-400 text-xs underline break-all px-4 text-center">Buka Berkas ({fileName})</a>
                    </div>
                  </div>
                );
              }

              // HEIF / Document / Other
              return (
                <div key={idx} className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col items-center gap-4 text-center shadow-xl">
                  <div className="w-16 h-16 rounded-2xl bg-green-950/60 border border-green-800/50 flex items-center justify-center text-green-400">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm break-all">{fileName}</p>
                    <p className="text-gray-400 text-xs mt-1">Berkas Bukti #{idx + 1}</p>
                  </div>
                  <a
                    href={proof}
                    target="_blank"
                    download
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Download className="w-4 h-4" /> Unduh / Buka Berkas
                  </a>
                </div>
              );
            })}
          </div>
        </div>,
        document.body
      )}

      {/* ULTRA FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {fullscreenImage && createPortal(
        <div 
          className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200"
          onClick={() => setFullscreenImage(null)}
        >
          {/* Top Bar */}
          <div 
            className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-white/10 shrink-0 z-10"
            onClick={e => e.stopPropagation()}
          >
            <span className="text-white text-xs font-semibold flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-green-400" />
              Pratinjau Layar Penuh
            </span>
            <div className="flex items-center gap-2">
              <a 
                href={fullscreenImage} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                title="Buka di Tab Baru"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Tab Baru</span>
              </a>
              <a 
                href={fullscreenImage} 
                download
                className="px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="Unduh Gambar"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh</span>
              </a>
              <button 
                onClick={() => setFullscreenImage(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90 ml-1"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Centered Large Image */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-auto">
            <img 
              src={fullscreenImage} 
              alt="Bukti Layar Penuh" 
              className="max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain rounded-xl shadow-2xl select-none"
              onClick={e => e.stopPropagation()}
            />
          </div>
          
          <div className="py-2.5 text-center text-gray-400 text-xs shrink-0 bg-black/40">
            Ketuk tombol ✕ atau area luar untuk menutup layar penuh
          </div>
        </div>,
        document.body
      )}

      {/* Recap Modal */}
      {showRecapModal && createPortal(
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[85vh] my-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                Rekap per Produk
              </h3>
              <button onClick={() => setShowRecapModal(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {productRecap.items.length === 0 && productRecap.customCount === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  Belum ada data penjualan.
                </div>
              ) : (
                <div className="space-y-4">
                  {productRecap.items.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Produk Reguler</h4>
                      <div className="space-y-2">
                        {productRecap.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div>
                              <div className="font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
                                <span>HPJ: Rp {formatRupiah(item.hpj)}</span>
                                <span>•</span>
                                <span className="text-amber-600 dark:text-amber-400 font-medium">HPP: Rp {formatRupiah(item.hpp)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold text-green-600 dark:text-green-400">{item.quantity}x terjual</div>
                              <div className="text-xs font-bold text-gray-800 dark:text-gray-200">Rp {formatRupiah(item.total)}</div>
                              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                Laba: +Rp {formatRupiah(item.profit)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {productRecap.customCount > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">Pesanan Titipan (Khusus)</h4>
                      <div className="space-y-2 mb-2">
                        {productRecap.customItems?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-purple-50 dark:bg-purple-900/20 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/50">
                            <div>
                              <div className="font-semibold text-purple-900 dark:text-purple-200 text-xs sm:text-sm">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-purple-600 dark:text-purple-300 mt-0.5">
                                HPP Standar: Rp {formatRupiah(item.hpp)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold text-purple-600 dark:text-purple-400">{item.quantity}x pesanan</div>
                              <div className="text-xs font-bold text-gray-800 dark:text-white">Rp {formatRupiah(item.total)}</div>
                              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                Laba: +Rp {formatRupiah(item.profit)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center bg-purple-100/70 dark:bg-purple-950/40 p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 text-xs">
                        <div>
                          <span className="font-bold text-purple-900 dark:text-purple-300 block">Subtotal Pesanan Khusus ({productRecap.customCount}x)</span>
                          <span className="text-[10px] text-purple-700 dark:text-purple-400">Modal: Rp {formatRupiah(productRecap.customHpp)}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-purple-700 dark:text-purple-300 block">Rp {formatRupiah(productRecap.customTotal)}</span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Laba: +Rp {formatRupiah(productRecap.customProfit)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* FOOTER TOTAL */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 mt-4 space-y-1.5">
                    <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                      <span>Total Belanja Produk (HPJ)</span>
                      <span className="font-bold text-gray-900 dark:text-white">Rp {formatRupiah(productRecap.totalProducts)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                      <span>Total Modal Pokok (HPP)</span>
                      <span className="font-bold text-amber-600 dark:border-amber-400">Rp {formatRupiah(productRecap.totalHpp)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-green-50 dark:bg-green-950/40 rounded-xl border border-green-200 dark:border-green-800">
                      <span className="font-bold text-green-900 dark:text-green-200 text-sm">Estimasi Laba Bersih Toko</span>
                      <span className="font-black text-green-700 dark:text-green-300 text-base">
                        Rp {formatRupiah(productRecap.totalProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setShowRecapModal(false)}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 rounded-xl font-bold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL UNGGAH BUKTI PEMBAYARAN OLEH KANTIN */}
      {orderToUploadPaymentProof && createPortal(
        <div className="fixed inset-0 z-[105] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-5 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 my-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                    Unggah Bukti Bayar Santri
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {orderToUploadPaymentProof._groupOrders?.length > 1
                      ? `Paket Checkout (${orderToUploadPaymentProof._groupOrders.length} Toko) • #${orderToUploadPaymentProof._groupOrders.map(o => o.id).join(', #')}`
                      : `Pesanan #${orderToUploadPaymentProof.id} • ${orderToUploadPaymentProof.canteen?.name || 'Toko'}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOrderToUploadPaymentProof(null);
                  setCanteenPaymentProofFiles([]);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Info Santri & Tagihan */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-3.5 border border-gray-200 dark:border-gray-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Santri / Pemesan:</span>
                <span className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
                  {orderToUploadPaymentProof.user?.santri_name || orderToUploadPaymentProof.user?.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Kamar / Lokasi:</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {orderToUploadPaymentProof.user?.santri_room || orderToUploadPaymentProof.delivery_location || '-'}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Total Tagihan:</span>
                <span className="text-base font-black text-green-600 dark:text-green-400">
                  Rp {formatRupiah(orderToUploadPaymentProof._groupGrandTotal || orderToUploadPaymentProof.total_price)}
                </span>
              </div>
            </div>

            {/* Bukti Yang Sudah Ada (Jika Ada) */}
            {orderToUploadPaymentProof.proof_of_payment && orderToUploadPaymentProof.proof_of_payment.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span>Bukti Tersimpan ({orderToUploadPaymentProof.proof_of_payment.length}):</span>
                  <span className="text-[10px] text-gray-400 font-normal">Klik untuk hapus jika salah</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {(Array.isArray(orderToUploadPaymentProof.proof_of_payment) 
                    ? orderToUploadPaymentProof.proof_of_payment 
                    : [orderToUploadPaymentProof.proof_of_payment]
                  ).map((p, pIdx) => (
                    <div key={pIdx} className="relative group shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-black/10">
                      <img src={getStorageUrl(p)} alt="Bukti" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Hapus berkas bukti ini?')) {
                            deleteCanteenProofMutation.mutate({
                              id: orderToUploadPaymentProof.id,
                              type: 'proof_of_payment',
                              path: p
                            });
                          }
                        }}
                        disabled={deleteCanteenProofMutation.isPending}
                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Hapus berkas ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tombol Pilih File & Kamera */}
            <div className="space-y-2">
              <input
                type="file"
                ref={canteenPaymentFileInputRef}
                multiple
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleCanteenProofFilesSelected(e.target.files)}
              />
              <input
                type="file"
                ref={canteenPaymentCameraInputRef}
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleCanteenProofFilesSelected(e.target.files)}
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isCompressingPaymentProof || uploadCanteenPaymentProofMutation.isPending}
                  onClick={() => canteenPaymentCameraInputRef.current?.click()}
                  className="py-3 px-3 bg-gray-50 hover:bg-green-50/80 dark:bg-gray-800/80 dark:hover:bg-green-950/40 border border-gray-200 dark:border-gray-700 hover:border-green-400 rounded-2xl text-gray-700 dark:text-gray-200 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold active:scale-98 cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span>Ambil Foto</span>
                </button>

                <button
                  type="button"
                  disabled={isCompressingPaymentProof || uploadCanteenPaymentProofMutation.isPending}
                  onClick={() => canteenPaymentFileInputRef.current?.click()}
                  className="py-3 px-3 bg-gray-50 hover:bg-green-50/80 dark:bg-gray-800/80 dark:hover:bg-green-950/40 border border-gray-200 dark:border-gray-700 hover:border-green-400 rounded-2xl text-gray-700 dark:text-gray-200 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold active:scale-98 cursor-pointer"
                >
                  <FileUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span>Pilih dari Galeri</span>
                </button>
              </div>

              <p className="text-[10px] text-gray-400 text-center">
                Mendukung JPG, PNG, WEBP, PDF (Maks 15MB/berkas, auto kompresi cerdas)
              </p>
            </div>

            {/* List Berkas Yang Dipilih */}
            {canteenPaymentProofFiles.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                  Berkas Terpilih ({canteenPaymentProofFiles.length}):
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {canteenPaymentProofFiles.map((file, fIdx) => {
                    const isImg = isImageFile(file);
                    return (
                      <div key={fIdx} className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 flex flex-col justify-between">
                        {isImg ? (
                          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/5 mb-1">
                            <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="aspect-video w-full rounded-lg bg-green-50 dark:bg-green-950/40 flex flex-col items-center justify-center text-green-600 dark:text-green-400 mb-1">
                            <FileText className="w-5 h-5" />
                            <span className="text-[9px] font-bold uppercase mt-0.5">PDF</span>
                          </div>
                        )}
                        <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-0.5">
                          <span>{formatFileSize(file.size)}</span>
                          {file.originalSize && file.originalSize > file.size && (
                            <span className="text-green-600 font-bold">
                              (-{Math.round((1 - file.size / file.originalSize) * 100)}%)
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setCanteenPaymentProofFiles((prev) => prev.filter((_, i) => i !== fIdx))}
                          className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-xs active:scale-90"
                          title="Hapus berkas"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pilihan Status Pembayaran */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                Ubah Status Pembayaran Menjadi:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCanteenPaymentStatus('paid')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    canteenPaymentStatus === 'paid'
                      ? 'bg-green-50 dark:bg-green-950/60 border-green-500 text-green-700 dark:text-green-300 ring-2 ring-green-500/30'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Langsung Lunas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCanteenPaymentStatus('waiting_confirmation')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    canteenPaymentStatus === 'waiting_confirmation'
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500/30'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Menunggu Validasi</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOrderToUploadPaymentProof(null);
                  setCanteenPaymentProofFiles([]);
                }}
                disabled={uploadCanteenPaymentProofMutation.isPending || isCompressingPaymentProof}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={canteenPaymentProofFiles.length === 0 || uploadCanteenPaymentProofMutation.isPending || isCompressingPaymentProof}
                onClick={() => {
                  const formData = new FormData();
                  canteenPaymentProofFiles.forEach((file) => {
                    formData.append('proof_of_payment[]', file);
                  });
                  formData.append('payment_status', canteenPaymentStatus);
                  uploadCanteenPaymentProofMutation.mutate({
                    id: orderToUploadPaymentProof.id,
                    formData,
                    canteen_id: orderToUploadPaymentProof.canteen_id
                  });
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                {uploadCanteenPaymentProofMutation.isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengunggah...</span>
                  </>
                ) : isCompressingPaymentProof ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengompresi...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Unggah ({canteenPaymentProofFiles.length}) Bukti</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL CETAK STRUK THERMAL IWARE UNTUK KANTIN */}
      <ThermalReceiptModal
        isOpen={receiptModalConfig.isOpen}
        onClose={() => setReceiptModalConfig(prev => ({ ...prev, isOpen: false }))}
        mode={receiptModalConfig.mode}
        order={receiptModalConfig.order}
        orders={receiptModalConfig.orders}
        courierName={receiptModalConfig.order?.courier?.name || 'Kantin Pondok'}
        title={receiptModalConfig.title}
      />
    </div>
  );
}
