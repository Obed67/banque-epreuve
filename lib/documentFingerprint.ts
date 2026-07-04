import { normalizeTypeKey } from "@/lib/documentType";
import { foldSearchText } from "@/lib/searchText";

export type DocumentFingerprintInput = {
  type: string;
  etablissement: string;
  filiere: string;
  ue: string;
  annee: string;
  niveau: string;
  session?: string | null;
};

export type DuplicateMatchType = "exact" | "logical";

export type DocumentDuplicateCheckResult = {
  isDuplicate: boolean;
  matchType?: DuplicateMatchType;
  existingId?: string;
  existingTitre?: string;
  existingStatut?: string;
};

async function digestSha256Hex(data: ArrayBuffer | Uint8Array): Promise<string> {
  const buffer = data instanceof Uint8Array ? data.buffer : data;
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function computeContentHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return digestSha256Hex(buffer);
}

export async function computeDocumentFingerprint(
  input: DocumentFingerprintInput,
): Promise<string> {
  const parts = [
    normalizeTypeKey(input.type),
    foldSearchText(input.etablissement),
    foldSearchText(input.filiere),
    foldSearchText(input.ue),
    foldSearchText(input.annee),
    foldSearchText(input.niveau),
    foldSearchText(input.session ?? ""),
  ];
  const encoder = new TextEncoder();
  return digestSha256Hex(encoder.encode(parts.join("|")));
}
