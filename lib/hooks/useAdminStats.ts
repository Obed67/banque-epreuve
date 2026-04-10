'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface AdminStats {
  total: number;
  enAttente: number;
  valides: number;
  rejetes?: number;
}

export function useAdminStats(enabled: boolean, includeRejected = false) {
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    enAttente: 0,
    valides: 0,
    rejetes: includeRejected ? 0 : undefined,
  });

  const fetchStats = useCallback(async () => {
    const { count: total } = await supabase.from('epreuves').select('*', { count: 'exact', head: true });
    const { count: enAttente } = await supabase.from('epreuves').select('*', { count: 'exact', head: true }).eq('statut', 'En attente');
    const { count: valides } = await supabase.from('epreuves').select('*', { count: 'exact', head: true }).eq('statut', 'Validé');

    if (includeRejected) {
      const { count: rejetes } = await supabase.from('epreuves').select('*', { count: 'exact', head: true }).eq('statut', 'Rejeté');
      setStats({ total: total || 0, enAttente: enAttente || 0, valides: valides || 0, rejetes: rejetes || 0 });
      return;
    }

    setStats({ total: total || 0, enAttente: enAttente || 0, valides: valides || 0 });
  }, [includeRejected]);

  useEffect(() => {
    if (!enabled) return;
    fetchStats();
  }, [enabled, fetchStats]);

  return { stats, fetchStats };
}
