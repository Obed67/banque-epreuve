"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminPageShell from "@/components/client/admin/shared/AdminPageShell";
import Loader from "@/app/components/Loader";
import SearchInput from "@/app/components/SearchInput";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/ui/data-table";
import { useAllDocumentsColumns } from "@/components/client/admin/documents/all-documents-columns";
import { toast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { supabase } from "@/lib/supabaseClient";
import type { DashboardDocument } from "../dashboard/types";

export default function AllDocumentsPageContent() {
  const { userEmail, checkingAuth, logout } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState<DashboardDocument[]>([]);
  const [drafts, setDrafts] = useState<
    Record<string, Partial<DashboardDocument>>
  >({});
  const [deleteTarget, setDeleteTarget] = useState<DashboardDocument | null>(
    null,
  );

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("epreuves")
      .select(
        "id,titre,type,filiere,ue,annee,session,soumis_par,created_at,statut,file_path,original_file_name",
      )
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setDocuments((data || []) as DashboardDocument[]);
    setLoading(false);
  };

  useEffect(() => {
    if (checkingAuth) return;
    void fetchDocuments();
  }, [checkingAuth]);

  const filteredDocuments = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return documents;
    return documents.filter((doc) =>
      [doc.titre, doc.type, doc.filiere, doc.ue, doc.annee, doc.statut]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [documents, query]);

  const setDraftValue = useCallback(
    (id: string, field: keyof DashboardDocument, value: string) => {
      setDrafts((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value,
        },
      }));
    },
    [],
  );

  const getValue = useCallback(
    (doc: DashboardDocument, field: keyof DashboardDocument) => {
      const draftValue = drafts[doc.id]?.[field];
      return String(draftValue ?? doc[field] ?? "");
    },
    [drafts],
  );

  const hasDraft = useCallback(
    (id: string) => {
      const patch = drafts[id];
      return Boolean(patch && Object.keys(patch).length > 0);
    },
    [drafts],
  );

  const openDocument = useCallback(async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(filePath, 120);

    if (error || !data?.signedUrl) {
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir ce document.",
        variant: "destructive",
      });
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }, []);

  const saveDocument = useCallback(async (doc: DashboardDocument) => {
    const patch = drafts[doc.id];
    if (!patch || !Object.keys(patch).length) return;

    setSavingId(doc.id);
    const { error } = await supabase
      .from("epreuves")
      .update(patch)
      .eq("id", doc.id);
    setSavingId(null);

    if (error) {
      toast({
        title: "Erreur",
        description: "Modification impossible.",
        variant: "destructive",
      });
      return;
    }

    setDocuments((prev) =>
      prev.map((item) =>
        item.id === doc.id ? ({ ...item, ...patch } as DashboardDocument) : item,
      ),
    );
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[doc.id];
      return next;
    });
    toast({ title: "Succès", description: "Document modifié." });
  }, [drafts]);

  const deleteDocument = useCallback(async (doc: DashboardDocument) => {
    setDeletingId(doc.id);
    const { error } = await supabase.from("epreuves").delete().eq("id", doc.id);
    setDeletingId(null);
    setDeleteTarget(null);

    if (error) {
      toast({
        title: "Erreur",
        description: "Suppression impossible.",
        variant: "destructive",
      });
      return;
    }

    setDocuments((prev) => prev.filter((item) => item.id !== doc.id));
    toast({ title: "Succès", description: "Document supprimé." });
  }, []);

  const columns = useAllDocumentsColumns({
    savingId,
    deletingId,
    getValue,
    setDraftValue,
    onOpenDocument: openDocument,
    onSave: saveDocument,
    onDelete: setDeleteTarget,
    hasDraft,
  });

  return (
    <AdminPageShell userEmail={userEmail} onLogout={logout}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] sm:text-3xl">
            Tous les documents
          </h1>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Modifier ou supprimer un document soumis.
          </p>
        </div>
        <span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-[#0077d2]">
          {filteredDocuments.length} document(s)
        </span>
      </div>

      <div className="mb-5 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par titre, filière, UE, type ou statut"
        />
      </div>

      {loading ? (
        <div className="rounded-2xl border border-blue-100 bg-white">
          <Loader message="Chargement des documents..." className="py-14" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredDocuments}
          emptyMessage="Aucun document trouvé."
        />
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le document sera supprimé
              définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && void deleteDocument(deleteTarget)}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageShell>
  );
}
