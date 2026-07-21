import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../../lib/axios';
import { MapPin, Heart, FileText, Search, UtensilsCrossed, Zap, Bike, Users, ArrowRight, Store, Star, Ticket } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function Kantin() {
  // Fetch Banners (Approved)
  const { data: banners, isLoading: loadingBanners } = useQuery({
    queryKey: ['canteen-banners'],
    queryFn: async () => {
      const res = await axios.get('/banners');
      return res.data;
    }
  });

  // Fetch Canteens (Kuliner sesuai seleramu)
  const { data: canteens, isLoading: loadingCanteens } = useQuery({
    queryKey: ['canteens'],
    queryFn: async () => {
      const res = await axios.get('/canteens');
      return res.data.data || res.data;
    }
  });

  // Fetch Vouchers
  const { data: vouchers, isLoading: loadingVouchers } = useQuery({
    queryKey: ['vouchers'],
    queryFn: async () => {
      const res = await axios.get('/vouchers');
      return res.data;
    }
  });



  return (
    <div className="pb-24 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* HEADER SECTION */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 pt-6 pb-28 px-4 relative rounded-b-[2.5rem]">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1.5 shadow-sm">
            <MapPin size={16} className="text-emerald-600" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Asrama Putra</span>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm text-gray-600 dark:text-gray-300">
              <Heart size={20} />
            </button>
            <button className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm text-gray-600 dark:text-gray-300 relative">
              <FileText size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>
          </div>
        </div>

        {/* Banner Carousel */}
        <div className="mb-4 relative z-10">
          {loadingBanners ? (
            <div className="w-full h-40 bg-emerald-200 dark:bg-emerald-900 rounded-2xl animate-pulse"></div>
          ) : (
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-4 pb-4">
              {Array.isArray(banners) && banners.length > 0 ? (
                banners.map((banner) => (
                  <div key={banner.id} className="snap-center shrink-0 w-full rounded-2xl overflow-hidden shadow-lg relative">
                    <img src={banner.image_path.startsWith('http') ? banner.image_path : `http://localhost:8000${banner.image_path}`} alt={banner.title} className="w-full h-44 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                    </div>
                  </div>
                ))
              ) : (
                <div className="snap-center shrink-0 w-full h-44 rounded-2xl overflow-hidden shadow-lg relative bg-emerald-600 flex items-center justify-center">
                  <h3 className="text-white font-bold text-lg">Belum ada promo saat ini</h3>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vouchers Carousel */}
        <div className="relative z-10 mb-4">
          {loadingVouchers ? (
             <div className="w-full h-12 bg-emerald-200 dark:bg-emerald-900 rounded-xl animate-pulse"></div>
          ) : (
             <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-3 pb-2">
               {Array.isArray(vouchers) && vouchers.map((voucher) => (
                 <div key={voucher.id} className="snap-center shrink-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-3 flex items-center justify-between min-w-[240px] shadow-sm">
                    <div className="flex items-center space-x-2">
                       <Ticket size={24} className="text-white" />
                       <div>
                         <p className="text-white font-bold text-sm">Diskon Rp{voucher.discount_amount.toLocaleString('id-ID')}</p>
                         <p className="text-amber-100 text-[10px]">Min. Blj Rp{voucher.min_purchase.toLocaleString('id-ID')}</p>
                       </div>
                    </div>
                    <button className="bg-white text-orange-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Klaim</button>
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>

      {/* SEARCH BAR (Overlapping) */}
      <div className="px-4 -mt-10 relative z-20 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-md px-4 py-3 flex items-center space-x-3 border border-gray-100 dark:border-gray-700">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Lagi mau jajan apa hari ini?" 
            className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 text-sm"
          />
          <UtensilsCrossed size={20} className="text-emerald-500" />
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="px-4 grid grid-cols-4 gap-3 mb-8">
        {[
          { icon: <MapPin size={24} className="text-red-500" />, label: 'Toko Terdekat' },
          { icon: <Bike size={24} className="text-amber-500" />, label: 'Ongkir Murah' },
          { icon: <Users size={24} className="text-emerald-500" />, label: 'Group Order' },
          { icon: <Zap size={24} className="text-blue-500" />, label: 'Menu Cepat' },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center relative mb-2">
              {item.icon}
            </div>
            <span className="text-xs font-semibold text-center text-gray-700 dark:text-gray-300">{item.label}</span>
          </div>
        ))}
      </div>



      {/* KULINER SESUAI SELERAMU (Toko List) */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">Kantin sesuai seleramu</h2>
          <button className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full">
            Lihat Semua
          </button>
        </div>

        {loadingCanteens ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="w-full h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(canteens) && canteens.map((canteen) => (
              <Link key={canteen.id} to={`/dashboard/kantin/${canteen.id}`} className="flex bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0 flex items-center justify-center">
                   {canteen.image ? (
                     <img src={`http://localhost:8000/storage/${canteen.image}`} alt={canteen.name} className="w-full h-full object-cover" />
                   ) : (
                     <Store size={32} className="text-gray-400" />
                   )}
                </div>
                <div className="ml-3 flex flex-col justify-center">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{canteen.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{canteen.description}</p>
                  <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
                    <span className="flex items-center text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                       {canteen.is_open ? 'Buka' : 'Tutup'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
