import { supabase } from "@/lib/supabaseClient";

const SESSION_STORAGE_KEY = "be_session_id";
const VISIT_STORAGE_PREFIX = "be_visit_";

export type AnalyticsEventType = "visit" | "download" | "submission";

function getOrCreateSessionId(): string | null {
  if (typeof window === "undefined") return null;

  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }

  return sessionId;
}

async function insertEvent(
  eventType: AnalyticsEventType,
  options?: { documentId?: string; pagePath?: string },
) {
  const sessionId = getOrCreateSessionId();
  if (!sessionId) return;

  const { error } = await supabase.from("site_analytics_events").insert({
    event_type: eventType,
    session_id: sessionId,
    document_id: options?.documentId ?? null,
    page_path: options?.pagePath ?? null,
  });

  if (error) {
    console.warn("[analytics]", eventType, error.message);
  }
}

export function trackVisit(pagePath: string) {
  if (typeof window === "undefined") return;

  const today = new Date().toISOString().slice(0, 10);
  const visitKey = `${VISIT_STORAGE_PREFIX}${today}`;

  if (sessionStorage.getItem(visitKey)) return;
  sessionStorage.setItem(visitKey, "1");

  void insertEvent("visit", { pagePath });
}

export function trackDownload(documentId: string) {
  void insertEvent("download", { documentId });
}

export function trackSubmission(documentId?: string) {
  void insertEvent("submission", documentId ? { documentId } : undefined);
}

export interface SiteAnalyticsSummary {
  unique_visitors: number;
  total_visits: number;
  unique_downloaders: number;
  total_downloads: number;
  unique_submitters: number;
  total_submissions: number;
}

export interface DailyActivityPoint {
  date: string;
  visits: number;
  unique_visitors: number;
  downloads: number;
  submissions: number;
}

export interface SiteAnalytics {
  summary: SiteAnalyticsSummary;
  daily_activity: DailyActivityPoint[];
  period_days: number;
}

export const EMPTY_SITE_ANALYTICS: SiteAnalytics = {
  summary: {
    unique_visitors: 0,
    total_visits: 0,
    unique_downloaders: 0,
    total_downloads: 0,
    unique_submitters: 0,
    total_submissions: 0,
  },
  daily_activity: [],
  period_days: 30,
};
