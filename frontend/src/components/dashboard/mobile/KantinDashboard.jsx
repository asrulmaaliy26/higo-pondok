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
    <div className="space-y-6 pb-24 animate-fade-in-up">
      {/* Header & Global Balance */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-green-800 dark:from-green-950 dark:via-emerald-950 dark:to-gray-900 rounded-3xl p-6 text-white shadow-lg shadow-green-600/20 dark:shadow-black/50 border border-transparent dark:border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="text-green-100 dark:text-emerald-200/80 text-sm font-medium mb-1">Total Saldo (Semua Toko)</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">{formatRupiah(analytics?.total_balance)}</h2>
            </div>
            <div className="shrink-0">
              <ThemeToggle variant="pill-light" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 border-t border-white/20 dark:border-emerald-800/40 pt-4">
            <div>
              <p className="text-green-100 dark:text-emerald-200/80 text-xs mb-1">Pesanan Selesai</p>
              <p className="font-bold text-lg flex items-center gap-1 text-white">
                <CheckCircle className="w-4 h-4 text-green-300 dark:text-emerald-400" />
                {analytics?.completed_orders_count || 0}
              </p>
            </div>
            <div>
              <p className="text-green-100 dark:text-emerald-200/80 text-xs mb-1">Toko Aktif</p>
              <p className="font-bold text-lg flex items-center gap-1 text-white">
                <Store className="w-4 h-4 text-green-300 dark:text-emerald-400" />
                {analytics?.store_performance?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Jika Belum Memiliki Toko */}
      {(!analytics?.store_performance || analytics.store_performance.length === 0) && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:bg-gray-900/90 rounded-3xl p-6 border-2 border-dashed border-green-300 dark:border-green-800 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Anda Belum Memiliki Toko / Kantin</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-sm mx-auto">
              Daftarkan toko/kantin Anda sekarang di halaman Profil untuk mulai mengunggah produk dan menerima pesanan santri.
            </p>
          </div>
          <button
            onClick={() => navigate({ to: '/dashboard/profile' })}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-green-600/30 transition-all transform active:scale-95 inline-flex items-center gap-2"
          >
            <Store className="w-4 h-4" />
            Buat Toko di Profil
          </button>
        </div>
      )}

      {/* Ringkasan Pendapatan (Harian, Mingguan, Bulanan) */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-600 dark:text-green-400" /> Ringkasan Pendapatan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center shrink-0 border border-transparent dark:border-blue-800/40">
              <Clock className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hari Ini</p>
              <p className="font-bold text-gray-900 dark:text-white">{formatRupiah(analytics?.today_income)}</p>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center shrink-0 border border-transparent dark:border-amber-800/40">
              <Calendar className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Minggu Ini</p>
              <p className="font-bold text-gray-900 dark:text-white">{formatRupiah(analytics?.this_week_income)}</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center shrink-0 border border-transparent dark:border-purple-800/40">
              <TrendingUp className="w-6 h-6 text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Bulan Ini</p>
              <p className="font-bold text-gray-900 dark:text-white">{formatRupiah(analytics?.this_month_income)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Peringkat Performa Toko */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" /> Performa Toko Anda
        </h3>
        <div className="glass-card rounded-2xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-700">
          {(!analytics?.store_performance || analytics.store_performance.length === 0) ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">Belum ada data toko atau transaksi.</div>
          ) : (
            analytics.store_performance.map((store, index) => (
              <div 
                key={store.id} 
                onClick={() => handleSelectStore(store.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400 shrink-0 text-xs border border-gray-200 dark:border-gray-700">
                    #{index + 1}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center overflow-hidden shrink-0">
                    {store.image ? (
                      <img src={getStorageUrl(store.image)} alt={store.name} className="w-full h-full object-cover" />
                    ) : (
                      <Store className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{store.name}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{store.total_orders} pesanan selesai</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400 text-sm">{formatRupiah(store.total_income)}</p>
                  <ChevronRight className="w-4 h-4 text-gray-400 inline-block mt-0.5" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Riwayat Transaksi Global */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-green-600 dark:text-green-400" /> Riwayat Transaksi Terbaru
        </h3>
        <div className="glass-card rounded-2xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-700">
          {(!analytics?.recent_transactions || analytics.recent_transactions.length === 0) ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">Belum ada riwayat transaksi.</div>
          ) : (
            analytics.recent_transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="p-4 flex items-center justify-between hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-950/60 flex items-center justify-center shrink-0 border border-transparent dark:border-green-800/40">
                    <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">{tx.customer_name}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{tx.canteen_name} &bull; {tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400 text-sm">+{formatRupiah(tx.amount)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
