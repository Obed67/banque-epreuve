'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '../../components/Button';
import { sendPasswordResetEmail } from '@/lib/auth';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const redirectTo = `${window.location.origin}/admin/reset-password`;
      await sendPasswordResetEmail(email, redirectTo);
      setSuccess('Email de réinitialisation envoyé. Vérifiez votre boîte mail.');
    } catch (err: any) {
      setError(err.message || "Impossible d'envoyer l'email de réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[#0f172a] mb-3 tracking-tight">
            Mot de passe oublié
          </h1>
          <p className="text-gray-500">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="nom@universite.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-green-700 font-medium">
                {success}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 bg-[#0077d2] hover:bg-[#0062b0] rounded-lg font-medium shadow-sm shadow-blue-900/10 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </Button>

            <p className="text-sm text-gray-600 text-center">
              Retour à{' '}
              <Link href="/admin/login" className="text-[#0077d2] hover:underline">
                la connexion
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
