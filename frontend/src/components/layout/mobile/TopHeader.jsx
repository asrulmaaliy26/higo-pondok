import React from 'react';
import { Link } from '@tanstack/react-router';

export default function TopHeader({ user, isNoTopHeaderPage }) {
  if (isNoTopHeaderPage) return null;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between lg:justify-end border-b border-gray-200 bg-white/70 backdrop-blur-lg dark:bg-gray-900/70 dark:border-gray-800 px-4 sm:px-6 lg:px-8 shadow-sm">
      {/* Mobile App Title (Visible only on mobile header) */}
      <div className="lg:hidden flex items-center">
        <h1 className="text-lg font-bold text-green-600 dark:text-green-400">
          Higo Pondok
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        
        <div className="relative flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
          <Link 
            to="/dashboard/profile"
            className="flex items-center gap-3 text-left focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800/50 p-1.5 rounded-lg transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'admin@higopondok.com'}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-green-600 flex items-center justify-center text-white font-bold shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
