"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle,
  Clock,
  Download,
  FileText,
  RefreshCw,
  Upload,
  Users,
  XCircle,
} from "lucide-react";
import AdminPageShell from "@/components/client/admin/shared/AdminPageShell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { useAdminStats } from "@/lib/hooks/useAdminStats";
import { useSiteAnalytics } from "@/lib/hooks/useSiteAnalytics";
import {
  ActivityAreaChart,
  ActivityTrendChart,
  AudienceComparisonChart,
  DocumentStatusCharts,
} from "./StatsCharts";

const PERIOD_OPTIONS = [
  { value: "7", label: "7 derniers jours" },
  { value: "30", label: "30 derniers jours" },
  { value: "90", label: "90 derniers jours" },
];

export default function AdminStatistiquesPageContent() {
  const [periodDays, setPeriodDays] = useState(30);
  const { userEmail, checkingAuth, logout } = useAdminAuth();
  const { stats, fetchStats } = useAdminStats(!checkingAuth, true);
  const {
    analytics,
    loading: analyticsLoading,
    error: analyticsError,
    fetchAnalytics,
  } = useSiteAnalytics(!checkingAuth, periodDays);

  const summary = analytics.summary;
  const isLoading = checkingAuth || analyticsLoading;

  const kpiCards = useMemo(
    () => [
      {
        label: "Visiteurs uniques",
        value: summary.unique_visitors,
        hint: `${summary.total_visits} visite${summary.total_visits > 1 ? "s" : ""}`,
        icon: Users,
        color: "text-[#0077d2]",
        bg: "bg-blue-50",
      },
      {
        label: "Téléchargeurs",
        value: summary.unique_downloaders,
        hint: `${summary.total_downloads} téléchargement${summary.total_downloads > 1 ? "s" : ""}`,
        icon: Download,
        color: "text-[#1cb427]",
        bg: "bg-green-50",
      },
      {
        label: "Contributeurs",
        value: summary.unique_submitters,
        hint: `${summary.total_submissions} soumission${summary.total_submissions > 1 ? "s" : ""}`,
        icon: Upload,
        color: "text-[#f59e0b]",
        bg: "bg-amber-50",
      },
      {
        label: "Documents validés",
        value: stats.valides,
        hint: `${stats.total} au total`,
        icon: CheckCircle,
        color: "text-[#1cb427]",
        bg: "bg-green-50",
      },
    ],
    [summary, stats],
  );

  const handleRefresh = () => {
    void Promise.all([fetchStats(), fetchAnalytics()]);
  };

  return (
    <AdminPageShell userEmail={userEmail} onLogout={logout}>
          <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0f172a]">
                Statistiques
              </h1>
              <p className="mt-2 text-gray-500">
                Vue d&apos;ensemble de la fréquentation et de la modération
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={String(periodDays)}
                onValueChange={(value) => setPeriodDays(Number(value))}
              >
                <SelectTrigger className="w-[200px] rounded-xl border-blue-100 bg-white">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  {PERIOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-blue-100 bg-white"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Actualiser
              </Button>
            </div>
          </header>

          {analyticsError && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p>{analyticsError}</p>
              <p className="mt-2 text-xs text-amber-800">
                Si le problème persiste, déconnectez-vous puis reconnectez-vous à
                l&apos;espace admin pour rafraîchir la session.
              </p>
            </div>
          )}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpiCards.map((card) => (
              <KpiCard key={card.label} {...card} loading={isLoading} />
            ))}
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <ActivityTrendChart
                data={analytics.daily_activity}
                loading={analyticsLoading}
                periodDays={periodDays}
              />
            </div>
            <AudienceComparisonChart
              uniqueVisitors={summary.unique_visitors}
              uniqueDownloaders={summary.unique_downloaders}
              uniqueSubmitters={summary.unique_submitters}
              loading={analyticsLoading}
            />
          </div>

          <div className="mb-8">
            <ActivityAreaChart
              data={analytics.daily_activity}
              loading={analyticsLoading}
              periodDays={periodDays}
            />
          </div>

          <div className="mb-6">
            <h2 className="mb-4 text-xl font-bold text-[#0f172a]">
              Modération des documents
            </h2>
            <DocumentStatusCharts stats={stats} loading={checkingAuth} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MiniStat
              label="En attente"
              value={stats.enAttente}
              icon={Clock}
              tone="orange"
            />
            <MiniStat
              label="Validés"
              value={stats.valides}
              icon={FileText}
              tone="green"
            />
            <MiniStat
              label="Rejetés"
              value={stats.rejetes ?? 0}
              icon={XCircle}
              tone="red"
            />
          </div>
    </AdminPageShell>
  );
}

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  color,
  bg,
  loading,
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          {loading ? (
            <Skeleton className="mt-3 h-9 w-20" />
          ) : (
            <p className="mt-2 text-3xl font-extrabold text-[#0f172a]">
              {value}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            {loading ? "Chargement..." : hint}
          </p>
        </div>
        <div className={`rounded-xl p-2.5 ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "orange" | "green" | "red";
}) {
  const toneStyles = {
    orange: {
      border: "border-orange-100",
      icon: "text-[#ffa446]",
    },
    green: {
      border: "border-green-100",
      icon: "text-[#1cb427]",
    },
    red: {
      border: "border-red-100",
      icon: "text-red-500",
    },
  } as const;

  const style = toneStyles[tone];

  return (
    <div
      className={`flex items-center justify-between rounded-2xl border bg-white px-5 py-4 shadow-sm ${style.border}`}
    >
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-extrabold text-[#0f172a]">{value}</p>
      </div>
      <Icon className={`h-5 w-5 ${style.icon}`} />
    </div>
  );
}
