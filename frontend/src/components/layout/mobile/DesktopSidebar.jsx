import React from 'react';
import { Link } from '@tanstack/react-router';
import ThemeToggle from '../../ui/ThemeToggle';

export default function DesktopSidebar({ sidebarMenus }) {
  return (
    <aside className="hidden lg:flex flex-col inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shrink-0">
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="text-2xl font-bold text-green-600 dark:text-green-400">
          Higo Pondok
        </Link>
      </div>

      <div className="px-4 py-6 overflow-y-auto flex-1">
        <div className="mb-6 px-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu Utama
          </p>
        </div>
        <nav className="space-y-1">
          {sidebarMenus.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              activeOptions={{ exact: item.href === '/dashboard' }}
              className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
              activeProps={{
                className: "bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300 font-bold"
              }}
              inactiveProps={{
                className: "text-gray-700 hover:bg-green-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-green-900/50 dark:hover:text-green-300"
              }}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
              {item.name === 'User'
                ? 'Manajemen User'
                : item.name === 'Pertokoan'
                ? 'Manajemen Toko'
                : item.name === 'Pesanan'
                ? 'Rekap & Pesanan'
                : item.name === 'Trans'
                ? 'Transaksi'
                : item.name === 'Transport'
                ? 'Transportasi'
                : item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer with Theme Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
        <ThemeToggle variant="switch" showLabel={true} className="w-full justify-between p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs" />
      </div>
    </aside>
  );
}
