-- Reference tables for dynamic submission options
-- Run this in Supabase SQL editor.

create table if not exists public.document_types (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  is_active boolean not null default true,
  sort_order int,
  created_at timestamptz not null default now()
);

create table if not exists public.filieres (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  is_active boolean not null default true,
  sort_order int,
  created_at timestamptz not null default now()
);

create table if not exists public.ues (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  is_active boolean not null default true,
  sort_order int,
  created_at timestamptz not null default now()
);

create table if not exists public.annees (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  is_active boolean not null default true,
  sort_order int,
  created_at timestamptz not null default now()
);

create table if not exists public.niveaux (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  is_active boolean not null default true,
  sort_order int,
  created_at timestamptz not null default now()
);

create table if not exists public.etablissements (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  is_active boolean not null default true,
  sort_order int,
  created_at timestamptz not null default now()
);

insert into public.document_types (code, label, sort_order) values
  ('epreuve','Epreuve',1),
  ('recueil_epreuve','Recueil d''épreuve',2),
  ('cours','Cours',3),
  ('td','TD',4),
  ('memoire','Memoire',5),
  ('support','Support',6)
on conflict (code) do nothing;

insert into public.filieres (code, label, sort_order) values
  ('informatique','Informatique',1),
  ('telecom','Telecom',2),
  ('mathematiques','Mathematiques',3),
  ('physique','Physique',4),
  ('chimie','Chimie',5)
on conflict (code) do nothing;

insert into public.ues (code, label, sort_order) values
  ('bases_de_donnees','Bases de Donnees',1),
  ('algorithmique','Algorithmique',2),
  ('reseaux','Reseaux',3),
  ('systemes','Systemes',4),
  ('probabilites','Probabilites',5)
on conflict (code) do nothing;

insert into public.annees (code, label, sort_order) values
  ('2026', '2026', 1),
  ('2025', '2025', 2),
  ('2024', '2024', 3),
  ('2023', '2023', 4),
  ('2022', '2022', 5),
  ('2021', '2021', 6)
on conflict (code) do nothing;

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

insert into public.etablissements (code, label, sort_order) values
  ('uac', 'Université d''Abomey-Calavi', 1),
  ('up', 'Université de Parakou', 2),
  ('unstim', 'UNSTIM', 3),
  ('epac', 'EPAC', 4)
on conflict (code) do nothing;

alter table public.document_types enable row level security;
alter table public.filieres enable row level security;
alter table public.ues enable row level security;
alter table public.annees enable row level security;
alter table public.niveaux enable row level security;
alter table public.etablissements enable row level security;

-- Read for everyone
drop policy if exists "document_types_read_all" on public.document_types;
create policy "document_types_read_all"
on public.document_types
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "filieres_read_all" on public.filieres;
create policy "filieres_read_all"
on public.filieres
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "ues_read_all" on public.ues;
create policy "ues_read_all"
on public.ues
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "annees_read_all" on public.annees;
create policy "annees_read_all"
on public.annees
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "niveaux_read_all" on public.niveaux;
create policy "niveaux_read_all"
on public.niveaux
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "etablissements_read_all" on public.etablissements;
create policy "etablissements_read_all"
on public.etablissements
for select
to anon, authenticated
using (is_active = true);

-- Allow authenticated users to suggest new values.
drop policy if exists "document_types_insert_authenticated" on public.document_types;
create policy "document_types_insert_authenticated"
on public.document_types
for insert
to authenticated
with check (true);

drop policy if exists "filieres_insert_authenticated" on public.filieres;
create policy "filieres_insert_authenticated"
on public.filieres
for insert
to authenticated
with check (true);

drop policy if exists "ues_insert_authenticated" on public.ues;
create policy "ues_insert_authenticated"
on public.ues
for insert
to authenticated
with check (true);

drop policy if exists "annees_insert_authenticated" on public.annees;
create policy "annees_insert_authenticated"
on public.annees
for insert
to authenticated
with check (true);

drop policy if exists "niveaux_insert_authenticated" on public.niveaux;
create policy "niveaux_insert_authenticated"
on public.niveaux
for insert
to authenticated
with check (true);

drop policy if exists "etablissements_insert_authenticated" on public.etablissements;
create policy "etablissements_insert_authenticated"
on public.etablissements
for insert
to authenticated
with check (true);

-- Admin full visibility (including inactive)
drop policy if exists "document_types_read_admin_all" on public.document_types;
create policy "document_types_read_admin_all"
on public.document_types
for select
to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

drop policy if exists "filieres_read_admin_all" on public.filieres;
create policy "filieres_read_admin_all"
on public.filieres
for select
to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

drop policy if exists "ues_read_admin_all" on public.ues;
create policy "ues_read_admin_all"
on public.ues
for select
to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

drop policy if exists "annees_read_admin_all" on public.annees;
create policy "annees_read_admin_all"
on public.annees
for select
to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

drop policy if exists "niveaux_read_admin_all" on public.niveaux;
create policy "niveaux_read_admin_all"
on public.niveaux
for select
to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

drop policy if exists "etablissements_read_admin_all" on public.etablissements;
create policy "etablissements_read_admin_all"
on public.etablissements
for select
to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Update rights for authenticated users (admin area already gated in app)
drop policy if exists "document_types_update_admin" on public.document_types;
create policy "document_types_update_admin"
on public.document_types
for update
to authenticated
using (true)
with check (true);

drop policy if exists "filieres_update_admin" on public.filieres;
create policy "filieres_update_admin"
on public.filieres
for update
to authenticated
using (true)
with check (true);

drop policy if exists "ues_update_admin" on public.ues;
create policy "ues_update_admin"
on public.ues
for update
to authenticated
using (true)
with check (true);

drop policy if exists "annees_update_admin" on public.annees;
create policy "annees_update_admin"
on public.annees
for update
to authenticated
using (true)
with check (true);

drop policy if exists "niveaux_update_admin" on public.niveaux;
create policy "niveaux_update_admin"
on public.niveaux
for update
to authenticated
using (true)
with check (true);

drop policy if exists "etablissements_update_admin" on public.etablissements;
create policy "etablissements_update_admin"
on public.etablissements
for update
to authenticated
using (true)
with check (true);
