import React from 'react';
import { Link } from '@tanstack/react-router';
import { Shield, Zap, Users, ChevronRight, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Home() {
  const token = useAuthStore((state) => state.token);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 font-sans selection:bg-green-200">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
                Higo Pondok
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#fitur" className="text-gray-600 hover:text-green-600 dark:text-gray-300 transition-colors">Fitur</a>
              <a href="#tentang" className="text-gray-600 hover:text-green-600 dark:text-gray-300 transition-colors">Tentang</a>
              <a href="#kontak" className="text-gray-600 hover:text-green-600 dark:text-gray-300 transition-colors">Kontak</a>
            </div>
            <div className="flex space-x-4 items-center">
              {token ? (
                <Link to="/dashboard" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md shadow-green-500/20 hover:shadow-lg hover:-translate-y-0.5">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Masuk
                  </Link>
                  <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md shadow-green-500/20 hover:shadow-lg hover:-translate-y-0.5">
                    Daftar Sekarang
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-green-400/20 blur-3xl animate-float" />
          <div className="absolute top-20 -left-40 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight">
            Manajemen Pesantren <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Lebih Modern & Efisien
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-400 mx-auto mb-10 leading-relaxed">
            Platform terpadu untuk digitalisasi sistem pondok pesantren. Kelola santri, administrasi keuangan, kantin, dan transportasi dalam satu aplikasi cerdas.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={token ? "/dashboard" : "/register"} className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30 transition-all hover:-translate-y-1">
              {token ? "Ke Dashboard" : "Mulai Sekarang"}
              <ChevronRight className="ml-2 -mr-1 w-5 h-5" />
            </Link>
            <a href="#fitur" className="inline-flex items-center justify-center px-8 py-3.5 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              Pelajari Fitur
            </a>
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-20 relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="rounded-2xl glass-card p-2 shadow-2xl border border-white/40">
            <div className="rounded-xl overflow-hidden bg-gray-100 aspect-video relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" />
              {/* Fake UI */}
              <div className="absolute inset-0 flex flex-col p-4 opacity-50">
                <div className="h-10 w-full bg-white dark:bg-gray-800 rounded-lg mb-4 shadow-sm" />
                <div className="flex gap-4 h-full">
                  <div className="w-48 bg-white dark:bg-gray-800 rounded-lg h-full shadow-sm" />
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="flex-1 h-24 bg-white dark:bg-gray-800 rounded-lg shadow-sm" />
                      <div className="flex-1 h-24 bg-white dark:bg-gray-800 rounded-lg shadow-sm" />
                      <div className="flex-1 h-24 bg-white dark:bg-gray-800 rounded-lg shadow-sm" />
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="fitur" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Fitur Unggulan</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Semua yang Anda butuhkan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Manajemen Santri Terpusat</h3>
              <p className="text-gray-600 dark:text-gray-400">Kelola data santri, prestasi, pelanggaran, hingga perizinan dalam satu dashboard yang mudah diakses.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Keamanan Transaksi</h3>
              <p className="text-gray-600 dark:text-gray-400">Sistem pembayaran SPP dan uang saku terintegrasi dengan pencatatan yang akurat dan transparan.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Sistem Kantin & Transport</h3>
              <p className="text-gray-600 dark:text-gray-400">Monitoring pemesanan makanan dan jadwal transportasi santri secara real-time dan efisien.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-green-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Higo Pondok</span>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Higo Pondok. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
