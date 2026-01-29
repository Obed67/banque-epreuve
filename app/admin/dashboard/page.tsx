'use client';

import { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Badge from '../../components/Badge';

const mockDocuments = [
  {
    id: 1,
    titre: 'Épreuve de Systèmes Distribués',
    type: 'Épreuve',
    filiere: 'Informatique',
    ue: 'Systèmes Distribués',
    annee: '2024',
    session: 'Normale',
    soumis_par: 'Étudiant A',
    date_soumission: '2024-01-20',
    statut: 'En attente',
  },
  {
    id: 2,
    titre: 'Cours de Machine Learning',
    type: 'Cours',
    filiere: 'Informatique',
    ue: 'Intelligence Artificielle',
    annee: '2024',
    session: null,
    soumis_par: 'Étudiant B',
    date_soumission: '2024-01-19',
    statut: 'En attente',
  },
  {
    id: 3,
    titre: 'TD de Cryptographie',
    type: 'TD',
    filiere: 'Informatique',
    ue: 'Sécurité Informatique',
    annee: '2024',
    session: null,
    soumis_par: 'Étudiant C',
    date_soumission: '2024-01-18',
    statut: 'En attente',
  },
  {
    id: 4,
    titre: 'Mémoire sur les Réseaux 5G',
    type: 'Mémoire',
    filiere: 'Télécom',
    ue: 'Réseaux Mobiles',
    annee: '2023',
    session: null,
    soumis_par: 'Étudiant D',
    date_soumission: '2024-01-17',
    statut: 'En attente',
  },
];

export default function AdminDashboardPage() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleValidate = (id: number) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    setNotification({
      type: 'success',
      message: 'Document validé avec succès',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReject = (id: number) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    setNotification({
      type: 'error',
      message: 'Document rejeté',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const stats = {
    total: mockDocuments.length,
    enAttente: documents.length,
    valides: mockDocuments.length - documents.length,
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-3">
            Tableau de Bord
          </h1>
          <p className="text-gray-500">
            Vue d'ensemble et gestion des documents académiques
          </p>
        </div>

        {notification && (
          <div
            className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-lg border animate-slide-up z-50 flex items-center ${
              notification.type === 'success'
                ? 'bg-white border-green-100 text-green-700'
                : 'bg-white border-red-100 text-red-700'
            }`}
          >
            <div className={`p-2 rounded-full mr-3 ${
               notification.type === 'success' ? 'bg-green-50' : 'bg-red-50'
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-[#0077d2]" />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</span>
            </div>
            <div className="text-4xl font-extrabold text-[#0f172a] mb-1">{stats.total}</div>
            <p className="text-sm text-gray-500">Documents soumis</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm ring-1 ring-orange-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-50 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-[#ffa446]" />
              </div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Prioritaire</span>
            </div>
            <div className="text-4xl font-extrabold text-[#0f172a] mb-1">{stats.enAttente}</div>
            <p className="text-sm text-gray-500">En attente de validation</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-[#1cb427]" />
              </div>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Complété</span>
            </div>
            <div className="text-4xl font-extrabold text-[#0f172a] mb-1">{stats.valides}</div>
            <p className="text-sm text-gray-500">Documents validés</p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0f172a]">
            Documents à traiter
          </h2>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
            {documents.length} restant(s)
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 dashed p-12 text-center">
            <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-[#1cb427]" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Tout est à jour !
            </h3>
            <p className="text-gray-500">
              Aucun document en attente de validation pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Icon & Main Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-[#0077d2]" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <div>
                        <h3 className="text-lg font-bold text-[#0f172a] mb-2">
                          {doc.titre}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="info-subtle">{doc.type}</Badge>
                          <Badge variant="warning-subtle">{doc.statut}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                         <div className="text-sm">
                            <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Filière</p>
                            <p className="font-medium text-gray-700">{doc.filiere}</p>
                         </div>
                         <div className="text-sm">
                            <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">UE</p>
                            <p className="font-medium text-gray-700">{doc.ue}</p>
                         </div>
                         <div className="text-sm">
                            <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Soumis par</p>
                            <p className="font-medium text-gray-700">{doc.soumis_par}</p>
                         </div>
                         <div className="text-sm">
                            <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Date</p>
                            <p className="font-medium text-gray-700">{new Date(doc.date_soumission).toLocaleDateString('fr-FR')}</p>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-3 lg:w-48 lg:border-l lg:border-gray-50 lg:pl-6 justify-center">
                    <button
                      onClick={() => handleValidate(doc.id)}
                      className="w-full flex items-center justify-center px-4 py-2.5 bg-[#1cb427] text-white text-sm font-medium rounded-lg hover:bg-[#158f1f] transition-colors"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Valider
                    </button>
                    <button
                      onClick={() => handleReject(doc.id)}
                      className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
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
    </div>
  );
}
