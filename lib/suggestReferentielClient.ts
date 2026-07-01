import type { ReferentielDocumentField } from "@/lib/referenceLabels";

type SuggestReferentielPayload = {
  documentId: string;
  values: { field: ReferentielDocumentField; label: string }[];
};

type SuggestReferentielApiResult = {
  ok: boolean;
  error?: string;
  results?: {
    field: ReferentielDocumentField;
    saved: boolean;
    skipped?: boolean;
    reason?: string;
  }[];
};

export async function suggestReferentielValuesFromClient(
  payload: SuggestReferentielPayload,
) {
  if (!payload.values.length) return;

  try {
    const response = await fetch("/api/suggest-referentiel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = (await response.json()) as SuggestReferentielApiResult;

    if (!response.ok || !body.ok) {
      console.warn("[suggest-referentiel]", body.error ?? body.results);
      return;
    }

    const failures = (body.results ?? []).filter((r) => !r.saved);
    if (failures.length > 0) {
      console.warn("[suggest-referentiel] valeurs non enregistrées:", failures);
    }
  } catch (error) {
    console.warn("[suggest-referentiel] request failed", error);
  }
}
