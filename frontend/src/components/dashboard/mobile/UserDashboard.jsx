import React from 'react';
import { ShoppingBag, CheckCircle, Clock, Wallet, ChevronRight, Store } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import api from '../../../lib/axios';
import ThemeToggle from '../../ui/ThemeToggle';

export default function UserDashboard({ user }) {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['user_orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data;
    }
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
      <div className="grid grid-cols-2 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>)}
      </div>
    </div>;
  }

  // Calculate real stats
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => ['pending', 'processing'].includes(o.status)).length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpense = orders
    .filter(o => {
      const d = new Date(o.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && o.payment_status === 'paid';
    })
    .reduce((sum, o) => sum + parseFloat(o.total_price), 0);

  const stats = [
    { title: 'Total Pesanan', value: totalOrders.toString(), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/50' },
    { title: 'Pesanan Aktif', value: activeOrders.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/50' },
    { title: 'Pesanan Selesai', value: completedOrders.toString(), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
    { title: 'Pengeluaran Bulan Ini', value: `Rp ${currentMonthExpense.toLocaleString('id-ID')}`, icon: Wallet, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/50' },
  ];

  return (
    <>
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 dark:from-emerald-950 dark:via-teal-950 dark:to-gray-900 p-5 sm:p-8 text-white overflow-hidden shadow-lg shadow-emerald-500/20 dark:shadow-black/50 border border-transparent dark:border-emerald-800/40">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Ahlan wa Sahlan, {user?.name}! ✨</h2>
            <p className="text-emerald-50 dark:text-emerald-200/80 max-w-xl text-sm sm:text-base">Jangan lupa jadwalkan kegiatan harianmu dan periksa sisa saldo E-Money untuk jajan di kantin hari ini.</p>
          </div>
          <div className="shrink-0 self-start sm:self-center">
            <ThemeToggle variant="pill-light" />
          </div>
        </div>
      </div>
      
      {/* Akses Cepat */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Akses Cepat</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/dashboard/kantin" className="flex flex-col items-center justify-center p-4 rounded-xl bg-green-50 hover:bg-green-100 dark:bg-green-950/50 dark:hover:bg-green-900/60 transition-colors border border-green-100 dark:border-green-800/50">
            <Store className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Pesan Makan</span>
          </Link>
          <Link to="/dashboard/pembayaran" className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 transition-colors border border-blue-100 dark:border-blue-800/50">
            <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Riwayat</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Transaksi Terakhir (Full Width) */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transaksi Terakhir</h3>
          <Link to="/dashboard/pembayaran" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">Lihat Semua</Link>
        </div>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <p className="text-sm">Belum ada transaksi</p>
            </div>
          ) : (
            orders.slice(0, 4).map(order => (
              <div key={order.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{order.canteen?.name || 'Kantin'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {order.items?.length || 0} Item</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Rp {parseFloat(order.total_price).toLocaleString('id-ID')}</p>
                  <p className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                    order.status === 'completed' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border dark:border-emerald-800/50' 
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 dark:border dark:border-amber-800/50'
                  }`}>
                    {order.status === 'completed' ? 'Selesai' : order.status === 'pending' ? 'Menunggu' : 'Diproses'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
