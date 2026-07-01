import {
  labelsMatch,
  normalizeLabel,
  REFERENTIEL_FIELD_TO_TABLE,
  toReferentielCode,
  type ReferentielDocumentField,
} from "@/lib/referenceLabels";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type SuggestReferentielInput = {
  documentId: string;
  field: ReferentielDocumentField;
  label: string;
};

export type SuggestReferentielResult = {
  field: ReferentielDocumentField;
  saved: boolean;
  skipped?: boolean;
  reason?: string;
};

export async function suggestReferentielValues(
  items: SuggestReferentielInput[],
): Promise<{
  ok: boolean;
  error?: string;
  results: SuggestReferentielResult[];
}> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    console.error(
      "[suggest-referentiel] SUPABASE_SERVICE_ROLE_KEY manquant — aucun référentiel enregistré.",
    );
    return {
      ok: false,
      error: "Service role non configuré",
      results: items.map((item) => ({
        field: item.field,
        saved: false,
        skipped: true,
        reason: "Service role non configuré",
      })),
    };
  }

  const { data: document, error: documentError } = await admin
    .from("epreuves")
    .select("id,type,etablissement,filiere,ue,annee,niveau")
    .eq("id", items[0]?.documentId)
    .maybeSingle();

  if (documentError || !document) {
    throw new Error("Document introuvable pour l'enrichissement du référentiel.");
  }

  const results: SuggestReferentielResult[] = [];

  for (const item of items) {
    const cleanLabel = normalizeLabel(item.label);
    if (!cleanLabel) {
      results.push({
        field: item.field,
        saved: false,
        reason: "Libellé vide",
      });
      continue;
    }

    if (item.documentId !== document.id) {
      results.push({
        field: item.field,
        saved: false,
        reason: "Document invalide",
      });
      continue;
    }

    const documentValue = String(document[item.field] ?? "");
    if (!labelsMatch(documentValue, cleanLabel)) {
      results.push({
        field: item.field,
        saved: false,
        reason: "La valeur ne correspond pas au document soumis",
      });
      continue;
    }

    const table = REFERENTIEL_FIELD_TO_TABLE[item.field];
    const code = toReferentielCode(cleanLabel);
    if (!code) {
      results.push({
        field: item.field,
        saved: false,
        reason: "Libellé invalide",
      });
      continue;
    }

    const { error } = await admin.from(table).upsert(
      {
        code,
        label: cleanLabel,
        is_active: true,
      },
      { onConflict: "code" },
    );

    if (error) {
      results.push({
        field: item.field,
        saved: false,
        reason: error.message,
      });
      continue;
    }

    results.push({ field: item.field, saved: true });
  }

  return { ok: true, results };
}
