'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface Ressource {
  id: string;
  titre: string;
  type: string;
  filiere: string;
  annee: string;
  ue: string;
  statut: string;
  created_at: string;
  file_path: string;
}

export function useRessourcesData() {
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [filteredRessources, setFilteredRessources] = useState<Ressource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRessources = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('epreuves')
        .select('*')
        .eq('statut', 'Validé')
        .neq('type', 'Épreuve')
        .order('created_at', { ascending: false });

      if (!error) {
        setRessources(data || []);
        setFilteredRessources(data || []);
      }
      setLoading(false);
    };

    fetchRessources();
  }, []);

  const filters = useMemo(
    () => [
      { label: 'Type', name: 'type', options: Array.from(new Set(ressources.map((r) => r.type).filter(Boolean))) },
      { label: 'Filière', name: 'filiere', options: Array.from(new Set(ressources.map((r) => r.filiere))) },
      { label: 'Année', name: 'annee', options: Array.from(new Set(ressources.map((r) => r.annee))) },
    ],
    [ressources]
  );

  const applyFilters = (values: Record<string, string>) => {
    let filtered = [...ressources];
    if (values.type) filtered = filtered.filter((r) => r.type === values.type);
    if (values.filiere) filtered = filtered.filter((r) => r.filiere === values.filiere);
    if (values.annee) filtered = filtered.filter((r) => r.annee === values.annee);
    setFilteredRessources(filtered);
  };

  return { loading, filteredRessources, filters, applyFilters };
}
