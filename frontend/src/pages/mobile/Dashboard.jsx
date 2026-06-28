import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { ROLES, getUserRole } from '../../config/roles';

import AdminDashboard from '../../components/dashboard/mobile/AdminDashboard';
import UserDashboard from '../../components/dashboard/mobile/UserDashboard';
import KantinDashboard from '../../components/dashboard/mobile/KantinDashboard';
import KurirDashboard from '../../components/dashboard/mobile/KurirDashboard';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const role = getUserRole(user) || ROLES.ADMIN;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {role === ROLES.ADMIN && <AdminDashboard user={user} />}
      {role === ROLES.USER && <UserDashboard user={user} />}
      {role === ROLES.KANTIN && <KantinDashboard user={user} />}
      {role === ROLES.KURIR && <KurirDashboard user={user} />}
    </div>
  );
}
