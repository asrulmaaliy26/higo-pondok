import React, { useState } from 'react';
import { Store, Save, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, Star, Clock, CheckCircle2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import toast from 'react-hot-toast';
import api, { getStorageUrl } from '../../lib/axios';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { ProductFormModal } from '../../components/modals/ProductFormModal';

export default function TokoSaya() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  // Product Form State (handled mostly in modal now, keeping simple state for toggling)
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Queries
  const { data: canteen, isLoading: isLoadingCanteen } = useQuery({
    queryKey: ['canteen'],
    queryFn: async () => {
      const res = await api.get('/my-canteen');
      return res.data.data || res.data;
    }
  });

  const { data: productsRes, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', page],
    queryFn: async () => {
      const res = await api.get(`/my-products?page=${page}`);
      return res.data;
    },
    keepPreviousData: true
  });

  const products = productsRes?.data || [];
  const pagination = productsRes ? (productsRes.meta ? {
    current_page: productsRes.meta.current_page,
    last_page: productsRes.meta.last_page,
    total: productsRes.meta.total,
  } : {
    current_page: productsRes.current_page,
    last_page: productsRes.last_page,
    total: productsRes.total,
  }) : null;

  // Mutations
  const openAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const toggleOpenMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put('/my-canteen/status');
      return res.data;
    },
    onSuccess: (data) => {
      // Optimistically update the cache
      queryClient.setQueryData(['canteen'], data.canteen);
      
      queryClient.invalidateQueries({ queryKey: ['canteen'] });
      queryClient.invalidateQueries({ queryKey: ['admin-canteens'] });
      toast.success('Status Kantin berhasil diubah');
    },
    onError: () => {
      toast.error('Gagal mengubah status kantin');
    }
  });

  const saveProductMutation = useMutation({
    mutationFn: (formDataPayload) => {
      if (editingProduct) {
        formDataPayload.append('_method', 'PUT');
        return api.post(`/my-products/${editingProduct.id}`, formDataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      return api.post('/my-products', formDataPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['products', page] });
      const previousProductsRes = queryClient.getQueryData(['products', page]);
      return { previousProductsRes };
    },
    onError: (err, payload, context) => {
      if (context?.previousProductsRes) {
        queryClient.setQueryData(['products', page], context.previousProductsRes);
      }
      toast.error('Koneksi terputus. Gagal menyimpan produk.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onSuccess: () => {
      if (!editingProduct) setShowProductModal(false);
      toast.success(editingProduct ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!');
    }
  });

  const handleSaveProduct = async (data, file) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('price', parseFloat(data.price));
    formData.append('stock', parseInt(data.stock, 10));
    formData.append('is_available', data.is_available ? 1 : 0);
    
    if (file) {
      formData.append('image', file);
    }
    
    await saveProductMutation.mutateAsync(formData);
  };

  const deleteProductMutation = useMutation({
    mutationFn: (id) => api.delete(`/my-products/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['products', page] });
      const previousProductsRes = queryClient.getQueryData(['products', page]);
      
      if (previousProductsRes?.data) {
        queryClient.setQueryData(['products', page], {
          ...previousProductsRes,
          data: previousProductsRes.data.filter(product => product.id !== id)
        });
      }
      
      return { previousProductsRes };
    },
    onError: (err, id, context) => {
      if (context?.previousProductsRes) {
        queryClient.setQueryData(['products', page], context.previousProductsRes);
      }
      toast.error('Koneksi terputus. Gagal menghapus produk.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onSuccess: () => {
      toast.success('Produk berhasil dihapus!');
    }
  });

  const handleDeleteProduct = (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    deleteProductMutation.mutate(id);
  };

  if (isLoadingCanteen || (isLoadingProducts && !productsRes)) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;
  }

  return (
    <div className="bg-gray-50 h-full pb-24 dark:bg-gray-950 font-sans relative">
      {/* HEADER BANNER */}
      <div className="relative h-48 sm:h-56 bg-gray-200 dark:bg-gray-800">
        {canteen?.image ? (
          <img src={getStorageUrl(canteen.image)} alt="Banner Toko" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-r from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-900">
            <Store className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-medium text-green-800/50 dark:text-green-200/50">Belum ada foto banner</span>
          </div>
        )}
        
        {/* Top Navbar overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent lg:hidden">
          <button onClick={() => window.location.href = '/dashboard'} className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white backdrop-blur-sm transition-colors hover:bg-black/50">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* STORE INFO CARD (Overlapping banner) */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto -mt-12 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 md:p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {canteen?.name || 'Toko Saya'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 pr-2">
                {canteen?.description || 'Belum ada deskripsi.'}
              </p>

              <div className="flex items-center gap-3 mt-3">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${canteen?.is_open ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {canteen?.is_open ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {canteen?.is_open ? 'Toko Buka' : 'Toko Tutup'}
                </span>
                <button 
                  onClick={() => toggleOpenMutation.mutate()}
                  disabled={toggleOpenMutation.isPending}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    canteen?.is_open 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400' 
                    : 'text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                  }`}
                >
                  {toggleOpenMutation.isPending ? '...' : canteen?.is_open ? 'Tutup Toko' : 'Buka Toko'}
                </button>
                <button 
                  onClick={() => window.location.href = '/dashboard/toko-saya/pesanan'}
                  className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  Pesanan Masuk
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center font-medium">
              <span className="text-yellow-400 mr-1">★</span>
              4.9 <span className="text-gray-400 ml-1 font-normal">(99+ Penilaian)</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1 text-gray-400">⏱</span>
              ± 15 Menit
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-4 bg-white dark:bg-gray-900 sticky top-0 z-20 border-b border-gray-100 dark:border-gray-800">
        <div className="flex overflow-x-auto hide-scrollbar px-2">
          {['Semua Menu', 'Paling Laris'].map(tab => (
            <button 
              key={tab}
              onClick={() => {}}
              className={`px-4 py-3 whitespace-nowrap text-sm font-semibold border-b-2 transition-colors ${
                tab === 'Semua Menu'
                  ? 'border-green-600 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="mt-4 px-4 md:px-8 max-w-7xl mx-auto">
        {isLoadingProducts && !productsRes ? (
          <div className="space-y-5 bg-white dark:bg-gray-900 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-gray-800">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 text-gray-500 flex flex-col items-center">
            <Store className="w-12 h-12 mb-3 opacity-20" />
            <p>Belum ada menu yang ditambahkan.</p>
          </div>
        ) : (
          <div className="space-y-5 bg-white dark:bg-gray-900 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-gray-800">
            {products.map((product) => (
              <div key={product.id} className="flex gap-4 group relative border-b border-gray-50 dark:border-gray-800/50 pb-5">
                {/* Product Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-800 overflow-hidden relative">
                   {product.image ? (
                     <img src={getStorageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                   ) : (
                     <Store className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                   )}
                   {!product.is_available && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                       <span className="text-white text-[10px] font-bold px-2 py-1 bg-black/60 rounded">HABIS</span>
                     </div>
                   )}
                </div>
                
                {/* Product Details */}
                <div className="flex-1 min-w-0 py-1 flex flex-col">
                  <h3 className={`text-base font-semibold truncate ${!product.is_available ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500 line-clamp-1">{product.category || 'Kategori Umum'}</p>
                    <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
                      Sisa: {product.stock}
                    </span>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className={`font-bold text-sm sm:text-base ${!product.is_available ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        Rp {parseFloat(product.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Management Actions */}
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => openEditProduct(product)} className="flex-1 py-1.5 px-3 bg-gray-100 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 text-xs font-medium rounded-md transition-colors flex items-center justify-center">
                      <Edit2 className="w-3 h-3 mr-1" /> Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="py-1.5 px-3 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 text-xs font-medium rounded-md transition-colors flex items-center justify-center">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pagination Controls */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex justify-center items-center gap-4 pt-4 pb-2">
                <button onClick={() => setPage(old => Math.max(old - 1, 1))} disabled={page === 1} className="p-2 rounded-full border border-gray-200 dark:border-gray-700 disabled:opacity-30">
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {page} / {pagination.last_page}
                </span>
                <button onClick={() => setPage(old => (!productsRes || old === pagination.last_page ? old : old + 1))} disabled={page === pagination.last_page} className="p-2 rounded-full border border-gray-200 dark:border-gray-700 disabled:opacity-30">
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FLOATING ACTION BUTTON (Add Product) */}
      <button 
        onClick={openAddProduct}
        className="fixed bottom-20 lg:bottom-10 right-4 lg:right-10 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(234,88,12,0.4)] transition-transform hover:scale-105 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Product Modal */}
      <ProductFormModal 
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        editingProduct={editingProduct}
        onSave={handleSaveProduct}
        isPending={saveProductMutation.isPending}
      />
    </div>
  );
}
