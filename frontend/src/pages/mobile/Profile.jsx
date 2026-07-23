import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Edit2, ShieldCheck, PlusCircle, CreditCard, Users, Bookmark, Activity, Ticket, Shield, LogOut, ChevronRight, Store, Camera, Save, X, Plus } from 'lucide-react';
import { ROLES, getUserRole } from '../../config/roles';
import { useAuthStore } from '../../store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api, { getStorageUrl } from '../../lib/axios';
import santriData from '../../data/santri.json';

const uniqueJenjang = [...new Set(santriData.data.filter(r => r.length > 5 && r[4]).map(r => r[4]))].sort();
const uniqueAsrama = [...new Set(santriData.data.filter(r => r.length > 10 && r[10]).map(r => r[10]))].sort();

export default function Profile() {
  const user = useAuthStore(state => state.user);
  const originalAdmin = useAuthStore(state => state.originalAdmin);
  const setUser = useAuthStore(state => state.setUser);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const userRole = getUserRole(user);

  const queryClient = useQueryClient();
  const [filterGender, setFilterGender] = useState('');
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showKeluargaModal, setShowKeluargaModal] = useState(false);
  const [userAvatarFile, setUserAvatarFile] = useState(null);
  const [userAvatarPreview, setUserAvatarPreview] = useState(null);
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    santri_name: user?.santri_name || '',
    santri_room: user?.santri_room || '',
    santri_class: user?.santri_class || '',
    santri_level: user?.santri_level || ''
  });
  
  // Store Management States
  const [showStoreListModal, setShowStoreListModal] = useState(false);
  const [showEditStoreModal, setShowEditStoreModal] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [selectedCanteenId, setSelectedCanteenId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // State for Editing
  const [profileData, setProfileData] = useState({
    name: '',
    description: '',
    is_open: true,
    image: null,
    whatsapp_number: '',
    delivery_fee: 0
  });

  // State for Adding
  const [newStoreData, setNewStoreData] = useState({
    name: '',
    description: ''
  });

  const availableKelas = React.useMemo(() => {
    if (!userData.santri_level) {
      return [...new Set(santriData.data.filter(r => r.length > 5 && r[5]).map(r => r[5]))].sort();
    }
    return [...new Set(santriData.data.filter(r => r.length > 5 && r[4] === userData.santri_level && r[5]).map(r => r[5]))].sort();
  }, [userData.santri_level]);

  const filteredSantris = React.useMemo(() => {
    return santriData.data.filter(row => {
      if (row.length < 6) return false;
      const nameCol = row[1] || '';
      const jenjang = row[4] || '';
      const kelas = row[5] || '';
      
      let matchJenjang = userData.santri_level ? jenjang === userData.santri_level : true;
      let matchKelas = userData.santri_class ? kelas === userData.santri_class : true;
      let matchGender = true;
      if (filterGender) {
        matchGender = nameCol.endsWith(filterGender);
      }
      return matchJenjang && matchKelas && matchGender;
    });
  }, [userData.santri_level, userData.santri_class, filterGender]);

  // Fetch multiple canteens
  const { data: canteens = [], isLoading: isLoadingCanteens } = useQuery({
    queryKey: ['canteens'],
    queryFn: async () => {
      const res = await api.get('/my-canteens');
      return res.data.data || res.data;
    },
    enabled: userRole === ROLES.KANTIN,
    onError: () => {
      toast.error('Gagal mengambil daftar kantin.');
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: (data) => api.post('/me?_method=PUT', data),
    onSuccess: (res) => {
      setUser(res.data.user);
      setShowEditUserModal(false);
      setShowKeluargaModal(false);
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
    if (userData.santri_name !== user?.santri_name) formData.append('santri_name', userData.santri_name);
    if (userData.santri_room !== user?.santri_room) formData.append('santri_room', userData.santri_room);
    if (userData.santri_class !== user?.santri_class) formData.append('santri_class', userData.santri_class);
    if (userData.santri_level !== user?.santri_level) formData.append('santri_level', userData.santri_level);
    if (userAvatarFile) formData.append('avatar', userAvatarFile);
    await updateUserMutation.mutateAsync(formData);
  };

  // Add Store Mutation
  const addStoreMutation = useMutation({
    mutationFn: (data) => api.post('/my-canteens', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canteens'] });
      toast.success('Toko baru berhasil dibuat!');
      setShowAddStoreModal(false);
      setNewStoreData({ name: '', description: '' });
      setShowStoreListModal(true);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal membuat toko');
    }
  });

  // Update Store Mutation
  const updateProfileMutation = useMutation({
    mutationFn: ({ id, formData }) => api.post(`/my-canteen?_method=PUT&canteen_id=${id}`, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canteens'] });
      toast.success('Profil toko berhasil disimpan!');
      setShowEditStoreModal(false);
      setImageFile(null);
      setShowStoreListModal(true);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal menyimpan profil.');
    }
  });

  const handleAddStore = async (e) => {
    e.preventDefault();
    addStoreMutation.mutate(newStoreData);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!selectedCanteenId) return;

    setIsSavingProfile(true);
    
    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('description', profileData.description || '');
    formData.append('is_open', profileData.is_open ? 1 : 0);
    formData.append('delivery_fee', profileData.delivery_fee);
    if (profileData.whatsapp_number) {
      let phone = profileData.whatsapp_number.replace(/\D/g, '');
      if (phone.startsWith('0')) phone = '62' + phone.substring(1);
      formData.append('whatsapp_number', phone);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    await updateProfileMutation.mutateAsync({ id: selectedCanteenId, formData });
    setIsSavingProfile(false);
  };

  const openEditStore = (canteen) => {
    setSelectedCanteenId(canteen.id);
    setProfileData({
      name: canteen.name || '',
      description: canteen.description || '',
      is_open: canteen.is_open === 1 || canteen.is_open === true,
      image: canteen.image || null,
      whatsapp_number: canteen.whatsapp_number || '',
      delivery_fee: canteen.delivery_fee || 0
    });
    setPreviewUrl(canteen.image ? getStorageUrl(canteen.image) : null);
    setImageFile(null);
    setShowStoreListModal(false);
    setShowEditStoreModal(true);
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
              <>
                <MenuItem 
                  icon={Store} 
                  title="Kelola Toko Saya" 
                  badge={canteens.length > 0 ? `${canteens.length} Toko` : null} 
                  badgeColor="bg-green-600"
                  onClick={() => setShowStoreListModal(true)} 
                />
                <MenuItem 
                  icon={Ticket} 
                  title="Pengajuan Promo Toko" 
                  onClick={() => navigate({ to: '/dashboard/toko-saya/promo' })} 
                  isLast={true}
                />
              </>
            )}
          </div>
        </div>

        {/* Aktivitas Section */}
        <div className="mb-5 sm:mb-6 animate-fade-in-up delay-75">
          <h3 className="px-1 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">Aktivitas di Higo Pondok</h3>
          <div className="bg-white dark:bg-gray-900 rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 dark:border-gray-800">
            <MenuItem icon={Activity} title="Aktivitas" onClick={() => navigate({ to: '/dashboard/pembayaran' })} />
            <MenuItem icon={LogOut} title="Keluar / Logout" isLast={true} isRed={true} onClick={handleLogout} />
          </div>
        </div>

        </div>

      {/* Modal Daftar Toko (Multi-Store) */}
      {userRole === ROLES.KANTIN && showStoreListModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Kelola Toko Saya</h3>
              <button onClick={() => setShowStoreListModal(false)} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoadingCanteens ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : canteens.length === 0 ? (
                <div className="text-center py-8">
                  <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Anda belum memiliki toko.</p>
                </div>
              ) : (
                canteens.map(c => (
                  <div key={c.id} onClick={() => openEditStore(c)} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center overflow-hidden shrink-0">
                        {c.image ? (
                          <img src={getStorageUrl(c.image)} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <Store className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{c.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {c.status === 'pending' ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Menunggu Review</span>
                          ) : c.status === 'rejected' ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700">Ditolak</span>
                          ) : c.is_open ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">Buka</span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">Tutup</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
              <button 
                onClick={() => {
                  setShowStoreListModal(false);
                  setShowAddStoreModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 font-semibold rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors border border-green-200 dark:border-green-800/50"
              >
                <Plus className="w-5 h-5" />
                Tambah Toko Baru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Toko Baru */}
      {showAddStoreModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  setShowAddStoreModal(false);
                  setShowStoreListModal(true);
                }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tambah Toko Baru</h3>
              </div>
            </div>
            <form onSubmit={handleAddStore} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Toko/Kantin</label>
                <input required type="text" value={newStoreData.name} onChange={e => setNewStoreData({...newStoreData, name: e.target.value})} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2.5 px-3 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500" placeholder="Misal: Kantin Barokah 2" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Deskripsi Singkat</label>
                <textarea rows="3" value={newStoreData.description} onChange={e => setNewStoreData({...newStoreData, description: e.target.value})} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2.5 px-3 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500" placeholder="Menjual berbagai makanan..."></textarea>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg flex gap-3">
                <ShieldCheck className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800 dark:text-yellow-500">Toko baru memerlukan persetujuan Admin sebelum bisa berjualan. Anda dapat melengkapi profil (foto, dll) setelah menambahkan toko ini.</p>
              </div>
              <button type="submit" disabled={addStoreMutation.isPending} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex justify-center shadow-md">
                {addStoreMutation.isPending ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Tambah Toko'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Kantin */}
      {userRole === ROLES.KANTIN && showEditStoreModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  setShowEditStoreModal(false);
                  setShowStoreListModal(true);
                }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pengaturan Profil Toko</h3>
              </div>
            </div>
            
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
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="whatsapp_number" className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Nomor WhatsApp Toko</label>
                    <p className="text-[10px] text-gray-400 mb-1">Masukkan nomor HP format lokal (awalan 0) atau internasional (awalan 62).</p>
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
                  <div>
                    <label htmlFor="delivery_fee" className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Ongkos Kirim Default</label>
                    <p className="text-[10px] text-gray-400 mb-1">Biaya pengiriman standar untuk setiap pesanan.</p>
                    <div className="mt-1 flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 focus-within:ring-2 focus-within:ring-green-500">
                      <span className="px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-700 shrink-0">Rp</span>
                      <input 
                        type="number" 
                        id="delivery_fee" 
                        placeholder="5000"
                        min="0"
                        value={profileData.delivery_fee} 
                        onChange={e => setProfileData({...profileData, delivery_fee: e.target.value})} 
                        className="flex-1 py-2 px-3 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 mt-4">
                <button type="submit" disabled={isSavingProfile} className="w-full inline-flex items-center justify-center px-5 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-70">
                  {isSavingProfile ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span> : <Save className="w-4 h-4 mr-2" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
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
              
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
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

      {/* Modal Keluarga Santri */}
      {showKeluargaModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Keluarga Santri</h3>
              <button onClick={() => setShowKeluargaModal(false)} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveUser} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Data Santri (Wajib diisi sebelum memesan)</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pastikan nama dan lokasi kamar santri valid agar pengiriman makanan berjalan lancar.</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Jenjang</label>
                    <select 
                      value={userData.santri_level} 
                      onChange={e => {
                        setUserData({
                          ...userData, 
                          santri_level: e.target.value,
                          santri_class: '',
                          santri_name: '',
                          santri_room: ''
                        });
                      }} 
                      className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow"
                    >
                      <option value="">Semua Jenjang</option>
                      {uniqueJenjang.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Kelas</label>
                    <select 
                      value={userData.santri_class} 
                      onChange={e => {
                        setUserData({
                          ...userData, 
                          santri_class: e.target.value,
                          santri_name: '',
                          santri_room: ''
                        });
                      }} 
                      className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow"
                    >
                      <option value="">Semua Kelas</option>
                      {availableKelas.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Jenis Kelamin</label>
                  <select 
                    value={filterGender} 
                    onChange={e => {
                      setFilterGender(e.target.value);
                      setUserData({...userData, santri_name: '', santri_room: ''});
                    }} 
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow"
                  >
                    <option value="">Semua</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Santri</label>
                  <select 
                    value={userData.santri_name} 
                    onChange={e => {
                       const selectedName = e.target.value;
                       const row = filteredSantris.find(r => r[1] && r[1].replace(' Laki-laki', '').replace(' Perempuan', '') === selectedName);
                       setUserData({
                         ...userData, 
                         santri_name: selectedName,
                         santri_room: row && row[10] ? row[10] : userData.santri_room
                       });
                    }} 
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow">
                    <option value="">-- Pilih Santri --</option>
                    {filteredSantris.map((row, i) => {
                       const rawName = row[1] || '';
                       const cleanName = rawName.replace(' Laki-laki', '').replace(' Perempuan', '');
                       return <option key={i} value={cleanName}>{cleanName}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Asrama / Kamar</label>
                  <select 
                    value={userData.santri_room} 
                    onChange={e => setUserData({...userData, santri_room: e.target.value})} 
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow"
                  >
                    <option value="">-- Pilih Asrama / Kamar --</option>
                    {uniqueAsrama.map(a => <option key={a} value={a}>{a}</option>)}
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 mt-2 flex gap-3">
                <button type="button" onClick={() => setShowKeluargaModal(false)} className="flex-1 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={updateUserMutation.isPending} className="flex-[2] py-3 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-70 flex items-center justify-center shadow-md transition-colors">
                  {updateUserMutation.isPending ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Simpan Data Santri'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
