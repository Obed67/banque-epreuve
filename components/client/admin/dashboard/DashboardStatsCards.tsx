import { BarChart3, CheckCircle, Clock, FileText } from "lucide-react";
import type { DashboardStats } from "./types";

type DashboardStatsCardsProps = {
  stats: DashboardStats;
};

export default function DashboardStatsCards({
  stats,
}: DashboardStatsCardsProps) {
  const pendingPercent =
    stats.total > 0 ? Math.round((stats.enAttente / stats.total) * 100) : 0;

  return (
    <div
      id="stats-section"
      className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
    >
      <StatCard
        title="Total documents"
        value={stats.total}
        icon={<FileText className="h-5 w-5 text-[#0077d2]" />}
        border="border-blue-100"
      />
      <StatCard
        title="En attente"
        value={stats.enAttente}
        icon={<Clock className="h-5 w-5 text-[#ffa446]" />}
        border="border-orange-100"
      />
      <StatCard
        title="Valides"
        value={stats.valides}
        icon={<CheckCircle className="h-5 w-5 text-[#1cb427]" />}
        border="border-green-100"
      />
      <StatCard
        title="Taux en attente"
        value={`${pendingPercent}%`}
        icon={<BarChart3 className="h-5 w-5 text-[#0077d2]" />}
        border="border-blue-100"
      />
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  border: string;
};

function StatCard({ title, value, icon, border }: StatCardProps) {
  return (
    <div className={`rounded-2xl border ${border} bg-white p-5 shadow-sm`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon}
      </div>
      <p className="mt-3 text-3xl font-extrabold text-[#0f172a]">{value}</p>
    </div>
  );
}
