"use client";

import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { DailyActivityPoint } from "@/lib/analytics";
import type { AdminStats } from "@/lib/hooks/useAdminStats";
import {
  activityChartConfig,
  audienceChartConfig,
  documentStatusChartConfig,
} from "./stats-chart-config";

type ActivityTrendChartProps = {
  data: DailyActivityPoint[];
  loading?: boolean;
  periodDays: number;
};

type AudienceComparisonChartProps = {
  uniqueVisitors: number;
  uniqueDownloaders: number;
  uniqueSubmitters: number;
  loading?: boolean;
};

type DocumentStatusChartsProps = {
  stats: AdminStats;
  loading?: boolean;
};

function formatDayLabel(date: string) {
  try {
    return format(parseISO(date), "d MMM", { locale: fr });
  } catch {
    return date;
  }
}

export function ActivityTrendChart({
  data,
  loading,
  periodDays,
}: ActivityTrendChartProps) {
  if (loading) {
    return <ChartSkeleton title="Activité du site" height="h-[340px]" />;
  }

  return (
    <Card className="rounded-2xl border-blue-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-[#0f172a]">Activité du site</CardTitle>
        <CardDescription>
          Courbes des visites, téléchargements et soumissions sur {periodDays} jours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={activityChartConfig} className="h-[340px] w-full">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={formatDayLabel}
            />
            <YAxis tickLine={false} axisLine={false} width={36} allowDecimals={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDayLabel(String(value))}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="var(--color-visits)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="downloads"
              stroke="var(--color-downloads)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="submissions"
              stroke="var(--color-submissions)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function ActivityAreaChart({
  data,
  loading,
  periodDays,
}: ActivityTrendChartProps) {
  if (loading) {
    return <ChartSkeleton title="Volume cumulé" height="h-[280px]" />;
  }

  return (
    <Card className="rounded-2xl border-blue-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-[#0f172a]">Volume d&apos;activité</CardTitle>
        <CardDescription>
          Aire cumulée des interactions sur {periodDays} jours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={activityChartConfig} className="h-[280px] w-full">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-visits)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-visits)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillDownloads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-downloads)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-downloads)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillSubmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-submissions)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-submissions)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={formatDayLabel}
            />
            <YAxis tickLine={false} axisLine={false} width={36} allowDecimals={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDayLabel(String(value))}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="visits"
              stroke="var(--color-visits)"
              fill="url(#fillVisits)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="downloads"
              stroke="var(--color-downloads)"
              fill="url(#fillDownloads)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="submissions"
              stroke="var(--color-submissions)"
              fill="url(#fillSubmissions)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function AudienceComparisonChart({
  uniqueVisitors,
  uniqueDownloaders,
  uniqueSubmitters,
  loading,
}: AudienceComparisonChartProps) {
  const data = [
    { metric: "visitors", value: uniqueVisitors },
    { metric: "downloaders", value: uniqueDownloaders },
    { metric: "submitters", value: uniqueSubmitters },
  ];

  if (loading) {
    return <ChartSkeleton title="Audience unique" height="h-[300px]" />;
  }

  return (
    <Card className="rounded-2xl border-blue-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-[#0f172a]">Audience unique</CardTitle>
        <CardDescription>
          Personnes distinctes par type d&apos;action
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={audienceChartConfig} className="h-[300px] w-full">
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis
              dataKey="metric"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                audienceChartConfig[value as keyof typeof audienceChartConfig]?.label ??
                value
              }
            />
            <YAxis tickLine={false} axisLine={false} width={36} allowDecimals={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    audienceChartConfig[value as keyof typeof audienceChartConfig]?.label ??
                    String(value)
                  }
                />
              }
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.metric}
                  fill={`var(--color-${entry.metric})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function DocumentStatusCharts({ stats, loading }: DocumentStatusChartsProps) {
  const pieData = [
    { status: "valides", value: stats.valides },
    { status: "enAttente", value: stats.enAttente },
    { status: "rejetes", value: stats.rejetes ?? 0 },
  ].filter((item) => item.value > 0);

  const barData = [
    { status: "valides", count: stats.valides },
    { status: "enAttente", count: stats.enAttente },
    { status: "rejetes", count: stats.rejetes ?? 0 },
  ];

  const validationRate =
    stats.total > 0 ? Math.round((stats.valides / stats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartSkeleton title="Répartition des documents" height="h-[320px]" />
        <ChartSkeleton title="Documents par statut" height="h-[320px]" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card className="rounded-2xl border-blue-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#0f172a]">Répartition des documents</CardTitle>
          <CardDescription>Camembert par statut de modération</CardDescription>
        </CardHeader>
        <CardContent>
          {pieData.length === 0 ? (
            <EmptyChartMessage message="Aucun document enregistré pour le moment." />
          ) : (
            <ChartContainer
              config={documentStatusChartConfig}
              className="mx-auto h-[320px] w-full max-w-[360px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={68}
                  outerRadius={108}
                  paddingAngle={3}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={`var(--color-${entry.status})`}
                    />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-[#0f172a] text-3xl font-extrabold"
                          >
                            {validationRate}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 22}
                            className="fill-gray-500 text-xs"
                          >
                            validés
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="status" />} />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-blue-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#0f172a]">Documents par statut</CardTitle>
          <CardDescription>Histogramme des volumes de modération</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={documentStatusChartConfig}
            className="h-[320px] w-full"
          >
            <BarChart data={barData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis
                dataKey="status"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  documentStatusChartConfig[
                    value as keyof typeof documentStatusChartConfig
                  ]?.label ?? value
                }
              />
              <YAxis tickLine={false} axisLine={false} width={36} allowDecimals={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      documentStatusChartConfig[
                        value as keyof typeof documentStatusChartConfig
                      ]?.label ?? String(value)
                    }
                  />
                }
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {barData.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={`var(--color-${entry.status})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export function CompactDocumentStatusChart({
  stats,
  loading,
}: DocumentStatusChartsProps) {
  const pieData = [
    { status: "valides", value: stats.valides },
    { status: "enAttente", value: stats.enAttente },
    { status: "rejetes", value: stats.rejetes ?? 0 },
  ].filter((item) => item.value > 0);

  const validationRate =
    stats.total > 0 ? Math.round((stats.valides / stats.total) * 100) : 0;

  if (loading) {
    return <ChartSkeleton title="État des documents" height="h-[260px]" />;
  }

  return (
    <Card className="rounded-2xl border-blue-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-[#0f172a]">État des documents</CardTitle>
        <CardDescription>Répartition du catalogue modéré</CardDescription>
      </CardHeader>
      <CardContent>
        {pieData.length === 0 ? (
          <EmptyChartMessage message="Aucun document pour le moment." />
        ) : (
          <ChartContainer
            config={documentStatusChartConfig}
            className="mx-auto h-[260px] w-full max-w-[300px]"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="status"
                innerRadius={56}
                outerRadius={88}
                paddingAngle={3}
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={`var(--color-${entry.status})`}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                      return null;
                    }
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-[#0f172a] text-2xl font-extrabold"
                        >
                          {validationRate}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 18}
                          className="fill-gray-500 text-[10px]"
                        >
                          validés
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="status" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

function ChartSkeleton({ title, height }: { title: string; height: string }) {
  return (
    <Card className="rounded-2xl border-blue-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-[#0f172a]">{title}</CardTitle>
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className={`${height} w-full rounded-xl`} />
      </CardContent>
    </Card>
  );
}

function EmptyChartMessage({ message }: { message: string }) {
  return (
    <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 text-center text-sm text-gray-500">
      {message}
    </div>
  );
}
