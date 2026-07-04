"use client";

import { Copy } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { SubmissionDuplicateInfo } from "./types";

type SubmissionDuplicateAlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duplicateInfo: SubmissionDuplicateInfo | null;
};

export default function SubmissionDuplicateAlertDialog({
  open,
  onOpenChange,
  duplicateInfo,
}: SubmissionDuplicateAlertDialogProps) {
  const isExact = duplicateInfo?.matchType === "exact";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-orange-100 sm:max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
            <Copy className="h-6 w-6 text-[#b45309]" />
          </div>
          <AlertDialogTitle className="text-center text-[#0f172a]">
            Document déjà présent
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                {isExact
                  ? "Le fichier que vous venez d'envoyer est identique à un document déjà enregistré."
                  : "Un document très similaire (même type, établissement, filière, UE, année et niveau) existe déjà dans notre catalogue."}
              </p>
              {duplicateInfo?.existingTitre && (
                <p className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 font-medium text-[#0f172a]">
                  Document existant : {duplicateInfo.existingTitre}
                </p>
              )}
              <p>
                Votre soumission a bien été reçue et sera examinée par
                l&apos;administration. Elle pourra toutefois être refusée s&apos;il
                s&apos;agit d&apos;un doublon.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="w-full rounded-xl bg-[#0077d2] hover:bg-[#0062b0]">
            J&apos;ai compris
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
