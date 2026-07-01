'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type RefRow = { label: string; is_active?: boolean; sort_order?: number | null };

const DEFAULT_SESSIONS = ['Normale', 'Rattrapage', 'Reprise'];

function sortByOrderThenLabel(rows: RefRow[]) {
  return rows
    .filter((r) => r.label && r.is_active !== false)
    .sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999) || a.label.localeCompare(b.label))
    .map((r) => r.label);
}

export function useSubmissionOptions() {
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [etablissementOptions, setEtablissementOptions] = useState<string[]>([]);
  const [filiereOptions, setFiliereOptions] = useState<string[]>([]);
  const [ueOptions, setUeOptions] = useState<string[]>([]);
  const [anneeOptions, setAnneeOptions] = useState<string[]>([]);
  const [niveauOptions, setNiveauOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');
  const sessionOptions = DEFAULT_SESSIONS;

  const loadOptions = useCallback(async () => {
    setLoading(true);
    setError('');
    const [typesRes, etablissementsRes, filieresRes, uesRes, anneesRes, niveauxRes] =
      await Promise.all([
        supabase.from('document_types').select('label,is_active,sort_order'),
        supabase.from('etablissements').select('label,is_active,sort_order'),
        supabase.from('filieres').select('label,is_active,sort_order'),
        supabase.from('ues').select('label,is_active,sort_order'),
        supabase.from('annees').select('label,is_active,sort_order'),
        supabase.from('niveaux').select('label,is_active,sort_order'),
      ]);

    const hasError =
      !!typesRes.error ||
      !!etablissementsRes.error ||
      !!filieresRes.error ||
      !!uesRes.error ||
      !!anneesRes.error ||
      !!niveauxRes.error;

    if (hasError) {
      console.error('Submission options loading error', {
        typesError: typesRes.error,
        etablissementsError: etablissementsRes.error,
        filieresError: filieresRes.error,
        uesError: uesRes.error,
        anneesError: anneesRes.error,
        niveauxError: niveauxRes.error,
      });
      setIsReady(false);
      setError("Le formulaire est temporairement indisponible. Veuillez réessayer dans un instant.");
      setLoading(false);
      return;
    }

    const types = sortByOrderThenLabel((typesRes.data || []) as RefRow[]);
    const etablissements = sortByOrderThenLabel((etablissementsRes.data || []) as RefRow[]);
    const filieres = sortByOrderThenLabel((filieresRes.data || []) as RefRow[]);
    const ues = sortByOrderThenLabel((uesRes.data || []) as RefRow[]);
    const annees = sortByOrderThenLabel((anneesRes.data || []) as RefRow[]);
    const niveaux = sortByOrderThenLabel((niveauxRes.data || []) as RefRow[]);

    if (
      !types.length ||
      !etablissements.length ||
      !filieres.length ||
      !ues.length ||
      !annees.length ||
      !niveaux.length
    ) {
      setIsReady(false);
      setError("Le formulaire est temporairement indisponible. Veuillez réessayer dans un instant.");
      setLoading(false);
      return;
    }

    setTypeOptions(types);
    setEtablissementOptions(etablissements);
    setFiliereOptions(filieres);
    setUeOptions(ues);
    setAnneeOptions(annees);
    setNiveauOptions(niveaux);
    setIsReady(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

  const withCustom = useMemo(
    () => ({
      types: [...typeOptions, 'Autre (à préciser)'],
      etablissements: [...etablissementOptions, 'Autre (à préciser)'],
      filieres: [...filiereOptions, 'Autre (à préciser)'],
      ues: [...ueOptions, 'Autre (à préciser)'],
      annees: [...anneeOptions, 'Autre (à préciser)'],
      niveaux: [...niveauOptions, 'Autre (à préciser)'],
      sessions: sessionOptions,
    }),
    [typeOptions, etablissementOptions, filiereOptions, ueOptions, anneeOptions, niveauOptions],
  );

  return { options: withCustom, loading, isReady, error, reloadOptions: loadOptions };
}
