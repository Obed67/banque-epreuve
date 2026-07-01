export type ReferentielTable =
  | "document_types"
  | "filieres"
  | "ues"
  | "annees"
  | "niveaux"
  | "etablissements";

export type ReferentielDocumentField =
  | "type"
  | "filiere"
  | "ue"
  | "annee"
  | "niveau"
  | "etablissement";

export const REFERENTIEL_FIELD_TO_TABLE: Record<
  ReferentielDocumentField,
  ReferentielTable
> = {
  type: "document_types",
  filiere: "filieres",
  ue: "ues",
  annee: "annees",
  niveau: "niveaux",
  etablissement: "etablissements",
};

export function normalizeLabel(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function toReferentielCode(value: string) {
  return normalizeLabel(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function labelsMatch(a: string, b: string) {
  return normalizeLabel(a).localeCompare(normalizeLabel(b), "fr", {
    sensitivity: "accent",
  }) === 0;
}
