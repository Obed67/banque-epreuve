"use client";

import { useMemo, useState } from "react";
import { Download, Eye, FileText } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DocumentPreviewActionsProps = {
  filePath: string;
  accent?: "blue" | "green";
};

export default function DocumentPreviewActions({
  filePath,
  accent = "blue",
}: DocumentPreviewActionsProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);

  const extension = useMemo(() => {
    const clean = filePath.split("?")[0];
    const parts = clean.split(".");
    return (parts[parts.length - 1] || "").toLowerCase();
  }, [filePath]);

  const isImage = ["png", "jpg", "jpeg", "webp", "gif"].includes(extension);
  const isPdf = extension === "pdf";
  const isPreviewable = isPdf || isImage;

  const getSignedUrl = async () => {
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(filePath, 300);

    if (error || !data?.signedUrl) {
      throw new Error("Impossible d'ouvrir ce document");
    }

    return data.signedUrl;
  };

  const handlePreview = async () => {
    try {
      setLoadingPreview(true);
      const signedUrl = await getSignedUrl();
      setPreviewUrl(signedUrl);
      setPreviewOpen(true);
    } catch {
      window.alert("Impossible de prévisualiser ce document pour le moment.");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoadingDownload(true);
      const signedUrl = await getSignedUrl();
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    } catch {
      window.alert("Impossible de télécharger ce document pour le moment.");
    } finally {
      setLoadingDownload(false);
    }
  };

  const mainButtonClass =
    accent === "green"
      ? "bg-[#1cb427] text-white hover:bg-[#158f1f]"
      : "bg-[#0077d2] text-white hover:bg-[#0062b0]";

  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        <button
          type="button"
          onClick={handlePreview}
          disabled={loadingPreview}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Eye className="mr-2 h-4 w-4" />
          {loadingPreview ? "Ouverture..." : "Prévisualiser"}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={loadingDownload}
          className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${mainButtonClass}`}
        >
          <Download className="mr-2 h-4 w-4" />
          {loadingDownload ? "Téléchargement..." : "Télécharger"}
        </button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Prévisualisation du document</DialogTitle>
            <DialogDescription>
              Vérifiez le contenu avant le téléchargement.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 rounded-lg border border-gray-200 bg-white p-2">
            {isPreviewable ? (
              isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Prévisualisation document"
                  className="max-h-[70vh] w-full rounded-md object-contain"
                />
              ) : (
                <iframe
                  src={previewUrl}
                  title="Prévisualisation"
                  className="h-[70vh] w-full rounded-md"
                />
              )
            ) : (
              <div className="flex h-[40vh] flex-col items-center justify-center text-center text-gray-600">
                <FileText className="mb-3 h-9 w-9 text-gray-400" />
                <p className="font-medium">Prévisualisation non disponible</p>
                <p className="mt-1 text-sm">
                  Ce type de fichier ne peut pas être affiché dans
                  l&apos;application.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
