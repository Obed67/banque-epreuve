/** Normalise pour recherche : minuscules, sans accents. */
export function foldSearchText(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
