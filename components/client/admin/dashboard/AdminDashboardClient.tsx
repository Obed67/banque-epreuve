"use client";

import { useEffect, useState } from "react";
import { CheckCircle, ShieldCheck, XCircle } from "lucide-react";
import AdminSidebar from "@/app/admin/components/AdminSidebar";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { usePendingDocuments } from "@/lib/hooks/usePendingDocuments";
import { useAdminStats } from "@/lib/hooks/useAdminStats";
import DashboardStatsCards from "./DashboardStatsCards";
import PendingDocumentsList from "./PendingDocumentsList";
import type { DashboardNotification } from "./types";

export default function AdminDashboardClient() {
  const [notification, setNotification] = useState<DashboardNotification>(null);
  const { userEmail, checkingAuth, logout } = useAdminAuth();
  const { documents, loading, processingId, openDocument, updateStatus } =
    usePendingDocuments(!checkingAuth);
  const { stats, fetchStats } = useAdminStats(!checkingAuth);

  useEffect(() => {
    if (checkingAuth) return;
    fetchStats();
  }, [checkingAuth, fetchStats]);

  const notify = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleValidate = async (id: string) => {
    try {
      await updateStatus(id, "Validé");
      await fetchStats();
      notify("success", "Document valide avec succes");
    } catch (error) {
      console.error("Error validating document:", error);
      notify("error", "Erreur lors de la validation");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Etes-vous sur de vouloir rejeter ce document ?")) return;
    try {
      await updateStatus(id, "Rejeté");
      await fetchStats();
      notify("error", "Document rejete");
    } catch (error) {
      console.error("Error rejecting document:", error);
      notify("error", "Erreur lors du rejet");
    }
  };

  const handleOpenDocument = async (filePath: string) => {
    try {
      await openDocument(filePath);
    } catch (error) {
      console.error("Error opening document:", error);
      notify("error", "Impossible d'ouvrir ce document");
    }
  };

  return (
    <div className="h-screen bg-[#eef6ff]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[290px_1fr]">
        <AdminSidebar userEmail={userEmail} onLogout={logout} />

        <section className="h-full overflow-y-auto p-6 lg:p-8">
          <header className="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0077d2]">
                  Espace administration
                </p>
                <h1 className="mt-1 text-3xl font-extrabold text-[#0f172a]">
                  Tableau de bord
                </h1>
                <p className="mt-2 text-gray-500">
                  Suivez les soumissions et prenez des decisions de validation
                  rapidement.
                </p>
              </div>
              <div className="hidden items-center gap-2 rounded-xl border border-blue-100 bg-[#f7fbff] px-3 py-2 md:flex">
                <ShieldCheck className="h-4 w-4 text-[#0077d2]" />
                <span className="text-sm font-medium text-[#0f172a]">
                  Mode moderation
                </span>
              </div>
            </div>
          </header>

          {notification && (
            <Toast type={notification.type} message={notification.message} />
          )}
          <DashboardStatsCards stats={stats} />

          <div
            id="documents-section"
            className="mb-5 flex items-center justify-between"
          >
            <h2 className="text-xl font-bold text-[#0f172a]">
              Documents a traiter
            </h2>
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-[#0077d2]">
              {documents.length} restant(s)
            </span>
          </div>

          <PendingDocumentsList
            loading={loading}
            documents={documents}
            processingId={processingId}
            onOpenDocument={handleOpenDocument}
            onValidate={handleValidate}
            onReject={handleReject}
          />
        </section>
      </div>
    </div>
  );
}

function Toast({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center rounded-xl border bg-white p-4 shadow-lg ${type === "success" ? "border-green-100 text-green-700" : "border-red-100 text-red-700"}`}
    >
      <div
        className={`mr-3 rounded-full p-2 ${type === "success" ? "bg-green-50" : "bg-red-50"}`}
      >
        {type === "success" ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <XCircle className="h-5 w-5" />
        )}
      </div>
      <p className="pr-2 font-medium">{message}</p>
    </div>
  );
}
