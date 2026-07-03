"use client";

import { useCallback, useEffect, useState } from "react";
import { openDocumentInNewTab } from "@/lib/documentStorage";
import { supabase } from "@/lib/supabaseClient";
import { notifyContributor } from "@/lib/notifyContributor";

export interface PendingDocument {
  id: string;
  titre: string;
  type: string;
  etablissement: string;
  filiere: string;
  ue: string;
  annee: string;
  niveau: string;
  session: string | null;
  soumis_par: string | null;
  created_at: string;
  statut: string;
  file_path: string;
  original_file_name?: string | null;
}

export function usePendingDocuments(enabled: boolean) {
  const [documents, setDocuments] = useState<PendingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("epreuves")
      .select("*")
      .eq("statut", "En attente")
      .order("created_at", { ascending: false });
    if (!error) setDocuments(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    fetchDocuments();
  }, [enabled, fetchDocuments]);

  const openDocument = async (filePath: string) => {
    await openDocumentInNewTab(filePath);
  };

  const updateStatus = async (id: string, statut: "Validé" | "Rejeté") => {
    setProcessingId(id);
    const { data, error } = await supabase
      .from("epreuves")
      .update({ statut })
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      setProcessingId(null);
      throw error;
    }

    if (!data) {
      setProcessingId(null);
      throw new Error(
        "Aucune ligne mise à jour. Vérifiez les droits admin ou exécutez db/epreuves_moderation_schema.sql.",
      );
    }

    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setProcessingId(null);

    void notifyContributor({ documentId: id, status: statut });
  };

  return {
    documents,
    loading,
    processingId,
    fetchDocuments,
    openDocument,
    updateStatus,
  };
}
