import React, { useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, CheckCircle, FileText, ShoppingBag, Store, User, MapPin, Building2, Calendar, Phone, CheckSquare } from 'lucide-react';
import santriData from '../../data/santri.json';

const formatRupiah = (num) => {
  return Math.round(Number(num) || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return new Date().toLocaleString('id-ID');
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

const formatDateOnly = (dateStr) => {
  if (!dateStr) return new Date().toLocaleDateString('id-ID');
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const getSantriReceiptInfo = (user) => {
  const santriName = user?.santri_name || user?.name || '-';
  let santriClass = user?.santri_class || '';
  let santriLevel = user?.santri_level || '';
  let santriRoom = user?.santri_room || '-';

  if (santriName && santriData?.data) {
    const sName = santriName.toLowerCase().trim();
    const match = santriData.data.find(r => {
      if (!r || !r[1]) return false;
      const rawName = r[1].toLowerCase().replace(/\s+(laki-laki|perempuan)$/i, '').trim();
      return rawName === sName || sName.includes(rawName) || rawName.includes(sName);
    });
    if (match) {
      if (!santriLevel && match[4]) santriLevel = match[4];
      const tingkat = match[5] || '';
      const rombel = match[6] || '';
      const program = match[7] && match[7] !== '-' ? match[7] : '';
      const fullClass = [tingkat, rombel, program].filter(Boolean).join(' ');
      if (!santriClass || santriClass === tingkat) {
        santriClass = fullClass || santriClass;
      }
      if ((!santriRoom || santriRoom === '-') && match[10]) {
        santriRoom = match[10];
      }
    }
  }

  return {
    santriName,
    santriClass,
    santriLevel,
    santriRoom,
    waliName: user?.name || '-'
  };
};

export default function ThermalReceiptModal({
  isOpen,
  onClose,
  mode = 'single', // 'single' | 'batch'
  order = null,
  orders = [],
  courierName = '',
  title = ''
}) {
  const receiptRef = useRef(null);
  const [paperWidth, setPaperWidth] = useState('58mm'); // '58mm' | '80mm' | 'A4'

  // Filter batch orders: include all passed orders (except cancelled), uncompleted first
  const rawBatchOrders = Array.isArray(orders) ? orders : [];
  const filteredBatchOrders = useMemo(() => {
    if (mode !== 'batch') return [];
    const valid = rawBatchOrders.filter(o => o.status !== 'cancelled');
    return valid.sort((a, b) => {
      const getPriority = (status) => {
        if (status === 'processing') return 1;
        if (status === 'pending') return 2;
        if (status === 'completed') return 3;
        return 4;
      };
      const pA = getPriority(a.status);
      const pB = getPriority(b.status);
      if (pA !== pB) return pA - pB;
      return (b.id || 0) - (a.id || 0);
    });
  }, [rawBatchOrders, mode]);

  // Calculate batch summaries
  const batchSummary = useMemo(() => {
    let products = 0;
    let delivery = 0;
    let admin = 0;

    filteredBatchOrders.forEach(o => {
      const deliveryFee = parseFloat(o.delivery_fee || 0);
      const adminFee = parseFloat(o.admin_fee || 0);
      delivery += deliveryFee;
      admin += adminFee;

      if (o.items && o.items.length > 0) {
        const sub = o.items.reduce((s, i) => s + parseFloat(i.subtotal || (parseFloat(i.price || 0) * (i.quantity || 1))), 0);
        products += sub;
      } else if (o.is_custom || o.custom_notes) {
        const custom = Math.max(0, parseFloat(o.total_price || 0) - deliveryFee - adminFee);
        products += custom;
      }
    });

    return {
      products,
      delivery,
      admin,
      grandTotal: products + delivery + admin
    };
  }, [filteredBatchOrders]);

  const handlePrint = () => {
    window.print();
  };

  // Early return only after all hooks are declared
  if (!isOpen) return null;

  const isA4 = paperWidth === 'A4';

  return createPortal(
    <>
      {/* CSS PRINT RULES (OPTIMIZED FOR THERMAL 58mm/80mm AND DESKTOP A4 PRINTERS) */}
      <style>{`
        @media print {
          @page {
            size: ${isA4 ? 'A4 portrait' : paperWidth === '58mm' ? '58mm auto' : '80mm auto'};
            margin: ${isA4 ? '10mm 12mm' : '0mm !important'};
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            width: ${isA4 ? '100%' : paperWidth === '58mm' ? '58mm' : '80mm'} !important;
          }
          body * {
            visibility: hidden !important;
          }
          .thermal-receipt-printable, .thermal-receipt-printable * {
            visibility: visible !important;
          }
          .thermal-receipt-printable {
            position: ${isA4 ? 'relative' : 'absolute'} !important;
            left: 0 !important;
            top: 0 !important;
            width: ${isA4 ? '100%' : paperWidth === '58mm' ? '48mm' : '72mm'} !important;
            max-width: ${isA4 ? '100%' : paperWidth === '58mm' ? '48mm' : '72mm'} !important;
            margin: 0 !important;
            padding: ${isA4 ? '0' : '1mm 1mm 4mm 1mm'} !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
            color: #000000 !important;
            font-family: ${isA4 ? "'Inter', 'Segoe UI', Arial, sans-serif" : "'Consolas', 'Courier New', Courier, monospace"} !important;
            font-size: ${isA4 ? '9.5pt' : paperWidth === '58mm' ? '9.5pt' : '11pt'} !important;
            line-height: ${isA4 ? '1.35' : '1.2'} !important;
            box-shadow: none !important;
            border: none !important;
            word-break: ${isA4 ? 'normal' : 'break-word'} !important;
            overflow-wrap: break-word !important;
          }
          .thermal-receipt-printable table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .thermal-receipt-printable th, .thermal-receipt-printable td {
            word-break: normal !important;
            overflow-wrap: break-word !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        <div className={`bg-white dark:bg-gray-900 w-full ${isA4 ? 'max-w-5xl' : 'max-w-md'} rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-gray-200 dark:border-gray-700 transition-all duration-200`}>
          {/* MODAL HEADER */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/80 dark:bg-gray-800/80 no-print flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 flex items-center justify-center shrink-0">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                  {title || (mode === 'batch' ? `Rekap Pesanan (${filteredBatchOrders.length} Pesanan)` : `Struk Pesanan #ORD-${order?.id}`)}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {isA4
                    ? 'Format Dokumen / Struk Kertas A4 (Besar)'
                    : mode === 'batch'
                    ? (title || 'Rekap Daftar Pesanan')
                    : `Format Printer Thermal (${paperWidth})`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Paper Size Selector (58mm, 80mm, A4) */}
              <div className="flex bg-gray-200 dark:bg-gray-700 p-0.5 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setPaperWidth('58mm')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    paperWidth === '58mm'
                      ? 'bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                  }`}
                  title="Printer Thermal 58mm (iWare / Mini POS)"
                >
                  58mm
                </button>
                <button
                  type="button"
                  onClick={() => setPaperWidth('80mm')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    paperWidth === '80mm'
                      ? 'bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                  }`}
                  title="Printer Thermal 80mm (Kasir Standar)"
                >
                  80mm
                </button>
                <button
                  type="button"
                  onClick={() => setPaperWidth('A4')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    paperWidth === 'A4'
                      ? 'bg-green-600 text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                  }`}
                  title="Kertas A4 / Dokumen & Invoice Besar"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Kertas A4</span>
                </button>
              </div>

              <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-full bg-gray-200/70 dark:bg-gray-700 hover:bg-gray-300 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-colors"
                title="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RECEIPT PREVIEW (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-200 dark:bg-gray-950 flex justify-center items-start">
            <div 
              ref={receiptRef}
              style={{
                width: isA4 ? '100%' : paperWidth === '58mm' ? '250px' : '320px',
                maxWidth: isA4 ? '850px' : undefined
              }}
              className={`thermal-receipt-printable bg-white text-black rounded-xl shadow-xl border border-gray-300 box-border shrink-0 min-h-fit my-1 ${
                isA4 ? 'p-6 sm:p-8 font-sans text-xs' : 'p-3.5 font-mono text-[11px] leading-tight'
              }`}
            >
              {/* ========================================================================= */}
              {/* 1. FORMAT A4: SINGLE ORDER INVOICE (STRUK BESAR KERTAS A4)                 */}
              {/* ========================================================================= */}
              {isA4 && mode === 'single' && order && (
                <div className="space-y-5 text-gray-900">
                  {/* KOP SURAT / HEADER RESMI A4 */}
                  <div className="border-b-2 border-gray-900 pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h1 className="text-xl font-black tracking-tight text-gray-900 uppercase">
                          HIGO PONDOK
                        </h1>
                        <p className="text-xs font-semibold text-gray-600">
                          Sistem Layanan Pesan Antar Santri • Pondok Pesantren
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Invoice / Bukti Pembelian & Pengantaran Resmi
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-gray-900 text-white font-black text-xs rounded-md uppercase tracking-wider">
                          INVOICE PESANAN
                        </span>
                        <p className="text-sm font-bold text-gray-900 mt-1">#ORD-{order.id}</p>
                        <p className="text-[11px] text-gray-500">{formatDateTime(order.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* GRID INFORMASI: PESANAN & SANTRI PEMESAN */}
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                    {/* Kolom 1: Info Pemesan */}
                    {(() => {
                      const info = getSantriReceiptInfo(order.user);
                      return (
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">DATA SANTRI / PEMESAN:</p>
                          <p className="text-sm font-bold text-gray-900">
                            {info.santriName}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Wali:</span> {info.waliName}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Asrama / Kamar:</span> {info.santriRoom}
                          </p>
                          {(info.santriClass || info.santriLevel) && (
                            <p className="text-gray-600">
                              <span className="font-semibold">Kelas:</span> {info.santriClass} {info.santriLevel ? `(${info.santriLevel})` : ''}
                            </p>
                          )}
                          {order.delivery_location && (
                            <p className="text-gray-600">
                              <span className="font-semibold">Tujuan Antar:</span> {order.delivery_location}
                            </p>
                          )}
                        </div>
                      );
                    })()}

                    {/* Kolom 2: Info Toko, Kurir & Status */}
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">INFO TOKO & PENGANTARAN:</p>
                      <p className="text-sm font-bold text-gray-900">
                        🏪 {order.canteen?.name || 'Kantin Pondok'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Kurir:</span> {order.courier?.name || courierName || 'Petugas Kurir'}
                      </p>
                      <div className="pt-1 flex items-center justify-end gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : order.payment_status === 'waiting_confirmation'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {order.payment_status === 'paid' ? '✅ Lunas' : order.payment_status === 'waiting_confirmation' ? '⏳ Verifikasi' : '⚠️ Belum Lunas'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase bg-gray-200 text-gray-800 border border-gray-300">
                          Status: {order.status === 'completed' ? 'Selesai' : order.status === 'processing' ? 'Sedang Diproses' : order.status === 'cancelled' ? 'Dibatalkan' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* TABEL ITEM / MENU PESANAN */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-gray-200">
                      <thead>
                        <tr className="border-b-2 border-gray-800 text-[11px] font-bold uppercase text-gray-700 bg-gray-100">
                          <th className="py-2.5 px-3 w-[45px] text-center shrink-0 border-r border-gray-200">No</th>
                          <th className="py-2.5 px-3 min-w-[200px] border-r border-gray-200">Nama Menu / Produk</th>
                          <th className="py-2.5 px-3 text-center w-[80px] shrink-0 border-r border-gray-200">Jumlah</th>
                          <th className="py-2.5 px-3 text-right w-[120px] shrink-0 border-r border-gray-200">Harga Satuan</th>
                          <th className="py-2.5 px-3 text-right w-[130px] shrink-0">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-xs">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => {
                            const qty = item.quantity || 1;
                            const price = parseFloat(item.price || 0);
                            const sub = parseFloat(item.subtotal || price * qty);
                            return (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="py-2.5 px-3 text-center text-gray-500 border-r border-gray-200 font-medium">{idx + 1}</td>
                                <td className="py-2.5 px-3 font-semibold border-r border-gray-200">
                                  {item.product?.name || 'Produk'}
                                  {item.notes && (
                                    <span className="block text-[11px] text-gray-500 font-normal italic mt-0.5">
                                      Catatan: {item.notes}
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold border-r border-gray-200">{qty}</td>
                                <td className="py-2.5 px-3 text-right border-r border-gray-200">Rp {formatRupiah(price)}</td>
                                <td className="py-2.5 px-3 text-right font-bold">Rp {formatRupiah(sub)}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td className="py-3 px-3 text-center text-gray-500 border-r border-gray-200">1</td>
                            <td className="py-3 px-3 font-semibold border-r border-gray-200">
                              {order.custom_notes || 'Pesanan Khusus / Titip Beli'}
                              <span className="block text-[11px] text-gray-500 font-normal italic">
                                *Pesanan khusus / custom order
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center font-bold border-r border-gray-200">1</td>
                            <td className="py-3 px-3 text-right border-r border-gray-200">Rp {formatRupiah(Math.max(0, parseFloat(order.total_price || 0) - parseFloat(order.delivery_fee || 0) - parseFloat(order.admin_fee || 0)))}</td>
                            <td className="py-3 px-3 text-right font-bold">Rp {formatRupiah(Math.max(0, parseFloat(order.total_price || 0) - parseFloat(order.delivery_fee || 0) - parseFloat(order.admin_fee || 0)))}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* SUMMARY TOTAL BOX */}
                  <div className="flex justify-end pt-2">
                    <div className="w-full sm:w-72 bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal Belanja:</span>
                        <span className="font-semibold">
                          Rp {formatRupiah(order.items?.reduce((s, i) => s + parseFloat(i.subtotal || i.price * i.quantity), 0) || (parseFloat(order.total_price || 0) - parseFloat(order.delivery_fee || 0) - parseFloat(order.admin_fee || 0)))}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Biaya Pengantaran (Ongkir):</span>
                        <span className="font-semibold">Rp {formatRupiah(order.delivery_fee || 0)}</span>
                      </div>
                      {parseFloat(order.admin_fee || 0) > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Biaya Layanan / Admin:</span>
                          <span className="font-semibold">Rp {formatRupiah(order.admin_fee || 0)}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t-2 border-gray-800 flex justify-between items-center text-sm font-black text-gray-900">
                        <span>TOTAL BAYAR:</span>
                        <span className="text-base text-green-700">Rp {formatRupiah(order.total_price || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* TANDA TANGAN & PENGESAHAN (3 PIHAK) */}
                  <div className="pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center text-xs">
                    <div>
                      <p className="text-gray-500 font-semibold mb-12">Penerima / Santri</p>
                      <p className="font-bold text-gray-900 underline">{order.user?.santri_name || order.user?.name || '( .......................... )'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-semibold mb-12">Petugas Kurir</p>
                      <p className="font-bold text-gray-900 underline">{order.courier?.name || courierName || '( .......................... )'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-semibold mb-12">Pihak Kantin / Admin</p>
                      <p className="font-bold text-gray-900 underline">{order.canteen?.name || 'Admin Higo Pondok'}</p>
                    </div>
                  </div>

                  {/* FOOTER NOTULENSI */}
                  <div className="text-center pt-3 border-t border-dotted border-gray-300 text-[10px] text-gray-400">
                    Dokumen ini sah dan dicetak secara otomatis dari sistem Higo Pondok pada {formatDateTime(new Date().toISOString())}.
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 2. FORMAT A4: BATCH RECAP / MANIFES ANTARAN PESANAN (KERTAS A4 BESAR)      */}
              {/* ========================================================================= */}
              {isA4 && mode === 'batch' && (
                <div className="space-y-5 text-gray-900">
                  {/* KOP MANIFES A4 */}
                  <div className="border-b-2 border-gray-900 pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h1 className="text-xl font-black tracking-tight text-gray-900 uppercase">
                          HIGO PONDOK
                        </h1>
                        <p className="text-xs font-bold text-gray-700 uppercase">
                          {title || 'LEMBAR REKAPITULASI & MANIFES DAFTAR ANTARAN PESANAN'}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Pondok Pesantren • Dicetak pada: {formatDateTime(new Date().toISOString())}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="inline-block px-3 py-1 bg-green-700 text-white font-black text-xs rounded-md uppercase tracking-wider">
                          REKAP TERPADU
                        </span>
                        <p className="text-xs font-bold text-gray-800">
                          Petugas: {courierName || 'Petugas / Kurir'}
                        </p>
                        <p className="text-xs font-bold text-gray-800">
                          Total: {filteredBatchOrders.length} Pesanan
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SUMMARY CARDS KEUANGAN */}
                  <div className="grid grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-gray-200 text-center">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Total Pesanan</span>
                      <span className="text-base font-black text-gray-900">{filteredBatchOrders.length}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-gray-200 text-center">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Uang Belanja Produk</span>
                      <span className="text-sm font-black text-gray-900">Rp {formatRupiah(batchSummary.products)}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-gray-200 text-center">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Total Ongkir</span>
                      <span className="text-sm font-black text-blue-700">Rp {formatRupiah(batchSummary.delivery)}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-gray-200 text-center">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Grand Total Omzet</span>
                      <span className="text-sm font-black text-green-700">Rp {formatRupiah(batchSummary.grandTotal)}</span>
                    </div>
                  </div>

                  {/* TABEL MANIFES DETAIL SEMUA PESANAN */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-gray-300 text-xs">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300 text-[10px] font-bold uppercase text-gray-700">
                          <th className="py-2.5 px-2 border-r border-gray-300 text-center w-[35px] shrink-0">No</th>
                          <th className="py-2.5 px-2 border-r border-gray-300 w-[85px] shrink-0 whitespace-nowrap">Order ID</th>
                          <th className="py-2.5 px-2.5 border-r border-gray-300 min-w-[150px] w-[26%]">Santri & Asrama</th>
                          <th className="py-2.5 px-2 border-r border-gray-300 w-[110px] min-w-[100px]">Toko / Kantin</th>
                          <th className="py-2.5 px-2.5 border-r border-gray-300 min-w-[150px] w-[28%]">Detail Menu</th>
                          <th className="py-2.5 px-2 border-r border-gray-300 text-right w-[85px] shrink-0 whitespace-nowrap">Total</th>
                          <th className="py-2.5 px-2 border-r border-gray-300 text-center w-[55px] shrink-0 whitespace-nowrap">Bayar</th>
                          <th className="py-2.5 px-2 text-center w-[65px] shrink-0">Paraf</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-300 text-[11px]">
                        {filteredBatchOrders.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="py-6 text-center text-gray-500 font-semibold">
                              Tidak ada data pesanan aktif untuk filter saat ini.
                            </td>
                          </tr>
                        ) : (
                          filteredBatchOrders.map((o, idx) => {
                            const itemsSummary = o.items && o.items.length > 0
                              ? o.items.map(i => `${i.quantity}x ${i.product?.name || 'Produk'}`).join(', ')
                              : (o.custom_notes || 'Pesanan Khusus');

                            return (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="py-2 px-2 text-center border-r border-gray-300 text-gray-500 font-bold">{idx + 1}</td>
                                <td className="py-2 px-2 border-r border-gray-300 font-bold whitespace-nowrap">
                                  #ORD-{o.id}
                                  <span className="block text-[9px] text-gray-500 font-normal">
                                    {formatDateTime(o.created_at).split(' ')[1] || ''}
                                  </span>
                                </td>
                                <td className="py-2 px-2.5 border-r border-gray-300">
                                  <span className="font-bold block text-gray-900 leading-tight">
                                    {o.user?.santri_name || o.user?.name || '-'}
                                  </span>
                                  <span className="text-[9.5px] text-gray-600 block mt-0.5 leading-tight">
                                    📍 {o.user?.santri_room || o.delivery_location || '-'}
                                  </span>
                                </td>
                                <td className="py-2 px-2 border-r border-gray-300 font-semibold text-[10.5px] leading-tight">
                                  {o.canteen?.name || 'Kantin'}
                                </td>
                                <td className="py-2 px-2.5 border-r border-gray-300 text-[10.5px] text-gray-700 leading-tight">
                                  {itemsSummary}
                                </td>
                                <td className="py-2 px-2 border-r border-gray-300 text-right font-bold text-gray-900 whitespace-nowrap">
                                  Rp {formatRupiah(o.total_price)}
                                </td>
                                <td className="py-2 px-2 border-r border-gray-300 text-center whitespace-nowrap">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                    o.payment_status === 'paid'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {o.payment_status === 'paid' ? 'LUNAS' : 'COD'}
                                  </span>
                                </td>
                                <td className="py-2 px-2 text-center text-gray-400">
                                  <div className="w-10 h-5 border border-dashed border-gray-400 rounded mx-auto"></div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* AREA TTD MANIFES RESMI */}
                  <div className="pt-6 border-t border-gray-200 grid grid-cols-2 gap-8 text-center text-xs">
                    <div>
                      <p className="text-gray-500 font-semibold mb-12">Petugas Kurir / Pengantar</p>
                      <p className="font-bold text-gray-900 underline">{courierName || '( ........................................ )'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-semibold mb-12">Pengurus / Admin Higo Pondok</p>
                      <p className="font-bold text-gray-900 underline">( ........................................ )</p>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="text-center pt-3 border-t border-dotted border-gray-300 text-[10px] text-gray-400">
                    Dokumen Rekapitulasi Manifes Resmi • Higo Pondok POS System
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 3. FORMAT THERMAL: SINGLE ORDER (58mm / 80mm THERMAL RECEIPT)             */}
              {/* ========================================================================= */}
              {!isA4 && mode === 'single' && order && (
                <div className="space-y-1.5 bg-white text-black">
                  {/* HEADER */}
                  <div className="text-center pb-1.5 border-b border-dashed border-black">
                    <h2 className="text-sm font-black uppercase tracking-wider">HIGO PONDOK</h2>
                    <p className="text-[9px] text-gray-600">Layanan Pesan Antar Santri</p>
                    
                    <div className="text-left text-[10px] mt-1.5 space-y-0.5 pt-1 border-t border-dotted border-gray-400">
                      <div className="flex justify-between items-start gap-1">
                        <span className="shrink-0 text-gray-700">No. Order:</span>
                        <span className="font-bold text-right">#ORD-{order.id}</span>
                      </div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="shrink-0 text-gray-700">Waktu:</span>
                        <span className="text-right">{formatDateTime(order.created_at)}</span>
                      </div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="shrink-0 text-gray-700">Toko:</span>
                        <span className="font-bold text-right break-words">{order.canteen?.name || 'Kantin Pondok'}</span>
                      </div>
                      {order.courier?.name && (
                        <div className="flex justify-between items-start gap-1">
                          <span className="shrink-0 text-gray-700">Kurir:</span>
                          <span className="text-right break-words">{order.courier.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DATA SANTRI / PEMESAN */}
                  {(() => {
                    const info = getSantriReceiptInfo(order.user);
                    return (
                      <div className="py-1 border-b border-dashed border-black text-[10px] space-y-0.5">
                        <div className="flex justify-between items-start gap-1">
                          <span className="shrink-0 text-gray-700">Santri:</span>
                          <span className="font-bold text-right break-words">{info.santriName}</span>
                        </div>
                        <div className="flex justify-between items-start gap-1">
                          <span className="shrink-0 text-gray-700">Asrama:</span>
                          <span className="font-bold text-right break-words">{info.santriRoom}</span>
                        </div>
                        {(info.santriClass || info.santriLevel) && (
                          <div className="flex justify-between items-start gap-1">
                            <span className="shrink-0 text-gray-700">Kelas:</span>
                            <span className="text-right">{info.santriClass} {info.santriLevel ? `(${info.santriLevel})` : ''}</span>
                          </div>
                        )}
                        {order.delivery_location && (
                          <div className="flex justify-between items-start gap-1">
                            <span className="shrink-0 text-gray-700">Antar:</span>
                            <span className="text-right break-words">{order.delivery_location}</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* ITEM LIST */}
                  <div className="py-1 border-b border-dashed border-black">
                    <div className="flex justify-between font-bold text-[10px] pb-1 border-b border-dotted border-gray-400">
                      <span>MENU</span>
                      <span className="shrink-0">TOTAL</span>
                    </div>
                    <div className="pt-1 space-y-1 text-[10px]">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => {
                          const qty = item.quantity || 1;
                          const price = parseFloat(item.price || 0);
                          const sub = parseFloat(item.subtotal || price * qty);
                          return (
                            <div key={idx} className="space-y-0.5">
                              <div className="flex justify-between items-start gap-1 font-semibold">
                                <span className="break-words">{item.product?.name || 'Produk'}</span>
                                <span className="shrink-0 font-bold">{formatRupiah(sub)}</span>
                              </div>
                              <div className="text-[9px] text-gray-600 flex justify-between items-center">
                                <span>{qty} x {formatRupiah(price)}</span>
                                {item.notes && <span className="italic text-[8.5px] truncate max-w-[120px]">({item.notes})</span>}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="space-y-0.5">
                          <div className="flex justify-between items-start gap-1 font-semibold">
                            <span className="break-words">{order.custom_notes || 'Pesanan Khusus / Titip Beli'}</span>
                            <span className="shrink-0 font-bold">{formatRupiah(Math.max(0, parseFloat(order.total_price || 0) - parseFloat(order.delivery_fee || 0) - parseFloat(order.admin_fee || 0)))}</span>
                          </div>
                          <div className="text-[9px] text-gray-600">1 x Pesanan Khusus</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FINANCIAL TOTALS */}
                  <div className="py-1 border-b border-dashed border-black text-[10px] space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Subtotal:</span>
                      <span>Rp {formatRupiah(order.items?.reduce((s, i) => s + parseFloat(i.subtotal || i.price * i.quantity), 0) || (parseFloat(order.total_price || 0) - parseFloat(order.delivery_fee || 0) - parseFloat(order.admin_fee || 0)))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Ongkir:</span>
                      <span>Rp {formatRupiah(order.delivery_fee || 0)}</span>
                    </div>
                    {parseFloat(order.admin_fee || 0) > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Admin:</span>
                        <span>Rp {formatRupiah(order.admin_fee || 0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-black text-[11px] pt-1 border-t border-dotted border-black">
                      <span>TOTAL:</span>
                      <span>Rp {formatRupiah(order.total_price || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-[9.5px] pt-0.5">
                      <span>STATUS:</span>
                      <span className="uppercase text-right">
                        {order.payment_status === 'paid' ? '[ LUNAS ]' : order.payment_status === 'waiting_confirmation' ? '[ VERIFIKASI ]' : '[ BELUM LUNAS ]'}
                      </span>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="text-center pt-1.5 text-[9px] space-y-0.5">
                    <p className="font-bold">Terima Kasih</p>
                    <p>Semoga Berkah & Bermanfaat</p>
                    <p className="text-[8px] text-gray-500 pt-0.5">*** Higo Pondok POS ***</p>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 4. FORMAT THERMAL: BATCH RECAP (58mm / 80mm THERMAL MANIFEST)             */}
              {/* ========================================================================= */}
              {!isA4 && mode === 'batch' && (
                <div className="space-y-1.5 bg-white text-black">
                  {/* HEADER */}
                  <div className="text-center pb-1.5 border-b border-dashed border-black">
                    <h2 className="text-xs font-black uppercase tracking-wider">{title || 'REKAP DAFTAR PESANAN'}</h2>
                    <p className="text-[9px] font-bold">HIGO PONDOK</p>
                    
                    <div className="text-left text-[10px] mt-1.5 space-y-0.5 pt-1 border-t border-dotted border-gray-400">
                      <div className="flex justify-between items-start gap-1">
                        <span className="shrink-0 text-gray-700">Petugas/Kurir:</span>
                        <span className="font-bold text-right break-words">{courierName || 'Petugas'}</span>
                      </div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="shrink-0 text-gray-700">Waktu:</span>
                        <span className="text-right">{formatDateTime(new Date().toISOString())}</span>
                      </div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="shrink-0 text-gray-700">Total Pesanan:</span>
                        <span className="font-bold text-right">{filteredBatchOrders.length} Pesanan</span>
                      </div>
                    </div>
                  </div>

                  {/* RINGKASAN KEUANGAN */}
                  <div className="py-1 border-b border-dashed border-black text-[10px] space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Uang Produk:</span>
                      <span>Rp {formatRupiah(batchSummary.products)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total Ongkir:</span>
                      <span>Rp {formatRupiah(batchSummary.delivery)}</span>
                    </div>
                    <div className="flex justify-between items-center font-black text-[11px] pt-1 border-t border-dotted border-black">
                      <span>GRAND TOTAL:</span>
                      <span>Rp {formatRupiah(batchSummary.grandTotal)}</span>
                    </div>
                  </div>

                  {/* DAFTAR ANTARAN DETAIL */}
                  <div className="py-1 border-b border-dashed border-black">
                    <p className="font-bold text-[10px] pb-1 border-b border-dotted border-gray-400">
                      DAFTAR PESANAN SANTRI:
                    </p>
                    <div className="pt-1.5 space-y-2 text-[10px]">
                      {filteredBatchOrders.length === 0 ? (
                        <div className="text-center py-2 text-gray-500 text-[10px]">
                          Tidak ada pesanan aktif pada daftar ini.
                        </div>
                      ) : (
                        filteredBatchOrders.map((o, idx) => {
                          const statusLabel = o.status === 'pending' ? 'Menunggu' : o.status === 'processing' ? 'Sedang Diantar' : o.status === 'completed' ? 'Selesai' : o.status;
                          return (
                            <div key={idx} className="border-b border-dotted border-gray-300 pb-1.5 space-y-0.5">
                              <div className="flex items-start justify-between gap-1 font-bold">
                                <span className="break-words">[ ] #{o.id} {o.user?.santri_name || o.user?.name}</span>
                                <span className="shrink-0">{formatRupiah(o.total_price)}</span>
                              </div>
                              <div className="text-[9px] text-gray-700 pl-2 space-y-0.5">
                                <div className="break-words">📍 {o.user?.santri_room || '-'}</div>
                                <div className="break-words">🏪 {o.canteen?.name || 'Kantin'}</div>
                                <div className="flex justify-between items-center pt-0.5 text-[8.5px]">
                                  <span>{o.payment_status === 'paid' ? 'LUNAS' : 'COD / TUNAI'}</span>
                                  <span className="font-semibold text-gray-800">({statusLabel})</span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="text-center pt-1.5 text-[9px] space-y-0.5">
                    <p className="font-bold">Selamat Bertugas</p>
                    <p>Pastikan Pesanan Diterima Santri</p>
                    <p className="text-[8px] text-gray-500 pt-0.5">*** Higo Pondok System ***</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MODAL FOOTER ACTION BUTTONS */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 bg-white dark:bg-gray-900 no-print flex-wrap">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-xs transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              disabled={filteredBatchOrders.length === 0 && mode === 'batch'}
              className="flex-[2] py-3 bg-green-600 hover:bg-green-700 active:scale-98 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-green-600/20 transition-all disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              {isA4
                ? '🖨️ Cetak Kertas A4 (Print A4)'
                : `🖨️ Cetak ke Printer Thermal (${paperWidth})`}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
