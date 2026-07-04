-- Backfill fingerprint pour les documents existants (avant la feature doublons)
-- Ré-exécuter dans l'éditeur SQL Supabase (autonome, aucun prérequis).

create extension if not exists pgcrypto;

-- Normalisation texte (identique à db/catalog_search_unaccent.sql)
create or replace function public.fold_search_text(input text)
returns text
language sql
immutable
parallel safe
as $$
  select lower(
    translate(
      btrim(coalesce(input, '')),
      'àâäáãåéèêëíìîïóòôöõúùûüýÿñçÀÂÄÁÃÅÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜÝŸÑÇ',
      'aaaaaaeeeeiiiioooooouuuuyyncAAAAAAEEEEIIIIOOOOOUUUUYYNC'
    )
  );
$$;

create or replace function public.compute_document_fingerprint(
  p_type text,
  p_etablissement text,
  p_filiere text,
  p_ue text,
  p_annee text,
  p_niveau text,
  p_session text default null
)
returns text
language sql
immutable
parallel safe
as $$
  select encode(
    digest(
      concat_ws(
        '|',
        public.fold_search_text(coalesce(p_type, '')),
        public.fold_search_text(coalesce(p_etablissement, '')),
        public.fold_search_text(coalesce(p_filiere, '')),
        public.fold_search_text(coalesce(p_ue, '')),
        public.fold_search_text(coalesce(p_annee, '')),
        public.fold_search_text(coalesce(p_niveau, '')),
        public.fold_search_text(coalesce(p_session, ''))
      ),
      'sha256'
    ),
    'hex'
  );
$$;

comment on function public.compute_document_fingerprint is
  'Empreinte métier alignée sur lib/documentFingerprint.ts (SHA-256 des champs normalisés).';

update public.epreuves
set fingerprint = public.compute_document_fingerprint(
  type,
  etablissement,
  filiere,
  ue,
  annee,
  niveau,
  session
)
where fingerprint is null;

-- Vérification rapide après exécution :
-- select count(*) as sans_fingerprint from public.epreuves where fingerprint is null;

notify pgrst, 'reload schema';
