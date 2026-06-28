import React from 'react';
import { ShoppingBag, Wallet, AlertCircle, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';

export default function KantinDashboard({ user }) {
  const { data: canteen } = useQuery({
    queryKey: ['canteen'],
    queryFn: async () => {
      const res = await api.get('/my-canteen');
      return res.data.data || res.data;
    }
  });

  const { data: statsData } = useQuery({
    queryKey: ['canteen_stats'],
    queryFn: async () => {
      const res = await api.get('/my-canteen/stats');
      return res.data;
    }
  });

  const stats = [
    { title: 'Pesanan Aktif', value: statsData?.pending_orders || 0, icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/50' },
    { title: 'Pendapatan Hari Ini', value: `Rp ${(statsData?.today_income || 0).toLocaleString('id-ID')}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
    { title: 'Menu Habis', value: statsData?.out_of_stock_products || 0, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/50' },
    { title: 'Rating', value: statsData?.rating || 'Belum ada', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
  ];

  return (
    <>
      <div className="relative rounded-2xl bg-gradient-to-r from-green-500 to-amber-600 p-5 sm:p-8 text-white overflow-hidden shadow-lg shadow-green-500/20">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Halo, {user?.name}! 🍳</h2>
            <p className="text-green-50 max-w-xl text-sm sm:text-base">Anda memiliki {statsData?.pending_orders || 0} pesanan aktif yang harus disiapkan. Pastikan menu hari ini selalu diperbarui.</p>
          </div>
          {canteen && (
            <div className="shrink-0 flex items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
              <span className="text-sm font-medium mr-3">Status Toko:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${canteen.is_open ? 'bg-white text-green-600' : 'bg-red-500 text-white'}`}>
                {canteen.is_open ? 'BUKA' : 'TUTUP'}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-4 sm:p-6 transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-xl ${stat.bg}`}><stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} /></div>
            </div>
          </div>
        ))}
      </div>

      {canteen && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Laporan Keuangan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <p className="text-xs text-green-700 dark:text-green-400 font-semibold mb-1">Pemasukan Produk</p>
              <p className="text-lg font-bold text-green-800 dark:text-green-300">Rp {parseFloat(canteen.product_income || 0).toLocaleString('id-ID')}</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-xs text-blue-700 dark:text-blue-400 font-semibold mb-1">Pemasukan Kurir (Toko)</p>
              <p className="text-lg font-bold text-blue-800 dark:text-blue-300">Rp {parseFloat(canteen.delivery_income || 0).toLocaleString('id-ID')}</p>
            </div>
            {canteen.admin_debt > 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex flex-col justify-center relative overflow-hidden">
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-1">Tagihan Admin</p>
                <p className="text-lg font-bold text-amber-800 dark:text-amber-300">Rp {parseFloat(canteen.admin_debt).toLocaleString('id-ID')}</p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Tagihan Admin</p>
                <p className="text-lg font-bold text-gray-600 dark:text-gray-300">Rp 0</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
