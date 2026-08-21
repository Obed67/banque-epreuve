-- Stats publiques pour la page d'accueil (anon OK).
-- Prérequis : table site_analytics_events (db/site_analytics_schema.sql).
-- À exécuter dans l'éditeur SQL Supabase (safe to re-run).

create or replace function public.get_public_home_stats()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_documents int := 0;
  v_downloads int := 0;
  v_visitors int := 0;
begin
  -- Tous les documents validés (épreuves + ressources)
  select count(*)::int into v_documents
  from public.epreuves e
  where e.statut = 'Validé';

  if to_regclass('public.site_analytics_events') is not null then
    select count(*)::int into v_downloads
    from public.site_analytics_events
    where event_type = 'download';

    select count(distinct session_id)::int into v_visitors
    from public.site_analytics_events
    where event_type = 'visit';
  end if;

  return json_build_object(
    'documents', coalesce(v_documents, 0),
    'downloads', coalesce(v_downloads, 0),
    'visitors', coalesce(v_visitors, 0)
  );
end;
$$;

grant execute on function public.get_public_home_stats() to anon, authenticated;

notify pgrst, 'reload schema';
