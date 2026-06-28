import React from 'react';
import { Package, CheckCircle, Truck, Wallet, Power } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../../lib/axios';
import { useAuthStore } from '../../../store/authStore';

export default function KurirDashboard({ user }) {
  const setUser = useAuthStore(state => state.setUser);
  
  const toggleMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put('/me/working-status');
      return res.data;
    },
    onSuccess: (data) => {
      setUser({ ...user, is_working: data.is_working });
      toast.success(data.message);
    },
    onError: () => {
      toast.error('Gagal mengubah status');
    }
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['courier_orders'],
    queryFn: async () => {
      const res = await api.get('/courier/orders');
      return res.data;
    }
  });

  const pendingCount = orders.filter(o => o.status === 'processing').length;
  
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  const completedToday = orders.filter(o => o.status === 'completed' && o.updated_at?.startsWith(todayStr));
  const completedCount = completedToday.length;

  const totalEarnings = orders.filter(o => o.status === 'completed').reduce((sum, o) => {
     return sum + parseFloat(o.canteen?.delivery_fee || 0);
  }, 0);

  const stats = [
    { title: 'Menunggu Diantar', value: pendingCount.toString(), icon: Package, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/50' },
    { title: 'Selesai Hari Ini', value: completedCount.toString(), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
    { title: 'Total Tugas', value: orders.filter(o => o.status === 'completed').length.toString(), icon: Truck, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/50' },
    { title: 'Pendapatan', value: `Rp ${totalEarnings.toLocaleString('id-ID')}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
  ];

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Status Kurir</p>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${user?.is_working ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-300'}`}></div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">{user?.is_working ? 'Online Siap Antar' : 'Sedang Istirahat'}</span>
          </div>
        </div>
        <button 
          onClick={() => toggleMutation.mutate()}
          disabled={toggleMutation.isPending}
          className={`p-3 sm:p-4 rounded-xl transition-colors shadow-sm ${
            user?.is_working 
            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
            : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          <Power className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      <div className="relative rounded-2xl bg-gradient-to-r from-teal-600 to-green-700 p-5 sm:p-8 text-white overflow-hidden shadow-lg shadow-teal-500/20">
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Siap bertugas, {user?.name}? 🛵</h2>
          <p className="text-teal-50 max-w-xl text-sm sm:text-base">Ada {pendingCount} paket dan makanan yang menunggu untuk diantarkan ke asrama santri.</p>
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
    </>
  );
}
