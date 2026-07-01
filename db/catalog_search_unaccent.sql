-- Recherche catalogue insensible aux accents
-- Ré-exécuter dans l'éditeur SQL Supabase après mise à jour.

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

create or replace function public.text_matches_unaccent(source text, query text)
returns boolean
language sql
immutable
parallel safe
as $$
  select coalesce(
    position(
      public.fold_search_text(query) in public.fold_search_text(source)
    ) > 0,
    false
  );
$$;

create or replace function public.get_catalog_page(
  p_mode text,
  p_search text default null,
  p_etablissement text default null,
  p_filiere text default null,
  p_ue text default null,
  p_annee text default null,
  p_niveau text default null,
  p_session text default null,
  p_type text default null,
  p_limit int default 6,
  p_offset int default 0
)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_total bigint;
  v_data json;
begin
  with filtered as (
    select
      e.id,
      e.titre,
      e.type,
      e.etablissement,
      e.filiere,
      e.ue,
      e.annee,
      e.niveau,
      e.session,
      e.file_path,
      e.original_file_name,
      e.created_at
    from public.epreuves e
    where e.statut = 'Validé'
      and (
        (
          p_mode = 'epreuves'
          and e.type in ('Epreuve', 'Épreuve', 'epreuve', 'EPREUVE', 'épreuve')
        )
        or (
          p_mode = 'ressources'
          and e.type not in ('Epreuve', 'Épreuve', 'epreuve', 'EPREUVE', 'épreuve')
        )
      )
      and (p_etablissement is null or e.etablissement = p_etablissement)
      and (p_filiere is null or e.filiere = p_filiere)
      and (p_ue is null or e.ue = p_ue)
      and (p_annee is null or e.annee = p_annee)
      and (p_niveau is null or e.niveau = p_niveau)
      and (p_session is null or e.session = p_session)
      and (p_type is null or e.type = p_type)
      and (
        p_search is null
        or btrim(p_search) = ''
        or public.text_matches_unaccent(e.titre, p_search)
        or public.text_matches_unaccent(e.filiere, p_search)
        or public.text_matches_unaccent(e.ue, p_search)
        or public.text_matches_unaccent(e.etablissement, p_search)
        or public.text_matches_unaccent(e.annee, p_search)
        or public.text_matches_unaccent(e.niveau, p_search)
        or public.text_matches_unaccent(e.type, p_search)
        or public.text_matches_unaccent(e.original_file_name, p_search)
      )
  )
  select count(*) into v_total from filtered;

  select coalesce(
    json_agg(row_to_json(page_rows) order by page_rows.created_at desc),
    '[]'::json
  )
  into v_data
  from (
    select *
    from filtered
    order by created_at desc
    limit greatest(p_limit, 0)
    offset greatest(p_offset, 0)
  ) as page_rows;

  return json_build_object('total', v_total, 'data', v_data);
end;
$$;

grant execute on function public.get_catalog_page to anon, authenticated;
