"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import AdminSidebar from "@/app/admin/components/AdminSidebar";
import Button from "@/app/components/Button";
import DocumentPreviewActions from "@/app/components/DocumentPreviewActions";
import Loader from "@/app/components/Loader";
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
        "id,titre,type,filiere,ue,annee,session,soumis_par,created_at,statut,file_path",
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
    fetchDocuments();
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

  const setDraftValue = (
    id: string,
    field: keyof DashboardDocument,
    value: string,
  ) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const getValue = (doc: DashboardDocument, field: keyof DashboardDocument) => {
    const draftValue = drafts[doc.id]?.[field];
    return String(draftValue ?? doc[field] ?? "");
  };

  const saveDocument = async (doc: DashboardDocument) => {
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
        item.id === doc.id
          ? ({ ...item, ...patch } as DashboardDocument)
          : item,
      ),
    );
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[doc.id];
      return next;
    });
    toast({ title: "Succès", description: "Document modifié." });
  };

  const deleteDocument = async (doc: DashboardDocument) => {
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
  };

  return (
    <div className="h-screen bg-[#eef6ff]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[290px_1fr]">
        <AdminSidebar userEmail={userEmail} onLogout={logout} />

        <section className="h-full overflow-y-auto p-6 lg:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0f172a]">
                Tous les documents
              </h1>
              <p className="mt-1 text-gray-500">
                Modifier ou supprimer un document soumis.
              </p>
            </div>
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-[#0077d2]">
              {documents.length} document(s)
            </span>
          </div>

          <div className="mb-5 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher par titre, filière, UE, type ou statut"
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077d2]"
              />
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-blue-100 bg-white">
              <Loader message="Chargement des documents..." className="py-14" />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="rounded-2xl border border-blue-100 bg-white p-14 text-center">
              <p className="text-gray-600">Aucun document trouvé.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
                >
                  <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        value={getValue(doc, "titre")}
                        onChange={(e) =>
                          setDraftValue(doc.id, "titre", e.target.value)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Titre"
                      />
                      <input
                        value={getValue(doc, "type")}
                        onChange={(e) =>
                          setDraftValue(doc.id, "type", e.target.value)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Type"
                      />
                      <input
                        value={getValue(doc, "filiere")}
                        onChange={(e) =>
                          setDraftValue(doc.id, "filiere", e.target.value)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Filière"
                      />
                      <input
                        value={getValue(doc, "ue")}
                        onChange={(e) =>
                          setDraftValue(doc.id, "ue", e.target.value)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="UE"
                      />
                      <input
                        value={getValue(doc, "annee")}
                        onChange={(e) =>
                          setDraftValue(doc.id, "annee", e.target.value)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Année"
                      />
                      <input
                        value={getValue(doc, "session")}
                        onChange={(e) =>
                          setDraftValue(doc.id, "session", e.target.value)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Session"
                      />
                    </div>

                    <div className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <Info label="Statut" value={doc.statut} />
                        <Info
                          label="Soumis par"
                          value={doc.soumis_par || "Anonyme"}
                        />
                        <Info
                          label="Créé le"
                          value={new Date(doc.created_at).toLocaleDateString(
                            "fr-FR",
                          )}
                        />
                        <Info
                          label="Fichier"
                          value={doc.file_path.split("/").pop() || "Document"}
                        />
                      </div>

                      <DocumentPreviewActions
                        filePath={doc.file_path}
                        accent="blue"
                      />

                      <div className="flex gap-2">
                        <Button
                          onClick={() => saveDocument(doc)}
                          disabled={savingId === doc.id}
                          className="flex-1 bg-[#0077d2] text-white hover:bg-[#0062b0] disabled:opacity-60"
                        >
                          {savingId === doc.id
                            ? "Enregistrement..."
                            : "Enregistrer"}
                        </Button>
                        <Button
                          onClick={() => setDeleteTarget(doc)}
                          disabled={deletingId === doc.id}
                          className="flex-1 bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
                        >
                          {deletingId === doc.id
                            ? "Suppression..."
                            : "Supprimer"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                  onClick={() => deleteTarget && deleteDocument(deleteTarget)}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="truncate font-medium text-[#0f172a]">{value}</p>
    </div>
  );
}
