import React, { useState } from 'react';
import api from '../../lib/axios';
import { useNavigate, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterDriver() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [vehicle, setVehicle] = useState('');
  
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
      await api.post('/register/driver', { 
          name, email, password, password_confirmation: passwordConfirmation,
          vehicle_info: vehicle
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
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Daftar Kurir</h2>
          <p className="mt-2 text-sm text-gray-600">Gabung menjadi kurir pengantar</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {success && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">{success}</div>}

          <div className="space-y-4">
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
            <div>
              <Label>Informasi Kendaraan</Label>
              <Input placeholder="Misal: Honda Beat Hitam AB 1234 CD" required value={vehicle} onChange={(e) => setVehicle(e.target.value)} className="mt-1" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading || success}>
            {loading ? 'Memproses...' : 'Daftar Kurir'}
          </Button>

          <div className="text-center text-sm text-gray-600 mt-4">
             Sudah punya akun? <Link to="/login" className="text-green-600 hover:underline">Masuk</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
