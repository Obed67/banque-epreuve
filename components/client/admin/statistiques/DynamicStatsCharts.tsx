"use client";

import dynamic from "next/dynamic";

function ChartFallback({ height }: { height: string }) {
  return (
    <div
      className={`w-full animate-pulse rounded-2xl border border-blue-100 bg-white ${height}`}
    />
  );
}

export const ActivityTrendChart = dynamic(
  () =>
    import("./StatsCharts").then((mod) => ({ default: mod.ActivityTrendChart })),
  { ssr: false, loading: () => <ChartFallback height="h-[420px]" /> },
);

export const ActivityAreaChart = dynamic(
  () =>
    import("./StatsCharts").then((mod) => ({ default: mod.ActivityAreaChart })),
  { ssr: false, loading: () => <ChartFallback height="h-[360px]" /> },
);

export const AudienceComparisonChart = dynamic(
  () =>
    import("./StatsCharts").then((mod) => ({
      default: mod.AudienceComparisonChart,
    })),
  { ssr: false, loading: () => <ChartFallback height="h-[380px]" /> },
);

export const DocumentStatusCharts = dynamic(
  () =>
    import("./StatsCharts").then((mod) => ({
      default: mod.DocumentStatusCharts,
    })),
  { ssr: false, loading: () => <ChartFallback height="h-[400px]" /> },
);
