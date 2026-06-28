import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';
import { useNavigate, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AuthLayout from '../../components/layout/mobile/AuthLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      setAuth(response.data.user, response.data.access_token);
      navigate({ to: '/dashboard' });
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa kembali kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Masuk ke Akun Anda" 
      subtitle="Masukkan email dan password Anda untuk melanjutkan ke dashboard."
    >
      <form className="mt-8 space-y-6" onSubmit={handleLogin}>
        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-100">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Alamat Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="mt-1"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-sm font-medium text-green-600 hover:text-green-500">Lupa password?</a>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-6" disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </Button>

        <div className="text-center text-sm text-gray-600 mt-6">
           Belum punya akun?{' '}
           <Link to="/register" className="font-semibold text-green-600 hover:text-green-500">
             Daftar sekarang
           </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
