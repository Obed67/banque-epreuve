/** Taille maximale des fichiers soumis (recueils d'épreuves, etc.) */
export const MAX_SUBMISSION_FILE_SIZE_MB = 50;
export const MAX_SUBMISSION_FILE_SIZE_BYTES =
  MAX_SUBMISSION_FILE_SIZE_MB * 1024 * 1024;

export type UploadProgressCallback = (loaded: number, total: number) => void;

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function encodeStoragePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

function mapStorageUploadError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("already exists") || lower.includes("duplicate")) {
    return "Un fichier avec ce nom existe déjà. Renommez votre fichier et réessayez.";
  }
  if (lower.includes("invalid key")) {
    return "Impossible d'enregistrer ce fichier. Réessayez ou contactez l'administrateur.";
  }
  if (lower.includes("payload too large") || lower.includes("entity too large")) {
    return `Le fichier dépasse la taille maximale de ${MAX_SUBMISSION_FILE_SIZE_MB} Mo.`;
  }
  return message || "Erreur lors de l'envoi du fichier.";
}

/** Upload vers Supabase Storage avec progression (XHR). */
export async function uploadSubmissionFile(
  file: File,
  storageKey: string,
  options: {
    originalFileName: string;
    onProgress?: UploadProgressCallback;
  },
): Promise<void> {
  const { supabase } = await import("./supabaseClient");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Configuration Supabase manquante.");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token ?? supabaseAnonKey;
  const uploadUrl = `${supabaseUrl}/storage/v1/object/documents/${encodeStoragePath(storageKey)}`;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", supabaseAnonKey);
    xhr.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream",
    );
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("x-metadata-originalFileName", options.originalFileName);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && options.onProgress) {
        options.onProgress(event.loaded, event.total);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }

      let message = "Erreur lors de l'envoi du fichier.";
      try {
        const body = JSON.parse(xhr.responseText) as {
          message?: string;
          error?: string;
        };
        message = body.message || body.error || message;
      } catch {
        // réponse non JSON
      }
      reject(new Error(mapStorageUploadError(message)));
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Erreur réseau lors de l'envoi du fichier."));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Envoi annulé."));
    });

    xhr.send(file);
  });
}

/** Nom affiché / téléchargé tel que choisi par l'utilisateur */
export function getOriginalFileName(file: File): string {
  return file.name.split(/[/\\]/).pop()?.trim() || "document";
}

/** Titre du document dérivé du nom du fichier uploadé */
export function getDocumentTitleFromFile(file: File): string {
  return getOriginalFileName(file);
}

/** Clé objet compatible Supabase Storage (ASCII, sans espaces ni accents) */
export function buildStorageObjectKey(file: File): string {
  const original = getOriginalFileName(file);
  const extension = original.includes(".")
    ? original.split(".").pop()?.toLowerCase() || ""
    : "";
  const id = crypto.randomUUID();

  return extension ? `${id}.${extension}` : id;
}

export function getDisplayFileName(
  originalFileName: string | null | undefined,
  filePath: string,
): string {
  if (originalFileName?.trim()) return originalFileName.trim();
  return filePath.split(/[/\\]/).pop() || "document";
}
