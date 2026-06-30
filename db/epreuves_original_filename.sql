-- Conserve le nom original du fichier pour l'affichage et le téléchargement.
-- file_path reste la clé technique dans le bucket Supabase Storage.

alter table public.epreuves
  add column if not exists original_file_name text;

comment on column public.epreuves.original_file_name is
  'Nom du fichier tel que soumis par l''utilisateur (affichage / téléchargement).';

-- Rétrocompatibilité : reprendre le nom depuis file_path pour les anciens enregistrements.
update public.epreuves
set original_file_name = split_part(file_path, '/', array_length(string_to_array(file_path, '/'), 1))
where original_file_name is null
  and file_path is not null
  and file_path <> '';
