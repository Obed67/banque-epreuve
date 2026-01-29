'use client';

import { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
} from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Tableau de bord Admin
          </h1>
          <p className="text-gray-600">
            Gérez les documents soumis par les étudiants
          </p>
        </div>

        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 mr-2" />
              )}
              <p className="font-medium">{notification.message}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total soumis</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="bg-[#0077d2] w-12 h-12 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En attente</p>
                <p className="text-3xl font-bold text-[#ffa446]">
                  {stats.enAttente}
                </p>
              </div>
              <div className="bg-[#ffa446] w-12 h-12 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Validés</p>
                <p className="text-3xl font-bold text-[#1cb427]">
                  {stats.valides}
                </p>
              </div>
              <div className="bg-[#1cb427] w-12 h-12 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Documents en attente de validation
          </h2>
        </div>

        {documents.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-[#1cb427] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Aucun document en attente
            </h3>
            <p className="text-gray-600">
              Tous les documents ont été traités
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-[#0077d2] w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {doc.titre}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="info">{doc.type}</Badge>
                          <Badge variant="warning">{doc.statut}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FileText className="h-4 w-4 mr-2 text-[#0077d2]" />
                        <span className="font-medium">Filière:</span>
                        <span className="ml-2">{doc.filiere}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <FileText className="h-4 w-4 mr-2 text-[#0077d2]" />
                        <span className="font-medium">UE:</span>
                        <span className="ml-2">{doc.ue}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-[#0077d2]" />
                        <span className="font-medium">Année:</span>
                        <span className="ml-2">{doc.annee}</span>
                      </div>

                      {doc.session && (
                        <div className="flex items-center text-gray-600">
                          <span className="font-medium">Session:</span>
                          <span className="ml-2">{doc.session}</span>
                        </div>
                      )}

                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2 text-[#0077d2]" />
                        <span className="font-medium">Soumis par:</span>
                        <span className="ml-2">{doc.soumis_par}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-[#0077d2]" />
                        <span className="font-medium">Date:</span>
                        <span className="ml-2">
                          {new Date(doc.date_soumission).toLocaleDateString(
                            'fr-FR'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3 lg:w-40">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleValidate(doc.id)}
                      className="flex-1 lg:flex-none"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Valider
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleReject(doc.id)}
                      className="flex-1 lg:flex-none"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeter
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
