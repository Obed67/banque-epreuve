"use client";

import { CheckCircle } from "lucide-react";
import Button from "../../../app/components/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import type { SubmittedInfo } from "./types";

type SubmissionSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submittedInfo: SubmittedInfo | null;
};

export default function SubmissionSuccessDialog({
  open,
  onOpenChange,
  submittedInfo,
}: SubmissionSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden border border-blue-100 bg-white p-0 shadow-2xl sm:rounded-2xl">
        <div className="border-b border-blue-100 bg-[#0077d2] px-5 py-5 text-white">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <CheckCircle className="h-9 w-9 text-white" />
          </div>

          <DialogHeader className="mt-3 text-center sm:text-center">
            <DialogTitle className="text-xl font-bold tracking-tight text-white">
              Soumission réussie
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-6 text-white/85">
              Votre document a bien été envoyé. Il sera vérifié par
              l&apos;administration avant publication.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-5 py-5 sm:px-6">
          {submittedInfo && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Récapitulatif
                </p>
                <span className="rounded-full bg-[#1cb427]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#1cb427]">
                  Reçu
                </span>
              </div>

              <div className="space-y-2 rounded-lg bg-white p-3 ring-1 ring-blue-100">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Titre
                  </span>
                  <span className="max-w-[65%] text-right text-sm font-semibold text-slate-900">
                    {submittedInfo.titre}
                  </span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Type
                  </span>
                  <span className="max-w-[65%] text-right text-sm font-semibold text-slate-900">
                    {submittedInfo.typeDocument}
                  </span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Filière
                  </span>
                  <span className="max-w-[65%] text-right text-sm font-semibold text-slate-900">
                    {submittedInfo.filiere}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm text-slate-700">
            Vous pouvez fermer cette fenêtre et revenir à la page
            d&apos;accueil.
          </div>

          <DialogFooter className="mt-5 sm:justify-center">
            <Button
              type="button"
              className="w-full rounded-xl bg-[#0077d2] text-white shadow-md shadow-blue-900/10 hover:bg-[#0062b0] sm:w-auto sm:px-8"
              onClick={() => onOpenChange(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
