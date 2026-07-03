# Changelog

Toutes les évolutions notables du projet sont suivies ici.

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et SemVer.

## [Unreleased]

### En cours

- mise en place d'un **admin principal** (seed initial) pour démarrer la modération
- workflow « inscription → attente de validation admin → accès accordé »
- modélisation des rôles applicatifs (`admin`, `user`, `pending`)

### Roadmap produit

- espace utilisateur connecté
- favoris sur les épreuves
- historique personnel des soumissions
- classement personnel des épreuves par catégories
- téléchargement public robuste via Storage avec règles sécurisées
- champ « motif de rejet » côté admin, transmis dans l'email au contributeur

---

## [0.2.0] - 2026-07-03

Grosse itération : notifications email, référentiels dynamiques, séparation épreuves/ressources, recherche insensible aux accents, filtres mobile et opt-in contributeur.

### Ajouté

#### Notifications email (Brevo)

- intégration Brevo (`lib/brevo/sendSubmissionNotification.ts`, `lib/brevo/sendContributorNotification.ts`)
- route serveur `POST /api/notify-submission` : email à l'admin à chaque soumission
- route serveur `POST /api/notify-contributor` : email au contributeur (validé / rejeté)
- template email « rejeté » bienveillant listant les causes courantes (document illisible / doublon) avec encouragements à re-soumettre
- variables d'environnement dédiées (`BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `ADMIN_NOTIFICATION_EMAIL`)
- anti-doublon d'envoi via `notified_status` dans `submission_contacts`

#### Contributeur opt-in

- section « Contributeur (optionnel) » dans le formulaire de soumission
- case à cocher « Je souhaite être notifié par email » (soumission anonyme par défaut)
- champs conditionnels : nom affiché (public, remplace « Anonyme ») et email (privé, jamais publié)
- validation email côté client + regex côté base
- table dédiée `submission_contacts` avec RLS admin (le public ne peut qu'insérer et uniquement pour un document en attente)
- migration SQL `db/contributor_email_migration.sql`

#### Référentiels dynamiques

- tables `document_types`, `filieres`, `ues`, `annees`, `niveaux`, `etablissements`
- page admin `/admin/referentiels` pour gérer les listes (ajout, activation, ordre)
- route serveur `POST /api/suggest-referentiel` : quand un contributeur choisit « Autre », la valeur est proposée en base avec le service role (jamais exposé côté client)
- migrations SQL `db/submission_reference_schema.sql`, `db/etablissements_niveaux_migration.sql`

#### Recherche catalogue

- barre de recherche sur `/epreuves` et `/ressources` (`app/components/CatalogSearchBar.tsx`)
- recherche multi-champs (titre, filière, UE, établissement, niveau, année, type, nom de fichier)
- insensible à la casse et **aux accents** (`algèbre` = `algebre`)
- côté serveur : RPC Postgres `get_catalog_page` + fonctions `fold_search_text` / `text_matches_unaccent` (translate + lower)
- côté client : repli `ilike` avec envoi des variantes accentuée et non-accentuée si la RPC est indisponible
- debounce 300 ms, pagination conservée
- migration SQL `db/catalog_search_unaccent.sql`

#### Filtres catalogue

- bouton « Filtrer » sur mobile ouvrant un bottom sheet natif-like
- pastilles indiquant les filtres actifs sur mobile
- grille inline conservée sur desktop
- refonte du composant `FilterBar.tsx`
- filtres ajoutés : établissement, niveau, type

#### Épreuves vs Ressources

- séparation basée sur le champ `type` (une seule table `epreuves` en base)
- `/epreuves` : uniquement les documents de type épreuve, avec gestion des variantes (`Epreuve`, `Épreuve`, `EPREUVE`, `epreuve`, `épreuve`)
- `/ressources` : tous les autres types (Cours, TD, Mémoire, Support, Autre…)
- helper `lib/documentType.ts` centralisant la logique de classification

#### Nouveaux champs de soumission

- `etablissement` (nouvelle table + champ obligatoire)
- `niveau` (L1 / Licence 1 / M1 / Première année…) — **distinct de l'année**
- `annee` (année calendaire : 2024, 2025…) — conservée en parallèle
- `original_file_name` sur `epreuves` (migration `db/epreuves_original_filename.sql`)
- titre du document déduit automatiquement du nom du fichier uploadé

#### UX

- refonte du formulaire de soumission en sections (`SubmissionForm.tsx`) : Document / Établissement et parcours / Formation / Contributeur / Fichier
- carte info sticky sur desktop
- refonte des cartes catalogue (`CatalogDocumentCard.tsx`) avec grille auto et libellés séparés par « : »
- confirmation avant validation / rejet d'un document dans l'admin (`DocumentModerationConfirmDialog`)
- retour de succès immédiat après soumission (notify + suggest-referentiel en arrière-plan)

### Modifié

- `soumis_par` prend la valeur du nom du contributeur si renseigné, sinon « Anonyme »
- policy RLS `epreuves` permettant à l'admin de rejeter (et pas seulement valider)
- fonction `is_app_admin()` centralisant la vérification du rôle admin
- hook `usePendingDocuments` déclenche automatiquement la notification contributeur à `updateStatus`
- schéma d'analytics simplifié (`db/site_analytics_schema.sql`)

### Corrigé

- documents de type `Épreuve` (avec accent) qui apparaissaient dans `/ressources` — la comparaison `ILIKE 'epreuve'` ne matchait pas
- fuites potentielles de l'email contributeur via `select *` public : email isolé dans une table à part avec RLS admin
- caractères spéciaux `%` et `_` échappés dans les recherches `ilike`
- normalisation des accents plus fiable via `translate()` (l'extension Postgres `unaccent` seule ne couvrait pas tous les cas Supabase)

### Sécurité

- `SUPABASE_SERVICE_ROLE_KEY` strictement côté serveur (routes API), jamais exposé au client
- RLS renforcée sur `submission_contacts` (INSERT public restreint aux documents « En attente », SELECT/UPDATE/DELETE admin uniquement)
- contrainte de format email en base (`~*` regex)
- ajout de `SUPABASE_SERVICE_ROLE_KEY` dans `.env.example` avec avertissement

---

## [0.1.0] - 2026-04-10

### Ajouté

- authentification admin (Supabase Auth) avec vérification du rôle
- protection des routes `/admin/*` via middleware
- page de login admin (affichage / masquage du mot de passe)
- création de compte admin (`/admin/register`)
- mot de passe oublié (`/admin/forgot-password`) + réinitialisation (`/admin/reset-password`)
- helpers auth (`signUpWithEmail`, `sendPasswordResetEmail`, `updateCurrentUserPassword`)
- redirection automatique vers le dashboard si admin déjà connecté
- dashboard admin de modération des soumissions
- ouverture des documents depuis le dashboard via URL signée Supabase
- actions de modération : valider / rejeter
- pages publiques : accueil, liste des épreuves validées avec filtres, liste des ressources validées avec filtres, page de soumission de documents

### Comportement

- n'importe qui peut soumettre un document
- les documents soumis passent en `En attente`
- un admin valide / rejette
- les visiteurs voient uniquement les documents `Validé`
