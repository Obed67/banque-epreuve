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

insert into public.document_types (code, label, sort_order) values
  ('epreuve','Epreuve',1),
  ('cours','Cours',2),
  ('td','TD',3),
  ('memoire','Memoire',4),
  ('support','Support',5)
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
  ('2024','2024',1),
  ('2023','2023',2),
  ('2022','2022',3),
  ('2021','2021',4)
on conflict (code) do nothing;

alter table public.document_types enable row level security;
alter table public.filieres enable row level security;
alter table public.ues enable row level security;
alter table public.annees enable row level security;

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
