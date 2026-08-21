# Changelog

Historique des évolutions de **Banque Epreuve**.  
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) · [SemVer](https://semver.org/lang/fr/)

> **État au 21 août 2026** — Version **0.3.0** en production (Vercel) : catalogue, soumission jusqu’à 50 Mo, stats dynamiques, contact admin, pages légales, keep-alive Supabase, pages d’erreur. Prochaine étape : espace utilisateur et rôles avancés.

---

## [Unreleased]

### Prévu — infrastructure

- [ ] **Admin principal seed** : compte admin créé automatiquement au premier déploiement
- [ ] Workflow **inscription → attente validation admin → accès accordé**
- [ ] Modélisation des rôles : `admin`, `user`, `pending`
- [ ] Middleware ou protection serveur renforcée sur `/admin/*` (aujourd'hui : garde côté client via `useAdminAuth`)

### Prévu — produit

- [ ] Espace utilisateur connecté
- [ ] Favoris sur les épreuves / ressources
- [ ] Historique personnel des soumissions
- [ ] Classement / organisation personnelle par catégories
- [ ] **Téléchargement public** robuste (bouton présent, logique Storage/RLS à finaliser)
- [ ] Champ **motif de rejet** saisi par l'admin, transmis dans l'email au contributeur
- [ ] Index UNIQUE sur `fingerprint` pour les documents `Validé` (blocage automatique des doublons logiques)

### Notes pour les reprises futures

- Version npm dans `package.json` peut diverger du CHANGELOG — se référer à ce fichier pour l'état fonctionnel.
- Toute migration SQL non exécutée = fonctionnalité partielle (voir README, section migrations).
- Documents créés **avant juillet 2026** : exécuter `backfill_document_fingerprints.sql` + `npm run backfill:content-hash`.

---

## [0.3.0] - 2026-08-21

Soumission large, stats enrichies, légal & contact, keep-alive Supabase, UX erreur.

### Ajouté

#### Soumission de gros fichiers

- Limite portée à **50 Mo** (`MAX_SUBMISSION_FILE_SIZE_MB`)
- Barre de **progression** pendant l’envoi (préparation, doublons, upload XHR, enregistrement)
- Upload Storage avec progression réelle + messages d’étape
- Encodage des métadonnées fichier (accents / caractères non ISO-8859-1)

#### Recueils d’épreuves

- Type **« Recueil d’épreuve »** traité comme une épreuve (catalogue `/epreuves`, champ session)
- Filtre catalogue par motif (`type` contenant « epreuve ») côté JS + RPC SQL
- Migration `db/recueil_epreuve_document_type.sql`

#### Statistiques admin

- Visiteurs : **aujourd’hui**, **hier**, **7 derniers jours**, **total**
- Compteurs **épreuves publiées** / **ressources publiées**
- Mise à jour RPC `get_site_analytics` (`db/site_analytics_schema.sql`)

#### Accueil dynamique

- Bandeau stats réel : **Documents**, **Téléchargements**, **Visiteurs**, Gratuit
- Affichage avec préfixe `+` (ex. `+31`)
- RPC publique `get_public_home_stats` (`db/public_home_stats.sql`)

#### Légal & contact

- Dialogs CGU et politique de confidentialité (shadcn)
- Formulaire **Contact admin** (navbar + footer) → email Brevo (`POST /api/contact`)
- Pages d’erreur **404** (`not-found`) et **500** (`error` / `global-error`)

#### Infrastructure

- Keep-alive Supabase **quotidien** (GitHub Actions) + retries DNS
- Notification email keep-alive via JSON Python (Brevo)
- Déploiement documenté sur **Vercel** (retrait Netlify)

### Modifié

- Client Supabase : initialisation différée (build CI sans `.env`)
- Footer : section Contact + Informations légales
- README / CHANGELOG alignés sur Vercel et la v0.3.0

### Corrigé

- Build GitHub / Next : `supabaseUrl is required` au prerender
- Build Progress Radix (minification) → barre CSS native
- JSON Brevo keep-alive invalide (`Input must be a valid JSON object`)

---

## [0.2.1] - 2026-07-04

### Ajouté — Détection des doublons

- colonnes `content_hash` (SHA-256 du fichier), `fingerprint` (empreinte métier), `duplicate_of_id`, `duplicate_match_type` sur `epreuves`
- RPC `check_document_duplicate` (exact = même fichier, logical = même type/établissement/filière/UE/année/niveau/session)
- calcul hash + fingerprint à chaque soumission (`lib/documentFingerprint.ts`, `lib/checkDocumentDuplicate.ts`)
- migration `db/document_duplicate_detection.sql`
- **admin** : badge « Fichier identique » / « Même ressource », lien vers document existant, alerte dans le dialog de modération
- **contributeur** : dialog d'alerte orange à la soumission si doublon (sans bloquer l'envoi ; pas de dialog succès en parallèle)
- backfill anciens documents :
  - `db/backfill_document_fingerprints.sql` (empreintes métier, autonome)
  - `scripts/backfill-content-hash.mjs` + `npm run backfill:content-hash` (hash fichiers depuis Storage)

---

## [0.2.0] - 2026-07-03

Notifications email, référentiels dynamiques, séparation épreuves/ressources, recherche accent-insensible, filtres mobile, opt-in contributeur.

### Ajouté

#### Notifications email (Brevo)

- `lib/brevo/sendSubmissionNotification.ts`, `lib/brevo/sendContributorNotification.ts`
- `POST /api/notify-submission` — email admin à chaque soumission
- `POST /api/notify-contributor` — email contributeur (validé / rejeté)
- template rejet bienveillant (document illisible / doublon)
- variables : `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `ADMIN_NOTIFICATION_EMAIL`
- anti-doublon envoi via `notified_status` dans `submission_contacts`

#### Contributeur opt-in

- section « Contributeur (optionnel) » dans le formulaire
- case notification email, nom affiché optionnel, email privé
- table `submission_contacts` + RLS admin (`db/contributor_email_migration.sql`)

#### Référentiels dynamiques

- tables `document_types`, `filieres`, `ues`, `annees`, `niveaux`, `etablissements`
- page `/admin/referentiels`
- `POST /api/suggest-referentiel` pour les valeurs « Autre »
- migrations `submission_reference_schema.sql`, `etablissements_niveaux_migration.sql`

#### Recherche catalogue

- `CatalogSearchBar` sur `/epreuves` et `/ressources`
- multi-champs, insensible casse et accents
- RPC `get_catalog_page` + `fold_search_text` (`db/catalog_search_unaccent.sql`)
- repli client `ilike` si RPC indisponible

#### Filtres catalogue

- bottom sheet mobile + pastilles filtres actifs
- filtres : établissement, niveau, type, filière, UE, année, session

#### Épreuves vs Ressources

- une table `epreuves`, séparation par champ `type`
- `/epreuves` : variantes épreuve (`Epreuve`, `Épreuve`, `EPREUVE`…)
- `/ressources` : tout le reste
- `lib/documentType.ts`

#### Champs de soumission

- `etablissement`, `niveau` (distinct de `annee`), `original_file_name`
- titre dérivé du nom de fichier uploadé

#### UX

- formulaire en sections, carte info sticky, cartes catalogue refondues
- `DocumentModerationConfirmDialog` avant valider/rejeter
- succès soumission immédiat (notify + suggest en arrière-plan)

### Modifié

- `soumis_par` = nom contributeur ou « Anonyme »
- RLS admin : validation **et** rejet
- `is_app_admin()` centralisée
- notification contributeur auto à `updateStatus`

### Corrigé

- type `Épreuve` classé à tort dans `/ressources`
- email contributeur isolé (plus de fuite via `select` public)
- échappement `%` / `_` dans recherches `ilike`
- normalisation accents via `translate()` plutôt que `unaccent` seul

### Sécurité

- `SUPABASE_SERVICE_ROLE_KEY` serveur uniquement
- RLS `submission_contacts` : INSERT public restreint, SELECT admin
- regex email en base

---

## [0.1.0] - 2026-04-10

**MVP initial** — flux principal bout en bout.

### Ajouté

- Auth admin Supabase (`user_metadata.role = "admin"`)
- Pages auth : login, register, forgot/reset password
- Dashboard admin + modération (valider / rejeter)
- Ouverture documents via URL signée Storage
- Pages publiques : accueil, épreuves, ressources, soumettre
- Filtres catalogue de base
- Soumission anonyme → statut `En attente` → publication si `Validé`

### Comportement fondateur (inchangé depuis)

```
Soumission libre → modération admin obligatoire → catalogue public = Validé uniquement
```

---

## Guide de lecture pour une reprise ultérieure

| Question | Où regarder |
|----------|-------------|
| C'est quoi le projet ? | [README](./README.md) — sections « Objectif » et « Fonctionnalités » |
| Comment démarrer ? | README — « Démarrage rapide » |
| Quelles variables `.env` ? | README + [`.env.example`](./.env.example) |
| Quels scripts SQL exécuter ? | README tableau migrations + fichiers `db/` |
| Qu'est-ce qui manque ? | CHANGELOG — `[Unreleased]` |
| Qu'est-ce qui a changé quand ? | CHANGELOG — versions datées |
| Doublons / backfill ? | `0.2.1` + README section backfill |
| Keep-alive Supabase ? | `0.3.0` + workflow `.github/workflows/keep-supabase-alive.yml` |
