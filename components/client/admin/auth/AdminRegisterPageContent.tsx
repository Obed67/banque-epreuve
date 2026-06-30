'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/Button';
import FormInput from '@/app/components/FormInput';
import FormPasswordField from '@/app/components/FormPasswordField';
import { signUpWithEmail } from '@/lib/auth';

export default function AdminRegisterPageContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
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
            <FormInput
              type="email"
              id="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="nom@universite.com"
            />
            <FormPasswordField
              id="password"
              name="password"
              label="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <FormPasswordField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
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
