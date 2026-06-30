export function getSupabaseErrorMessage(
  error: unknown,
  fallback = "Erreur lors de la mise à jour",
) {
  if (!error || typeof error !== "object") return fallback;

  const payload = error as { message?: string; code?: string; details?: string };

  if (payload.code === "23514") {
    return "Statut refusé par la base de données. Exécutez db/epreuves_moderation_schema.sql dans Supabase.";
  }

  if (payload.message?.includes("row-level security")) {
    return "Permission refusée. Vérifiez les politiques RLS admin sur la table epreuves.";
  }

  return payload.message || payload.details || fallback;
}
