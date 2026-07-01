-- Migration : établissement + niveau d'études (L1, M1…) — année calendaire conservée
-- Exécuter dans l'éditeur SQL Supabase.

-- ── Correction si une ancienne version renommait annee → niveau ──
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'epreuves' and column_name = 'niveau'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'epreuves' and column_name = 'annee'
  ) then
    alter table public.epreuves rename column niveau to annee;
  end if;
end $$;

alter table public.epreuves add column if not exists etablissement text;
alter table public.epreuves add column if not exists niveau text;

-- ── Table années (session calendaire : 2024, 2025…) ──
create table if not exists public.annees (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  is_active boolean not null default true,
  sort_order int,
  created_at timestamptz not null default now()
);

insert into public.annees (code, label, sort_order) values
  ('2026', '2026', 1),
  ('2025', '2025', 2),
  ('2024', '2024', 3),
  ('2023', '2023', 4),
  ('2022', '2022', 5),
  ('2021', '2021', 6)
on conflict (code) do nothing;

-- ── Table niveaux (niveau d'études : L1, Licence 1, Première année…) ──
create table if not exists public.niveaux (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  is_active boolean not null default true,
  sort_order int,
  created_at timestamptz not null default now()
);

insert into public.niveaux (code, label, sort_order) values
  ('l1', 'L1', 1),
  ('l2', 'L2', 2),
  ('l3', 'L3', 3),
  ('licence_1', 'Licence 1', 4),
  ('licence_2', 'Licence 2', 5),
  ('licence_3', 'Licence 3', 6),
  ('m1', 'M1', 7),
  ('m2', 'M2', 8),
  ('master_1', 'Master 1', 9),
  ('master_2', 'Master 2', 10),
  ('premiere_annee', 'Première année', 11),
  ('deuxieme_annee', 'Deuxième année', 12),
  ('troisieme_annee', 'Troisième année', 13)
on conflict (code) do nothing;

-- Retirer les années calendaires du référentiel niveaux (si mauvaise migration)
delete from public.niveaux
where code in ('2026', '2025', '2024', '2023', '2022', '2021');

-- ── Table établissements ──
create table if not exists public.etablissements (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  is_active boolean not null default true,
  sort_order int,
  created_at timestamptz not null default now()
);

insert into public.etablissements (code, label, sort_order) values
  ('uac', 'Université d''Abomey-Calavi', 1),
  ('up', 'Université de Parakou', 2),
  ('unstim', 'UNSTIM', 3),
  ('epac', 'EPAC', 4)
on conflict (code) do nothing;

-- ── RLS annees ──
alter table public.annees enable row level security;

drop policy if exists "annees_read_all" on public.annees;
create policy "annees_read_all"
on public.annees for select to anon, authenticated
using (is_active = true);

drop policy if exists "annees_insert_authenticated" on public.annees;
create policy "annees_insert_authenticated"
on public.annees for insert to authenticated
with check (true);

drop policy if exists "annees_read_admin_all" on public.annees;
create policy "annees_read_admin_all"
on public.annees for select to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

drop policy if exists "annees_update_admin" on public.annees;
create policy "annees_update_admin"
on public.annees for update to authenticated
using (true) with check (true);

-- ── RLS niveaux ──
alter table public.niveaux enable row level security;

drop policy if exists "niveaux_read_all" on public.niveaux;
create policy "niveaux_read_all"
on public.niveaux for select to anon, authenticated
using (is_active = true);

drop policy if exists "niveaux_insert_authenticated" on public.niveaux;
create policy "niveaux_insert_authenticated"
on public.niveaux for insert to authenticated
with check (true);

drop policy if exists "niveaux_read_admin_all" on public.niveaux;
create policy "niveaux_read_admin_all"
on public.niveaux for select to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

drop policy if exists "niveaux_update_admin" on public.niveaux;
create policy "niveaux_update_admin"
on public.niveaux for update to authenticated
using (true) with check (true);

-- ── RLS établissements ──
alter table public.etablissements enable row level security;

drop policy if exists "etablissements_read_all" on public.etablissements;
create policy "etablissements_read_all"
on public.etablissements for select to anon, authenticated
using (is_active = true);

drop policy if exists "etablissements_insert_authenticated" on public.etablissements;
create policy "etablissements_insert_authenticated"
on public.etablissements for insert to authenticated
with check (true);

drop policy if exists "etablissements_read_admin_all" on public.etablissements;
create policy "etablissements_read_admin_all"
on public.etablissements for select to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

drop policy if exists "etablissements_update_admin" on public.etablissements;
create policy "etablissements_update_admin"
on public.etablissements for update to authenticated
using (true) with check (true);
