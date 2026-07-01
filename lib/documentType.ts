/** Clé de comparaison insensible aux accents / casse pour le champ `type`. */
export function normalizeTypeKey(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Vrai si le libellé correspond à une épreuve (Epreuve, Épreuve, etc.). */
export function isEpreuveType(value: string) {
  const key = normalizeTypeKey(value);
  return key === "epreuve" || key.includes("epreuve");
}

/** Variantes connues pour les filtres PostgREST (sans colonne is_epreuve). */
export const EPREUVE_TYPE_VARIANTS = [
  "Epreuve",
  "Épreuve",
  "epreuve",
  "EPREUVE",
  "épreuve",
] as const;

export function buildEpreuveTypeOrFilter() {
  return EPREUVE_TYPE_VARIANTS.map((variant) => `type.eq.${variant}`).join(",");
}
