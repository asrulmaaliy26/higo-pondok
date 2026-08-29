import React, { useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, CheckCircle, FileText, ShoppingBag, Store, User, MapPin } from 'lucide-react';

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
  const [paperWidth, setPaperWidth] = useState('58mm'); // '58mm' | '80mm'

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

    filteredBatchOrders.forEach(o => {
      const deliveryFee = parseFloat(o.delivery_fee || 0);
      const adminFee = parseFloat(o.admin_fee || 0);
      delivery += deliveryFee;

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
      grandTotal: products + delivery
    };
  }, [filteredBatchOrders]);

  const handlePrint = () => {
    window.print();
  };

  // Early return only after all hooks are declared
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* CSS PRINT RULES FOR THERMAL PRINTER (OPTIMIZED FOR 58mm / 48mm PRINTABLE HEAD) */}
      <style>{`
        @media print {
          @page {
            size: ${paperWidth === '58mm' ? '58mm auto' : '80mm auto'};
            margin: 0mm !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            width: ${paperWidth === '58mm' ? '58mm' : '80mm'} !important;
          }
          body * {
            visibility: hidden !important;
          }
          .thermal-receipt-printable, .thermal-receipt-printable * {
            visibility: visible !important;
          }
          .thermal-receipt-printable {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: ${paperWidth === '58mm' ? '48mm' : '72mm'} !important;
            max-width: ${paperWidth === '58mm' ? '48mm' : '72mm'} !important;
            margin: 0 !important;
            padding: 1mm 1mm 4mm 1mm !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
            color: #000000 !important;
            font-family: 'Consolas', 'Courier New', Courier, monospace !important;
            font-size: ${paperWidth === '58mm' ? '9.5pt' : '11pt'} !important;
            line-height: 1.2 !important;
            box-shadow: none !important;
            border: none !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-gray-100 dark:border-gray-800">
          {/* MODAL HEADER */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/80 dark:bg-gray-800/80 no-print">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 flex items-center justify-center">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                  {title || (mode === 'batch' ? `Rekap Pesanan (${filteredBatchOrders.length} Pesanan)` : `Cetak Struk #${order?.id}`)}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {mode === 'batch' ? (title || 'Rekap Daftar Pesanan') : 'Format Printer Thermal iWare 58mm'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Width Selector */}
              <div className="flex bg-gray-200 dark:bg-gray-700 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setPaperWidth('58mm')}
                  className={`px-2 py-1 rounded-md transition-all ${paperWidth === '58mm' ? 'bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 shadow-xs' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  58mm
                </button>
                <button
                  type="button"
                  onClick={() => setPaperWidth('80mm')}
                  className={`px-2 py-1 rounded-md transition-all ${paperWidth === '80mm' ? 'bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 shadow-xs' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  80mm
                </button>
              </div>
              <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-full bg-gray-200/70 dark:bg-gray-700 hover:bg-gray-300 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RECEIPT PREVIEW (SCROLLABLE - WRAPPED WITH FULL SOLID BACKGROUND) */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-200 dark:bg-gray-950 flex justify-center items-start">
            <div 
              ref={receiptRef}
              style={{ width: paperWidth === '58mm' ? '250px' : '320px' }}
              className="thermal-receipt-printable bg-white text-black p-3.5 rounded-xl shadow-xl border border-gray-300 font-mono text-[11px] leading-tight box-border shrink-0 min-h-fit my-1"
            >
              {/* ======================================================== */}
              {/* MODE 1: SINGLE ORDER RECEIPT */}
              {/* ======================================================== */}
              {mode === 'single' && order && (
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
                  <div className="py-1 border-b border-dashed border-black text-[10px] space-y-0.5">
                    <div className="flex justify-between items-start gap-1">
                      <span className="shrink-0 text-gray-700">Santri:</span>
                      <span className="font-bold text-right break-words">{order.user?.santri_name || order.user?.name || '-'}</span>
                    </div>
                    <div className="flex justify-between items-start gap-1">
                      <span className="shrink-0 text-gray-700">Asrama:</span>
                      <span className="font-bold text-right break-words">{order.user?.santri_room || '-'}</span>
                    </div>
                    {order.user?.santri_class && (
                      <div className="flex justify-between items-start gap-1">
                        <span className="shrink-0 text-gray-700">Kelas:</span>
                        <span className="text-right">{order.user.santri_class} {order.user.santri_level ? `(${order.user.santri_level})` : ''}</span>
                      </div>
                    )}
                    {order.delivery_location && (
                      <div className="flex justify-between items-start gap-1">
                        <span className="shrink-0 text-gray-700">Antar:</span>
                        <span className="text-right break-words">{order.delivery_location}</span>
                      </div>
                    )}
                  </div>

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

              {/* ======================================================== */}
              {/* ======================================================== */}
              {/* MODE 2: BATCH / COURIER MANIFEST */}
              {/* ======================================================== */}
              {mode === 'batch' && (
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
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 bg-white dark:bg-gray-900 no-print">
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
              Cetak ke Printer iWare (Print)
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
