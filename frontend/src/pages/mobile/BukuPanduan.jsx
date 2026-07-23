import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ROLES } from '../../config/roles';

export default function BukuPanduan() {
  const [openSection, setOpenSection] = useState('umum');
  const { user } = useAuthStore();
  const userRole = user?.role;

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const SectionHeader = ({ id, title }) => (
    <button 
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-bold text-gray-900 dark:text-white text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <span>{title}</span>
      {openSection === id ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
    </button>
  );

  return (
    <div className="space-y-4 animate-fade-in-up pb-24 font-sans px-4 md:px-0 mt-4 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-green-600" />
          Buku Panduan & SOP Hidayah Go
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Manual Operasional Unit Jastip Makanan, Minuman, dan Obat-obatan BUMP Al Hidayah - PPTQ Al Mannan.
        </p>
      </div>

      {/* INFORMASI UMUM (Tampil untuk semua role) */}
      <div className="space-y-2">
        <SectionHeader id="umum" title="Bagian I - VII: Informasi Umum & Layanan" />
        {openSection === 'umum' && (
          <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 space-y-6">
            
            <section>
              <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">I. Latar Belakang</h3>
              <p>Hidayah Go adalah unit usaha jasa titip atau jastip di bawah naungan BUMP Al Hidayah PPTQ Al Mannan. Layanan ini dibentuk untuk membantu memenuhi kebutuhan santri dan santriwati dalam pemesanan makanan malam, minuman kelas kafe, serta obat-obatan yang bersifat mendesak maupun tidak mendesak.</p>
              <p className="mt-2">Hidayah Go hadir karena santri membutuhkan akses makanan dari luar pondok pada malam hari, namun tetap dalam pengawasan pengurus. Selain itu, ini menjadi unit usaha pesantren yang dikelola secara amanah dan profesional.</p>
            </section>

            <section>
              <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">II. Profil Layanan</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b dark:border-gray-700"><td className="py-2 font-semibold w-1/3">Nama Layanan</td><td className="py-2">Hidayah Go</td></tr>
                    <tr className="border-b dark:border-gray-700"><td className="py-2 font-semibold">Jenis Layanan</td><td className="py-2">Jastip makanan, minuman kelas kafe, dan obat-obatan</td></tr>
                    <tr className="border-b dark:border-gray-700"><td className="py-2 font-semibold">Area Layanan</td><td className="py-2">Kec. Kauman dan Kota Tulungagung</td></tr>
                    <tr className="border-b dark:border-gray-700"><td className="py-2 font-semibold">Waktu Order</td><td className="py-2">09.00 - 17.00 WIB</td></tr>
                    <tr><td className="py-2 font-semibold">Pengantaran</td><td className="py-2">21.00 WIB di Kantin/Pos Pengurus</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">III - IV. Jasa & Waktu Layanan</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Makanan:</strong> Area Kauman (bakso, soto, dll) & Kota (Gacoan, McD, dll).</li>
                <li><strong>Minuman:</strong> Minuman kelas kafe dengan kemasan aman. Admin berhak menolak kemasan rawan tumpah.</li>
                <li><strong>Obat-obatan:</strong> Obat umum & darurat (bisa on-call sewaktu-waktu).</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">V - VI. Area & Tarif Jasa</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border dark:border-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr><th className="p-2 border dark:border-gray-700">Area</th><th className="p-2 border dark:border-gray-700">Ketentuan</th><th className="p-2 border dark:border-gray-700">Tarif</th></tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-2 border dark:border-gray-700">Kauman</td><td className="p-2 border dark:border-gray-700">1-5 pcs dari tempat sama</td><td className="p-2 border dark:border-gray-700 font-bold">Rp3.000</td></tr>
                    <tr><td className="p-2 border dark:border-gray-700">Kota</td><td className="p-2 border dark:border-gray-700">1-5 pcs dari tempat sama</td><td className="p-2 border dark:border-gray-700 font-bold">Rp5.000</td></tr>
                    <tr><td className="p-2 border dark:border-gray-700">Kauman</td><td className="p-2 border dark:border-gray-700">&gt;5 pcs dari tempat sama</td><td className="p-2 border dark:border-gray-700 font-bold">Rp6.000</td></tr>
                    <tr><td className="p-2 border dark:border-gray-700">Kota</td><td className="p-2 border dark:border-gray-700">&gt;5 pcs dari tempat sama</td><td className="p-2 border dark:border-gray-700 font-bold">Rp10.000</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs italic">*Tarif dihitung per orang/pemesan, bukan per item satuan. Jika dari dua merchant berbeda, tarif dihitung sesuai jumlah merchant.</p>
            </section>

          </div>
        )}
      </div>

      {/* SOP SANTRI (Tampil untuk Admin & Santri) */}
      {(userRole === ROLES.USER || userRole === ROLES.ADMIN) && (
        <div className="space-y-2">
          <SectionHeader id="santri" title="SOP Santri & Wali Santri" />
          {openSection === 'santri' && (
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 space-y-6">
              <section>
                <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">Ketentuan Umum Pemesanan</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Santri hanya boleh memesan melalui sistem resmi Hidayah Go lewat HP asrama.</li>
                  <li>Dilarang memesan langsung kepada driver/ojek tanpa sepengetahuan admin.</li>
                  <li>Pesanan wajib dibayar lunas sebelum pukul 17.00 WIB. Belum lunas = batal.</li>
                  <li>Pengambilan pesanan di kantin/pos pukul 21.00 WIB dengan tertib.</li>
                  <li>Pesanan harus ditulis jelas dan lengkap. Jika pesan obat, harus mencantumkan nama obat atau keluhan.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">Alur Pemesanan Santri</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Santri membuka aplikasi Hidayah Go.</li>
                  <li>Memilih area pemesanan: Kauman atau Kota.</li>
                  <li>Memilih merchant/tempat makan.</li>
                  <li>Menulis detail pesanan, jumlah, catatan level pedas, dan minuman jika ada.</li>
                  <li>Memilih metode pembayaran (Transfer, VA, atau Bayar di Kantin).</li>
                  <li>Menyelesaikan pembayaran sebelum pukul 17.00 WIB.</li>
                  <li>Menunggu konfirmasi admin.</li>
                  <li>Mengambil pesanan di kantin pada pukul 21.00 WIB.</li>
                </ol>
              </section>

              <section>
                <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">Sistem Surat Peringatan (SP) Santri</h3>
                <ul className="space-y-3">
                  <li><strong>SP 1 (Teguran):</strong> Format pesanan tidak lengkap, terlambat ambil pesanan, tidak tertib antre.</li>
                  <li><strong>SP 2 (Peringatan Keras):</strong> Belum bayar tapi maksa diproses, membatalkan pesanan setelah dibeli driver, mengambil pesanan orang lain.</li>
                  <li><strong>SP 3 (Pembatasan Layanan):</strong> Pesan langsung ke driver, tidak bayar pesanan yang sudah dibeli, manipulasi pembayaran, tidak sopan ke petugas.</li>
                  <li><strong>SP 4 (Pencabutan Hak):</strong> Penipuan pembayaran, pesan barang terlarang, kekerasan/ancaman, merusak nama baik lembaga.</li>
                </ul>
              </section>
            </div>
          )}
        </div>
      )}

      {/* SOP KANTIN (Tampil untuk Admin & Kantin) */}
      {(userRole === ROLES.KANTIN || userRole === ROLES.ADMIN) && (
        <div className="space-y-2">
          <SectionHeader id="kantin" title="SOP Kantin Asrama & Pembayaran" />
          {openSection === 'kantin' && (
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 space-y-6">
              <section>
                <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">Pembayaran Melalui Kantin (Bab XII)</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Santri dapat memilih metode Bayar Tunai di Kantin saat memesan Hidayah Go.</li>
                  <li>Petugas kantin menerima uang pembayaran dan mencatat nama santri, asrama, merchant, dan total pembayaran.</li>
                  <li>Petugas kantin wajib melaporkan status pembayaran ke admin sistem Hidayah Go (mengubah status pesanan menjadi Lunas di aplikasi/grup).</li>
                  <li>Admin hanya akan memproses pesanan setelah status pembayaran Lunas (wajib sebelum pukul 17.00 WIB).</li>
                  <li>Petugas kantin wajib menyetorkan uang transaksi harian kepada Bendahara BUMP Al Hidayah.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">Pengambilan Pesanan di Kantin (Bab XIII)</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Seluruh pesanan makanan dan minuman dari luar akan dikumpulkan di kantin atau pos pengurus (tiba sekitar pukul 20.45 WIB).</li>
                  <li>Admin akan memisahkan pesanan berdasarkan nama dan asrama lalu menyerahkannya ke petugas kantin.</li>
                  <li>Pada pukul 21.00 WIB, santri datang untuk mengambil pesanan dengan antre yang tertib.</li>
                  <li>Petugas kantin bertugas mencocokkan nama dengan daftar pesanan lalu menyerahkan pesanan kepada santri.</li>
                  <li>Pesanan hanya dapat diambil oleh pemilik pesanan atau perwakilan yang secara resmi diizinkan. Dilarang keras membuka pesanan milik orang lain.</li>
                </ul>
              </section>
            </div>
          )}
        </div>
      )}

      {/* SOP DRIVER (Tampil untuk Admin & Kurir) */}
      {(userRole === ROLES.KURIR || userRole === ROLES.ADMIN) && (
        <div className="space-y-2">
          <SectionHeader id="driver" title="SOP Driver / Ojek Hidayah Go" />
          {openSection === 'driver' && (
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 space-y-6">
              <section>
                <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">Tugas & Tanggung Jawab (Bab X)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Menerima daftar pesanan (manifest) dari admin.</li>
                  <li>Membeli pesanan sesuai merchant dan detail yang diberikan (pastikan jumlah, level pedas, dan catatan sesuai).</li>
                  <li><strong>Wajib</strong> meminta dan menyimpan nota pembelian asli dari outlet.</li>
                  <li>Konfirmasi segera ke admin jika menu habis, harga berubah, outlet tutup, atau antrean sangat panjang.</li>
                  <li>Menjaga makanan/minuman agar aman, rapi, tidak tumpah/rusak.</li>
                  <li>Tiba di pondok maksimal pukul 20.45 WIB.</li>
                  <li>Menyerahkan seluruh pesanan dan nota kepada admin/pengurus, <strong>bukan langsung kepada santri</strong>.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">Etika Driver</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Wajib berpakaian sopan saat mengambil/mengantar makanan.</li>
                  <li>Menjaga adab selama di lingkungan pondok pesantren (dilarang merokok di area pondok).</li>
                  <li>Dilarang berkata kasar atau berinteraksi berlebihan dengan santri/santriwati.</li>
                  <li>Wajib menjaga amanah uang tunai (jika ada), pesanan, dan nota.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">Sistem Surat Peringatan (SP) Driver (Bab XVII)</h3>
                <ul className="space-y-3">
                  <li><strong>SP 1 (Teguran):</strong> Terlambat datang tanpa alasan, lambat merespon admin, tidak bawa tas makanan layak, kurang teliti membaca pesanan, lupa nota.</li>
                  <li><strong>SP 2 (Peringatan Keras):</strong> Tidak ikut rute admin, tidak konfirmasi perubahan harga/stok, merokok di area larangan, pesanan tertukar, komunikasi tidak sopan.</li>
                  <li><strong>SP 3 (Skors/Suspensi):</strong> Menyerahkan pesanan langsung ke santri (bypass admin), menghilangkan uang/nota berulang, merusak pesanan secara lalai berat, berinteraksi berlebihan dengan santri.</li>
                  <li><strong>SP 4 (Pemutusan Kemitraan):</strong> Mengambil barang/uang pesanan (pencurian), manipulasi harga/nota (penipuan), tindakan asusila/kekerasan, merusak nama baik lembaga.</li>
                </ul>
              </section>
            </div>
          )}
        </div>
      )}

      {/* SOP ADMIN (Khusus Admin) */}
      {userRole === ROLES.ADMIN && (
        <div className="space-y-2">
          <SectionHeader id="admin" title="SOP Admin Pemegang HP" />
          {openSection === 'admin' && (
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 space-y-6">
              <section>
                <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">Jadwal Kerja Admin (Bab IX)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>09.00 - 17.00:</strong> Menerima order, cek kelengkapan pesanan, verifikasi pembayaran lunas/belum lunas.</li>
                  <li><strong>17.00 - 18.00:</strong> Menutup order, membatalkan pesanan yang belum lunas, mengelompokkan pesanan berdasar rute/merchant, membuat manifest.</li>
                  <li><strong>18.30:</strong> Mengirim manifest kepada driver, memberi arahan rute.</li>
                  <li><strong>20.45 - 21.00:</strong> Menerima pesanan dari driver, mencocokkan nota, memisahkan per nama/asrama, serahkan ke kantin.</li>
                  <li><strong>Sewaktu-waktu:</strong> Menangani kebutuhan obat darurat (memanggil ojek on-call).</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">XIV. Profit Sharing Harian</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border dark:border-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr><th className="p-2 border dark:border-gray-700">Area & Ketentuan</th><th className="p-2 border dark:border-gray-700">Driver (80%)</th><th className="p-2 border dark:border-gray-700">BUMP (20%)</th></tr>
                    </thead>
                    <tbody>
                      <tr><td className="p-2 border dark:border-gray-700">Kauman (Rp3.000)</td><td className="p-2 border dark:border-gray-700">Rp2.400</td><td className="p-2 border dark:border-gray-700">Rp600</td></tr>
                      <tr><td className="p-2 border dark:border-gray-700">Kota (Rp5.000)</td><td className="p-2 border dark:border-gray-700">Rp4.000</td><td className="p-2 border dark:border-gray-700">Rp1.000</td></tr>
                      <tr><td className="p-2 border dark:border-gray-700">Kauman &gt;5 pcs (Rp6.000)</td><td className="p-2 border dark:border-gray-700">Rp4.800</td><td className="p-2 border dark:border-gray-700">Rp1.200</td></tr>
                      <tr><td className="p-2 border dark:border-gray-700">Kota &gt;5 pcs (Rp10.000)</td><td className="p-2 border dark:border-gray-700">Rp8.000</td><td className="p-2 border dark:border-gray-700">Rp2.000</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>
              
              <section>
                <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">Sistem SP Admin (Bab XVIII)</h3>
                <ul className="space-y-3">
                  <li><strong>SP 1:</strong> Terlambat buka/tutup order, lupa memberi status pesanan, rekap tidak lengkap.</li>
                  <li><strong>SP 2:</strong> Memproses pesanan belum lunas tanpa izin, lupa menyimpan nota, salah hitung total, abaikan komplain.</li>
                  <li><strong>SP 3:</strong> Menggunakan dana transaksi, menghilangkan nota berulang, mengabaikan obat darurat, menyalahgunakan HP admin.</li>
                  <li><strong>SP 4:</strong> Manipulasi keuangan, korupsi dana, bocorkan akses admin, kerja sama jahat.</li>
                </ul>
              </section>
            </div>
          )}
        </div>
      )}

      {/* KOMPLAIN & LAINNYA (Tampil untuk semua) */}
      <div className="space-y-2">
        <SectionHeader id="komplain" title="Ketentuan Komplain & Obat-obatan" />
        {openSection === 'komplain' && (
          <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 space-y-6">
            <section>
              <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">Ketentuan Komplain (Bab XV)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800/50">
                  <h4 className="font-bold text-green-800 dark:text-green-300 mb-1">Komplain yang Diproses</h4>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-green-700 dark:text-green-400">
                    <li>Pesanan tidak sesuai catatan.</li>
                    <li>Jumlah kurang atau menu tertukar.</li>
                    <li>Minuman tumpah/rusak karena driver.</li>
                    <li>Nota berbeda dengan harga tagihan.</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800/50">
                  <h4 className="font-bold text-red-800 dark:text-red-300 mb-1">Komplain yang Ditolak</h4>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-red-700 dark:text-red-400">
                    <li>Santri salah menulis pesanan/lupa tulis catatan khusus.</li>
                    <li>Pesanan basi karena santri telat ambil pesanan.</li>
                    <li>Rasa makanan tidak sesuai selera.</li>
                    <li>Menu habis dan santri sudah menyetujui opsi pengganti.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2 border-b pb-1">Ketentuan Pemesanan Obat</h3>
              <p>Pemesanan obat harus menyebutkan nama obat atau keluhannya dengan jelas. Untuk obat tertentu (keras), admin dapat meminta persetujuan wali/pengurus. Driver dilarang membeli obat di luar instruksi admin, dan wajib menyimpan nota apotek.</p>
            </section>
          </div>
        )}
      </div>

    </div>
  );
}
