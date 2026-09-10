import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { getStorageUrl } from '../../lib/axios';

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
    hpp: '',
    price: '',
    stock: '',
    is_available: true
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [autoSync, setAutoSync] = useState(true);
  const [lastModified, setLastModified] = useState(null); // 'hpp' | 'price'

  // Sync props when modal opens or editing product changes
  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        const hpjVal = (editingProduct.price || editingProduct.hpj || '').toString();
        const rawHpp = editingProduct.hpp;
        const hppVal = (rawHpp !== undefined && rawHpp !== null && parseFloat(rawHpp) > 0)
          ? rawHpp.toString()
          : (hpjVal ? Math.max(0, parseInt(hpjVal, 10) - 1000).toString() : '');

        setProductData({
          name: editingProduct.name || '',
          category: editingProduct.category || '',
          hpp: hppVal,
          price: hpjVal,
          stock: (editingProduct.stock || 0).toString(),
          is_available: editingProduct.is_available ?? true
        });

        // Check if current margin is exactly 1000
        const diff = parseInt(hpjVal || 0, 10) - parseInt(hppVal || 0, 10);
        setAutoSync(diff === 1000 || !hpjVal);
        setLastModified(diff === 1000 ? 'hpp' : null);
        setImagePreview(editingProduct.image ? getStorageUrl(editingProduct.image) : null);
      } else {
        setProductData({ name: '', category: '', hpp: '', price: '', stock: '', is_available: true });
        setAutoSync(true);
        setLastModified(null);
        setImagePreview(null);
        setImageFile(null);
      }
    }
  }, [isOpen, editingProduct]);

  if (!isOpen) return null;

  const handleHppChange = (e) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    if (autoSync) {
      if (lastModified === 'price') {
        // User already filled HPJ first and is now customizing HPP -> detach sync so HPJ is kept
        setAutoSync(false);
        setProductData(prev => ({ ...prev, hpp: rawVal }));
      } else {
        // Auto-sync active: HPP drives HPJ = HPP + 1000
        setLastModified('hpp');
        if (!rawVal) {
          setProductData(prev => ({ ...prev, hpp: '', price: '' }));
        } else {
          const hppNum = parseInt(rawVal, 10);
          const calcPrice = (hppNum + 1000).toString();
          setProductData(prev => ({ ...prev, hpp: rawVal, price: calcPrice }));
        }
      }
    } else {
      setProductData(prev => ({ ...prev, hpp: rawVal }));
    }
  };

  const handlePriceChange = (e) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    if (autoSync) {
      if (lastModified === 'hpp') {
        // User already filled HPP first and is now customizing HPJ -> detach sync so HPP is kept
        setAutoSync(false);
        setProductData(prev => ({ ...prev, price: rawVal }));
      } else {
        // Auto-sync active: HPJ drives HPP = HPJ - 1000
        setLastModified('price');
        if (!rawVal) {
          setProductData(prev => ({ ...prev, price: '', hpp: '' }));
        } else {
          const hpjNum = parseInt(rawVal, 10);
          const calcHpp = Math.max(0, hpjNum - 1000).toString();
          setProductData(prev => ({ ...prev, price: rawVal, hpp: calcHpp }));
        }
      }
    } else {
      setProductData(prev => ({ ...prev, price: rawVal }));
    }
  };

  const toggleAutoSync = () => {
    const next = !autoSync;
    setAutoSync(next);
    if (next) {
      // Re-apply default margin (+1.000)
      setLastModified('hpp');
      if (productData.hpp) {
        const h = parseInt(productData.hpp, 10);
        setProductData(prev => ({ ...prev, price: (h + 1000).toString() }));
      } else if (productData.price) {
        const p = parseInt(productData.price, 10);
        setProductData(prev => ({ ...prev, hpp: Math.max(0, p - 1000).toString() }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPrice = productData.price || (parseInt(productData.hpp || 0, 10) + 1000).toString();
    const finalHpp = productData.hpp || Math.max(0, parseInt(finalPrice, 10) - 1000).toString();

    onSave({
      ...productData,
      hpp: finalHpp,
      hpj: finalPrice,
      price: finalPrice
    }, imageFile);
  };

  const formatRupiah = (value) => {
    if (!value && value !== 0) return '';
    return 'Rp ' + parseInt(value, 10).toLocaleString('id-ID');
  };

  const hppNum = parseInt(productData.hpp || 0, 10);
  const hpjNum = parseInt(productData.price || 0, 10);
  const profit = hpjNum - hppNum;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 w-full sm:max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
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
                    if (file.size > 2 * 1024 * 1024) {
                      toast.error('Ukuran foto produk maksimal 2 MB');
                      e.target.value = '';
                      return;
                    }
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                    HPP (Harga Pokok) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold px-1.5 py-0.5 rounded">
                    Modal Toko
                  </span>
                </div>
                <input 
                  required 
                  type="text" 
                  placeholder="Cth: 23.000" 
                  value={formatRupiah(productData.hpp)} 
                  onChange={handleHppChange} 
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow" 
                />
                <p className="text-[10px] text-gray-400 mt-0.5">Biaya modal pokok (Cth: 23.000)</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                    HPJ (Harga Jual) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 font-semibold px-1.5 py-0.5 rounded">
                    Harga Santri
                  </span>
                </div>
                <input 
                  required 
                  type="text" 
                  placeholder="Cth: 24.000" 
                  value={formatRupiah(productData.price)} 
                  onChange={handlePriceChange} 
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-shadow font-semibold text-green-700 dark:text-green-400" 
                />
                <p className="text-[10px] text-gray-400 mt-0.5">Harga jual santri (Cth: 24.000)</p>
              </div>
            </div>

            {/* SYNC INDICATOR / MODE TOGGLE */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 text-xs">
              <span className="text-[11px] text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                {autoSync ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Sinkronisasi otomatis (Selisih +Rp 1.000)</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Mode manual (Bisa ubah bebas)</span>
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={toggleAutoSync}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                  autoSync
                    ? 'bg-gray-200/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                    : 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 hover:bg-green-200'
                }`}
              >
                {autoSync ? 'Bebaskan Manual' : '⚡ Sinkronkan (+Rp 1.000)'}
              </button>
            </div>

            {/* LIVE MARGIN & PROFIT PREVIEW */}
            {hpjNum > 0 && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 text-xs space-y-1.5">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 text-[11px]">
                  <span>Modal Pokok (HPP):</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{formatRupiah(hppNum)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 text-[11px]">
                  <span>Harga Jual Santri (HPJ):</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatRupiah(hpjNum)}</span>
                </div>
                <div className="pt-1.5 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center font-bold">
                  <span className="text-gray-700 dark:text-gray-300">Estimasi Keuntungan / Porsi:</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                    profit > 0 
                      ? 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300' 
                      : profit === 0 
                        ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                  }`}>
                    {profit > 0 ? `+${formatRupiah(profit)}` : formatRupiah(profit)}
                  </span>
                </div>
              </div>
            )}
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
    </div>,
    document.body
  );
};
