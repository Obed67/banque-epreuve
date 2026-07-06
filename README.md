# Banque Epreuve

> 📖 **[Lire le Changelog](./CHANGELOG.md)** — historique des versions, ce qui est fait et ce qui reste.

Plateforme web communautaire de partage de documents académiques : épreuves d'examen, cours, TD, mémoires et autres ressources pédagogiques. Les étudiants consultent et soumettent des documents ; une équipe admin modère avant publication.

**Stack :** Next.js 13 (App Router) · React 18 · TypeScript · Tailwind · Supabase (Auth, Postgres, Storage) · Brevo (emails) · Vercel

**Version documentée :** voir [CHANGELOG.md](./CHANGELOG.md) — dernière release fonctionnelle **0.2.1** (juillet 2026).

---

## Objectif du projet

Centraliser les documents utiles à la préparation des examens et au travail universitaire, dans un catalogue **fiable et modéré** :

1. **Contribuer facilement** — soumission anonyme ou identifiée, sans compte obligatoire.
2. **Garantir la qualité** — chaque document passe par une validation admin avant d'être public.
3. **Retrouver vite** — catalogues séparés (épreuves / ressources), filtres, recherche insensible aux accents.
4. **Boucler la boucle** — notifications email (admin à la soumission, contributeur opt-in à la validation/rejet).

---

## Ce qui est fait aujourd'hui

### Côté public

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/epreuves` | Catalogue des examens validés + recherche + filtres |
| `/ressources` | Catalogue des autres documents (cours, TD, mémoires…) |
| `/soumettre` | Formulaire de soumission (PDF, DOC, DOCX — 50 Mo max) |

- Recherche multi-champs, insensible casse et accents.
- Filtres desktop (grille) et mobile (bottom sheet + pastilles).
- Soumission avec référentiels dynamiques et option « Autre à préciser ».
- Opt-in contributeur : nom public optionnel, email privé pour notification du résultat.
- **Détection des doublons** à la soumission : alerte au contributeur si document similaire ; la soumission n'est pas bloquée.

### Côté admin

| Route | Description |
|-------|-------------|
| `/admin/login` | Connexion |
| `/admin/register` | Création de compte |
| `/admin/forgot-password` | Mot de passe oublié |
| `/admin/reset-password` | Réinitialisation via lien email |
| `/admin/dashboard` | Vue d'ensemble et statistiques |
| `/admin/documents` | File de modération (valider / rejeter) |
| `/admin/documents/all` | Gestion complète (édition, suppression) |
| `/admin/referentiels` | Types, filières, UE, années, niveaux, établissements |
| `/admin/statistiques` | Graphiques d'activité |

- Badge **doublon** en modération (fichier identique ou même ressource académique).
- Emails Brevo : notification admin à chaque soumission ; email contributeur si opt-in.
- Ouverture des fichiers via URL signée Supabase Storage.

### Modèle de données (résumé)

- Table principale **`epreuves`** : métadonnées + `statut` (`En attente` | `Validé` | `Rejeté`) + `content_hash` + `fingerprint` + `duplicate_of_id`.
- Table **`submission_contacts`** : emails contributeurs (RLS admin uniquement).
- Tables **référentiels** : `document_types`, `filieres`, `ues`, `annees`, `niveaux`, `etablissements`.
- Bucket Storage **`documents`** : fichiers uploadés (clé UUID, nom original en base).

---

## Ce qui reste à faire

Voir la section **[Unreleased]** du [CHANGELOG.md](./CHANGELOG.md). En bref :

- Admin principal seedé automatiquement au premier déploiement.
- Workflow utilisateur : inscription → validation admin → accès.
- Espace utilisateur connecté, favoris, historique des soumissions.
- Téléchargement public robuste (Storage + RLS).
- Motif de rejet personnalisable côté admin, transmis par email.

---

## Démarrage rapide

### 1. Prérequis

- **Node.js 18+**
- Un **projet Supabase** (gratuit suffit pour démarrer)
- Un compte **Brevo** (optionnel — sans lui, les soumissions fonctionnent mais pas les emails)

### 2. Cloner et installer

```bash
git clone <url-du-repo>
cd banque-epreuve
npm install
```

### 3. Configurer l'environnement

```bash
cp .env.example .env
```

Remplir toutes les variables (détail ci-dessous). **Ne jamais commiter `.env`.**

### 4. Configurer Supabase

#### a) Auth — rôle admin

Les comptes admin doivent avoir `role: "admin"` dans les **user metadata** Supabase :

1. Supabase → Authentication → Users
2. Sélectionner l'utilisateur → **User Metadata** (JSON) :
   ```json
   { "role": "admin" }
   ```

Sans ce champ, l'utilisateur ne peut pas accéder aux pages admin.

#### b) Storage

1. Créer un bucket **`documents`** (privé recommandé).
2. Configurer les policies pour permettre l'upload public (soumission) et la lecture admin (URLs signées).

#### c) Migrations SQL

Exécuter les scripts du dossier `db/` **dans l'éditeur SQL Supabase**, dans cet ordre :

| Ordre | Fichier | Obligatoire | Rôle |
|-------|---------|-------------|------|
| 1 | `epreuves_moderation_schema.sql` | Oui | Statuts + RLS modération |
| 2 | `epreuves_original_filename.sql` | Oui | Colonne `original_file_name` |
| 3 | `submission_reference_schema.sql` | Oui | Référentiels + seed |
| 4 | `etablissements_niveaux_migration.sql` | Oui | Établissements + niveaux |
| 5 | `catalog_search_unaccent.sql` | Recommandé | Recherche accent-insensible (RPC) — inclut recueils d'épreuves sur `/epreuves` |
| 5b | `recueil_epreuve_document_type.sql` | Si recueils | Type « Recueil d'épreuve » dans le formulaire de soumission |
| 6 | `contributor_email_migration.sql` | Si opt-in email | Table `submission_contacts` |
| 7 | `document_duplicate_detection.sql` | Si doublons | Colonnes hash + RPC `check_document_duplicate` |
| 8 | `site_analytics_schema.sql` | Optionnel | Compteurs analytics |

#### d) Backfill documents existants (si base déjà peuplée)

```sql
-- Empreintes métier (fingerprint) — SQL Supabase
-- db/backfill_document_fingerprints.sql
```

```bash
# Hash des fichiers (content_hash) — local, nécessite SUPABASE_SERVICE_ROLE_KEY
npm run backfill:content-hash
```

### 5. Lancer en local

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

### 6. Vérifier que tout fonctionne

- [ ] Page `/epreuves` et `/ressources` chargent (même vides).
- [ ] Soumission d'un PDF sur `/soumettre` → statut `En attente` en base.
- [ ] Connexion admin → `/admin/documents` affiche la soumission.
- [ ] Validation → document visible dans le catalogue public.
- [ ] (Si Brevo configuré) email reçu à la soumission.

---

## Configuration détaillée

### Variables d'environnement

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Oui | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Oui | Clé anon (publique, côté client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Oui* | Clé service role — **serveur uniquement**. Requise pour référentiels « Autre », contacts contributeurs, backfill hash |
| `NEXT_PUBLIC_APP_URL` | Recommandé | URL publique du site (liens dans les emails). Ex. `https://mon-site.vercel.app` |
| `BREVO_API_KEY` | Non | Clé API v3 Brevo (`xkeysib-…`, **pas** `xsmtpsib-…`) |
| `BREVO_SENDER_EMAIL` | Non | Email expéditeur vérifié dans Brevo |
| `BREVO_SENDER_NAME` | Non | Nom affiché (défaut : Banque Epreuve) |
| `ADMIN_NOTIFICATION_EMAIL` | Non | Destinataire des alertes de soumission |

\* Sans service role : soumission et catalogue OK ; suggestions « Autre » et notifications contributeur limitées.

### Brevo (emails)

1. Créer un compte sur [brevo.com](https://www.brevo.com)
2. Vérifier l'email expéditeur (domaine ou adresse Gmail)
3. Générer une **clé API v3** : SMTP & API → Clés API → `xkeysib-…`
4. Renseigner les 4 variables Brevo dans `.env`

### Déploiement (Vercel)

Le projet est hébergé sur [Vercel](https://vercel.com) (preset Next.js détecté automatiquement).

1. Connecter le dépôt GitHub au projet Vercel
2. Ajouter **toutes** les variables d'environnement dans Vercel → Project → Settings → Environment Variables (Production, Preview et Development selon besoin)
3. `NEXT_PUBLIC_APP_URL` = URL de production Vercel du site (ex. `https://mon-site.vercel.app`)
4. Build command : `npm run build` (valeur par défaut Vercel pour Next.js)
5. Chaque push sur `main` déclenche un déploiement automatique

**Supabase Auth** — dans Supabase → Authentication → URL Configuration, ajouter l'URL Vercel de production (et éventuellement les URLs de preview) dans **Site URL** et **Redirect URLs** pour la connexion admin et la réinitialisation de mot de passe.

---

## Scripts npm

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (port 3000) |
| `npm run build` | Build de production |
| `npm run start` | Exécuter le build localement |
| `npm run lint` | ESLint |
| `npm run typecheck` | Vérification TypeScript (`tsc --noEmit`) |
| `npm run backfill:content-hash` | Recalculer `content_hash` des anciens documents depuis Storage |

---

## Structure du projet

```
app/
  (public)/              Pages publiques : accueil, épreuves, ressources, soumettre
  admin/                 Pages admin : auth, dashboard, modération, référentiels, stats
  api/
    notify-submission/   Email admin à chaque soumission
    notify-contributor/  Email contributeur (validé / rejeté)
    suggest-referentiel/ Enregistrement des valeurs « Autre »
  components/            Navbar, Footer, CatalogSearchBar, FilterBar, cartes catalogue…

components/client/       Formulaires, tables admin, dialogs (soumission, modération, doublon)
components/ui/           Composants shadcn/ui (Radix)

db/                      Migrations SQL Supabase (exécuter manuellement)
scripts/                 Scripts one-shot (ex. backfill content_hash)

lib/
  hooks/                 useCatalogDocuments, usePendingDocuments, useAdminAuth…
  brevo/                 Templates et envoi emails
  documentFingerprint.ts Calcul fingerprint + content_hash
  checkDocumentDuplicate.ts Appel RPC doublon
  supabaseClient.ts      Client public
  supabaseAdmin.ts       Client service role (serveur)
```

---

## Flux métier (résumé)

```
Visiteur → /soumettre → upload Storage + insert epreuves (En attente)
                    → check doublon (fingerprint + content_hash)
                    → alerte si doublon OU dialog succès
                    → email admin (Brevo)

Admin → /admin/documents → voir fichier + badge doublon éventuel
                        → valider → statut Validé → catalogue public
                        → rejeter → statut Rejeté → email contributeur si opt-in
```

---

## Sécurité et confidentialité

- **RLS** sur toutes les tables sensibles ; le public ne lit que les documents `Validé`.
- **Emails contributeurs** isolés dans `submission_contacts` — jamais exposés au catalogue.
- **`SUPABASE_SERVICE_ROLE_KEY`** uniquement dans les routes API serveur, jamais côté client.
- Soumission **anonyme par défaut** ; consentement explicite pour l'email (RGPD-friendly).
- Fichiers Storage avec clés UUID (pas de nom prévisible).

---

## Pour aller plus loin

- **Historique des versions et roadmap :** [CHANGELOG.md](./CHANGELOG.md)
- **Variables d'environnement :** [.env.example](./.env.example)
- **Migrations base :** dossier `db/`

---

## Licence et contribution

Projet privé / académique. Pour reprendre le projet : lire ce README, exécuter les migrations SQL, configurer `.env`, créer un compte admin avec `role: "admin"`, puis `npm run dev`.
