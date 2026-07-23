import {
  LayoutDashboard,
  Users,
  Wallet,
  Coffee,
  Bus,
  Store,
  Package,
  HeartHandshake,
  FileText,
  ClipboardList,
  Tag,
  ShoppingCart
} from 'lucide-react';
import { ROLES } from './roles';

export const allMenus = [
  { name: 'Beranda', href: '/dashboard', icon: LayoutDashboard, roles: [ROLES.ADMIN, ROLES.USER, ROLES.KANTIN, ROLES.KURIR] },
  { name: 'User', href: '/dashboard/users', icon: Users, roles: [ROLES.ADMIN] },
  { name: 'Pertokoan', href: '/dashboard/pertokoan', icon: Store, roles: [ROLES.ADMIN] },
  
  // Non-Admin specific menus
  { name: 'Riwayat', href: '/dashboard/pembayaran', icon: ClipboardList, roles: [ROLES.USER] },
  { name: 'Kantin', href: '/dashboard/kantin', icon: Coffee, roles: [ROLES.USER] },
  { name: 'Keranjang', href: '/dashboard/keranjang', icon: ShoppingCart, roles: [ROLES.USER] },
  { name: 'Toko Saya', href: '/dashboard/toko-saya', icon: Store, roles: [ROLES.KANTIN] },
  { name: 'Pesanan', href: '/dashboard/toko-saya/pesanan', icon: ClipboardList, roles: [ROLES.KANTIN] },
  { name: 'Tugas', href: '/dashboard/tugas-kurir', icon: Package, roles: [ROLES.KURIR] },
  { name: 'Panduan', href: '/dashboard/panduan', icon: FileText, roles: [ROLES.ADMIN, ROLES.USER, ROLES.KANTIN, ROLES.KURIR] },
];
