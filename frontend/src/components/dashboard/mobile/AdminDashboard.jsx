import React from 'react';
import { Users, Wallet, TrendingUp, AlertCircle, ArrowRight, ClipboardList, Store, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { Link } from '@tanstack/react-router';
import ThemeToggle from '../../ui/ThemeToggle';

export default function AdminDashboard({ user }) {
  const { data: adminStats } = useQuery({
    queryKey: ['admin_stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    }
  });

  const stats = [
    { title: 'Total Santri Aktif', value: adminStats?.total_santri || 0, href: '/dashboard/users', icon: Users, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/50' },
    { title: 'Tagihan Belum Dibayar', value: `Rp ${(adminStats?.total_admin_debt || 0).toLocaleString('id-ID')}`, href: '/dashboard/pertokoan', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
    { title: 'Transaksi Kantin', value: adminStats?.total_transactions || 0, href: '/dashboard/admin/pesanan', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
    { title: 'Menunggu Persetujuan', value: adminStats?.pending_approvals || 0, href: '/dashboard/pertokoan', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/50' },
  ];

  return (
    <>
      <div className="relative rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 dark:from-green-950 dark:via-emerald-950 dark:to-gray-900 p-5 sm:p-8 text-white overflow-hidden shadow-lg shadow-green-500/20 dark:shadow-black/50 border border-transparent dark:border-emerald-800/40">
        <div className="absolute right-0 top-0 opacity-10">
          <svg className="w-64 h-64 -mt-10 -mr-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.8l7.5 15H4.5L12 5.8z" /></svg>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Selamat Datang, {user?.name}! 👋</h2>
            <p className="text-green-100 dark:text-emerald-200/80 max-w-xl text-sm sm:text-base">Ringkasan aktivitas pondok pesantren hari ini. Anda memiliki beberapa laporan baru yang perlu ditinjau.</p>
          </div>
          <div className="shrink-0 self-start sm:self-center">
            <ThemeToggle variant="pill-light" />
          </div>
        </div>
      </div>

      {/* Akses Cepat Admin */}
      <div className="glass-card rounded-2xl p-5 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          Akses Cepat Menu Admin
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            to="/dashboard/admin/pesanan"
            className="flex flex-col items-center text-center justify-center p-4 rounded-xl bg-green-50 hover:bg-green-100 dark:bg-green-950/50 dark:hover:bg-green-900/60 transition-all border border-green-200/60 dark:border-green-800/50 shadow-xs hover:-translate-y-0.5"
          >
            <ClipboardList className="w-7 h-7 text-green-600 dark:text-green-400 mb-1.5" />
            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Rekap & Pesanan</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block mt-0.5">Semua Transaksi Toko</span>
          </Link>

          <Link
            to="/dashboard/pertokoan"
            className="flex flex-col items-center text-center justify-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 transition-all border border-blue-200/60 dark:border-blue-800/50 shadow-xs hover:-translate-y-0.5"
          >
            <Store className="w-7 h-7 text-blue-600 dark:text-blue-400 mb-1.5" />
            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Manajemen Toko</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block mt-0.5">Kantin & Biaya Ongkir</span>
          </Link>

          <Link
            to="/dashboard/users"
            className="flex flex-col items-center text-center justify-center p-4 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 transition-all border border-purple-200/60 dark:border-purple-800/50 shadow-xs hover:-translate-y-0.5"
          >
            <Users className="w-7 h-7 text-purple-600 dark:text-purple-400 mb-1.5" />
            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Manajemen User</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block mt-0.5">Santri, Kantin & Kurir</span>
          </Link>

          <Link
            to="/dashboard/admin-logs"
            className="flex flex-col items-center text-center justify-center p-4 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 transition-all border border-amber-200/60 dark:border-amber-800/50 shadow-xs hover:-translate-y-0.5"
          >
            <Shield className="w-7 h-7 text-amber-600 dark:text-amber-400 mb-1.5" />
            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Log Aktivitas</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block mt-0.5">Riwayat Audit Sistem</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <Link
            key={idx}
            to={stat.href}
            className="glass-card rounded-2xl p-4 sm:p-6 transition-all hover:-translate-y-1 hover:shadow-md block"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-xl ${stat.bg}`}><stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} /></div>
            </div>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="glass-card rounded-2xl p-5 sm:p-6 relative">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Aktivitas Terbaru</h3>
            <Link to="/dashboard/admin-logs" className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 flex items-center font-medium">
              Lihat Semua Log <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {adminStats?.recent_activities?.length > 0 ? (
              adminStats.recent_activities.map((activity) => (
                <div key={activity.id} className="flex items-center p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-lg transition-colors border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mr-3 sm:mr-4 shrink-0"><Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">{activity.title}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">{activity.description}</p>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-2">{activity.time}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada aktivitas terbaru.</p>
            )}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 sm:p-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Ringkasan Pembayaran</h3>
          </div>
          <div className="h-48 sm:h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900/40">
            <p className="text-gray-400 dark:text-gray-500 text-sm">Data transaksi terbaru telah diperbarui</p>
          </div>
        </div>
      </div>
    </>
  );
}
