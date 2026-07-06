/** Clé de comparaison insensible aux accents / casse pour le champ `type`. */
export function normalizeTypeKey(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Sous-chaînes reconnues pour classer un document comme épreuve (catalogue / formulaire). */
export const EPREUVE_TYPE_PATTERN_KEYS = ["epreuve", "épreuve"] as const;

/**
 * Vrai si le libellé correspond à une épreuve :
 * Epreuve, Épreuve, Recueil d'épreuve, etc.
 */
export function isEpreuveType(value: string) {
  const key = normalizeTypeKey(value);
  if (!key) return false;

  return EPREUVE_TYPE_PATTERN_KEYS.some((pattern) =>
    key.includes(normalizeTypeKey(pattern)),
  );
}

/** Filtre PostgREST : types contenant « epreuve » / « épreuve ». */
export function buildEpreuveTypeOrFilter() {
  return EPREUVE_TYPE_PATTERN_KEYS.map(
    (pattern) => `type.ilike.%${pattern}%`,
  ).join(",");
}

/** Exclut les épreuves du catalogue ressources (fallback sans RPC SQL). */
export function applyRessourceTypeExclusion<
  T extends {
    not: (column: string, operator: string, value: string) => T;
  },
>(query: T): T {
  let next = query;
  for (const pattern of EPREUVE_TYPE_PATTERN_KEYS) {
    next = next.not("type", "ilike", `%${pattern}%`);
  }
  return next;
}
