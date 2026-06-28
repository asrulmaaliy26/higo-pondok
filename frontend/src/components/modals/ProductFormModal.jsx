import React, { useState, useEffect } from 'react';
import { X, Store } from 'lucide-react';

export const ProductFormModal = ({
  isOpen,
  onClose,
  editingProduct,
  onSave,
  isPending
}) => {
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    is_available: true
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Sync props when modal opens or editing product changes
  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        setProductData({
          name: editingProduct.name,
          category: editingProduct.category || '',
          price: editingProduct.price.toString(),
          stock: editingProduct.stock.toString(),
          is_available: editingProduct.is_available
        });
        setImagePreview(editingProduct.image ? `http://localhost:8000/storage/${editingProduct.image}` : null); // We should use getStorageUrl here, but since it's hard to pass, we'll pass it or import it.
      } else {
        setProductData({ name: '', category: '', price: '', stock: '', is_available: true });
        setImagePreview(null);
        setImageFile(null);
      }
    }
  }, [isOpen, editingProduct]);

  // Use a helper function for the image URL formatting if editingProduct has an image
  useEffect(() => {
    if (isOpen && editingProduct?.image) {
      // Basic formatting, but passing a helper from parent is better or using import
      setImagePreview(`http://localhost:8000/storage/${editingProduct.image}`);
    }
  }, [isOpen, editingProduct]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(productData, imageFile);
  };

  const handleNumericInput = (e, field) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setProductData({ ...productData, [field]: value });
  };

  const formatRupiah = (value) => {
    if (!value) return '';
    return 'Rp ' + parseInt(value, 10).toLocaleString('id-ID');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {editingProduct ? 'Edit Menu' : 'Tambah Menu Baru'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foto Produk</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900/30 dark:file:text-green-400" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Produk</label>
            <input required type="text" placeholder="Misal: Nasi Ayam Geprek" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
            <input type="text" placeholder="Cth: Makanan, Minuman, Snack" value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Harga</label>
              <input 
                required 
                type="text" 
                placeholder="10000" 
                value={formatRupiah(productData.price)} 
                onChange={e => handleNumericInput(e, 'price')} 
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stok Awal</label>
              <input 
                required 
                type="text" 
                placeholder="50" 
                value={productData.stock} 
                onChange={e => handleNumericInput(e, 'stock')} 
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Ketersediaan</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex-1">
                <input type="radio" name="is_available" checked={productData.is_available} onChange={() => setProductData({...productData, is_available: true})} className="text-green-600 focus:ring-green-500 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tersedia</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex-1">
                <input type="radio" name="is_available" checked={!productData.is_available} onChange={() => setProductData({...productData, is_available: false})} className="text-green-600 focus:ring-green-500 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Habis</span>
              </label>
            </div>
          </div>

          <div className="pt-6 mt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={isPending} className="flex-[2] py-3 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-70 flex items-center justify-center shadow-md transition-colors">
              {isPending ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Simpan Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
