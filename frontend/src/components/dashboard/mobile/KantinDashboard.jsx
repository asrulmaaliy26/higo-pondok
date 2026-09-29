import React, { useState } from 'react';
import { ShoppingBag, Wallet, TrendingUp, Store, ChevronRight, Activity, Calendar, History, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api, { getStorageUrl } from '../../../lib/axios';
import { useCanteenStore } from '../../../store/canteenStore';
import { useNavigate } from '@tanstack/react-router';
import ThemeToggle from '../../ui/ThemeToggle';

export default function KantinDashboard({ user }) {
  const navigate = useNavigate();
  const { setActiveCanteenId, setIsStoreSelected } = useCanteenStore();

  // Fetch Global Analytics
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['my_canteens_analytics'],
    queryFn: async () => {
      const res = await api.get('/my-canteens/analytics');
      return res.data;
    },
    refetchInterval: 30000 // Refresh every 30s
  });

  const handleSelectStore = (storeId) => {
    setActiveCanteenId(storeId);
    setIsStoreSelected(true);
    navigate({ to: '/dashboard/toko-saya/pesanan' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  };

  return (
    <div className="space-y-2 pb-20 animate-fade-in-up">
      {/* Header & Global Balance */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 dark:from-emerald-950 dark:via-green-950 dark:to-gray-900 rounded-none p-2.5 sm:p-3 text-white shadow-xs border border-green-600/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-green-100/80 dark:text-emerald-200/80 uppercase font-bold tracking-wider">
              Total Saldo (Semua Toko)
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-mono text-white leading-tight">
              {formatRupiah(analytics?.total_balance)}
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-300 dark:text-emerald-400" />
                <span className="text-[11px] text-green-100">Pesanan:</span>
                <span className="font-bold font-mono text-white">{analytics?.completed_orders_count || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-green-300 dark:text-emerald-400" />
                <span className="text-[11px] text-green-100">Toko:</span>
                <span className="font-bold font-mono text-white">{analytics?.store_performance?.length || 0}</span>
              </div>
            </div>
            <ThemeToggle variant="pill-light" />
          </div>
        </div>
      </div>

      {/* Banner Jika Belum Memiliki Toko */}
      {(!analytics?.store_performance || analytics.store_performance.length === 0) && (
        <div className="bg-white dark:bg-gray-900 rounded-none p-4 border border-dashed border-gray-200 dark:border-gray-800 text-center space-y-2 shadow-xs">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-none flex items-center justify-center mx-auto">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Anda Belum Memiliki Toko / Kantin</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-sm mx-auto">
              Daftarkan toko/kantin Anda sekarang di halaman Profil untuk mulai mengunggah produk dan menerima pesanan santri.
            </p>
          </div>
          <button
            onClick={() => navigate({ to: '/dashboard/profile' })}
            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-none shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Store className="w-3.5 h-3.5" />
            Buat Toko di Profil
          </button>
        </div>
      )}

      {/* Ringkasan Pendapatan (Harian, Mingguan, Bulanan) */}
      <div className="bg-white dark:bg-gray-900 rounded-none p-2 sm:p-2.5 border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            Ringkasan Pendapatan
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <div className="bg-gray-50/70 dark:bg-gray-800/50 p-2 rounded-none border border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase font-semibold leading-none">Hari Ini</p>
              <p className="text-xs sm:text-sm font-black font-mono text-gray-900 dark:text-white mt-0.5 truncate">
                {formatRupiah(analytics?.today_income)}
              </p>
            </div>
            <div className="w-6 h-6 rounded-none bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800/40">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-50/70 dark:bg-gray-800/50 p-2 rounded-none border border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase font-semibold leading-none">Minggu Ini</p>
              <p className="text-xs sm:text-sm font-black font-mono text-gray-900 dark:text-white mt-0.5 truncate">
                {formatRupiah(analytics?.this_week_income)}
              </p>
            </div>
            <div className="w-6 h-6 rounded-none bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800/40">
              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <div className="bg-gray-50/70 dark:bg-gray-800/50 p-2 rounded-none border border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase font-semibold leading-none">Bulan Ini</p>
              <p className="text-xs sm:text-sm font-black font-mono text-gray-900 dark:text-white mt-0.5 truncate">
                {formatRupiah(analytics?.this_month_income)}
              </p>
            </div>
            <div className="w-6 h-6 rounded-none bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800/40">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Peringkat Performa Toko */}
      <div className="bg-white dark:bg-gray-900 rounded-none border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="p-2 sm:p-2.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            Performa Toko Anda
          </h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {(!analytics?.store_performance || analytics.store_performance.length === 0) ? (
            <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400">Belum ada data toko atau transaksi.</div>
          ) : (
            analytics.store_performance.map((store, index) => (
              <div 
                key={store.id} 
                onClick={() => handleSelectStore(store.id)}
                className="p-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-none bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400 shrink-0 text-[10px] font-mono border border-gray-200 dark:border-gray-700">
                    #{index + 1}
                  </div>
                  <div className="w-7 h-7 rounded-none bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 flex items-center justify-center overflow-hidden shrink-0">
                    {store.image ? (
                      <img src={getStorageUrl(store.image)} alt={store.name} className="w-full h-full object-cover" />
                    ) : (
                      <Store className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{store.name}</h4>
                    <p className="text-[10px] text-gray-400 leading-none mt-0.5">{store.total_orders} pesanan selesai</p>
                  </div>
                </div>
                <div className="text-right shrink-0 flex items-center gap-1.5 ml-2">
                  <p className="font-bold text-xs font-mono text-emerald-600 dark:text-emerald-400">{formatRupiah(store.total_income)}</p>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Riwayat Transaksi Global */}
      <div className="bg-white dark:bg-gray-900 rounded-none border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="p-2 sm:p-2.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            Riwayat Transaksi Terbaru
          </h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {(!analytics?.recent_transactions || analytics.recent_transactions.length === 0) ? (
            <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400">Belum ada riwayat transaksi.</div>
          ) : (
            analytics.recent_transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="p-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-none bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800/40 flex items-center justify-center shrink-0">
                    <Wallet className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs text-gray-900 dark:text-white truncate">{tx.customer_name}</h4>
                    <p className="text-[10px] text-gray-400 truncate leading-none mt-0.5">{tx.canteen_name} &bull; {tx.date}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="font-bold text-xs font-mono text-emerald-600 dark:text-emerald-400">+{formatRupiah(tx.amount)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
