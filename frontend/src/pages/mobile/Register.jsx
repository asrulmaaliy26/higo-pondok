import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';
import { useNavigate, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AuthLayout from '../../components/layout/mobile/AuthLayout';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/register', { 
          name, email, password, password_confirmation: passwordConfirmation 
      });
      setAuth(response.data.user, response.data.access_token);
      navigate({ to: '/dashboard' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Daftar User" 
      subtitle="Buat akun untuk mengakses berbagai layanan pondok pesantren."
    >
      <form className="mt-8 space-y-6" onSubmit={handleRegister}>
        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-100">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Alamat Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
            <Input id="password_confirmation" type="password" required value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="mt-1" />
          </div>
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-6" disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar Sekarang'}
        </Button>

        <div className="text-center text-sm text-gray-600 mt-6 space-y-2">
           <div>
             Ingin mendaftar sebagai kantin? <Link to="/register-canteen" className="font-semibold text-green-600 hover:text-green-500">Daftar Kantin</Link>
           </div>
           <div>
             Ingin menjadi driver? <Link to="/register-driver" className="font-semibold text-green-600 hover:text-green-500">Daftar Driver</Link>
           </div>
           <div className="pt-4 border-t border-gray-200 mt-4">
             Sudah punya akun? <Link to="/login" className="font-semibold text-green-600 hover:text-green-500">Masuk di sini</Link>
           </div>
        </div>
      </form>
    </AuthLayout>
  );
}
