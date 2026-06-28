import React from 'react';
import { Package } from 'lucide-react';

export default function Perkuriran() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Monitoring Perkuriran</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pantau rute, jadwal, dan status pengantaran barang oleh kurir internal.
          </p>
        </div>
      </div>
      <div className="glass-card p-6 sm:p-12 flex flex-col items-center justify-center rounded-2xl border-dashed border-2 border-gray-200 dark:border-gray-800">
        <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Modul Perkuriran</h3>
        <p className="text-gray-500 text-center max-w-md mt-2">Peta kurir, daftar antrean pengiriman, dan riwayat paket akan ditampilkan di sini.</p>
      </div>
    </div>
  );
}
