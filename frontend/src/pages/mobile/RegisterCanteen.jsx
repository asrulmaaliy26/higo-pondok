import React, { useState } from 'react';
import api from '../../lib/axios';
import { useNavigate, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Daftar Kantin</h2>
          <p className="mt-2 text-sm text-gray-600">Buka toko Anda di Higo Pondok</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {success && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">{success}</div>}

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Data Pemilik</h3>
            <div>
              <Label>Nama Lengkap</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Konfirmasi Password</Label>
              <Input type="password" required value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="mt-1" />
            </div>

            <h3 className="font-semibold text-gray-700 pt-4">Data Toko</h3>
            <div>
              <Label>Nama Kantin/Toko</Label>
              <Input required value={canteenName} onChange={(e) => setCanteenName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Deskripsi Singkat</Label>
              <Input value={canteenDesc} onChange={(e) => setCanteenDesc(e.target.value)} className="mt-1" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading || success}>
            {loading ? 'Memproses...' : 'Daftar Kantin'}
          </Button>

          <div className="text-center text-sm text-gray-600 mt-4">
             Sudah punya akun? <Link to="/login" className="text-green-600 hover:underline">Masuk</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
