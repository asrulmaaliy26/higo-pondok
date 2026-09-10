import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Calculator, 
  Store, 
  Bike, 
  ShieldCheck, 
  ArrowRightLeft, 
  Layers, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Coins, 
  TrendingUp,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { PRICING_CONFIG, calculateOrderFees, formatRupiah } from '../../config/pricing';

export default function AdminAccountingModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'simulator' | 'matrix'

  // States untuk Kalkulator Simulasi
  const [simProductPrice, setSimProductPrice] = useState(30000);
  const [simQuantity, setSimQuantity] = useState(7);
  const [simUserRank, setSimUserRank] = useState(4); // 1 = User 1-3, 4 = User 4+
  const [simHasCourier, setSimHasCourier] = useState(true);

  if (!isOpen) return null;

  // Hitung Simulasi menggunakan helper terpusat
  const fees = calculateOrderFees(simQuantity, simUserRank, simHasCourier);
  const { extraBlocks, rawDeliveryFee, baseAdminFee, courierCut, deliveryFee: netDeliveryFee, adminFee: totalAdminFee } = fees;

  // Jika tanpa kurir, ongkir masuk ke kantin
  const canteenIncome = simProductPrice + (!simHasCourier ? rawDeliveryFee : 0);
  const grandTotal = simProductPrice + (simHasCourier ? netDeliveryFee : 0) + totalAdminFee;

  const formatRp = (val) => formatRupiah(val);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden my-auto">
        
        {/* HEADER MODAL */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-md shadow-green-600/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                Sistem & Logika Akuntansi
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-green-200 text-green-800 dark:bg-green-900/60 dark:text-green-300">
                  Higo Pondok
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Transparansi seluruh rumus pembagian kas Toko, Kurir, dan Admin
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAB NAVIGASI */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 px-3 sm:px-5 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('rules')}
            className={`pb-2.5 px-3 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'border-green-600 text-green-700 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Aturan & Rumus Lengkap
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`pb-2.5 px-3 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'border-green-600 text-green-700 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Kalkulator Simulasi Live
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`pb-2.5 px-3 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'border-green-600 text-green-700 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Tabel Matriks Cepat
          </button>
        </div>

        {/* ISI TAB MODAL */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-gray-800 dark:text-gray-200">
          
          {/* ================= TAB 1: ATURAN & RUMUS LENGKAP ================= */}
          {activeTab === 'rules' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Card 1: Tarif Dasar */}
              <div className="bg-white dark:bg-gray-800/80 p-4 rounded-2xl border border-green-200 dark:border-green-800/50 shadow-xs">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 flex items-center justify-center">
                    <Coins className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    1. Struktur Tarif Dasar Jasa Pesanan
                  </h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  Setiap pesanan standar (1 s/d 5 produk) dikenakan tarif jasa flat sebesar <strong>Rp 5.000</strong> dengan pembagian:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40">
                    <span className="text-blue-700 dark:text-blue-400 font-semibold block text-[11px]">Ongkir Dasar Kurir:</span>
                    <span className="text-base font-black text-blue-800 dark:text-blue-200">{formatRupiah(PRICING_CONFIG.BASE_DELIVERY_FEE)}</span>
                    <span className="block text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Ongkos antar driver</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40">
                    <span className="text-purple-700 dark:text-purple-400 font-semibold block text-[11px]">Biaya Admin Pokok:</span>
                    <span className="text-base font-black text-purple-800 dark:text-purple-200">{formatRupiah(PRICING_CONFIG.BASE_ADMIN_FEE)}</span>
                    <span className="block text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Operasional sistem</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Kelipatan 5 Produk */}
              <div className="bg-white dark:bg-gray-800/80 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/50 shadow-xs">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    2. Skala Beban Kuantitas (&gt; 5 Produk)
                  </h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-2.5">
                  Jika pembeli memesan <strong>lebih dari 5 produk</strong> dalam 1 pesanan toko, setiap kelipatan 5 produk berikutnya dikenakan penambahan biaya:
                </p>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">📦 Tambahan ke Driver/Kurir:</span>
                    <span className="font-bold text-blue-700 dark:text-blue-400">+Rp 2.000 / 5 item</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">⚙️ Tambahan ke Admin:</span>
                    <span className="font-bold text-purple-700 dark:text-purple-400">+Rp 3.000 / 5 item</span>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 pt-1 border-t border-amber-200/50">
                    Contoh 6–10 item: Ongkir Rp 5.500, Admin Rp 4.500 (Total Jasa Rp 10.000).
                  </div>
                </div>
              </div>

              {/* Card 3: Pengalihan Ongkir > 3 User */}
              <div className="bg-white dark:bg-gray-800/80 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 shadow-xs">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    3. Pengalihan Ongkir Toko Harian (&gt; 3 User di Toko yang Sama)
                  </h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-2.5">
                  Efisiensi rute pengantaran driver di toko yang sama dalam 1 hari kalender diatur dengan pembagian kas adil:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <span className="font-bold text-green-700 dark:text-green-400 block text-[11px]">User ke-1, 2, dan 3:</span>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1">
                      Ongkir kurir <strong>100% UTUH</strong> tanpa potongan pengalihan (Rp 0).
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                    <span className="font-bold text-amber-700 dark:text-amber-400 block text-[11px]">User ke-4 dan seterusnya:</span>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1">
                      Ongkir kurir <strong>dipotong Rp 2.000</strong> dan dialihkan menjadi pendapatan kas Admin.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4: HPJ, HPP, & Laba Toko */}
              <div className="bg-white dark:bg-gray-800/80 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 shadow-xs">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    4. Akuntansi Toko (HPJ, HPP, &amp; Laba Toko)
                  </h3>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p><strong className="text-gray-900 dark:text-white">HPJ (Harga Penjualan):</strong> Harga produk yang tertera di menu toko.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p><strong className="text-gray-900 dark:text-white">HPP (Harga Pokok Penjualan):</strong> Modal riil belanja toko (jika tidak diinput, otomatis dihitung <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-[11px]">HPJ - 1.000</code>).</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p><strong className="text-gray-900 dark:text-white">Laba Toko:</strong> Selisih <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-[11px]">HPJ - HPP</code> adalah 100% hak kantin/toko.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p><strong className="text-gray-900 dark:text-white">Pesanan Tanpa Kurir:</strong> Jika pesanan diantar sendiri oleh toko atau santri ambil di tempat, ongkir menjadi hak toko.</p>
                  </div>
                </div>
              </div>

              {/* Card 5: Grand Total Rekap */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 rounded-2xl shadow-md space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-green-400">
                  Rumus Rekapitulasi Kas &amp; Grand Total
                </h4>
                <div className="text-xs font-mono bg-black/40 p-2.5 rounded-xl border border-white/10 space-y-1">
                  <div>Grand Total = Total HPJ + Total Ongkir Kurir + Total Kas Admin</div>
                  <div className="text-gray-400 text-[11px] pt-1 border-t border-white/10">
                    Kas Admin = Biaya Admin Pokok + Pindahan Ongkir Kurir (User &gt; 3)
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 2: KALKULATOR SIMULASI LIVE ================= */}
          {activeTab === 'simulator' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-green-50/70 dark:bg-green-950/30 p-3.5 rounded-2xl border border-green-200 dark:border-green-800/60 text-xs text-green-800 dark:text-green-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-600 shrink-0" />
                <span>Ubah parameter di bawah untuk melihat simulasi pembagian kas secara real-time.</span>
              </div>

              {/* Form Input Simulasi */}
              <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3.5 text-xs">
                
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Subtotal Belanja Makanan / Minuman (HPJ):
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-500">Rp</span>
                    <input
                      type="number"
                      step="1000"
                      min="1000"
                      value={simProductPrice}
                      onChange={(e) => setSimProductPrice(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-1.5 border rounded-xl font-bold text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Jumlah Produk (Qty):
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={simQuantity}
                      onChange={(e) => setSimQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-1.5 border rounded-xl font-bold text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <span className="text-[10px] text-gray-500 mt-0.5 block">
                      {extraBlocks > 0 ? `+${extraBlocks} blok kelipatan 5` : 'Termasuk paket 1-5 item'}
                    </span>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Urutan User di Toko Hari Ini:
                    </label>
                    <select
                      value={simUserRank}
                      onChange={(e) => setSimUserRank(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border rounded-xl font-semibold text-xs bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                    >
                      <option value="1">User ke-1 (Utuh)</option>
                      <option value="2">User ke-2 (Utuh)</option>
                      <option value="3">User ke-3 (Utuh)</option>
                      <option value="4">User ke-4+ (Potong 2.000 ke Admin)</option>
                      <option value="5">User ke-5+ (Potong 2.000 ke Admin)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={simHasCourier}
                      onChange={(e) => setSimHasCourier(e.target.checked)}
                      className="w-4 h-4 rounded text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="font-semibold text-xs text-gray-700 dark:text-gray-300">
                      Pesanan menggunakan jasa Kurir / Driver
                    </span>
                  </label>
                </div>
              </div>

              {/* Output Hasil Simulasi */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Hasil Perhitungan &amp; Distribusi Kas:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  
                  {/* Kas Toko */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                    <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold mb-1">
                      <Store className="w-4 h-4" />
                      Hak Kas Toko
                    </div>
                    <div className="text-base font-black text-emerald-700 dark:text-emerald-400">
                      {formatRp(canteenIncome)}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      HPJ Menu: {formatRp(simProductPrice)}
                      {!simHasCourier && ' + Ongkir Mandiri'}
                    </div>
                  </div>

                  {/* Kas Kurir */}
                  <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60">
                    <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 font-bold mb-1">
                      <Bike className="w-4 h-4" />
                      Hak Kas Kurir
                    </div>
                    <div className="text-base font-black text-blue-700 dark:text-blue-400">
                      {formatRp(netDeliveryFee)}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      Kotor: {formatRp(rawDeliveryFee)}
                      {courierCut > 0 && <span className="text-amber-600 block">Potongan: -{formatRp(courierCut)}</span>}
                    </div>
                  </div>

                  {/* Kas Admin */}
                  <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60">
                    <div className="flex items-center gap-1.5 text-purple-800 dark:text-purple-300 font-bold mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      Hak Kas Admin
                    </div>
                    <div className="text-base font-black text-purple-700 dark:text-purple-400">
                      {formatRp(totalAdminFee)}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 space-y-0.5">
                      <div>Pokok: {formatRp(baseAdminFee)}</div>
                      {courierCut > 0 && <div className="text-amber-600 font-semibold">+Pindahan: +{formatRp(courierCut)}</div>}
                    </div>
                  </div>

                </div>

                {/* Total Santri Bayar */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 text-white flex items-center justify-between shadow-md">
                  <div>
                    <span className="text-[11px] text-green-100 font-medium block">Total Ditagihkan ke Santri / Wali:</span>
                    <span className="text-lg sm:text-xl font-black">{formatRp(grandTotal)}</span>
                  </div>
                  <div className="text-right text-[11px] text-green-100">
                    <div>{simQuantity} Produk</div>
                    <div className="font-semibold">{simUserRank > 3 ? 'Status: User > 3 Toko' : 'Status: User 1-3'}</div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= TAB 3: TABEL MATRIKS CEPAT ================= */}
          {activeTab === 'matrix' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tabel referensi cepat perbandingan tarif jasa antar kurir dan admin berdasarkan kuantitas produk dan status user:
              </p>

              <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold">
                    <tr>
                      <th className="p-2.5 sm:p-3">Jumlah Produk</th>
                      <th className="p-2.5 sm:p-3">Total Jasa</th>
                      <th className="p-2.5 sm:p-3 text-blue-700 dark:text-blue-400">User 1–3 (Kurir/Admin)</th>
                      <th className="p-2.5 sm:p-3 text-amber-700 dark:text-amber-400">User 4+ (Kurir/Admin)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 font-medium">
                    {[
                      { label: '1 s/d 5 Item', qty: 1 },
                      { label: '6 s/d 10 Item', qty: 6 },
                      { label: '11 s/d 15 Item', qty: 11 },
                      { label: '16 s/d 20 Item', qty: 16 },
                    ].map((b, idx) => {
                      const f1 = calculateOrderFees(b.qty, 1, true);
                      const f4 = calculateOrderFees(b.qty, 4, true);
                      const grandTotal = f1.deliveryFee + f1.adminFee;
                      return (
                        <tr key={b.label} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${idx % 2 === 1 ? 'bg-gray-50/50 dark:bg-gray-900/30' : ''}`}>
                          <td className="p-2.5 sm:p-3 font-bold">{b.label}</td>
                          <td className="p-2.5 sm:p-3 font-semibold text-gray-900 dark:text-white">Rp {grandTotal.toLocaleString('id-ID')}</td>
                          <td className="p-2.5 sm:p-3">
                            <span className="text-blue-600 font-bold">{f1.deliveryFee.toLocaleString('id-ID')}</span> / <span className="text-purple-600 font-bold">{f1.adminFee.toLocaleString('id-ID')}</span>
                          </td>
                          <td className="p-2.5 sm:p-3">
                            <span className="text-blue-600 font-bold">{f4.deliveryFee.toLocaleString('id-ID')}</span> / <span className="text-purple-600 font-bold">{f4.adminFee.toLocaleString('id-ID')}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-[11px] text-gray-500 dark:text-gray-400 space-y-1">
                <div>• Format pembagian: <span className="text-blue-600 font-bold">Ongkir Kurir</span> / <span className="text-purple-600 font-bold">Kas Admin</span></div>
                <div>• Pada User ke-4+, kas admin menerima tambahan +Rp 2.000 dari pengalihan ongkir kurir.</div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER MODAL */}
        <div className="p-3.5 sm:p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/60 dark:bg-gray-900/60">
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            Formula dikunci di Model <code className="text-green-600 font-bold">Order.php</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
          >
            Tutup Panduan
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
