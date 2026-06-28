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
  Tag
} from 'lucide-react';
import { ROLES } from './roles';

export const allMenus = [
  { name: 'Beranda', href: '/dashboard', icon: LayoutDashboard, roles: [ROLES.ADMIN, ROLES.USER, ROLES.KANTIN, ROLES.KURIR] },
  { name: 'User', href: '/dashboard/users', icon: Users, roles: [ROLES.ADMIN] },
  { name: 'Pertokoan', href: '/dashboard/pertokoan', icon: Store, roles: [ROLES.ADMIN] },
  { name: 'Perkuriran', href: '/dashboard/perkuriran', icon: Package, roles: [ROLES.ADMIN] },
  { name: 'Persantrian', href: '/dashboard/persantrian', icon: HeartHandshake, roles: [ROLES.ADMIN] },
  
  // Non-Admin specific menus
  { name: 'Trans', href: '/dashboard/pembayaran', icon: Wallet, roles: [ROLES.USER] },
  { name: 'Kantin', href: '/dashboard/kantin', icon: Coffee, roles: [ROLES.USER] },
  { name: 'Toko Saya', href: '/dashboard/toko-saya', icon: Store, roles: [ROLES.KANTIN] },
  { name: 'Promo', href: '/dashboard/toko-saya/promo', icon: Tag, roles: [ROLES.KANTIN] },
  { name: 'Pesanan', href: '/dashboard/toko-saya/pesanan', icon: ClipboardList, roles: [ROLES.KANTIN] },
  { name: 'Tugas', href: '/dashboard/tugas-kurir', icon: Package, roles: [ROLES.KURIR] },
];
