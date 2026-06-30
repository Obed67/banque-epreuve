import { supabase } from "@/lib/supabaseClient";

const SIGNED_URL_TTL_SECONDS = 300;
const CACHE_SAFETY_MARGIN_MS = 30_000;

type CachedSignedUrl = {
  url: string;
  expiresAt: number;
};

const signedUrlCache = new Map<string, CachedSignedUrl>();

export async function getCachedSignedUrl(
  filePath: string,
  expiresIn = SIGNED_URL_TTL_SECONDS,
): Promise<string> {
  const cached = signedUrlCache.get(filePath);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(filePath, expiresIn);

  if (error || !data?.signedUrl) {
    throw new Error("Impossible d'ouvrir ce document");
  }

  signedUrlCache.set(filePath, {
    url: data.signedUrl,
    expiresAt: Date.now() + expiresIn * 1000 - CACHE_SAFETY_MARGIN_MS,
  });

  return data.signedUrl;
}

export async function openDocumentInNewTab(filePath: string) {
  const signedUrl = await getCachedSignedUrl(filePath);
  window.open(signedUrl, "_blank", "noopener,noreferrer");
}

export async function downloadDocumentFile(
  filePath: string,
  downloadFileName: string,
) {
  const signedUrl = await getCachedSignedUrl(filePath);
  const response = await fetch(signedUrl);

  if (!response.ok) {
    throw new Error("Téléchargement impossible");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = downloadFileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
