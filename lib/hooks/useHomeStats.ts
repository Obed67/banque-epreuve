"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type HomeStats = {
  documents: number;
  downloads: number;
  visitors: number;
};

const EMPTY_STATS: HomeStats = {
  documents: 0,
  downloads: 0,
  visitors: 0,
};

async function fetchViaRpc(): Promise<HomeStats | null> {
  const { data, error } = await supabase.rpc("get_public_home_stats");
  if (error || !data || typeof data !== "object") return null;

  const payload = data as Record<string, unknown>;

  // Compat : ancienne RPC renvoyait epreuves + ressources séparés
  const documents =
    Number(payload.documents) ||
    (Number(payload.epreuves) || 0) + (Number(payload.ressources) || 0);

  return {
    documents,
    downloads: Number(payload.downloads) || 0,
    visitors: Number(payload.visitors) || 0,
  };
}

async function fetchViaFallback(): Promise<HomeStats> {
  const { count } = await supabase
    .from("epreuves")
    .select("*", { count: "exact", head: true })
    .eq("statut", "Validé");

  return {
    documents: count || 0,
    downloads: 0,
    visitors: 0,
  };
}

export function useHomeStats() {
  const [stats, setStats] = useState<HomeStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const fromRpc = await fetchViaRpc();
      if (fromRpc) {
        setStats(fromRpc);
        return;
      }
      setStats(await fetchViaFallback());
    } catch {
      setStats(EMPTY_STATS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  return { stats, loading };
}
