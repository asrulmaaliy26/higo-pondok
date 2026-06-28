import React from 'react';
import { Users, Wallet, TrendingUp, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';

export default function AdminDashboard({ user }) {
  const { data: adminStats } = useQuery({
    queryKey: ['admin_stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    }
  });

  const stats = [
    { title: 'Total Santri Aktif', value: adminStats?.total_santri || 0, change: '', icon: Users, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/50' },
    { title: 'Tagihan Belum Dibayar', value: `Rp ${(adminStats?.total_admin_debt || 0).toLocaleString('id-ID')}`, change: '', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
    { title: 'Transaksi Kantin', value: adminStats?.total_transactions || 0, change: '', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
    { title: 'Menunggu Persetujuan', value: adminStats?.pending_approvals || 0, change: '', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/50' },
  ];

  return (
    <>
      <div className="relative rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 p-5 sm:p-8 text-white overflow-hidden shadow-lg shadow-green-500/20">
        <div className="absolute right-0 top-0 opacity-10">
          <svg className="w-64 h-64 -mt-10 -mr-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.8l7.5 15H4.5L12 5.8z" /></svg>
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Selamat Datang, {user?.name}! 👋</h2>
          <p className="text-green-100 max-w-xl text-sm sm:text-base">Ringkasan aktivitas pondok pesantren hari ini. Anda memiliki beberapa laporan baru yang perlu ditinjau.</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-3 sm:space-y-4">
            {adminStats?.recent_activities?.length > 0 ? (
              adminStats.recent_activities.map((activity) => (
                <div key={activity.id} className="flex items-center p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 sm:mr-4"><Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /></div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">{activity.description}</p>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-400">{activity.time}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Belum ada aktivitas terbaru.</p>
            )}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Ringkasan Pembayaran</h3>
          <div className="h-48 sm:h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            <p className="text-gray-400 text-sm">Chart Placeholder</p>
          </div>
        </div>
      </div>
    </>
  );
}
