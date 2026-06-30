-- Site analytics: visits, downloads, submissions
-- Run this in Supabase SQL editor (safe to re-run).

create table if not exists public.site_analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('visit', 'download', 'submission')),
  session_id text not null,
  document_id uuid references public.epreuves(id) on delete set null,
  page_path text,
  created_at timestamptz not null default now()
);

create index if not exists site_analytics_events_type_idx
  on public.site_analytics_events (event_type);

create index if not exists site_analytics_events_session_idx
  on public.site_analytics_events (session_id);

create index if not exists site_analytics_events_created_at_idx
  on public.site_analytics_events (created_at desc);

alter table public.site_analytics_events enable row level security;

drop policy if exists "site_analytics_insert_public" on public.site_analytics_events;
create policy "site_analytics_insert_public"
on public.site_analytics_events
for insert
to anon, authenticated
with check (true);

drop policy if exists "site_analytics_read_admin" on public.site_analytics_events;
create policy "site_analytics_read_admin"
on public.site_analytics_events
for select
to authenticated
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'admin'
  or coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
);

drop function if exists public.get_site_analytics();
drop function if exists public.get_site_analytics(int);

create or replace function public.get_site_analytics(days int default 30)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  period_days int := greatest(days, 1);
  start_date date := current_date - (period_days - 1);
begin
  if coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') <> 'admin'
     and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'Unauthorized';
  end if;

  return json_build_object(
    'summary', json_build_object(
      'unique_visitors',
        (select count(distinct session_id) from site_analytics_events where event_type = 'visit'),
      'total_visits',
        (select count(*) from site_analytics_events where event_type = 'visit'),
      'unique_downloaders',
        (select count(distinct session_id) from site_analytics_events where event_type = 'download'),
      'total_downloads',
        (select count(*) from site_analytics_events where event_type = 'download'),
      'unique_submitters',
        (select count(distinct session_id) from site_analytics_events where event_type = 'submission'),
      'total_submissions',
        (select count(*) from site_analytics_events where event_type = 'submission')
    ),
    'daily_activity', (
      select coalesce(json_agg(row_to_json(activity) order by activity.date), '[]'::json)
      from (
        select
          to_char(d.day, 'YYYY-MM-DD') as date,
          coalesce(stats.visits, 0)::int as visits,
          coalesce(stats.unique_visitors, 0)::int as unique_visitors,
          coalesce(stats.downloads, 0)::int as downloads,
          coalesce(stats.submissions, 0)::int as submissions
        from generate_series(start_date, current_date, interval '1 day') as d(day)
        left join lateral (
          select
            count(*) filter (where e.event_type = 'visit') as visits,
            count(distinct e.session_id) filter (where e.event_type = 'visit') as unique_visitors,
            count(*) filter (where e.event_type = 'download') as downloads,
            count(*) filter (where e.event_type = 'submission') as submissions
          from site_analytics_events e
          where e.created_at::date = d.day::date
        ) stats on true
      ) activity
    ),
    'period_days', period_days
  );
end;
$$;

grant execute on function public.get_site_analytics(int) to authenticated;

notify pgrst, 'reload schema';
