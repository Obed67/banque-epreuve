'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface PendingDocument {
  id: string;
  titre: string;
  type: string;
  filiere: string;
  ue: string;
  annee: string;
  session: string | null;
  soumis_par: string | null;
  created_at: string;
  statut: string;
  file_path: string;
}

export function usePendingDocuments(enabled: boolean) {
  const [documents, setDocuments] = useState<PendingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('epreuves')
      .select('*')
      .eq('statut', 'En attente')
      .order('created_at', { ascending: false });
    if (!error) setDocuments(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    fetchDocuments();
  }, [enabled, fetchDocuments]);

  const openDocument = async (filePath: string) => {
    const { data, error } = await supabase.storage.from('documents').createSignedUrl(filePath, 120);
    if (error || !data?.signedUrl) {
      throw new Error("Impossible d'ouvrir ce document");
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  const updateStatus = async (id: string, statut: 'Validé' | 'Rejeté') => {
    setProcessingId(id);
    const { error } = await supabase.from('epreuves').update({ statut }).eq('id', id);
    if (error) {
      setProcessingId(null);
      throw error;
    }
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setProcessingId(null);
  };

  return { documents, loading, processingId, fetchDocuments, openDocument, updateStatus };
}
