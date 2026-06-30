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
