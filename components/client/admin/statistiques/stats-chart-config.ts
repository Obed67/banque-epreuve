import type { ChartConfig } from "@/components/ui/chart";

export const activityChartConfig = {
  visits: {
    label: "Visites",
    color: "#0077d2",
  },
  downloads: {
    label: "Téléchargements",
    color: "#1cb427",
  },
  submissions: {
    label: "Soumissions",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

export const audienceChartConfig = {
  visitors: {
    label: "Visiteurs",
    color: "#0077d2",
  },
  downloaders: {
    label: "Téléchargeurs",
    color: "#1cb427",
  },
  submitters: {
    label: "Contributeurs",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

export const documentStatusChartConfig = {
  valides: {
    label: "Validés",
    color: "#1cb427",
  },
  enAttente: {
    label: "En attente",
    color: "#ffa446",
  },
  rejetes: {
    label: "Rejetés",
    color: "#ef4444",
  },
} satisfies ChartConfig;
