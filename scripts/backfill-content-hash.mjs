/**
 * Backfill content_hash pour les documents existants.
 * Télécharge chaque fichier depuis Supabase Storage et calcule SHA-256.
 *
 * Usage (depuis la racine du projet) :
 *   npm run backfill:content-hash
 *
 * Prérequis :
 *   - .env avec NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY
 *   - db/document_duplicate_detection.sql déjà exécuté (colonne content_hash)
 */

import { createHash } from "crypto";
import { existsSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

function loadEnvFile() {
  const envPath = resolve(projectRoot, ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function sha256Hex(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function main() {
  loadEnvFile();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceKey) {
    console.error(
      "Variables manquantes : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env",
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: documents, error: fetchError } = await supabase
    .from("epreuves")
    .select("id, titre, file_path")
    .is("content_hash", null)
    .not("file_path", "is", null)
    .order("created_at", { ascending: true });

  if (fetchError) {
    throw fetchError;
  }

  const rows = documents ?? [];
  console.log(`${rows.length} document(s) sans content_hash à traiter.\n`);

  if (rows.length === 0) {
    console.log("Rien à faire.");
    return;
  }

  let updated = 0;
  let failed = 0;

  for (const doc of rows) {
    const label = `${doc.id} — ${doc.titre}`;

    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from("documents")
      .download(doc.file_path);

    if (downloadError || !fileBlob) {
      console.warn(`[échec téléchargement] ${label}`);
      console.warn(`  ${downloadError?.message ?? "fichier introuvable"}`);
      failed += 1;
      continue;
    }

    const buffer = Buffer.from(await fileBlob.arrayBuffer());
    const contentHash = sha256Hex(buffer);

    const { error: updateError } = await supabase
      .from("epreuves")
      .update({ content_hash: contentHash })
      .eq("id", doc.id);

    if (updateError) {
      console.warn(`[échec mise à jour] ${label}`);
      console.warn(`  ${updateError.message}`);
      failed += 1;
      continue;
    }

    console.log(`[ok] ${label}`);
    updated += 1;
  }

  console.log(`\nTerminé : ${updated} mis à jour, ${failed} en échec.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
