import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type AdminKpiCardProps = {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  accent?: string;
  loading?: boolean;
};

export default function AdminKpiCard({
  label,
  value,
  hint,
  icon: Icon,
  iconColor,
  iconBg,
  accent = "border-blue-100",
  loading,
}: AdminKpiCardProps) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${accent}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          {loading ? (
            <Skeleton className="mt-3 h-9 w-20" />
          ) : (
            <p className="mt-2 text-3xl font-extrabold text-[#0f172a]">{value}</p>
          )}
          {hint && (
            <p className="mt-1 truncate text-xs text-gray-400">
              {loading ? "Chargement..." : hint}
            </p>
          )}
        </div>
        <div className={`shrink-0 rounded-xl p-2.5 ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
