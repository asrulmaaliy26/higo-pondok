import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Edit2, Trash2, Filter, Shield, User, Coffee, Bus, LogIn, X } from 'lucide-react';
import { ROLES } from '../../config/roles';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  });

  const impersonate = useAuthStore(state => state.impersonate);
  const currentUser = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data;
    }
  });

  // Create User Mutation
  const createUserMutation = useMutation({
    mutationFn: (data) => api.post('/admin/users', data),
    onSuccess: () => {
      toast.success('User berhasil ditambahkan');
      queryClient.invalidateQueries(['admin_users']);
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal menambahkan user');
    }
  });

  // Update User Mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/users/${id}`, data),
    onSuccess: () => {
      toast.success('User berhasil diperbarui');
      queryClient.invalidateQueries(['admin_users']);
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui user');
    }
  });

  // Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success('User berhasil dihapus');
      queryClient.invalidateQueries(['admin_users']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal menghapus user');
    }
  });

  // Impersonate Mutation
  const impersonateMutation = useMutation({
    mutationFn: (userId) => api.post(`/admin/impersonate/${userId}`),
    onSuccess: (res) => {
      const { user: targetUser, token } = res.data;
      impersonate(targetUser, token);
      toast.success(`Berhasil login sebagai ${targetUser.name}`);
      navigate({ to: '/dashboard' });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal beralih akun.');
    }
  });

  const handleImpersonate = (user) => {
    if(user.role === ROLES.ADMIN) return;
    impersonateMutation.mutate(user.id);
  };

  const handleDelete = (user) => {
    if (user.id === currentUser?.id) {
      toast.error('Tidak bisa menghapus akun sendiri');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus user ${user.name}?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', email: '', password: '', role: 'user', status: 'active' });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Leave blank, only fill if changing
      role: user.role,
      status: user.status || 'active'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      createUserMutation.mutate(formData);
    } else {
      updateUserMutation.mutate({ id: editingUserId, data: formData });
    }
  };

  const filteredUsers = users.filter(user => {
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
    <div className="space-y-6 animate-fade-in-up pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Manajemen User</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola data akun administrator, user, pengelola kantin, dan kurir.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center px-4 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm shadow-green-500/20 w-full sm:w-auto"
        >
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
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Memuat data...</div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className="glass-card rounded-xl p-4 border border-gray-200/50 dark:border-gray-800/50 shadow-sm relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 truncate">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                   {getRoleBadge(user.role)}
                   {getStatusBadge(user.status || 'active')}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/50">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="block font-medium mb-0.5">Terdaftar:</span>
                  {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                  <button 
                    onClick={() => openEditModal(user)}
                    className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded-md hover:bg-green-50 dark:hover:bg-green-900/30" title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(user)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/30" title="Hapus"
                  >
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

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {modalMode === 'add' ? 'Tambah User Baru' : 'Edit User'}
              </h3>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full bg-gray-50 dark:bg-gray-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="Masukkan nama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password {modalMode === 'edit' && '(Kosongkan jika tidak diubah)'}
                </label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={modalMode === 'add'}
                  minLength={8}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder={modalMode === 'edit' ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peran (Role)</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  >
                    <option value="user">User / Santri</option>
                    <option value="kantin">Kantin</option>
                    <option value="kurir">Kurir</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                    <option value="pending">Menunggu</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={createUserMutation.isPending || updateUserMutation.isPending}
                  className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors flex justify-center items-center"
                >
                  {(createUserMutation.isPending || updateUserMutation.isPending) ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
