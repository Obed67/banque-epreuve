"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import type { SubmittedInfo } from "./types";

const AUTO_CLOSE_DELAY_MS = 4500;

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
  const [remainingMs, setRemainingMs] = useState(AUTO_CLOSE_DELAY_MS);

  useEffect(() => {
    if (!open) {
      setRemainingMs(AUTO_CLOSE_DELAY_MS);
      return;
    }

    const startedAt = Date.now();

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setRemainingMs(Math.max(0, AUTO_CLOSE_DELAY_MS - elapsed));
    }, 50);

    const timer = window.setTimeout(() => {
      onOpenChange(false);
    }, AUTO_CLOSE_DELAY_MS);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, [open, onOpenChange]);

  const progressPercent = (remainingMs / AUTO_CLOSE_DELAY_MS) * 100;
  const remainingSeconds = Math.max(1, Math.ceil(remainingMs / 1000));

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md overflow-hidden border border-blue-100 bg-white p-0 shadow-2xl sm:rounded-2xl [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
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
        </div>

        <div className="border-t border-blue-100 bg-slate-50/80 px-5 py-4">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
            <span>Fermeture automatique</span>
            <span className="font-semibold tabular-nums text-[#0077d2]">
              {remainingSeconds}s
            </span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-blue-100"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progressPercent)}
            aria-label="Temps restant avant fermeture"
          >
            <div
              className="h-full rounded-full bg-[#0077d2] transition-[width] duration-75 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
