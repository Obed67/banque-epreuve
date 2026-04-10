"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Button from "@/app/components/Button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import type { DashboardDocument } from "./types";

type AllDocumentsManagerProps = {
  onChanged: () => Promise<void> | void;
};

type DraftMap = Record<string, Partial<DashboardDocument>>;

export default function AllDocumentsManager({
  onChanged,
}: AllDocumentsManagerProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<DashboardDocument[]>([]);
  const [query, setQuery] = useState("");
  const [drafts, setDrafts] = useState<DraftMap>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DashboardDocument | null>(
    null,
  );

  const fetchAllDocuments = async () => {
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
    if (!open) return;
    fetchAllDocuments();
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter((doc) =>
      [doc.titre, doc.filiere, doc.ue, doc.type, doc.statut]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [documents, query]);

  const getDraftValue = (
    doc: DashboardDocument,
    key: keyof DashboardDocument,
  ) => {
    const fromDraft = drafts[doc.id]?.[key];
    return String(fromDraft ?? doc[key] ?? "");
  };

  const setDraftValue = (
    docId: string,
    key: keyof DashboardDocument,
    value: string,
  ) => {
    setDrafts((prev) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [key]: value,
      },
    }));
  };

  const saveRow = async (doc: DashboardDocument) => {
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
    await onChanged();
    toast({ title: "Succès", description: "Document modifié." });
  };

  const deleteRow = async (doc: DashboardDocument) => {
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
    await onChanged();
    toast({ title: "Succès", description: "Document supprimé." });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0077d2] text-white hover:bg-[#0062b0]">
          <Pencil className="mr-2 h-4 w-4" />
          Tous les documents
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] max-w-5xl overflow-hidden p-0">
        <DialogHeader className="border-b border-blue-100 px-6 py-4">
          <DialogTitle>Gestion de tous les documents</DialogTitle>
          <DialogDescription>
            Modifiez les informations ou supprimez un document.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-5 pt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par titre, filière, UE, type, statut"
            className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077d2]"
          />

          <div className="max-h-[58vh] overflow-y-auto pr-1">
            {loading ? (
              <Loader message="Chargement des documents..." className="py-16" />
            ) : (
              <div className="space-y-3">
                {filtered.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-xl border border-blue-100 bg-white p-4"
                  >
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <input
                        value={getDraftValue(doc, "titre")}
                        onChange={(e) =>
                          setDraftValue(doc.id, "titre", e.target.value)
                        }
                        className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                        placeholder="Titre"
                      />
                      <input
                        value={getDraftValue(doc, "type")}
                        onChange={(e) =>
                          setDraftValue(doc.id, "type", e.target.value)
                        }
                        className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                        placeholder="Type"
                      />
                      <input
                        value={getDraftValue(doc, "filiere")}
                        onChange={(e) =>
                          setDraftValue(doc.id, "filiere", e.target.value)
                        }
                        className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                        placeholder="Filière"
                      />
                      <input
                        value={getDraftValue(doc, "ue")}
                        onChange={(e) =>
                          setDraftValue(doc.id, "ue", e.target.value)
                        }
                        className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                        placeholder="UE"
                      />
                      <input
                        value={getDraftValue(doc, "annee")}
                        onChange={(e) =>
                          setDraftValue(doc.id, "annee", e.target.value)
                        }
                        className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                        placeholder="Année"
                      />
                      <input
                        value={getDraftValue(doc, "session")}
                        onChange={(e) =>
                          setDraftValue(doc.id, "session", e.target.value)
                        }
                        className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                        placeholder="Session"
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Button
                        onClick={() => saveRow(doc)}
                        disabled={savingId === doc.id}
                        className="bg-[#0077d2] text-white hover:bg-[#0062b0] disabled:opacity-60"
                      >
                        {savingId === doc.id
                          ? "Enregistrement..."
                          : "Enregistrer"}
                      </Button>
                      <Button
                        onClick={() => setDeleteTarget(doc)}
                        disabled={deletingId === doc.id}
                        className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingId === doc.id ? "Suppression..." : "Supprimer"}
                      </Button>
                    </div>
                  </div>
                ))}

                {!filtered.length && (
                  <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                    Aucun document trouvé.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>

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
              onClick={() => deleteTarget && deleteRow(deleteTarget)}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
