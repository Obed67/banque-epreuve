'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  applyRessourceTypeExclusion,
  buildEpreuveTypeOrFilter,
} from '@/lib/documentType';
import { supabase } from '@/lib/supabaseClient';

export interface AdminStats {
  total: number;
  enAttente: number;
  valides: number;
  rejetes?: number;
  epreuvesValides: number;
  ressourcesValides: number;
}

export function useAdminStats(enabled: boolean, includeRejected = false) {
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    enAttente: 0,
    valides: 0,
    rejetes: includeRejected ? 0 : undefined,
    epreuvesValides: 0,
    ressourcesValides: 0,
  });

  const fetchStats = useCallback(async () => {
    const [
      totalRes,
      enAttenteRes,
      validesRes,
      epreuvesRes,
      ressourcesRes,
      rejetesRes,
    ] = await Promise.all([
      supabase.from('epreuves').select('*', { count: 'exact', head: true }),
      supabase
        .from('epreuves')
        .select('*', { count: 'exact', head: true })
        .eq('statut', 'En attente'),
      supabase
        .from('epreuves')
        .select('*', { count: 'exact', head: true })
        .eq('statut', 'Validé'),
      supabase
        .from('epreuves')
        .select('*', { count: 'exact', head: true })
        .eq('statut', 'Validé')
        .or(buildEpreuveTypeOrFilter()),
      applyRessourceTypeExclusion(
        supabase
          .from('epreuves')
          .select('*', { count: 'exact', head: true })
          .eq('statut', 'Validé'),
      ),
      includeRejected
        ? supabase
            .from('epreuves')
            .select('*', { count: 'exact', head: true })
            .eq('statut', 'Rejeté')
        : Promise.resolve({ count: null }),
    ]);

    setStats({
      total: totalRes.count || 0,
      enAttente: enAttenteRes.count || 0,
      valides: validesRes.count || 0,
      rejetes: includeRejected ? rejetesRes.count || 0 : undefined,
      epreuvesValides: epreuvesRes.count || 0,
      ressourcesValides: ressourcesRes.count || 0,
    });
  }, [includeRejected]);

  useEffect(() => {
    if (!enabled) return;
    fetchStats();
  }, [enabled, fetchStats]);

  return { stats, fetchStats };
}
