import React, { useState } from 'react';
import api from '../../lib/axios';
import { useNavigate, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '../../components/layout/mobile/AuthLayout';

export default function RegisterCanteen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [canteenName, setCanteenName] = useState('');
  const [canteenDesc, setCanteenDesc] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/register/canteen', { 
          name, email, password, password_confirmation: passwordConfirmation,
          canteen_name: canteenName, canteen_description: canteenDesc
      });
      setSuccess('Pendaftaran berhasil! Silakan tunggu persetujuan dari Admin.');
      setTimeout(() => navigate({ to: '/login' }), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Daftar Kantin" 
      subtitle="Buka toko Anda di Higo Pondok"
    >
      <form className="mt-8 space-y-6" onSubmit={handleRegister}>
        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-100">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="rounded-md bg-green-50 p-4 border border-green-100">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Data Pemilik</h3>
          <div>
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="passwordConfirmation">Konfirmasi Password</Label>
            <Input id="passwordConfirmation" type="password" required value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="mt-1" />
          </div>

          <h3 className="font-semibold text-gray-700 dark:text-gray-300 pt-4">Data Toko</h3>
          <div>
            <Label htmlFor="canteenName">Nama Kantin/Toko</Label>
            <Input id="canteenName" required value={canteenName} onChange={(e) => setCanteenName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="canteenDesc">Deskripsi Singkat</Label>
            <Input id="canteenDesc" value={canteenDesc} onChange={(e) => setCanteenDesc(e.target.value)} className="mt-1" />
          </div>
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-6" disabled={loading || success}>
          {loading ? 'Memproses...' : 'Daftar Kantin'}
        </Button>

        <div className="text-center text-sm text-gray-600 mt-6 space-y-2">
           <div className="pt-4 border-t border-gray-200 mt-4">
             Sudah punya akun? <Link to="/login" className="font-semibold text-green-600 hover:text-green-500">Masuk di sini</Link>
           </div>
        </div>
      </form>
    </AuthLayout>
  );
}
