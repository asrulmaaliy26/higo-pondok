import React from 'react';
import { Link } from '@tanstack/react-router';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { getUserRole } from '../../../config/roles';
import { ROLES } from '../../../config/roles';

export default function MobileBottomNav({ sidebarMenus, location }) {
  if (location.pathname === '/dashboard/profile') return null;

  const user = useAuthStore(state => state.user);
  const role = getUserRole(user);
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const totalCartItems = role === ROLES.USER ? getTotalItems() : 0;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-center h-16 px-1">
        {sidebarMenus.map((item) => {
          const isKeranjang = item.href === '/dashboard/keranjang';
          return (
            <Link
              key={item.name}
              to={item.href}
              activeOptions={{ exact: true }}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative"
              activeProps={{
                className: "text-green-600 dark:text-green-400"
              }}
              inactiveProps={{
                className: "text-gray-400 hover:text-green-600 dark:text-gray-500 dark:hover:text-green-400"
              }}
            >
              <div className="relative">
                <item.icon className="h-6 w-6 mb-0.5" strokeWidth={2} />
                {isKeranjang && totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-0.5 border border-white dark:border-gray-900 leading-none">
                    {totalCartItems > 99 ? '99+' : totalCartItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
