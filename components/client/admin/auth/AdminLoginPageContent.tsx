'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@/app/components/Button';
import { getCurrentUser, signInWithEmail, signOut } from '@/lib/auth';

export default function AdminLoginPageContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkExistingAdminSession = async () => {
      const user = await getCurrentUser();
      if (user?.user_metadata?.role === 'admin') router.replace('/admin/dashboard');
    };
    checkExistingAdminSession();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user } = await signInWithEmail(formData.email, formData.password);
      if (user?.user_metadata?.role !== 'admin') {
        setError('Accès refusé. Vous devez être administrateur.');
        await signOut();
        setLoading(false);
        return;
      }
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[#0f172a] mb-3 tracking-tight">Espace Administration</h1>
          <p className="text-gray-500">Connectez-vous pour gérer le contenu de la plateforme</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email professionnel</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required disabled={loading} placeholder="nom@universite.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent transition-all disabled:opacity-50" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required disabled={loading} placeholder="••••••••" className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent transition-all disabled:opacity-50" />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700 disabled:opacity-50" aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} disabled={loading}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-3"></div><p className="text-sm text-red-700 font-medium">{error}</p></div>}
            <Button type="submit" size="lg" className="w-full h-12 bg-[#0077d2] hover:bg-[#0062b0] rounded-lg font-medium shadow-sm shadow-blue-900/10 disabled:opacity-50" disabled={loading}>
              {loading ? 'Connexion...' : 'Connexion'}
            </Button>
            <div className="flex items-center justify-between text-sm pt-1">
              <Link href="/admin/forgot-password" className="text-[#0077d2] hover:underline">Mot de passe oublié ?</Link>
              <Link href="/admin/register" className="text-gray-600 hover:text-gray-800 hover:underline">Créer un compte</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
