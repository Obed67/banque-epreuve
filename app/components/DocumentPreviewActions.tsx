"use client";

import { useMemo, useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import { getDisplayFileName } from "@/lib/fileUpload";
import {
  downloadDocumentFile,
  openDocumentInNewTab,
} from "@/lib/documentStorage";

type DocumentPreviewActionsProps = {
  filePath: string;
  downloadFileName?: string | null;
  accent?: "blue" | "green";
};

export default function DocumentPreviewActions({
  filePath,
  downloadFileName,
  accent = "blue",
}: DocumentPreviewActionsProps) {
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [loadingNewTab, setLoadingNewTab] = useState(false);

  const resolvedDownloadName = useMemo(
    () => getDisplayFileName(downloadFileName, filePath),
    [downloadFileName, filePath],
  );

  const handleOpenInNewTab = async () => {
    try {
      setLoadingNewTab(true);
      await openDocumentInNewTab(filePath);
    } catch {
      window.alert("Impossible d'ouvrir ce document pour le moment.");
    } finally {
      setLoadingNewTab(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoadingDownload(true);
      await downloadDocumentFile(filePath, resolvedDownloadName);
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
    <div className="grid grid-cols-1 gap-2">
      <button
        type="button"
        onClick={() => void handleOpenInNewTab()}
        disabled={loadingNewTab}
        className="inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        {loadingNewTab ? "Ouverture..." : "Prévisualiser"}
      </button>

      <button
        type="button"
        onClick={() => void handleDownload()}
        disabled={loadingDownload}
        className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${mainButtonClass}`}
      >
        <Download className="mr-2 h-4 w-4" />
        {loadingDownload ? "Téléchargement..." : "Télécharger"}
      </button>
    </div>
  );
}
