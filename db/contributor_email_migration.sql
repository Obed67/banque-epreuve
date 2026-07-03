-- Contributeurs (optionnels) qui souhaitent être notifiés du résultat
-- Table séparée pour ne jamais exposer l'email au public via RLS.
-- Ré-exécuter dans l'éditeur SQL Supabase.

create table if not exists public.submission_contacts (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.epreuves(id) on delete cascade,
  contributor_name text,
  contributor_email text not null,
  notify_contributor boolean not null default true,
  notified_status text,
  notified_at timestamptz,
  created_at timestamptz not null default now(),
  constraint submission_contacts_document_unique unique (document_id),
  constraint submission_contacts_email_format
    check (contributor_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create index if not exists submission_contacts_document_idx
  on public.submission_contacts (document_id);

alter table public.submission_contacts enable row level security;

-- Politique : insertion publique autorisée (formulaire de soumission).
drop policy if exists "submission_contacts_insert_public" on public.submission_contacts;
create policy "submission_contacts_insert_public"
on public.submission_contacts
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.epreuves e
    where e.id = document_id
      and e.statut = 'En attente'
  )
);

-- Politique : lecture réservée aux admins (jamais exposée en public).
drop policy if exists "submission_contacts_select_admin" on public.submission_contacts;
create policy "submission_contacts_select_admin"
on public.submission_contacts
for select
to authenticated
using (public.is_app_admin());

-- Politique : mise à jour du suivi (notified_at, notified_status) réservée à l'admin.
drop policy if exists "submission_contacts_update_admin" on public.submission_contacts;
create policy "submission_contacts_update_admin"
on public.submission_contacts
for update
to authenticated
using (public.is_app_admin())
with check (public.is_app_admin());

-- Suppression réservée à l'admin.
drop policy if exists "submission_contacts_delete_admin" on public.submission_contacts;
create policy "submission_contacts_delete_admin"
on public.submission_contacts
for delete
to authenticated
using (public.is_app_admin());

notify pgrst, 'reload schema';
