import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, Plus, Edit2, Trash2, Filter, Shield, User, 
  Coffee, Bus, LogIn, X, AlertTriangle, Phone, GraduationCap, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCw,
  Home, BookOpen, Layers
} from 'lucide-react';
import { ROLES } from '../../config/roles';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingUserId, setEditingUserId] = useState(null);
  
  // SP (Surat Peringatan) states
  const [isSPModalOpen, setIsSPModalOpen] = useState(false);
  const [spFormData, setSpFormData] = useState({ id: null, penalty_points: 0 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    santri_name: '',
    santri_room: '',
    santri_class: '',
    santri_level: '',
    password: '',
    role: 'user',
    status: 'active'
  });

  const impersonate = useAuthStore(state => state.impersonate);
  const currentUser = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1); // reset to page 1 on search
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset to page 1 on filter change
  const handleRoleChange = (newRole) => {
    setFilterRole(newRole);
    setPage(1);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(Number(newPerPage));
    setPage(1);
  };

  // Fetch paginated users from backend
  const { data: paginationData, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin_users', page, perPage, debouncedSearch, filterRole],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('per_page', perPage);
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (filterRole !== 'all') params.append('role', filterRole);
      
      const res = await api.get(`/admin/users?${params.toString()}`);
      return res.data;
    },
    placeholderData: (previousData) => previousData
  });

  // Extract pagination info
  const users = Array.isArray(paginationData?.data) ? paginationData.data : (Array.isArray(paginationData) ? paginationData : []);
  const totalUsers = paginationData?.total ?? users.length;
  const currentPage = paginationData?.current_page ?? page;
  const lastPage = paginationData?.last_page ?? Math.max(1, Math.ceil(totalUsers / perPage));
  const fromItem = paginationData?.from ?? (users.length > 0 ? (currentPage - 1) * perPage + 1 : 0);
  const toItem = paginationData?.to ?? (users.length > 0 ? fromItem + users.length - 1 : 0);

  // Create User Mutation
  const createUserMutation = useMutation({
    mutationFn: (data) => api.post('/admin/users', data),
    onSuccess: () => {
      toast.success('User berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
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
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      santri_name: '', 
      santri_room: '', 
      santri_class: '', 
      santri_level: '', 
      password: '', 
      role: 'user', 
      status: 'active' 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setEditingUserId(user.id);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      santri_name: user.santri_name || '',
      santri_room: user.santri_room || '',
      santri_class: user.santri_class || '',
      santri_level: user.santri_level || '',
      password: '', // Leave blank, only fill if changing
      role: user.role || 'user',
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

  const getRoleBadge = (role) => {
    switch(role) {
      case ROLES.ADMIN: 
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800"><Shield className="w-3.5 h-3.5"/> Admin</span>;
      case ROLES.USER: 
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-xs font-bold border border-green-200 dark:border-green-800"><User className="w-3.5 h-3.5"/> User / Wali</span>;
      case ROLES.KANTIN: 
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800"><Coffee className="w-3.5 h-3.5"/> Kantin</span>;
      case ROLES.KURIR: 
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800"><Bus className="w-3.5 h-3.5"/> Kurir</span>;
      default: 
        return <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 text-xs font-semibold">{role}</span>;
    }
  };

  // Generate pagination page numbers
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(lastPage, currentPage + delta); i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Manajemen User & Akun
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola data akun santri/wali, administrator, pengelola kantin, dan kurir dengan cepat & ringan.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-green-600/20 w-full sm:w-auto shrink-0 gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah User Baru
        </button>
      </div>

      {/* Action Bar & Server-Side Filters */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama, santri, kamar, email, no hp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-xs sm:text-sm font-medium transition-colors"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Filters & Per Page */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
          {/* Role Filter */}
          <div className="relative flex-1 sm:flex-initial min-w-[140px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="pl-9 pr-8 py-2.5 w-full border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              <option value="all">Semua Peran</option>
              <option value={ROLES.ADMIN}>Admin</option>
              <option value={ROLES.USER}>User / Santri</option>
              <option value={ROLES.KANTIN}>Kantin</option>
              <option value={ROLES.KURIR}>Kurir</option>
            </select>
          </div>

          {/* Per Page Selector */}
          <div className="relative">
            <select
              value={perPage}
              onChange={(e) => handlePerPageChange(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
              title="Jumlah baris per halaman"
            >
              <option value={10}>10 / hal</option>
              <option value={15}>15 / hal</option>
              <option value={30}>30 / hal</option>
              <option value={50}>50 / hal</option>
              <option value={100}>100 / hal</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            className="p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-green-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Pagination Summary Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          Menampilkan <strong>{fromItem}</strong> - <strong>{toItem}</strong> dari total <strong>{totalUsers}</strong> pengguna
          {debouncedSearch && ` (hasil pencarian "${debouncedSearch}")`}
        </span>
        <span>Halaman {currentPage} dari {lastPage}</span>
      </div>

      {/* Users List (Optimized Cards with Santri Details) */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent mx-auto mb-3"></div>
            <p className="text-gray-500 text-xs font-semibold">Memuat data pengguna...</p>
          </div>
        ) : users.length > 0 ? (
          users.map((user) => {
            const isUserSantri = user.role === ROLES.USER || (!user.role && (user.santri_name || user.santri_room));
            
            return (
              <div 
                key={user.id} 
                className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-xs hover:border-green-200 dark:hover:border-green-800 transition-all space-y-3"
              >
                {/* User Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="flex-shrink-0 h-10 w-10 rounded-2xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-700 dark:text-green-300 font-extrabold text-sm uppercase shadow-xs">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {user.name}
                        </h3>
                        <span className="text-[10px] text-gray-400 font-mono">#{user.id}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {user.email || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {getRoleBadge(user.role)}
                    {user.role === ROLES.KURIR && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${user.penalty_points > 0 ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'}`}>
                        SP {user.penalty_points || 0}
                      </span>
                    )}
                  </div>
                </div>

                {/* Santri & Contact Details (If available) */}
                {(user.santri_name || user.santri_room || user.santri_class || user.phone) && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
                    {user.santri_name && (
                      <div className="flex items-center gap-1.5 truncate">
                        <GraduationCap className="w-3.5 h-3.5 text-green-600 shrink-0" />
                        <span className="text-gray-500 font-medium">Santri:</span>
                        <strong className="text-gray-900 dark:text-white truncate">{user.santri_name}</strong>
                      </div>
                    )}
                    {user.santri_room && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Home className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="text-gray-500 font-medium">Asrama:</span>
                        <strong className="text-gray-900 dark:text-white truncate">{user.santri_room}</strong>
                      </div>
                    )}
                    {user.santri_class && (
                      <div className="flex items-center gap-1.5 truncate">
                        <BookOpen className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="text-gray-500 font-medium">Kelas:</span>
                        <span>{user.santri_class} {user.santri_level ? `(${user.santri_level})` : ''}</span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-gray-500 font-medium">No. HP:</span>
                        <a 
                          href={`https://wa.me/${user.phone.replace(/^0/, '62')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-green-600 hover:underline font-semibold"
                        >
                          {user.phone}
                        </a>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Card Footer: Registered date & Action buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <div className="text-[11px] text-gray-400">
                    Terdaftar: {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {user.role !== ROLES.ADMIN && (
                      <button 
                        onClick={() => handleImpersonate(user)}
                        className="px-2.5 py-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors" 
                        title="Login Sebagai Pengguna Ini"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Login As</span>
                      </button>
                    )}
                    {user.role === ROLES.KURIR && (
                      <button 
                        onClick={() => {
                          setSpFormData({ id: user.id, penalty_points: user.penalty_points || 0 });
                          setIsSPModalOpen(true);
                        }}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg transition-colors" 
                        title="Kelola SP Kurir"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button 
                      onClick={() => openEditModal(user)}
                      className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors" 
                      title="Edit User"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(user)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors" 
                      title="Hapus User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
            <User className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Tidak ada pengguna ditemukan</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Coba ubah kata kunci pencarian atau ganti filter peran.
            </p>
          </div>
        )}
      </div>

      {/* PAGINATION CONTROLS BAR */}
      {lastPage > 1 && (
        <div className="bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500 font-medium">
            Halaman <strong>{currentPage}</strong> dari <strong>{lastPage}</strong>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {/* First Page */}
            <button
              onClick={() => setPage(1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-100 transition-colors"
              title="Halaman Pertama"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Prev Page */}
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-100 transition-colors text-xs font-bold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {/* Page Number Buttons */}
            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  pageNum === currentPage
                    ? 'bg-green-600 text-white shadow-xs'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Page */}
            <button
              onClick={() => setPage(prev => Math.min(lastPage, prev + 1))}
              disabled={currentPage >= lastPage}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-100 transition-colors text-xs font-bold flex items-center gap-1"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => setPage(lastPage)}
              disabled={currentPage >= lastPage}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-100 transition-colors"
              title="Halaman Terakhir"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal CRUD User (Add & Edit) */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-auto border border-gray-100 dark:border-gray-800 max-h-[92vh] flex flex-col">
            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/80 dark:bg-gray-800/50">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
                {modalMode === 'add' ? 'Tambah User Baru' : 'Edit Data User'}
              </h3>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full bg-gray-200/60 dark:bg-gray-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Nama Akun / Wali *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none font-medium"
                  placeholder="Contoh: Budi Santoso (Wali)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none font-medium"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">No. WhatsApp / HP</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none font-medium"
                    placeholder="08123456789"
                  />
                </div>
              </div>

              {/* Data Santri (Optional / For Santri Users) */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/70 dark:border-gray-700 space-y-3">
                <span className="text-[11px] font-extrabold text-green-700 dark:text-green-400 uppercase tracking-wider block">
                  Data Santri (Opsional untuk Akun Wali/Santri)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Nama Santri</label>
                    <input 
                      type="text" 
                      value={formData.santri_name}
                      onChange={(e) => setFormData({...formData, santri_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none text-xs font-medium"
                      placeholder="Nama lengkap santri"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Kamar / Asrama</label>
                    <input 
                      type="text" 
                      value={formData.santri_room}
                      onChange={(e) => setFormData({...formData, santri_room: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none text-xs font-medium"
                      placeholder="Contoh: Al-Mannan B-04"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Kelas</label>
                    <input 
                      type="text" 
                      value={formData.santri_class}
                      onChange={(e) => setFormData({...formData, santri_class: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none text-xs font-medium"
                      placeholder="Contoh: 3 Aliyah"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Jenjang</label>
                    <input 
                      type="text" 
                      value={formData.santri_level}
                      onChange={(e) => setFormData({...formData, santri_level: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none text-xs font-medium"
                      placeholder="Contoh: SMA / MA"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Password {modalMode === 'edit' && '(Kosongkan jika tidak ingin mengubah)'}
                </label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={modalMode === 'add'}
                  minLength={8}
                  className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none font-medium"
                  placeholder={modalMode === 'edit' ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Peran Akun (Role)</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none font-bold"
                >
                  <option value="user">User / Santri / Wali</option>
                  <option value="kantin">Kantin</option>
                  <option value="kurir">Kurir</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={createUserMutation.isPending || updateUserMutation.isPending}
                  className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex justify-center items-center shadow-md shadow-green-600/20 active:scale-98"
                >
                  {(createUserMutation.isPending || updateUserMutation.isPending) ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    'Simpan Data'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* SP (Penalty) Modal */}
      {isSPModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-auto border border-gray-100 dark:border-gray-800">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-amber-50 dark:bg-amber-900/20">
              <h3 className="font-bold text-base text-amber-900 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Kelola SP Kurir
              </h3>
              <button onClick={() => setIsSPModalOpen(false)} className="p-1.5 text-amber-700 hover:text-amber-900 dark:text-amber-500 rounded-full hover:bg-amber-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">Tingkat Surat Peringatan (SP) Saat Ini</p>
                <div className="flex items-center justify-center gap-4">
                  <button 
                    type="button" 
                    onClick={() => setSpFormData(prev => ({...prev, penalty_points: Math.max(0, prev.penalty_points - 1)}))}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-xl font-bold text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-4xl font-black text-amber-600 w-16 text-center">{spFormData.penalty_points}</span>
                  <button 
                    type="button" 
                    onClick={() => setSpFormData(prev => ({...prev, penalty_points: Math.min(4, prev.penalty_points + 1)}))}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-xl font-bold text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-3 text-left space-y-0.5 bg-amber-50/60 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
                  <strong className="text-amber-700 dark:text-amber-400">Ketentuan Sanksi Kurir:</strong><br/>
                  • SP 1: Teguran tertulis<br/>
                  • SP 2: Peringatan keras<br/>
                  • SP 3: Skorsing / pembatasan order<br/>
                  • SP 4: Pemutusan kemitraan
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsSPModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    updateUserMutation.mutate({ 
                      id: spFormData.id, 
                      data: { penalty_points: spFormData.penalty_points } 
                    });
                    setIsSPModalOpen(false);
                  }}
                  disabled={updateUserMutation.isPending}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors flex justify-center items-center shadow-md shadow-amber-500/20"
                >
                  Simpan SP
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
