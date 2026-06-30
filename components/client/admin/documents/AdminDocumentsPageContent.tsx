"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock } from "lucide-react";
import Loader from "@/app/components/Loader";
import AdminPageShell from "@/components/client/admin/shared/AdminPageShell";
import DocumentModerationConfirmDialog, {
  type ModerationConfirmAction,
} from "@/components/client/admin/shared/DocumentModerationConfirmDialog";
import { DataTable } from "@/components/ui/data-table";
import { useValidationDocumentsColumns } from "@/components/client/admin/documents/validation-documents-columns";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { usePendingDocuments } from "@/lib/hooks/usePendingDocuments";
import { getSupabaseErrorMessage } from "@/lib/supabaseErrors";

type PendingConfirm = {
  id: string;
  titre: string;
  action: ModerationConfirmAction;
};

export default function AdminDocumentsPageContent() {
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(
    null,
  );
  const { userEmail, checkingAuth, logout } = useAdminAuth();
  const { documents, loading, processingId, openDocument, updateStatus } =
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
    await updateStatus(id, statut);
    setNotification({
      type: statut === "Validé" ? "success" : "error",
      message:
        statut === "Validé"
          ? "Document validé avec succès"
          : "Document rejeté",
    });
  };

  const openConfirm = useCallback(
    (doc: { id: string; titre: string }, action: ModerationConfirmAction) => {
      setPendingConfirm({ id: doc.id, titre: doc.titre, action });
    },
    [],
  );

  const handleConfirm = async () => {
    if (!pendingConfirm) return;
    const statut = pendingConfirm.action === "validate" ? "Validé" : "Rejeté";
    try {
      await handleStatusUpdate(pendingConfirm.id, statut);
    } catch (error) {
      setNotification({
        type: "error",
        message: getSupabaseErrorMessage(error),
      });
      throw error;
    }
  };

  const columns = useValidationDocumentsColumns({
    processingId,
    onOpenDocument: openDocument,
    onConfirm: openConfirm,
  });

  return (
    <>
      <AdminPageShell userEmail={userEmail} onLogout={logout}>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-extrabold text-[#0f172a] sm:text-3xl">
            Validation des documents
          </h1>
          <span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-[#0077d2]">
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
            <Clock className="mx-auto mb-3 h-8 w-8 text-[#0077d2]" />
            <p className="text-gray-600">Aucun document en attente.</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={documents}
            emptyMessage="Aucun document en attente."
          />
        )}
      </AdminPageShell>

      <DocumentModerationConfirmDialog
        open={pendingConfirm !== null}
        onOpenChange={(open) => {
          if (!open) setPendingConfirm(null);
        }}
        action={pendingConfirm?.action ?? "validate"}
        documentTitle={pendingConfirm?.titre ?? ""}
        loading={processingId === pendingConfirm?.id}
        onConfirm={handleConfirm}
      />
    </>
  );
}
