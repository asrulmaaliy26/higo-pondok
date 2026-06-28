import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Edit2, Trash2, Filter, Shield, User, Coffee, Bus, LogIn } from 'lucide-react';
import { ROLES } from '../../config/roles';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

// Data simulasi (Mock Data) untuk preview UI
const mockUsers = [
  { id: 1, name: 'Administrator', email: 'admin@higopondok.com', role: 'admin', status: 'active', date: '26 Jun 2026' },
  { id: 2, name: 'Santri Dummy', email: 'santri@higopondok.com', role: 'user', status: 'active', date: '26 Jun 2026' },
  { id: 3, name: 'Kantin Barokah', email: 'kantin@higopondok.com', role: 'kantin', status: 'active', date: '26 Jun 2026' },
  { id: 4, name: 'Kurir Amanah', email: 'kurir@higopondok.com', role: 'kurir', status: 'pending', date: '26 Jun 2026' },
  { id: 5, name: 'Ahmad Fulan', email: 'ahmad@higopondok.com', role: 'user', status: 'active', date: '25 Jun 2026' },
  { id: 6, name: 'Siti Fatimah', email: 'siti@higopondok.com', role: 'user', status: 'inactive', date: '20 Jun 2026' },
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const impersonate = useAuthStore(state => state.impersonate);
  const navigate = useNavigate();

  const impersonateMutation = useMutation({
    mutationFn: (userId) => api.post(`/admin/impersonate/${userId}`),
    onSuccess: (res) => {
      const { user: targetUser, token } = res.data;
      impersonate(targetUser, token);
      toast.success(`Berhasil login sebagai ${targetUser.name}`);
      navigate({ to: '/dashboard' });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal beralih akun. Mungkin user ini hanya data palsu/mock.');
    }
  });

  const handleImpersonate = (user) => {
    if(user.role === ROLES.ADMIN) return; // Don't impersonate another admin (or self)
    impersonateMutation.mutate(user.id);
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch(role) {
      case ROLES.ADMIN: return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs font-semibold"><Shield className="w-3 h-3"/> Admin</span>;
      case ROLES.USER: return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold"><User className="w-3 h-3"/> User</span>;
      case ROLES.KANTIN: return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold"><Coffee className="w-3 h-3"/> Kantin</span>;
      case ROLES.KURIR: return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-semibold"><Bus className="w-3 h-3"/> Kurir</span>;
      default: return <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 text-xs font-semibold">{role}</span>;
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'active') return <span className="px-2.5 py-1 rounded-full bg-emerald-100/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-800">Aktif</span>;
    if (status === 'pending') return <span className="px-2.5 py-1 rounded-full bg-amber-100/50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 text-xs font-medium border border-amber-200 dark:border-amber-800">Menunggu</span>;
    return <span className="px-2.5 py-1 rounded-full bg-red-100/50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-xs font-medium border border-red-200 dark:border-red-800">Nonaktif</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Manajemen User</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola data akun administrator, user, pengelola kantin, dan kurir.
          </p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm shadow-green-500/20 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Tambah User
        </button>
      </div>

      {/* Action Bar */}
      <div className="glass-card p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg leading-5 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-9 pr-8 py-2 w-full border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-white dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
            >
              <option value="all">Semua Peran</option>
              <option value={ROLES.ADMIN}>Admin</option>
              <option value={ROLES.USER}>User</option>
              <option value={ROLES.KANTIN}>Kantin</option>
              <option value={ROLES.KURIR}>Kurir</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List (Card Layout for Mobile) */}
      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className="glass-card rounded-xl p-4 border border-gray-200/50 dark:border-gray-800/50 shadow-sm relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 truncate">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                   {getRoleBadge(user.role)}
                   {getStatusBadge(user.status)}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/50">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="block font-medium mb-0.5">Terdaftar:</span>
                  {user.date}
                </div>
                
                <div className="flex items-center gap-1">
                  {user.role !== ROLES.ADMIN && (
                    <button 
                      onClick={() => handleImpersonate(user)}
                      className="p-1.5 text-emerald-500 hover:text-emerald-600 transition-colors rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50" 
                      title="Login Sebagai"
                    >
                      <LogIn className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded-md hover:bg-green-50 dark:hover:bg-green-900/30" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/30" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-xl p-8 text-center border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
            <User className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Tidak ada pengguna</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Pengguna yang Anda cari tidak ditemukan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
