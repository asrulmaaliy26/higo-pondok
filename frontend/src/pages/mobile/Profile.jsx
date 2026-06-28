import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Edit2, ShieldCheck, PlusCircle, CreditCard, Users, Bookmark, Activity, Ticket, Shield, LogOut, ChevronRight, Store, Camera, Save, X } from 'lucide-react';
import { ROLES, getUserRole } from '../../config/roles';
import { useAuthStore } from '../../store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api, { getStorageUrl } from '../../lib/axios';

export default function Profile() {
  const user = useAuthStore(state => state.user);
  const originalAdmin = useAuthStore(state => state.originalAdmin);
  const setUser = useAuthStore(state => state.setUser);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const userRole = getUserRole(user);

  const queryClient = useQueryClient();
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [userAvatarFile, setUserAvatarFile] = useState(null);
  const [userAvatarPreview, setUserAvatarPreview] = useState(null);
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    description: '',
    is_open: true,
    image: null,
    whatsapp_number: ''
  });

  const { data: canteenData, isLoading: isLoadingCanteen } = useQuery({
    queryKey: ['canteen'],
    queryFn: async () => {
      const res = await api.get('/my-canteen');
      const canteen = res.data.data || res.data;
      setProfileData({
        name: canteen.name || '',
        description: canteen.description || '',
        is_open: canteen.is_open === 1 || canteen.is_open === true,
        image: canteen.image || null,
        whatsapp_number: canteen.whatsapp_number || ''
      });
      if (canteen.image) {
        setPreviewUrl(getStorageUrl(canteen.image));
      }
      return canteen;
    },
    enabled: userRole === ROLES.KANTIN,
    onError: () => {
      toast.error('Gagal mengambil data kantin. Pastikan Anda memiliki profil kantin.');
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: (data) => api.post('/me?_method=PUT', data),
    onSuccess: (res) => {
      setUser(res.data.user);
      setShowEditUserModal(false);
      setUserData(prev => ({ ...prev, password: '' }));
      toast.success('Profil berhasil diperbarui!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil');
    }
  });

  const handleSaveUser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (userData.name && userData.name !== user?.name) formData.append('name', userData.name);
    if (userData.email && userData.email !== user?.email) formData.append('email', userData.email);
    if (userData.password) formData.append('password', userData.password);
    if (userAvatarFile) formData.append('avatar', userAvatarFile);
    await updateUserMutation.mutateAsync(formData);
  };

  const updateProfileMutation = useMutation({
    mutationFn: (formData) => api.post('/my-canteen?_method=PUT', formData),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['canteen'] });
      const previousCanteen = queryClient.getQueryData(['canteen']);
      
      if (previousCanteen) {
        queryClient.setQueryData(['canteen'], {
          ...previousCanteen,
          ...newData
        });
      }
      return { previousCanteen };
    },
    onError: (err, newData, context) => {
      if (context?.previousCanteen) {
        queryClient.setQueryData(['canteen'], context.previousCanteen);
      }
      toast.error('Koneksi terputus. Gagal menyimpan profil.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['canteen'] });
    }
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    
    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('description', profileData.description);
    formData.append('is_open', profileData.is_open ? 1 : 0);
    if (profileData.whatsapp_number) {
      // Normalize: strip non-digits, convert 08xxx -> 628xxx
      let phone = profileData.whatsapp_number.replace(/\D/g, '');
      if (phone.startsWith('0')) phone = '62' + phone.substring(1);
      formData.append('whatsapp_number', phone);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    await updateProfileMutation.mutateAsync(formData);
    setIsSavingProfile(false);
    toast.success('Profil toko berhasil disimpan!');
    setShowStoreModal(false);
    setImageFile(null); // Reset image input
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const MenuItem = ({ icon: Icon, title, badge, badgeColor = 'bg-green-600', isLast, onClick, isRed = false }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between py-3 px-4 sm:py-4 sm:px-5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${!isLast ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <Icon className={`w-5 h-5 ${isRed ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`} strokeWidth={2.5} />
        <span className={`font-semibold text-sm sm:text-[15px] ${isRed ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'}`}>{title}</span>
        {badge && (
          <span className={`ml-2 px-2 py-0.5 rounded-full text-white text-[10px] sm:text-xs font-bold ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${isRed ? 'text-red-400' : 'text-gray-400'}`} />
    </button>
  );

  return (
    <div className="h-full bg-[#F5F6F8] dark:bg-gray-950 pb-20">
      {/* Green Header Area */}
      <div className="relative bg-[#C2EDC7] sm:bg-[#55C564] h-32 sm:h-44 rounded-b-[30px] sm:rounded-b-[40px] overflow-hidden shadow-sm bg-gradient-to-br from-[#9ee8a7] to-[#55C564] dark:from-green-600 dark:to-green-800">
        {/* Top Navbar */}
        <div className="flex items-center px-3 sm:px-4 pt-6 pb-2 sm:pt-8 z-10 relative">
          <button onClick={() => navigate({ to: '/dashboard' })} className="p-2 -ml-2 text-gray-900 dark:text-white hover:bg-black/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white ml-2">Profilku</h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 -mt-10 sm:-mt-16 relative z-10 max-w-lg mx-auto">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-5 sm:mb-6 flex items-center justify-between border border-gray-50 dark:border-gray-800">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#55C564] flex items-center justify-center text-white text-base sm:text-xl font-bold shrink-0 shadow-sm border-2 border-white dark:border-gray-800 overflow-hidden">
              {user?.avatar ? (
                <img src={getStorageUrl(user.avatar)} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">{user?.name || 'Pengguna Pondok'}</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email || 'email@pondok.com'}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{user?.phone || '+62 812-3456-7890'}</p>
            </div>
          </div>
          <button onClick={() => setShowEditUserModal(true)} className="p-2 sm:p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors group border border-gray-200 dark:border-gray-700">
            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-[#55C564] transition-colors" />
          </button>
        </div>

        {/* Preferensi Section */}
        <div className="mb-5 sm:mb-6 animate-fade-in-up">
          <h3 className="px-1 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">Preferensi</h3>
          <div className="bg-white dark:bg-gray-900 rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 dark:border-gray-800">
            {userRole === ROLES.KANTIN && (
              <MenuItem 
                icon={Store} 
                title="Profil Toko" 
                badge={canteenData?.is_open ? 'Buka' : 'Tutup'} 
                badgeColor={canteenData?.is_open ? 'bg-green-500' : 'bg-red-500'}
                onClick={() => setShowStoreModal(true)} 
              />
            )}
            <MenuItem icon={ShieldCheck} title="Keamanan akun" />
            <MenuItem icon={PlusCircle} title="Higo PLUS" badge="Promo terbatas 🔥" badgeColor="bg-green-500" />
            <MenuItem icon={CreditCard} title="Metode Pembayaran" />
            <MenuItem icon={Users} title="Keluarga Santri" badge="Baru" badgeColor="bg-green-700" />
            <MenuItem icon={Bookmark} title="Alamat tersimpan" isLast={true} />
          </div>
        </div>

        {/* Aktivitas Section */}
        <div className="mb-5 sm:mb-6 animate-fade-in-up delay-75">
          <h3 className="px-1 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">Aktivitas di Higo Pondok</h3>
          <div className="bg-white dark:bg-gray-900 rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 dark:border-gray-800">
            <MenuItem icon={Activity} title="Aktivitas" />
            <MenuItem icon={Ticket} title="Promo & voucher" />
            <MenuItem icon={Shield} title="Asuransiku" badge="Baru" badgeColor="bg-green-700" />
            <MenuItem icon={LogOut} title="Keluar / Logout" isLast={true} isRed={true} onClick={handleLogout} />
          </div>
        </div>

        </div>

      {/* Modal Manajemen Kantin */}
      {userRole === ROLES.KANTIN && showStoreModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pengaturan Profil Toko</h3>
              <button onClick={() => setShowStoreModal(false)} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {isLoadingCanteen ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto">
                <div className="h-28 sm:h-32 bg-gradient-to-r from-green-400 to-green-600 relative">
                  <div className="absolute -bottom-10 left-4 sm:left-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-900 flex items-center justify-center overflow-hidden shadow-md">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Store" className="w-full h-full object-cover" />
                        ) : (
                          <Store className="w-8 h-8 text-green-500" />
                        )}
                      </div>
                      <label htmlFor="upload-banner" className="absolute -bottom-1 -right-1 p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-colors cursor-pointer">
                        <Camera className="w-3 h-3" />
                      </label>
                      <input id="upload-banner" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-14 pb-5 px-4 sm:px-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Nama Kantin</label>
                      <input type="text" id="name" required value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Deskripsi Singkat</label>
                      <textarea id="description" rows="2" value={profileData.description} onChange={e => setProfileData({...profileData, description: e.target.value})} className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" />
                    </div>
                    <div>
                      <label htmlFor="is_open" className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Status Operasional</label>
                      <select id="is_open" value={profileData.is_open} onChange={e => setProfileData({...profileData, is_open: e.target.value === 'true'})} className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors">
                        <option value="true">Buka (Menerima Pesanan)</option>
                        <option value="false">Tutup / Istirahat</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="whatsapp_number" className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Nomor WhatsApp Toko</label>
                      <p className="text-[10px] text-gray-400 mb-1">Masukkan nomor HP format lokal (awalan 0) atau internasional (awalan 62). Otomatis dikonversi.</p>
                      <div className="mt-1 flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 focus-within:ring-2 focus-within:ring-green-500">
                        <span className="px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-700 shrink-0">+62 / 0</span>
                        <input 
                          type="tel" 
                          id="whatsapp_number" 
                          placeholder="812-3456-7890"
                          value={profileData.whatsapp_number} 
                          onChange={e => setProfileData({...profileData, whatsapp_number: e.target.value})} 
                          className="flex-1 py-2 px-3 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowStoreModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700">
                    Batal
                  </button>
                  <button type="submit" disabled={isSavingProfile} className="inline-flex items-center justify-center px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-70">
                    {isSavingProfile ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span> : <Save className="w-4 h-4 mr-2" />}
                    Simpan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Profil Pribadi</h3>
              <button onClick={() => setShowEditUserModal(false)} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveUser} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#55C564] flex items-center justify-center text-white text-3xl font-bold shadow-sm overflow-hidden border-4 border-gray-50 dark:border-gray-800">
                    {userAvatarPreview ? (
                      <img src={userAvatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : user?.avatar ? (
                      <img src={getStorageUrl(user.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user?.name)
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full cursor-pointer hover:bg-green-700 shadow-md transition-colors">
                    <Camera className="w-4 h-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      if (e.target.files[0]) {
                        setUserAvatarFile(e.target.files[0]);
                        setUserAvatarPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                <input required type="text" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input required type="email" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password Baru (Opsional)</label>
                <input type="password" placeholder="Kosongkan jika tak ingin diubah" value={userData.password} onChange={e => setUserData({...userData, password: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow" />
              </div>

              <div className="pt-6 mt-2 flex gap-3">
                <button type="button" onClick={() => setShowEditUserModal(false)} className="flex-1 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={updateUserMutation.isPending} className="flex-[2] py-3 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-70 flex items-center justify-center shadow-md transition-colors">
                  {updateUserMutation.isPending ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Simpan Profil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
