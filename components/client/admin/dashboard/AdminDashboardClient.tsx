"use client";

import { useEffect, useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Clock,
  Download,
  RefreshCw,
  Upload,
  Users,
} from "lucide-react";
import AdminPageShell from "@/components/client/admin/shared/AdminPageShell";
import AdminKpiCard from "@/components/client/admin/shared/AdminKpiCard";
import { ActivityTrendChart } from "@/components/client/admin/statistiques/StatsCharts";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { useAdminStats } from "@/lib/hooks/useAdminStats";
import { useSiteAnalytics } from "@/lib/hooks/useSiteAnalytics";

const DASHBOARD_PERIOD_DAYS = 7;

export default function AdminDashboardClient() {
  const { userEmail, checkingAuth, logout } = useAdminAuth();
  const { stats, fetchStats } = useAdminStats(!checkingAuth, true);
  const {
    analytics,
    loading: analyticsLoading,
    fetchAnalytics,
  } = useSiteAnalytics(!checkingAuth, DASHBOARD_PERIOD_DAYS);

  const summary = analytics.summary;
  const isLoading = checkingAuth || analyticsLoading;
  const todayLabel = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  useEffect(() => {
    if (checkingAuth) return;
    void fetchStats();
  }, [checkingAuth, fetchStats]);

  const kpiCards = useMemo(
    () => [
      {
        label: "Visiteurs",
        value: summary.unique_visitors,
        hint: `${summary.total_visits} visite${summary.total_visits > 1 ? "s" : ""}`,
        icon: Users,
        iconColor: "text-[#0077d2]",
        iconBg: "bg-blue-50",
        accent: "border-blue-100",
      },
      {
        label: "Téléchargements",
        value: summary.total_downloads,
        hint: `${summary.unique_downloaders} personne${summary.unique_downloaders > 1 ? "s" : ""}`,
        icon: Download,
        iconColor: "text-[#1cb427]",
        iconBg: "bg-green-50",
        accent: "border-green-100",
      },
      {
        label: "Soumissions",
        value: summary.total_submissions,
        hint: `${summary.unique_submitters} contributeur${summary.unique_submitters > 1 ? "s" : ""}`,
        icon: Upload,
        iconColor: "text-[#f59e0b]",
        iconBg: "bg-amber-50",
        accent: "border-amber-100",
      },
      {
        label: "En attente",
        value: stats.enAttente,
        hint: `${stats.valides} validé${stats.valides > 1 ? "s" : ""}`,
        icon: Clock,
        iconColor: "text-[#ffa446]",
        iconBg: "bg-orange-50",
        accent: "border-orange-100",
      },
    ],
    [summary, stats],
  );

  const handleRefresh = () => {
    void Promise.all([fetchStats(), fetchAnalytics()]);
  };

  return (
    <AdminPageShell userEmail={userEmail} onLogout={logout}>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium capitalize text-[#0077d2]">
              {todayLabel}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-[#0f172a]">
              Tableau de bord
            </h1>
          </div>
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
        </header>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((card) => (
            <AdminKpiCard key={card.label} {...card} loading={isLoading} />
          ))}
        </div>

      <ActivityTrendChart
        data={analytics.daily_activity}
        loading={analyticsLoading}
        periodDays={DASHBOARD_PERIOD_DAYS}
      />
    </AdminPageShell>
  );
}
