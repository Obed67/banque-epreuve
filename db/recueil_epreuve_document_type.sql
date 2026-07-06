-- Ajoute « Recueil d'épreuve » aux types de document.
-- Puis ré-exécutez db/catalog_search_unaccent.sql pour le filtre catalogue (recueils sur /epreuves).

insert into public.document_types (code, label, sort_order) values
  ('recueil_epreuve', 'Recueil d''épreuve', 2)
on conflict (code) do update
  set label = excluded.label,
      is_active = true,
      sort_order = excluded.sort_order;
