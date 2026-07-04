"use client";

import { useCallback, useEffect, useState } from "react";
import { openDocumentInNewTab } from "@/lib/documentStorage";
import type { DuplicateMatchType } from "@/lib/documentFingerprint";
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
  content_hash?: string | null;
  fingerprint?: string | null;
  duplicate_of_id?: string | null;
  duplicate_match_type?: DuplicateMatchType | null;
  duplicate_existing?: {
    id: string;
    titre: string;
    statut: string;
    file_path: string;
  } | null;
}

async function enrichDuplicateInfo(
  documents: PendingDocument[],
): Promise<PendingDocument[]> {
  const duplicateIds = Array.from(
    new Set(
      documents
        .map((doc) => doc.duplicate_of_id)
        .filter((id): id is string => Boolean(id)),
    ),
  );

  if (duplicateIds.length === 0) return documents;

  const { data: existingDocs } = await supabase
    .from("epreuves")
    .select("id, titre, statut, file_path")
    .in("id", duplicateIds);

  const byId = new Map((existingDocs ?? []).map((doc) => [doc.id, doc]));

  return documents.map((doc) => ({
    ...doc,
    duplicate_existing: doc.duplicate_of_id
      ? byId.get(doc.duplicate_of_id) ?? null
      : null,
  }));
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

    if (!error) {
      const enriched = await enrichDuplicateInfo((data || []) as PendingDocument[]);
      setDocuments(enriched);
    }
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
    const pendingDoc = documents.find((doc) => doc.id === id);

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

    const reason =
      statut === "Rejeté" && pendingDoc?.duplicate_of_id
        ? "Ce document est déjà présent dans le catalogue ou un fichier identique a déjà été soumis."
        : null;

    void notifyContributor({ documentId: id, status: statut, reason });
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
