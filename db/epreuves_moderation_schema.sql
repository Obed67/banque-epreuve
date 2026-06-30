-- Moderation: allow admin to validate OR reject documents
-- Run this in Supabase SQL editor if rejection fails with a generic update error.

-- Ensure rejected status is allowed by the column constraint
alter table public.epreuves drop constraint if exists epreuves_statut_check;
alter table public.epreuves drop constraint if exists epreuves_status_check;
alter table public.epreuves drop constraint if exists check_statut;

alter table public.epreuves
  add constraint epreuves_statut_check
  check (statut in ('En attente', 'Validé', 'Rejeté'));

create or replace function public.is_app_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'admin'
      or coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

alter table public.epreuves enable row level security;

-- Replace policies that only allow updating to "Validé"
drop policy if exists "epreuves_update_admin" on public.epreuves;
drop policy if exists "Admin can update epreuves" on public.epreuves;
drop policy if exists "epreuves_admin_update" on public.epreuves;
drop policy if exists "Allow admin update" on public.epreuves;

create policy "epreuves_update_admin"
on public.epreuves
for update
to authenticated
using (public.is_app_admin())
with check (public.is_app_admin());

-- Optional: explicit read for admin on all statuses (if updates still fail)
drop policy if exists "epreuves_read_admin" on public.epreuves;
create policy "epreuves_read_admin"
on public.epreuves
for select
to authenticated
using (public.is_app_admin());

notify pgrst, 'reload schema';
