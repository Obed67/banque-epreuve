"use client";

import type { LucideIcon } from "lucide-react";
import Badge from "@/app/components/Badge";
import DocumentPreviewActions from "@/app/components/DocumentPreviewActions";
import VerifiedBadge from "@/app/components/VerifiedBadge";

type CatalogDocumentCardProps = {
  documentId: string;
  titre: string;
  badgeLabel: string;
  meta: { label: string; value: string }[];
  filePath: string;
  downloadFileName?: string | null;
  accent: "blue" | "green";
  icon: LucideIcon;
};

const accentStyles = {
  blue: {
    iconWrap:
      "bg-blue-50 group-hover:bg-[#0077d2]",
    icon: "text-[#0077d2] group-hover:text-white",
    badge: "info-subtle" as const,
  },
  green: {
    iconWrap:
      "bg-green-50 group-hover:bg-[#1cb427]",
    icon: "text-[#1cb427] group-hover:text-white",
    badge: "info-subtle" as const,
  },
};

export default function CatalogDocumentCard({
  documentId,
  titre,
  badgeLabel,
  meta,
  filePath,
  downloadFileName,
  accent,
  icon: Icon,
}: CatalogDocumentCardProps) {
  const styles = accentStyles[accent];

  return (
    <article className="group flex h-full flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="mb-3 flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${styles.iconWrap}`}
        >
          <Icon className={`h-5 w-5 transition-colors duration-200 ${styles.icon}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-start gap-2">
            <h3
              className="line-clamp-2 min-w-0 flex-1 text-base font-bold leading-snug text-[#0f172a]"
              title={titre}
            >
              {titre}
            </h3>
            <VerifiedBadge className="shrink-0" />
          </div>
          <span className="inline-block max-w-full" title={badgeLabel}>
            <Badge variant={styles.badge} className="max-w-full text-xs font-medium">
              <span className="block truncate">{badgeLabel}</span>
            </Badge>
          </span>
        </div>
      </div>

      <dl className="space-y-2 border-t border-gray-50 pt-3">
        {meta.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-2 text-sm"
          >
            <dt className="shrink-0 font-medium whitespace-nowrap text-gray-500">
              {row.label}&nbsp;:
            </dt>
            <dd
              className="min-w-0 truncate font-medium text-gray-900"
              title={row.value}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto pt-3">
        <DocumentPreviewActions
          documentId={documentId}
          filePath={filePath}
          downloadFileName={downloadFileName}
          accent={accent}
        />
      </div>
    </article>
  );
}
