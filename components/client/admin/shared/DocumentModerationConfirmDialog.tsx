"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export type ModerationConfirmAction = "validate" | "reject";

type DocumentModerationConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: ModerationConfirmAction;
  documentTitle: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
};

const COPY = {
  validate: {
    title: "Valider ce document ?",
    description:
      "Le document sera publié et visible dans le catalogue public.",
    confirm: "Valider",
    confirmClass: "bg-[#1cb427] hover:bg-[#158f1f] text-white",
  },
  reject: {
    title: "Rejeter ce document ?",
    description:
      "Le document ne sera pas publié. Cette action peut être définitive selon votre politique de modération.",
    confirm: "Rejeter",
    confirmClass: "bg-red-500 hover:bg-red-600 text-white",
  },
} as const;

export default function DocumentModerationConfirmDialog({
  open,
  onOpenChange,
  action,
  documentTitle,
  loading,
  onConfirm,
}: DocumentModerationConfirmDialogProps) {
  const copy = COPY[action];

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // Keep the dialog open when the action fails.
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-blue-100 sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#0f172a]">
            {copy.title}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2 text-sm text-gray-500">
              <p>{copy.description}</p>
              <p className="rounded-lg border border-blue-50 bg-[#f7fbff] px-3 py-2 font-medium text-[#0f172a]">
                {documentTitle}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel
            disabled={loading}
            className="rounded-xl border-blue-100"
          >
            Annuler
          </AlertDialogCancel>
          <Button
            type="button"
            disabled={loading}
            className={`rounded-xl ${copy.confirmClass}`}
            onClick={() => void handleConfirm()}
          >
            {loading ? "Traitement..." : copy.confirm}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
