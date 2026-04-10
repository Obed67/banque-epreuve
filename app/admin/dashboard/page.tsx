'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';
import Badge from '../../components/Badge';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '@/lib/supabaseClient';
import { getCurrentUser, signOut } from '@/lib/auth';

interface Document {
  id: string;
  titre: string;
  type: string;
  filiere: string;
  ue: string;
  annee: string;
  session: string | null;
  soumis_par: string | null;
  created_at: string;
  statut: string;
  file_path: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [stats, setStats] = useState({
    total: 0,
    enAttente: 0,
    valides: 0,
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();

    if (!user) {
      router.push('/admin/login');
      return;
    }

    if (user.user_metadata?.role !== 'admin') {
      router.push('/admin/login');
      return;
    }

    setUserEmail(user.email || '');
    fetchDocuments();
    fetchStats();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('epreuves')
      .select('*')
      .eq('statut', 'En attente')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const { count: total } = await supabase.from('epreuves').select('*', { count: 'exact', head: true });
    const { count: enAttente } = await supabase.from('epreuves').select('*', { count: 'exact', head: true }).eq('statut', 'En attente');
    const { count: valides } = await supabase.from('epreuves').select('*', { count: 'exact', head: true }).eq('statut', 'Validé');

    setStats({
      total: total || 0,
      enAttente: enAttente || 0,
      valides: valides || 0,
    });
  };

  const handleValidate = async (id: string) => {
    try {
      setProcessingId(id);
      const { error } = await supabase
        .from('epreuves')
        .update({ statut: 'Validé' })
        .eq('id', id);

      if (error) throw error;

      setDocuments(documents.filter((doc) => doc.id !== id));
      fetchStats(); // Update stats
      setNotification({
        type: 'success',
        message: 'Document validé avec succès',
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error validating document:', error);
      setNotification({
        type: 'error',
        message: 'Erreur lors de la validation',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir rejeter ce document ?')) return;

    try {
      setProcessingId(id);
      const { error } = await supabase
        .from('epreuves')
        .update({ statut: 'Rejeté' })
        .eq('id', id);

      if (error) throw error;

      setDocuments(documents.filter((doc) => doc.id !== id));
      fetchStats(); // Update stats
      setNotification({
        type: 'error',
        message: 'Document rejeté',
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error rejecting document:', error);
      setNotification({
        type: 'error',
        message: 'Erreur lors du rejet',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenDocument = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 120);

      if (error || !data?.signedUrl) {
        throw error || new Error('Lien de document indisponible');
      }

      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening document:', error);
      setNotification({
        type: 'error',
        message: "Impossible d'ouvrir ce document",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const pendingPercent = stats.total > 0 ? Math.round((stats.enAttente / stats.total) * 100) : 0;

  return (
    <div className="h-screen bg-[#eef6ff]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[290px_1fr]">
        <AdminSidebar userEmail={userEmail} onLogout={handleLogout} />

        <section className="h-full overflow-y-auto">
          <div className="p-6 lg:p-8">
            <div className="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#0077d2] font-semibold">Espace administration</p>
                  <h1 className="text-3xl font-extrabold text-[#0f172a] mt-1">
                    Tableau de bord
                  </h1>
                  <p className="text-gray-500 mt-2">
                    Suivez les soumissions et prenez des decisions de validation rapidement.
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 rounded-xl border border-blue-100 px-3 py-2 bg-[#f7fbff]">
                  <ShieldCheck className="h-4 w-4 text-[#0077d2]" />
                  <span className="text-sm text-[#0f172a] font-medium">Mode moderation</span>
                </div>
              </div>
            </div>

            {notification && (
              <div
                className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-lg border animate-slide-up z-50 flex items-center ${notification.type === 'success'
                  ? 'bg-white border-green-100 text-green-700'
                  : 'bg-white border-red-100 text-red-700'
                  }`}
              >
                <div className={`p-2 rounded-full mr-3 ${notification.type === 'success' ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                  {notification.type === 'success' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                </div>
                <p className="font-medium pr-2">{notification.message}</p>
              </div>
            )}

            <div id="stats-section" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
              <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">Total documents</p>
                  <FileText className="h-5 w-5 text-[#0077d2]" />
                </div>
                <p className="text-3xl font-extrabold text-[#0f172a] mt-3">{stats.total}</p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">En attente</p>
                  <Clock className="h-5 w-5 text-[#ffa446]" />
                </div>
                <p className="text-3xl font-extrabold text-[#0f172a] mt-3">{stats.enAttente}</p>
              </div>
              <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">Valides</p>
                  <CheckCircle className="h-5 w-5 text-[#1cb427]" />
                </div>
                <p className="text-3xl font-extrabold text-[#0f172a] mt-3">{stats.valides}</p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">Taux en attente</p>
                  <BarChart3 className="h-5 w-5 text-[#0077d2]" />
                </div>
                <p className="text-3xl font-extrabold text-[#0f172a] mt-3">{pendingPercent}%</p>
              </div>
            </div>

            <div id="documents-section" className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0f172a]">Documents a traiter</h2>
              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-[#0077d2]">
                {documents.length} restant(s)
              </span>
            </div>

            {loading ? (
              <div className="text-center py-14 bg-white rounded-2xl border border-blue-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077d2] mx-auto mb-4"></div>
                <p className="text-gray-500">Chargement des documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="rounded-2xl border border-blue-100 bg-white p-14 text-center">
                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-[#1cb427]" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Tout est a jour</h3>
                <p className="text-gray-500">Aucun document en attente de validation pour le moment.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col xl:flex-row gap-5">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="bg-blue-50 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-[#0077d2]" />
                        </div>
                        <div className="space-y-3 flex-1">
                          <div>
                            <h3 className="text-lg font-bold text-[#0f172a] mb-2">{doc.titre}</h3>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="info-subtle">{doc.type || 'N/A'}</Badge>
                              <Badge variant="warning-subtle">{doc.statut}</Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                            <div className="text-sm">
                              <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Filiere</p>
                              <p className="font-medium text-gray-700">{doc.filiere}</p>
                            </div>
                            <div className="text-sm">
                              <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">UE</p>
                              <p className="font-medium text-gray-700">{doc.ue}</p>
                            </div>
                            <div className="text-sm">
                              <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Soumis par</p>
                              <p className="font-medium text-gray-700">{doc.soumis_par || 'Anonyme'}</p>
                            </div>
                            <div className="text-sm">
                              <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Date</p>
                              <p className="font-medium text-gray-700">{new Date(doc.created_at).toLocaleDateString('fr-FR')}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex xl:flex-col gap-2.5 xl:w-52 xl:border-l xl:border-blue-100 xl:pl-5 justify-center">
                        <button
                          onClick={() => handleOpenDocument(doc.file_path)}
                          className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-50 text-[#0077d2] text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Voir le fichier
                        </button>
                        <button
                          onClick={() => handleValidate(doc.id)}
                          disabled={processingId === doc.id}
                          className="w-full flex items-center justify-center px-4 py-2.5 bg-[#1cb427] text-white text-sm font-medium rounded-lg hover:bg-[#158f1f] transition-colors disabled:opacity-60"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Valider
                        </button>
                        <button
                          onClick={() => handleReject(doc.id)}
                          disabled={processingId === doc.id}
                          className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all disabled:opacity-60"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Rejeter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
