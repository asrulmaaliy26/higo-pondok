import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Edit2, ShieldCheck, PlusCircle, CreditCard, Users, Bookmark, Activity, Ticket, Shield, LogOut, ChevronRight, Store, Camera, Save, X, Plus, BookOpen } from 'lucide-react';
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
    phone: user?.phone || '',
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
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [selectedCanteenId, setSelectedCanteenId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // State for Editing
  const [profileData, setProfileData] = useState({
    name: '',
    description: '',
    open_time: '09:00',
    close_time: '17:00',
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
    if (userData.phone !== user?.phone) {
      let p = userData.phone.replace(/\D/g, '');
      if (p.startsWith('0')) p = '62' + p.substring(1);
      formData.append('phone', p);
    }
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
    const category = profileData.category || 'kauman';
    const autoDeliveryFee = category === 'kota' ? 3500 : 2000;
    
    formData.append('open_time', profileData.open_time);
    formData.append('close_time', profileData.close_time);
    formData.append('delivery_fee', autoDeliveryFee);
    formData.append('category', category);
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
      category: canteen.category || 'kauman',
      description: canteen.description || '',
      open_time: canteen.open_time?.substring(0,5) || '09:00',
      close_time: canteen.close_time?.substring(0,5) || '17:00',
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
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{user?.phone ? `+${user.phone}` : 'Belum ada No. WhatsApp'}</p>
            </div>
          </div>
          <button onClick={() => setShowEditUserModal(true)} className="p-2 sm:p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors group border border-gray-200 dark:border-gray-700">
            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-[#55C564] transition-colors" />
          </button>
        </div>

        {/* Banner Jika Kantin Belum Memiliki Toko */}
        {userRole === ROLES.KANTIN && !isLoadingCanteens && canteens.length === 0 && (
          <div className="mb-5 sm:mb-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:bg-gray-900 border-2 border-dashed border-green-300 dark:border-green-800 rounded-[20px] p-5 text-center space-y-3 shadow-sm animate-in fade-in duration-200">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Anda Belum Memiliki Toko / Kantin</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Daftarkan toko/kantin Anda sekarang untuk mulai mengunggah produk dan menerima pesanan dari santri.
              </p>
            </div>
            <button
              onClick={() => setShowAddStoreModal(true)}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-1.5"
            >
              ＋ Buat Toko Baru Sekarang
            </button>
          </div>
        )}

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
            {userRole === ROLES.USER && (
              <MenuItem 
                icon={Users} 
                title="Keluarga Santri" 
                badge={user?.santri_name ? 'Terisi' : 'Belum Lengkap'}
                badgeColor={user?.santri_name ? 'bg-green-500' : 'bg-amber-500'}
                onClick={() => setShowKeluargaModal(true)} 
                isLast={true}
              />
            )}
          </div>
        </div>

        {/* Aktivitas Section */}
        <div className="mb-5 sm:mb-6 animate-fade-in-up delay-75">
          <h3 className="px-1 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">Aktivitas di Higo Pondok</h3>
          <div className="bg-white dark:bg-gray-900 rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 dark:border-gray-800">
            <MenuItem icon={Activity} title="Alur Kerja Saya" onClick={() => setShowWorkflowModal(true)} />
            <MenuItem icon={CreditCard} title="Aktivitas Pembayaran" onClick={() => navigate({ to: '/dashboard/pembayaran' })} />
            <MenuItem icon={BookOpen} title="Buku Panduan & SOP" onClick={() => navigate({ to: '/dashboard/panduan' })} />
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="open_time" className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Jam Buka</label>
                      <input type="time" id="open_time" required value={profileData.open_time} onChange={e => setProfileData({...profileData, open_time: e.target.value})} className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" />
                    </div>
                    <div>
                      <label htmlFor="close_time" className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Jam Tutup</label>
                      <input type="time" id="close_time" required value={profileData.close_time} onChange={e => setProfileData({...profileData, close_time: e.target.value})} className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" />
                    </div>
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
                    <label htmlFor="category" className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Kategori Toko / Zona Lokasi</label>
                    <p className="text-[10px] text-gray-400 mb-1">Menentukan tarif dasar ongkir & admin otomatis.</p>
                    <select
                      id="category"
                      value={profileData.category || 'kauman'}
                      onChange={e => setProfileData({
                        ...profileData, 
                        category: e.target.value,
                        delivery_fee: e.target.value === 'kota' ? 3500 : 2000
                      })}
                      className="w-full mt-1 p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 font-medium"
                    >
                      <option value="kauman">Kauman (Ongkir Rp 2.000, Admin Rp 1.000)</option>
                      <option value="kota">Kota (Ongkir Rp 3.500, Admin Rp 1.500)</option>
                    </select>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-lg border border-gray-200 dark:border-gray-700/60 space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Rincian Tarif Kirim Standar</label>
                    <div className="flex items-center gap-2 text-xs font-bold pt-1">
                      <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-md">
                        🛵 Ongkir Dasar: Rp {(profileData.category === 'kota' ? 3500 : 2000).toLocaleString('id-ID')}
                      </span>
                      <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-md">
                        🛡️ Biaya Admin: Rp {(profileData.category === 'kota' ? 1500 : 1000).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      *Tarif di atas berlaku otomatis sesuai kategori lokasi toko yang Anda pilih.
                    </p>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor WhatsApp</label>
                <input required type="tel" placeholder="Contoh: 08123456789" value={userData.phone} onChange={e => setUserData({...userData, phone: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow" />
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
                         santri_level: row && row[4] ? row[4] : userData.santri_level,
                         santri_class: row && row[5] ? row[5] : userData.santri_class,
                         santri_room: row && row[10] ? row[10] : userData.santri_room
                       });
                    }} 
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow">
                    <option value="">-- Pilih Santri --</option>
                    {filteredSantris.map((row, i) => {
                       const rawName = row[1] || '';
                       const cleanName = rawName.replace(' Laki-laki', '').replace(' Perempuan', '');
                       const jenjang = row[4] || '';
                       const kelas = row[5] || '';
                       const info = [jenjang, kelas].filter(Boolean).join(' - ');
                       const label = info ? `${cleanName} (${info})` : cleanName;
                       return <option key={i} value={cleanName}>{label}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Asrama / Kamar (Isian Bebas)</label>
                  <input 
                    type="text"
                    placeholder="Ketik lokasi asrama / kamar santri..."
                    value={userData.santri_room} 
                    onChange={e => setUserData({...userData, santri_room: e.target.value})} 
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">No. WhatsApp / HP Pembeli (Wali Santri)</label>
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 focus-within:ring-2 focus-within:ring-green-500">
                    <input 
                      type="text"
                      placeholder="812-3456-7890"
                      value={userData.phone} 
                      onChange={e => setUserData({...userData, phone: e.target.value})} 
                      className="flex-1 py-2.5 px-3 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Nomor ini digunakan toko & kurir untuk mengonfirmasi pesanan Anda.</p>
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
      {/* Modal Alur Kerja */}
      {showWorkflowModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Alur Kerja Saya</h3>
              <button onClick={() => setShowWorkflowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {userRole === ROLES.KURIR && (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-300 before:to-transparent">
                  <h4 className="text-center font-bold text-blue-600 mb-6">Kurir (Driver)</h4>
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      1
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <h4 className="font-bold text-gray-900 text-sm">Aktifkan Status Bekerja</h4>
                      <p className="text-[10px] font-semibold text-blue-600 mb-1 mt-1">📍 Navigasi: Beranda → Switch "Status Bekerja"</p>
                      <p className="text-xs text-gray-500">Anda wajib menyalakan toggle "Status Bekerja" menjadi ON agar penyedia menu dapat melihat dan memilih Anda.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      2
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <h4 className="font-bold text-gray-900 text-sm">Ambil Pesanan di Toko Luar</h4>
                      <p className="text-[10px] font-semibold text-blue-600 mb-1 mt-1">📍 Navigasi: Menu Bawah → Ikon Motor (Tugas)</p>
                      <p className="text-xs text-gray-500">Lihat detail pesanan di tab "Tugas". Pergilah ke toko/warung luar untuk mengambil makanan (Kantin di aplikasi hanya menyediakan menu). Jika ditalangi tunai, klik tombol "Upload Struk".</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      3
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <h4 className="font-bold text-gray-900 text-sm">Antar ke Lokasi & Foto</h4>
                      <p className="text-[10px] font-semibold text-blue-600 mb-1 mt-1">📍 Navigasi: Halaman Tugas → Upload Bukti Pengantaran</p>
                      <p className="text-xs text-gray-500">Antar makanan ke kamar/kelas santri. Lalu ambil foto serah terima sebagai bukti bahwa tugas selesai diantar.</p>
                    </div>
                  </div>
                </div>
              )}

              {userRole === ROLES.KANTIN && (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-green-300 before:to-transparent">
                  <h4 className="text-center font-bold text-green-600 mb-6">Toko / Kantin</h4>
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      1
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <h4 className="font-bold text-gray-900 text-sm">Buat & Kelola Toko</h4>
                      <p className="text-[10px] font-semibold text-green-600 mb-1 mt-1">📍 Navigasi: Profil → Kelola Toko Saya</p>
                      <p className="text-xs text-gray-500">Buat toko baru (klik Tambah Toko). Setelah selesai, pilih toko tersebut untuk mulai mengelola jam buka, menu makanan, dan melihat analitik harian Anda.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      2
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <h4 className="font-bold text-gray-900 text-sm">Terima Pesanan</h4>
                      <p className="text-[10px] font-semibold text-green-600 mb-1 mt-1">📍 Navigasi: Menu Bawah → Ikon Pesanan</p>
                      <p className="text-xs text-gray-500">Pantau daftar pesanan baru. Jika stok habis, klik tombol merah "Tolak". Jika pesanan disetujui, siapkan makanannya.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      3
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <h4 className="font-bold text-gray-900 text-sm">Pilih Kurir</h4>
                      <p className="text-[10px] font-semibold text-green-600 mb-1 mt-1">📍 Navigasi: Halaman Pesanan → Tombol Biru "Pilih Kurir"</p>
                      <p className="text-xs text-gray-500">Klik tombol "Pilih Kurir", lalu pilih kurir yang berstatus aktif/bekerja untuk menugaskannya mengantar pesanan ke santri.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      4
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <h4 className="font-bold text-gray-900 text-sm">Tandai Lunas & Selesai</h4>
                      <p className="text-[10px] font-semibold text-green-600 mb-1 mt-1">📍 Navigasi: Halaman Pesanan → Tombol Hijau "Lunas & Selesai"</p>
                      <p className="text-xs text-gray-500">Setelah foto bukti kurir terupload di pesanan, verifikasi, lalu klik "Lunas & Selesai". Saldo Anda akan otomatis bertambah!</p>
                    </div>
                  </div>
                </div>
              )}

              {userRole === ROLES.USER && (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-orange-300 before:to-transparent">
                  <h4 className="text-center font-bold text-orange-600 mb-6">Wali Santri (Pembeli)</h4>
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-orange-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      1
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <h4 className="font-bold text-gray-900 text-sm">Pilih Makanan</h4>
                      <p className="text-[10px] font-semibold text-orange-600 mb-1 mt-1">📍 Navigasi: Beranda → Pilih Kantin/Toko → Klik '+' pada Menu</p>
                      <p className="text-xs text-gray-500">Pilih menu dari toko yang berstatus Buka (Hijau). Cek juga menu "Pesanan Khusus" jika ada titipan khusus di luar menu.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-orange-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      2
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <h4 className="font-bold text-gray-900 text-sm">Checkout & Transfer</h4>
                      <p className="text-[10px] font-semibold text-orange-600 mb-1 mt-1">📍 Navigasi: Ikon Keranjang (Kanan Atas) → Checkout</p>
                      <p className="text-xs text-gray-500">Selesaikan pesanan Anda, lalu unggah bukti transfer pembayaran di halaman Profil → Aktivitas Pembayaran.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-orange-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      3
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <h4 className="font-bold text-gray-900 text-sm">Tunggu Pengantaran</h4>
                      <p className="text-[10px] font-semibold text-orange-600 mb-1 mt-1">📍 Navigasi: Halaman Pembayaran → Status Order</p>
                      <p className="text-xs text-gray-500">Pantau status pesanan. Kurir akan mengantarkan pesanan ke santri. Anda bisa melihat foto bukti serah terima jika pesanan sudah selesai.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
