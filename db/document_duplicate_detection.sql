  -- Détection des doublons : même fichier uniquement (SHA-256).
  -- L'empreinte métier est conservée mais n'est plus un critère de doublon.
  -- Ré-exécuter dans l'éditeur SQL Supabase.

  alter table public.epreuves add column if not exists content_hash text;
  alter table public.epreuves add column if not exists fingerprint text;
  alter table public.epreuves add column if not exists duplicate_of_id uuid;
  alter table public.epreuves add column if not exists duplicate_match_type text;

  alter table public.epreuves drop constraint if exists epreuves_duplicate_of_id_fkey;
  alter table public.epreuves
    add constraint epreuves_duplicate_of_id_fkey
    foreign key (duplicate_of_id) references public.epreuves(id) on delete set null;

  alter table public.epreuves drop constraint if exists epreuves_duplicate_match_type_check;
  alter table public.epreuves
    add constraint epreuves_duplicate_match_type_check
    check (duplicate_match_type is null or duplicate_match_type in ('exact', 'logical'));

  create index if not exists epreuves_content_hash_active_idx
    on public.epreuves (content_hash)
    where content_hash is not null and statut in ('Validé', 'En attente');

  create index if not exists epreuves_fingerprint_active_idx
    on public.epreuves (fingerprint)
    where fingerprint is not null and statut in ('Validé', 'En attente');

  -- Un doublon = le même fichier (SHA-256). L'empreinte métier ne déclenche plus d'alerte.
  update public.epreuves
  set duplicate_of_id = null,
      duplicate_match_type = null
  where duplicate_match_type = 'logical';

  comment on column public.epreuves.content_hash is
    'SHA-256 du fichier — seul critère de doublon, y compris si le fichier est renommé.';
  comment on column public.epreuves.fingerprint is
    'Empreinte métier conservée (type + établissement + filière + UE + année + niveau + session). Ne sert pas à détecter un doublon.';
  comment on column public.epreuves.duplicate_of_id is
    'Document existant au même contenu, détecté à la soumission.';
  comment on column public.epreuves.duplicate_match_type is
    'exact = même fichier. logical est obsolète et nettoyé.';

  -- p_fingerprint est conservé pour les clients déjà déployés ; il n'est plus utilisé.
  create or replace function public.check_document_duplicate(
    p_content_hash text default null,
    p_fingerprint text default null
  )
  returns json
  language plpgsql
  stable
  security definer
  set search_path = public
  as $$
  declare
    v_row record;
  begin
    if p_content_hash is not null and btrim(p_content_hash) <> '' then
      select id, titre, statut
      into v_row
      from public.epreuves
      where content_hash = p_content_hash
        and statut in ('Validé', 'En attente')
      order by created_at desc
      limit 1;

      if found then
        return json_build_object(
          'is_duplicate', true,
          'match_type', 'exact',
          'existing_id', v_row.id,
          'existing_titre', v_row.titre,
          'existing_statut', v_row.statut
        );
      end if;
    end if;

    return json_build_object('is_duplicate', false);
  end;
  $$;

  grant execute on function public.check_document_duplicate to anon, authenticated;

  notify pgrst, 'reload schema';
