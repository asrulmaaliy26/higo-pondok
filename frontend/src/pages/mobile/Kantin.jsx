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

  // Mock Flash Sale Data
  const flashSales = [
    { id: 1, title: 'Nasi Goreng Spesial', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop', oldPrice: 20000, newPrice: 15000, discount: '25%', time: '15-25 min', kantin: 'Kantin Barokah' },
    { id: 2, title: 'Ayam Geprek Level 5', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&h=300&fit=crop', oldPrice: 18000, newPrice: 12000, discount: '33%', time: '10-20 min', kantin: 'Ayam Geprek Mang Ujang' },
    { id: 3, title: 'Es Kopi Susu Aren', image: 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=300&h=300&fit=crop', oldPrice: 15000, newPrice: 10000, discount: '33%', time: '5-10 min', kantin: 'Kopi Santri' },
  ];

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
          { icon: <MapPin size={24} className="text-red-500" />, label: 'Toko Terdekat', badge: null },
          { icon: <Bike size={24} className="text-amber-500" />, label: 'Ongkir Murah', badge: null },
          { icon: <Users size={24} className="text-emerald-500" />, label: 'Group Order', badge: '-50%' },
          { icon: <Zap size={24} className="text-blue-500" />, label: 'Flash Sale', badge: 'HOT' },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center relative mb-2">
              {item.icon}
              {item.badge && (
                <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </div>
              )}
            </div>
            <span className="text-xs font-semibold text-center text-gray-700 dark:text-gray-300">{item.label}</span>
          </div>
        ))}
      </div>

      {/* FLASH SALE SECTION */}
      <div className="px-4 mb-8">
        <div className="bg-gradient-to-r from-red-50 to-emerald-50 dark:from-red-950/30 dark:to-emerald-950/30 rounded-3xl p-4 shadow-sm border border-red-100 dark:border-red-900/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Zap size={20} className="text-red-500" />
              <h2 className="font-bold text-gray-800 dark:text-gray-200">Flash Sale</h2>
              <div className="bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center space-x-1">
                <span>00</span><span>:</span><span>16</span><span>:</span><span>49</span>
              </div>
            </div>
            <button className="bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-sm">
              <ArrowRight size={16} className="text-emerald-600" />
            </button>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-4 pb-2">
            {flashSales.map((item) => (
              <div key={item.id} className="snap-center shrink-0 w-36 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 relative flex flex-col">
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md z-10">
                  {item.discount}
                </div>
                <img src={item.image} alt={item.title} className="w-full h-28 object-cover" />
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight mb-1">{item.title}</h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">{item.kantin}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      <div className="w-4 h-4 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                        <Bike size={10} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">{item.time}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">Rp{item.newPrice.toLocaleString('id-ID')}</span>
                      <span className="text-gray-400 text-[10px] line-through">Rp{item.oldPrice.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
                    <span className="flex items-center text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                       <Star size={10} className="mr-0.5 fill-current" /> {canteen.rating > 0 ? canteen.rating : 'Baru'}
                    </span>
                    {canteen.distance !== undefined && (
                      <span className="flex items-center text-[10px] font-semibold text-gray-600 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                         <MapPin size={10} className="mr-0.5" /> {canteen.distance < 1 ? (canteen.distance * 1000).toFixed(0) + ' m' : canteen.distance.toFixed(1) + ' km'}
                      </span>
                    )}
                    <span className="flex items-center text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                       <Bike size={10} className="mr-0.5" /> Rp{canteen.delivery_fee?.toLocaleString('id-ID') || '0'}
                    </span>
                    {canteen.sold_count > 100 && (
                      <span className="flex items-center text-[10px] font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                         🔥 Best Seller
                      </span>
                    )}
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
