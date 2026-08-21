"use client";

import { useHomeStats } from "@/lib/hooks/useHomeStats";

function formatStat(value: number, loading: boolean) {
  if (loading) return "...";
  if (value <= 0) return "0";
  return `+${value.toLocaleString("fr-FR")}`;
}

export default function HomeStatsSection() {
  const { stats, loading } = useHomeStats();

  const items = [
    {
      value: formatStat(stats.documents, loading),
      label: "Documents",
    },
    {
      value: formatStat(stats.downloads, loading),
      label: "Téléchargements",
    },
    {
      value: formatStat(stats.visitors, loading),
      label: "Visiteurs",
    },
    {
      value: "100%",
      label: "Gratuit",
    },
  ];

  return (
    <section className="border-y border-gray-100 bg-gray-50 py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-0 sm:px-2">
        <div className="grid grid-cols-2 gap-6 text-center sm:gap-8 md:grid-cols-4">
          {items.map((item) => (
            <div key={item.label}>
              <div className="mb-1 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:mb-2 sm:text-4xl md:text-5xl">
                {item.value}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 sm:text-sm">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
