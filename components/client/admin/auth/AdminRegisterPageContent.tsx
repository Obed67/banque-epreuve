'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@/app/components/Button';
import { signUpWithEmail } from '@/lib/auth';

export default function AdminRegisterPageContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (formData.password.length < 6) throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
      if (formData.password !== formData.confirmPassword) throw new Error('Les mots de passe ne correspondent pas.');
      await signUpWithEmail(formData.email, formData.password);
      setSuccess('Compte créé. Vérifiez votre email pour confirmer votre inscription.');
      setTimeout(() => router.push('/admin/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[#0f172a] mb-3 tracking-tight">Créer un compte</h1>
          <p className="text-gray-500">Inscrivez-vous puis connectez-vous à l&apos;espace admin</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required disabled={loading} placeholder="nom@universite.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent transition-all disabled:opacity-50" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required disabled={loading} placeholder="••••••••" className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent transition-all disabled:opacity-50" />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700" aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required disabled={loading} placeholder="••••••••" className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent transition-all disabled:opacity-50" />
                <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700" aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-700 font-medium">{error}</div>}
            {success && <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-green-700 font-medium">{success}</div>}
            <Button type="submit" size="lg" className="w-full h-12 bg-[#0077d2] hover:bg-[#0062b0] rounded-lg font-medium shadow-sm shadow-blue-900/10 disabled:opacity-50" disabled={loading}>
              {loading ? 'Création...' : 'Créer le compte'}
            </Button>
            <p className="text-sm text-gray-600 text-center">Déjà inscrit ? <Link href="/admin/login" className="text-[#0077d2] hover:underline">Se connecter</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}
