'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  XCircle,
} from 'lucide-react';
import Badge from '../../components/Badge';
import AdminSidebar from '../components/AdminSidebar';
import { getCurrentUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

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

export default function AdminDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser();
      if (!user || user.user_metadata?.role !== 'admin') {
        router.push('/admin/login');
        return;
      }
      setUserEmail(user.email || '');
      await fetchDocuments();
    };
    init();
  }, [router]);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('epreuves')
      .select('*')
      .eq('statut', 'En attente')
      .order('created_at', { ascending: false });
    if (!error) setDocuments(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const handleOpenDocument = async (filePath: string) => {
    const { data, error } = await supabase.storage.from('documents').createSignedUrl(filePath, 120);
    if (error || !data?.signedUrl) {
      setNotification({ type: 'error', message: "Impossible d'ouvrir ce document" });
      return;
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  const updateStatus = async (id: string, statut: 'Validé' | 'Rejeté') => {
    try {
      setProcessingId(id);
      const { error } = await supabase.from('epreuves').update({ statut }).eq('id', id);
      if (error) throw error;
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      setNotification({ type: statut === 'Validé' ? 'success' : 'error', message: `Document ${statut.toLowerCase()} avec succès` });
    } catch {
      setNotification({ type: 'error', message: 'Erreur lors de la mise à jour' });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="h-screen bg-[#eef6ff]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[290px_1fr]">
        <AdminSidebar userEmail={userEmail} onLogout={handleLogout} />

        <section className="h-full overflow-y-auto p-6 lg:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-[#0f172a]">Validation des documents</h1>
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-[#0077d2]">{documents.length} en attente</span>
          </div>

          {notification && <div className={`mb-4 rounded-xl border p-3 text-sm ${notification.type === 'success' ? 'border-green-100 bg-green-50 text-green-700' : 'border-red-100 bg-red-50 text-red-700'}`}>{notification.message}</div>}

          {loading ? (
            <div className="text-center py-14 bg-white rounded-2xl border border-blue-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077d2] mx-auto mb-4"></div>
              <p className="text-gray-500">Chargement des documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-2xl border border-blue-100 bg-white p-14 text-center">
              <Clock className="h-8 w-8 text-[#0077d2] mx-auto mb-3" />
              <p className="text-gray-600">Aucun document en attente.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
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
                          <p className="text-sm text-gray-700"><span className="text-gray-400">Filière: </span>{doc.filiere}</p>
                          <p className="text-sm text-gray-700"><span className="text-gray-400">UE: </span>{doc.ue}</p>
                          <p className="text-sm text-gray-700"><span className="text-gray-400">Soumis par: </span>{doc.soumis_par || 'Anonyme'}</p>
                          <p className="text-sm text-gray-700"><span className="text-gray-400">Date: </span>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex xl:flex-col gap-2.5 xl:w-52 xl:border-l xl:border-blue-100 xl:pl-5 justify-center">
                      <button onClick={() => handleOpenDocument(doc.file_path)} className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-50 text-[#0077d2] text-sm font-medium rounded-lg hover:bg-blue-100">
                        <ExternalLink className="h-4 w-4 mr-2" /> Voir le fichier
                      </button>
                      <button onClick={() => updateStatus(doc.id, 'Validé')} disabled={processingId === doc.id} className="w-full flex items-center justify-center px-4 py-2.5 bg-[#1cb427] text-white text-sm font-medium rounded-lg hover:bg-[#158f1f] disabled:opacity-60">
                        <CheckCircle className="h-4 w-4 mr-2" /> Valider
                      </button>
                      <button onClick={() => updateStatus(doc.id, 'Rejeté')} disabled={processingId === doc.id} className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-red-50 hover:text-red-600 disabled:opacity-60">
                        <XCircle className="h-4 w-4 mr-2" /> Rejeter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
