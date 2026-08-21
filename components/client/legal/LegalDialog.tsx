"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import ConditionsUtilisationBody from "./ConditionsUtilisationBody";
import ConfidentialiteBody from "./ConfidentialiteBody";

export type LegalDocument = "conditions" | "confidentialite";

const COPY: Record<
  LegalDocument,
  { title: string; description: string; updatedAt: string }
> = {
  conditions: {
    title: "Conditions d'utilisation",
    description: "Règles d'usage de la plateforme Banque Epreuve.",
    updatedAt: "21 août 2026",
  },
  confidentialite: {
    title: "Politique de confidentialité",
    description: "Protection des données personnelles sur Banque Epreuve.",
    updatedAt: "21 août 2026",
  },
};

type LegalDialogProps = {
  document: LegalDocument;
  triggerClassName?: string;
  children: ReactNode;
};

export default function LegalDialog({
  document,
  triggerClassName,
  children,
}: LegalDialogProps) {
  const copy = COPY[document];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "cursor-pointer bg-transparent p-0 text-left font-inherit",
            triggerClassName,
          )}
        >
          {children}
        </button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl border-blue-100 p-0 sm:rounded-2xl">
        <DialogHeader className="shrink-0 border-b border-gray-100 px-5 py-4 pr-12 text-left">
          <DialogTitle className="text-xl font-extrabold text-[#0f172a]">
            {copy.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {copy.description} Dernière mise à jour : {copy.updatedAt}.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-8">
            {document === "conditions" ? (
              <ConditionsUtilisationBody />
            ) : (
              <ConfidentialiteBody />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
