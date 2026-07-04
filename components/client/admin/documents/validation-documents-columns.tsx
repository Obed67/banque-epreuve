"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  Copy,
  ExternalLink,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
import Badge from "@/app/components/Badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PendingDocument } from "@/lib/hooks/usePendingDocuments";
import type { ModerationConfirmAction } from "@/components/client/admin/shared/DocumentModerationConfirmDialog";

type ValidationDocumentsColumnsOptions = {
  processingId: string | null;
  onOpenDocument: (filePath: string) => void;
  onConfirm: (
    doc: PendingDocument,
    action: ModerationConfirmAction,
  ) => void;
};

function duplicateLabel(matchType: PendingDocument["duplicate_match_type"]) {
  if (matchType === "exact") return "Fichier identique";
  if (matchType === "logical") return "Même ressource";
  return "Possible doublon";
}

export function useValidationDocumentsColumns({
  processingId,
  onOpenDocument,
  onConfirm,
}: ValidationDocumentsColumnsOptions) {
  return useMemo<ColumnDef<PendingDocument>[]>(
    () => [
      {
        accessorKey: "titre",
        header: "Titre",
        cell: ({ row }) => {
          const doc = row.original;
          const hasDuplicate = Boolean(doc.duplicate_of_id);

          return (
            <div className="space-y-1.5">
              <span className="font-medium text-[#0f172a]">{doc.titre}</span>
              {hasDuplicate && (
                <div className="flex flex-col gap-1">
                  <Badge variant="warning-subtle" className="w-fit">
                    <Copy className="mr-1 h-3 w-3" />
                    {duplicateLabel(doc.duplicate_match_type)}
                  </Badge>
                  {doc.duplicate_existing && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenDocument(doc.duplicate_existing!.file_path)
                      }
                      className="max-w-[220px] truncate text-left text-xs text-[#0077d2] hover:underline"
                      title={doc.duplicate_existing.titre}
                    >
                      Existant : {doc.duplicate_existing.titre}
                      {doc.duplicate_existing.statut === "Validé"
                        ? " (publié)"
                        : " (en attente)"}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="info-subtle">{row.original.type || "N/A"}</Badge>
        ),
      },
      {
        accessorKey: "etablissement",
        header: "Établissement",
      },
      {
        accessorKey: "filiere",
        header: "Filière",
      },
      {
        accessorKey: "ue",
        header: "UE",
        cell: ({ row }) => (
          <span className="max-w-[180px] truncate">{row.original.ue}</span>
        ),
      },
      {
        accessorKey: "niveau",
        header: "Niveau",
      },
      {
        accessorKey: "annee",
        header: "Année",
      },
      {
        accessorKey: "soumis_par",
        header: "Soumis par",
        cell: ({ row }) => row.original.soumis_par || "Anonyme",
      },
      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) =>
          new Date(row.original.created_at).toLocaleDateString("fr-FR"),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const doc = row.original;
          const isProcessing = processingId === doc.id;

          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 rounded-lg border-blue-100"
                disabled={isProcessing}
                onClick={() => onOpenDocument(doc.file_path)}
              >
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Voir
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-lg border-blue-100"
                    disabled={isProcessing}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    onClick={() => onConfirm(doc, "validate")}
                    className="text-[#1cb427] focus:text-[#1cb427]"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Valider
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onConfirm(doc, "reject")}
                    className="text-red-600 focus:text-red-600"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Rejeter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [processingId, onConfirm, onOpenDocument],
  );
}
