"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react";
import Badge from "@/app/components/Badge";
import DocumentPreviewActions from "@/app/components/DocumentPreviewActions";
import Loader from "@/app/components/Loader";
import AdminSidebar from "@/app/admin/components/AdminSidebar";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { usePendingDocuments } from "@/lib/hooks/usePendingDocuments";

export default function AdminDocumentsPageContent() {
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { userEmail, checkingAuth, logout } = useAdminAuth();
  const { documents, loading, processingId, updateStatus } =
    usePendingDocuments(!checkingAuth);

  useEffect(() => {
    if (!notification) return;
    const id = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(id);
  }, [notification]);

  const handleStatusUpdate = async (
    id: string,
    statut: "Validé" | "Rejeté",
  ) => {
    try {
      await updateStatus(id, statut);
      setNotification({
        type: statut === "Validé" ? "success" : "error",
        message: `Document ${statut.toLowerCase()} avec succès`,
      });
    } catch {
      setNotification({
        type: "error",
        message: "Erreur lors de la mise à jour",
      });
    }
  };

  return (
    <div className="h-screen bg-[#eef6ff]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[290px_1fr]">
        <AdminSidebar userEmail={userEmail} onLogout={logout} />
        <section className="h-full overflow-y-auto p-6 lg:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-[#0f172a]">
              Validation des documents
            </h1>
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-[#0077d2]">
              {documents.length} en attente
            </span>
          </div>
          {notification && (
            <div
              className={`mb-4 rounded-xl border p-3 text-sm ${notification.type === "success" ? "border-green-100 bg-green-50 text-green-700" : "border-red-100 bg-red-50 text-red-700"}`}
            >
              {notification.message}
            </div>
          )}
          {loading ? (
            <div className="rounded-2xl border border-blue-100 bg-white">
              <Loader message="Chargement des documents..." className="py-14" />
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-2xl border border-blue-100 bg-white p-14 text-center">
              <Clock className="h-8 w-8 text-[#0077d2] mx-auto mb-3" />
              <p className="text-gray-600">Aucun document en attente.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col xl:flex-row gap-5">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-blue-50 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-[#0077d2]" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <div>
                          <h3 className="text-lg font-bold text-[#0f172a] mb-2">
                            {doc.titre}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="info-subtle">
                              {doc.type || "N/A"}
                            </Badge>
                            <Badge variant="warning-subtle">{doc.statut}</Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                          <p className="text-sm text-gray-700">
                            <span className="text-gray-400">Filière: </span>
                            {doc.filiere}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="text-gray-400">UE: </span>
                            {doc.ue}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="text-gray-400">Soumis par: </span>
                            {doc.soumis_par || "Anonyme"}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="text-gray-400">Date: </span>
                            {new Date(doc.created_at).toLocaleDateString(
                              "fr-FR",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex xl:flex-col gap-2.5 xl:w-52 xl:border-l xl:border-blue-100 xl:pl-5 justify-center">
                      <DocumentPreviewActions
                        filePath={doc.file_path}
                        accent="blue"
                      />
                      <button
                        onClick={() => handleStatusUpdate(doc.id, "Validé")}
                        disabled={processingId === doc.id}
                        className="w-full flex items-center justify-center px-4 py-2.5 bg-[#1cb427] text-white text-sm font-medium rounded-lg hover:bg-[#158f1f] disabled:opacity-60"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" /> Valider
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(doc.id, "Rejeté")}
                        disabled={processingId === doc.id}
                        className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                      >
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
