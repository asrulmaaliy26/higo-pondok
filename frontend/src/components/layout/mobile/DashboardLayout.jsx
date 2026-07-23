import React from 'react';
import { Outlet, useLocation } from '@tanstack/react-router';
import { useAuthStore } from '../../../store/authStore';
import { allMenus } from '../../../config/menus';
import { getUserRole } from '../../../config/roles';
import api from '../../../lib/axios';

import TopHeader from './TopHeader';
import MobileBottomNav from './MobileBottomNav';
import DesktopSidebar from './DesktopSidebar';

export default function DashboardLayout() {
  const user = useAuthStore((state) => state.user);
  const originalAdmin = useAuthStore((state) => state.originalAdmin);
  const stopImpersonating = useAuthStore((state) => state.stopImpersonating);
  const location = useLocation();
  const isNoTopHeaderPage = location.pathname !== '/dashboard';

  const userRole = getUserRole(user) || 'admin';
  const sidebarMenus = allMenus.filter(menu => menu.roles.includes(userRole));

  const isKantinDetail = location.pathname.match(/^\/dashboard\/kantin\/\d+$/);
  const isKantinList = location.pathname === '/dashboard/kantin';
  const isProfile = location.pathname === '/dashboard/profile';
  const isPembayaran = location.pathname === '/dashboard/pembayaran';
  const isTokoSaya = location.pathname.startsWith('/dashboard/toko-saya');
  const isPesanan = location.pathname.startsWith('/dashboard/pesanan');
  const isPerkuriran = location.pathname.startsWith('/dashboard/perkuriran') || location.pathname.startsWith('/dashboard/tugas-kurir');
  const isKeranjang = location.pathname === '/dashboard/keranjang';
  
  // Pages that manage their own full-bleed layout
  const isEdgeToEdgePage = isKantinDetail || isKantinList || isProfile || isPembayaran || isTokoSaya || isPesanan || isPerkuriran || isKeranjang;
  const hideBottomNav = isKantinDetail || isKeranjang;

  return (
    <div className="flex w-full h-screen bg-slate-50 dark:bg-gray-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <DesktopSidebar sidebarMenus={sidebarMenus} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Impersonation Banner */}
        {originalAdmin && (
          <div className="bg-amber-100 dark:bg-amber-900/40 border-b border-amber-200 dark:border-amber-800/50 px-4 py-2.5 sm:px-6 lg:px-8 flex items-center justify-between z-10 shrink-0">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Anda sedang login sebagai <span className="font-bold">{user?.name}</span>.
            </p>
            <button 
              onClick={async () => {
                try {
                  await api.post('/logout');
                } catch (e) {
                  console.error('Gagal menghapus token penyamaran:', e);
                }
                stopImpersonating();
                window.location.href = '/dashboard/users';
              }}
              className="text-xs font-semibold bg-white dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-md shadow-sm hover:bg-amber-50 dark:hover:bg-amber-900 transition-colors border border-amber-200 dark:border-amber-700/50"
            >
              Kembali ke Admin
            </button>
          </div>
        )}

        {/* Top Header */}
        <TopHeader user={user} isNoTopHeaderPage={isNoTopHeaderPage} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-gray-950">
          <div className={`${isEdgeToEdgePage ? 'min-h-full' : 'p-4 sm:p-6 lg:p-8 pb-28 sm:pb-32 lg:pb-8 min-h-full'}`}>
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        {!hideBottomNav && (
          <MobileBottomNav sidebarMenus={sidebarMenus} location={location} />
        )}
      </div>
    </div>
  );
}
