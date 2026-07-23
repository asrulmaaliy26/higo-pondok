import React from 'react';
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';

// Pages & Layouts
import Home from './pages/mobile/Home';
import Login from './pages/mobile/Login';
import Register from './pages/mobile/Register';
import RegisterCanteen from './pages/mobile/RegisterCanteen';
import RegisterDriver from './pages/mobile/RegisterDriver';
import DashboardLayout from './components/layout/mobile/DashboardLayout';
import Dashboard from './pages/mobile/Dashboard';
import UserManagement from './pages/mobile/UserManagement';
import Pertokoan from './pages/mobile/Pertokoan';
import BukuPanduan from './pages/mobile/BukuPanduan';
import TokoSaya from './pages/mobile/TokoSaya';
import Profile from './pages/mobile/Profile';
import Kantin from './pages/mobile/Kantin';
import DetailKantin from './pages/mobile/DetailKantin';
import PesananToko from './pages/mobile/PesananToko';
import PromoVoucher from './pages/mobile/PromoVoucher';
import Pembayaran from './pages/mobile/Pembayaran';
import TugasKurir from './pages/mobile/TugasKurir';
import Keranjang from './pages/mobile/Keranjang';

import RoleGuard from './components/RoleGuard';
import { ROLES } from './config/roles';

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});

// Public Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
});

const registerCanteenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register-canteen',
  component: RegisterCanteen,
});

const registerDriverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register-driver',
  component: RegisterDriver,
});

// Wrapper components to avoid inline arrow functions in createRoute
function UserManagementPage() {
  return <RoleGuard allowedRoles={[ROLES.ADMIN]}><UserManagement /></RoleGuard>;
}

function PertokoanPage() {
  return <RoleGuard allowedRoles={[ROLES.ADMIN]}><Pertokoan /></RoleGuard>;
}

function BukuPanduanPage() {
  return <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.USER, ROLES.KANTIN, ROLES.KURIR]}><BukuPanduan /></RoleGuard>;
}

function TokoSayaPage() {
  return <RoleGuard allowedRoles={[ROLES.KANTIN]}><TokoSaya /></RoleGuard>;
}

function PromoVoucherPage() {
  return <RoleGuard allowedRoles={[ROLES.KANTIN]}><PromoVoucher /></RoleGuard>;
}

function PesananTokoPage() {
  return <RoleGuard allowedRoles={[ROLES.KANTIN]}><PesananToko /></RoleGuard>;
}

function KantinPage() {
  return <RoleGuard allowedRoles={[ROLES.USER]}><Kantin /></RoleGuard>;
}

function DetailKantinPage() {
  return <RoleGuard allowedRoles={[ROLES.USER]}><DetailKantin /></RoleGuard>;
}

function PembayaranPage() {
  return <RoleGuard allowedRoles={[ROLES.USER]}><Pembayaran /></RoleGuard>;
}

function KeranjangPage() {
  return <RoleGuard allowedRoles={[ROLES.USER]}><Keranjang /></RoleGuard>;
}

// Protected Dashboard Routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: function ProtectedDashboard() {
    const token = useAuthStore((state) => state.token);
    if (!token) {
      window.location.href = '/login';
      return null;
    }
    return <DashboardLayout />;
  },
});

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  component: Dashboard,
});

const userManagementRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/users',
  component: UserManagementPage,
});

const pertokoanRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/pertokoan',
  component: PertokoanPage,
});

const panduanRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/panduan',
  component: BukuPanduanPage,
});

const tokoSayaRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/toko-saya',
  component: TokoSayaPage,
});

const promoVoucherRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/toko-saya/promo',
  component: PromoVoucherPage,
});

const pesananTokoRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/toko-saya/pesanan',
  component: PesananTokoPage,
});

const kantinRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/kantin',
  component: KantinPage,
});

const kantinDetailRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/kantin/$id',
  component: DetailKantinPage,
});

const pembayaranRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 'pembayaran',
  component: () => (
    <RoleGuard allowedRoles={[ROLES.USER]}>
      <Pembayaran />
    </RoleGuard>
  ),
});

const tugasKurirRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 'tugas-kurir',
  component: () => (
    <RoleGuard allowedRoles={[ROLES.KURIR]}>
      <TugasKurir />
    </RoleGuard>
  ),
});

const keranjangRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/keranjang',
  component: KeranjangPage,
});

const profileRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/profile',
  component: Profile,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  registerCanteenRoute,
  registerDriverRoute,
  dashboardRoute.addChildren([
    dashboardIndexRoute, 
    userManagementRoute,
    pertokoanRoute,
    panduanRoute,
    tokoSayaRoute,
    promoVoucherRoute,
    kantinRoute,
    kantinDetailRoute,
    pesananTokoRoute,
    pembayaranRoute,
    tugasKurirRoute,
    keranjangRoute,
    profileRoute
  ]),
]);

const router = createRouter({ 
  routeTree,
  defaultNotFoundComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
        <p className="text-gray-500 dark:text-gray-400">Halaman atau fitur ini belum tersedia.</p>
      </div>
    );
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
