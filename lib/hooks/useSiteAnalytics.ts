"use client";

import { useCallback, useEffect, useState } from "react";
import { EMPTY_SITE_ANALYTICS, type SiteAnalytics } from "@/lib/analytics";
import {
  aggregateSiteAnalytics,
  emptySiteAnalytics,
  type AnalyticsEventRow,
} from "@/lib/siteAnalyticsAggregator";
import { supabase } from "@/lib/supabaseClient";

const PAGE_SIZE = 1000;

async function fetchAllAnalyticsEvents(): Promise<AnalyticsEventRow[]> {
  const allEvents: AnalyticsEventRow[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("site_analytics_events")
      .select("event_type, session_id, created_at")
      .order("created_at", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;

    const batch = (data ?? []) as AnalyticsEventRow[];
    allEvents.push(...batch);

    if (batch.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return allEvents;
}

async function fetchViaRpc(days: number): Promise<SiteAnalytics | null> {
  const attempts = [
    () => supabase.rpc("get_site_analytics", { days }),
    () => supabase.rpc("get_site_analytics"),
  ];

  for (const attempt of attempts) {
    const { data, error } = await attempt();
    if (!error && data && typeof data === "object") {
      const payload = data as Record<string, unknown>;
      if (payload.summary && Array.isArray(payload.daily_activity)) {
        const summary = payload.summary as Record<string, unknown>;
        return {
          summary: {
            unique_visitors: Number(summary.unique_visitors) || 0,
            total_visits: Number(summary.total_visits) || 0,
            unique_downloaders: Number(summary.unique_downloaders) || 0,
            total_downloads: Number(summary.total_downloads) || 0,
            unique_submitters: Number(summary.unique_submitters) || 0,
            total_submissions: Number(summary.total_submissions) || 0,
          },
          daily_activity: payload.daily_activity.map((row) => {
            const point = row as Record<string, unknown>;
            return {
              date: String(point.date ?? ""),
              visits: Number(point.visits) || 0,
              unique_visitors: Number(point.unique_visitors) || 0,
              downloads: Number(point.downloads) || 0,
              submissions: Number(point.submissions) || 0,
            };
          }),
          period_days: Number(payload.period_days) || days,
        };
      }
    }
  }

  return null;
}

function isMissingTableError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("site_analytics_events") &&
    (lower.includes("does not exist") ||
      lower.includes("n'existe pas") ||
      lower.includes("could not find the table"))
  );
}

function isPermissionError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("permission denied") ||
    lower.includes("row-level security") ||
    lower.includes("unauthorized")
  );
}

export function useSiteAnalytics(enabled: boolean, days = 30) {
  const [analytics, setAnalytics] = useState<SiteAnalytics>(EMPTY_SITE_ANALYTICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const rpcData = await fetchViaRpc(days);
      if (rpcData) {
        setAnalytics(rpcData);
        setLoading(false);
        return;
      }

      const events = await fetchAllAnalyticsEvents();
      setAnalytics(aggregateSiteAnalytics(events, days));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de charger les statistiques";

      if (isMissingTableError(message)) {
        setError(
          "La table site_analytics_events est absente. Exécutez db/site_analytics_schema.sql dans Supabase.",
        );
      } else if (isPermissionError(message)) {
        setError(
          "Accès refusé aux statistiques. Vérifiez que votre compte admin a bien role = admin dans Supabase Auth.",
        );
      } else {
        setError(message);
      }

      setAnalytics(emptySiteAnalytics(days));
    }

    setLoading(false);
  }, [days]);

  useEffect(() => {
    if (!enabled) return;
    void fetchAnalytics();
  }, [enabled, fetchAnalytics]);

  return { analytics, loading, error, fetchAnalytics };
}
