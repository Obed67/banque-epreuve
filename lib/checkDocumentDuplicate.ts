import type { DocumentDuplicateCheckResult } from "@/lib/documentFingerprint";
import { supabase } from "@/lib/supabaseClient";

type RpcDuplicateResult = {
  is_duplicate?: boolean;
  match_type?: "exact" | "logical";
  existing_id?: string;
  existing_titre?: string;
  existing_statut?: string;
};

export async function checkDocumentDuplicate(
  contentHash: string,
  fingerprint: string,
): Promise<DocumentDuplicateCheckResult> {
  try {
    const { data, error } = await supabase.rpc("check_document_duplicate", {
      p_content_hash: contentHash,
      p_fingerprint: fingerprint,
    });

    if (error) {
      console.warn("[check-document-duplicate] RPC error", error);
      return { isDuplicate: false };
    }

    const result = (
      typeof data === "string" ? JSON.parse(data) : data
    ) as RpcDuplicateResult | null;

    if (!result?.is_duplicate) {
      return { isDuplicate: false };
    }

    return {
      isDuplicate: true,
      matchType: result.match_type,
      existingId: result.existing_id,
      existingTitre: result.existing_titre,
      existingStatut: result.existing_statut,
    };
  } catch (error) {
    console.warn("[check-document-duplicate] failed", error);
    return { isDuplicate: false };
  }
}
