import {
  EMPTY_SITE_ANALYTICS,
  EMPTY_VISIT_WINDOW,
  type DailyActivityPoint,
  type SiteAnalytics,
  type VisitWindowStats,
} from "@/lib/analytics";

export type AnalyticsEventRow = {
  event_type: "visit" | "download" | "submission";
  session_id: string;
  created_at: string;
};

function toDayKey(isoDate: string) {
  return isoDate.slice(0, 10);
}

function buildDateRange(periodDays: number): string[] {
  const days: string[] = [];
  const end = new Date();
  end.setHours(0, 0, 0, 0);

  for (let i = periodDays - 1; i >= 0; i -= 1) {
    const day = new Date(end);
    day.setDate(end.getDate() - i);
    days.push(day.toISOString().slice(0, 10));
  }

  return days;
}

function shiftDayKey(dayKey: string, deltaDays: number): string {
  const date = new Date(`${dayKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + deltaDays);
  return date.toISOString().slice(0, 10);
}

function countVisitWindow(
  visits: AnalyticsEventRow[],
  predicate: (dayKey: string) => boolean,
): VisitWindowStats {
  const filtered = visits.filter((event) => predicate(toDayKey(event.created_at)));
  return {
    unique_visitors: new Set(filtered.map((event) => event.session_id)).size,
    total_visits: filtered.length,
  };
}

function parseVisitWindow(value: unknown): VisitWindowStats {
  if (!value || typeof value !== "object") {
    return { ...EMPTY_VISIT_WINDOW };
  }
  const row = value as Record<string, unknown>;
  return {
    unique_visitors: Number(row.unique_visitors) || 0,
    total_visits: Number(row.total_visits) || 0,
  };
}

export function parseSiteAnalyticsSummary(
  summary: Record<string, unknown>,
): SiteAnalytics["summary"] {
  return {
    unique_visitors: Number(summary.unique_visitors) || 0,
    total_visits: Number(summary.total_visits) || 0,
    unique_downloaders: Number(summary.unique_downloaders) || 0,
    total_downloads: Number(summary.total_downloads) || 0,
    unique_submitters: Number(summary.unique_submitters) || 0,
    total_submissions: Number(summary.total_submissions) || 0,
    visits_today: parseVisitWindow(summary.visits_today),
    visits_yesterday: parseVisitWindow(summary.visits_yesterday),
    visits_last_7_days: parseVisitWindow(summary.visits_last_7_days),
  };
}

export function aggregateSiteAnalytics(
  events: AnalyticsEventRow[],
  periodDays: number,
): SiteAnalytics {
  const visits = events.filter((event) => event.event_type === "visit");
  const downloads = events.filter((event) => event.event_type === "download");
  const submissions = events.filter((event) => event.event_type === "submission");

  const range = buildDateRange(periodDays);
  const rangeStart = range[0];
  const today = range[range.length - 1] ?? new Date().toISOString().slice(0, 10);
  const yesterday = shiftDayKey(today, -1);
  const last7Start = shiftDayKey(today, -6);

  const inRange = (createdAt: string) => toDayKey(createdAt) >= rangeStart;

  const dailyMap = new Map<string, DailyActivityPoint>(
    range.map((date) => [
      date,
      {
        date,
        visits: 0,
        unique_visitors: 0,
        downloads: 0,
        submissions: 0,
      },
    ]),
  );

  const visitorsByDay = new Map<string, Set<string>>();

  for (const event of events) {
    if (!inRange(event.created_at)) continue;

    const day = toDayKey(event.created_at);
    const point = dailyMap.get(day);
    if (!point) continue;

    if (event.event_type === "visit") {
      point.visits += 1;
      if (!visitorsByDay.has(day)) visitorsByDay.set(day, new Set());
      visitorsByDay.get(day)!.add(event.session_id);
    }

    if (event.event_type === "download") {
      point.downloads += 1;
    }

    if (event.event_type === "submission") {
      point.submissions += 1;
    }
  }

  for (const day of range) {
    const point = dailyMap.get(day)!;
    point.unique_visitors = visitorsByDay.get(day)?.size ?? 0;
  }

  return {
    summary: {
      unique_visitors: new Set(visits.map((event) => event.session_id)).size,
      total_visits: visits.length,
      unique_downloaders: new Set(downloads.map((event) => event.session_id)).size,
      total_downloads: downloads.length,
      unique_submitters: new Set(submissions.map((event) => event.session_id))
        .size,
      total_submissions: submissions.length,
      visits_today: countVisitWindow(visits, (day) => day === today),
      visits_yesterday: countVisitWindow(visits, (day) => day === yesterday),
      visits_last_7_days: countVisitWindow(
        visits,
        (day) => day >= last7Start && day <= today,
      ),
    },
    daily_activity: range.map((date) => dailyMap.get(date)!),
    period_days: periodDays,
  };
}

export function emptySiteAnalytics(periodDays: number): SiteAnalytics {
  return {
    ...EMPTY_SITE_ANALYTICS,
    summary: {
      ...EMPTY_SITE_ANALYTICS.summary,
      visits_today: { ...EMPTY_VISIT_WINDOW },
      visits_yesterday: { ...EMPTY_VISIT_WINDOW },
      visits_last_7_days: { ...EMPTY_VISIT_WINDOW },
    },
    period_days: periodDays,
    daily_activity: buildDateRange(periodDays).map((date) => ({
      date,
      visits: 0,
      unique_visitors: 0,
      downloads: 0,
      submissions: 0,
    })),
  };
}
