'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.email === 'admin@portail.com' && formData.password === 'admin123') {
      router.push('/admin/dashboard');
    } else {
      setError('Identifiants invalides');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[#0f172a] mb-3 tracking-tight">
            Espace Administration
          </h1>
          <p className="text-gray-500">
            Connectez-vous pour gérer le contenu de la plateforme
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email professionnel
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="nom@universite.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-3"></div>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-xs text-blue-700 flex flex-col gap-1">
                <span className="font-semibold uppercase tracking-wider text-blue-900/60">Identifiants de démonstration</span>
                <span className="font-mono">admin@portail.com</span>
                <span className="font-mono">admin123</span>
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full h-12 bg-[#0077d2] hover:bg-[#0062b0] rounded-lg font-medium shadow-sm shadow-blue-900/10">
              Accéder au tableau de bord
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
