"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, MoreHorizontal, Save, Trash2 } from "lucide-react";
import Badge from "@/app/components/Badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formInputCompactClass } from "@/lib/form-styles";
import type { DashboardDocument } from "@/components/client/admin/dashboard/types";

function statusVariant(statut: string): "success-subtle" | "warning-subtle" | "default" {
  if (statut === "Validé") return "success-subtle";
  if (statut === "En attente") return "warning-subtle";
  return "default";
}

type AllDocumentsColumnsOptions = {
  savingId: string | null;
  deletingId: string | null;
  getValue: (doc: DashboardDocument, field: keyof DashboardDocument) => string;
  setDraftValue: (
    id: string,
    field: keyof DashboardDocument,
    value: string,
  ) => void;
  onOpenDocument: (filePath: string) => void;
  onSave: (doc: DashboardDocument) => void;
  onDelete: (doc: DashboardDocument) => void;
  hasDraft: (id: string) => boolean;
};

export function useAllDocumentsColumns({
  savingId,
  deletingId,
  getValue,
  setDraftValue,
  onOpenDocument,
  onSave,
  onDelete,
  hasDraft,
}: AllDocumentsColumnsOptions) {
  return useMemo<ColumnDef<DashboardDocument>[]>(
    () => [
      {
        accessorKey: "titre",
        header: "Titre",
        cell: ({ row }) => (
          <input
            value={getValue(row.original, "titre")}
            onChange={(e) =>
              setDraftValue(row.original.id, "titre", e.target.value)
            }
            className={`${formInputCompactClass} min-w-[160px]`}
            placeholder="Titre"
          />
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <input
            value={getValue(row.original, "type")}
            onChange={(e) =>
              setDraftValue(row.original.id, "type", e.target.value)
            }
            className={`${formInputCompactClass} min-w-[100px]`}
            placeholder="Type"
          />
        ),
      },
      {
        accessorKey: "etablissement",
        header: "Établissement",
        cell: ({ row }) => (
          <input
            value={getValue(row.original, "etablissement")}
            onChange={(e) =>
              setDraftValue(row.original.id, "etablissement", e.target.value)
            }
            className={`${formInputCompactClass} min-w-[140px]`}
            placeholder="Établissement"
          />
        ),
      },
      {
        accessorKey: "filiere",
        header: "Filière",
        cell: ({ row }) => (
          <input
            value={getValue(row.original, "filiere")}
            onChange={(e) =>
              setDraftValue(row.original.id, "filiere", e.target.value)
            }
            className={`${formInputCompactClass} min-w-[120px]`}
            placeholder="Filière"
          />
        ),
      },
      {
        accessorKey: "ue",
        header: "UE",
        cell: ({ row }) => (
          <input
            value={getValue(row.original, "ue")}
            onChange={(e) =>
              setDraftValue(row.original.id, "ue", e.target.value)
            }
            className={`${formInputCompactClass} min-w-[120px]`}
            placeholder="UE"
          />
        ),
      },
      {
        accessorKey: "annee",
        header: "Année",
        cell: ({ row }) => (
          <input
            value={getValue(row.original, "annee")}
            onChange={(e) =>
              setDraftValue(row.original.id, "annee", e.target.value)
            }
            className={`${formInputCompactClass} w-24`}
            placeholder="Année"
          />
        ),
      },
      {
        accessorKey: "niveau",
        header: "Niveau",
        cell: ({ row }) => (
          <input
            value={getValue(row.original, "niveau")}
            onChange={(e) =>
              setDraftValue(row.original.id, "niveau", e.target.value)
            }
            className={`${formInputCompactClass} w-28`}
            placeholder="Niveau"
          />
        ),
      },
      {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.statut)}>
            {row.original.statut}
          </Badge>
        ),
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
          const isSaving = savingId === doc.id;
          const isDeleting = deletingId === doc.id;
          const dirty = hasDraft(doc.id);

          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 rounded-lg border-blue-100"
                disabled={isSaving || isDeleting}
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
                    disabled={isSaving || isDeleting}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    disabled={!dirty || isSaving}
                    onClick={() => onSave(doc)}
                    className="text-[#0077d2] focus:text-[#0077d2]"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={isDeleting}
                    onClick={() => onDelete(doc)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Suppression..." : "Supprimer"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [
      savingId,
      deletingId,
      getValue,
      setDraftValue,
      onOpenDocument,
      onSave,
      onDelete,
      hasDraft,
    ],
  );
}
