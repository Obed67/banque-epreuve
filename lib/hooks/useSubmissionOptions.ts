'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type RefRow = { label: string; is_active?: boolean; sort_order?: number | null };

const DEFAULT_SESSIONS = ['Normale', 'Rattrapage', 'Reprise'];

function normalizeLabel(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function toCode(value: string) {
  return normalizeLabel(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function sortByOrderThenLabel(rows: RefRow[]) {
  return rows
    .filter((r) => r.label && r.is_active !== false)
    .sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999) || a.label.localeCompare(b.label))
    .map((r) => r.label);
}

export function useSubmissionOptions() {
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [filiereOptions, setFiliereOptions] = useState<string[]>([]);
  const [ueOptions, setUeOptions] = useState<string[]>([]);
  const [anneeOptions, setAnneeOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');
  const sessionOptions = DEFAULT_SESSIONS;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      const [typesRes, filieresRes, uesRes, anneesRes] = await Promise.all([
        supabase.from('document_types').select('label,is_active,sort_order'),
        supabase.from('filieres').select('label,is_active,sort_order'),
        supabase.from('ues').select('label,is_active,sort_order'),
        supabase.from('annees').select('label,is_active,sort_order'),
      ]);

      const hasError =
        !!typesRes.error || !!filieresRes.error || !!uesRes.error || !!anneesRes.error;

      if (hasError) {
        console.error('Submission options loading error', {
          typesError: typesRes.error,
          filieresError: filieresRes.error,
          uesError: uesRes.error,
          anneesError: anneesRes.error,
        });
        setIsReady(false);
        setError("Le formulaire est temporairement indisponible. Veuillez réessayer dans un instant.");
        setLoading(false);
        return;
      }

      const types = sortByOrderThenLabel((typesRes.data || []) as RefRow[]);
      const filieres = sortByOrderThenLabel((filieresRes.data || []) as RefRow[]);
      const ues = sortByOrderThenLabel((uesRes.data || []) as RefRow[]);
      const annees = sortByOrderThenLabel((anneesRes.data || []) as RefRow[]);

      if (!types.length || !filieres.length || !ues.length || !annees.length) {
        console.warn('Submission options are empty', {
          typesCount: types.length,
          filieresCount: filieres.length,
          uesCount: ues.length,
          anneesCount: annees.length,
        });
        setIsReady(false);
        setError("Le formulaire est temporairement indisponible. Veuillez réessayer dans un instant.");
        setLoading(false);
        return;
      }

      setTypeOptions(types);
      setFiliereOptions(filieres);
      setUeOptions(ues);
      setAnneeOptions(annees);
      setIsReady(true);
      setLoading(false);
    };
    load();
  }, []);

  const withCustom = useMemo(
    () => ({
      types: [...typeOptions, 'Autre (à préciser)'],
      filieres: [...filiereOptions, 'Autre (à préciser)'],
      ues: [...ueOptions, 'Autre (à préciser)'],
      annees: [...anneeOptions, 'Autre (à préciser)'],
      sessions: sessionOptions,
    }),
    [typeOptions, filiereOptions, ueOptions, anneeOptions]
  );

  const ensureCustomValue = async (
    table: 'document_types' | 'filieres' | 'ues' | 'annees',
    label: string
  ) => {
    const clean = normalizeLabel(label);
    if (!clean) return;
    await supabase.from(table).upsert(
      {
        code: toCode(clean),
        label: clean,
        is_active: true,
      },
      { onConflict: 'code' }
    );
  };

  return { options: withCustom, ensureCustomValue, loading, isReady, error };
}
