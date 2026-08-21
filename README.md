# Banque Epreuve

<p align="center">
  <strong>La référence pour partager et retrouver des ressources académiques.</strong><br/>
  Épreuves · Cours · TD · Mémoires — catalogue modéré, gratuit, pensé pour les étudiants.
</p>

<p align="center">
  <a href="./CHANGELOG.md"><img src="https://img.shields.io/badge/version-0.3.0-0077d2?style=flat-square" alt="Version 0.3.0" /></a>
  <img src="https://img.shields.io/badge/Next.js-13%20App%20Router-black?style=flat-square" alt="Next.js 13" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20·%20DB%20·%20Storage-3FCF8E?style=flat-square" alt="Supabase" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square" alt="Vercel" />
  <img src="https://img.shields.io/badge/Emails-Brevo-0B996E?style=flat-square" alt="Brevo" />
</p>

<p align="center">
  <a href="./CHANGELOG.md">Changelog</a> ·
  <a href="#démarrage-rapide">Démarrage</a> ·
  <a href="#configuration">Configuration</a> ·
  <a href="#migrations-sql">Migrations SQL</a> ·
  <a href="#déploiement-vercel">Déploiement</a>
</p>

---

## À propos

**Banque Epreuve** centralise les documents utiles à la préparation des examens et au travail universitaire, dans un catalogue **fiable et modéré** :

| | |
|---|---|
| **Contribuer** | Soumission anonyme ou identifiée, sans compte obligatoire (PDF / DOC / DOCX jusqu’à **50 Mo**) |
| **Modérer** | Chaque document est validé par un admin avant publication |
| **Retrouver** | Catalogues `/epreuves` et `/ressources`, recherche accent-insensible, filtres |
| **Notifier** | Emails Brevo (admin à la soumission, contributeur opt-in, formulaire contact) |

**Stack :** Next.js 13 (App Router) · React 18 · TypeScript · Tailwind · Supabase · Brevo · Vercel

---

## Fonctionnalités

### Public

| Route / élément | Description |
|-----------------|-------------|
| `/` | Accueil + stats dynamiques (documents, téléchargements, visiteurs) |
| `/epreuves` | Examens & recueils d’épreuves validés |
| `/ressources` | Cours, TD, mémoires… |
| `/soumettre` | Formulaire + progression d’upload + détection de doublons |
| Contact | Dialog « Écrire à l’administration » (navbar / footer) |
| Légal | CGU & confidentialité (dialogs) |
| Erreurs | Pages **404** et **500** |

### Admin

| Route | Description |
|-------|-------------|
| `/admin/login` … `/admin/reset-password` | Auth |
| `/admin/dashboard` | Vue d’ensemble |
| `/admin/documents` | File de modération |
| `/admin/documents/all` | Gestion complète |
| `/admin/referentiels` | Types, filières, UE, années, niveaux, établissements |
| `/admin/statistiques` | Visiteurs (jour / hier / 7 j / total), épreuves, ressources, graphiques |

### Données (résumé)

- Table **`epreuves`** — métadonnées + `statut` + hash / fingerprint doublons  
- **`submission_contacts`** — emails contributeurs (RLS admin)  
- Référentiels dynamiques + bucket Storage **`documents`**

---

## Roadmap

Détail dans [CHANGELOG.md → Unreleased](./CHANGELOG.md#unreleased) :

- Seed admin au premier déploiement  
- Inscription utilisateur → validation admin  
- Espace connecté, favoris, historique  
- Motif de rejet personnalisable  
- Protection serveur renforcée sur `/admin/*`

---

## Démarrage rapide

### Prérequis

- Node.js **18+**
- Projet **Supabase**
- Compte **Brevo** (optionnel, requis pour les emails)

### Installation

```bash
git clone <url-du-repo>
cd banque-epreuve
npm install
cp .env.example .env
```

Renseignez `.env` (voir [Configuration](#configuration)). **Ne jamais committer `.env`.**

### Supabase — Auth admin

Dans **Authentication → Users → User Metadata** :

```json
{ "role": "admin" }
```

### Supabase — Storage

1. Bucket **`documents`** (privé recommandé)  
2. Policies : upload public (soumission) + lecture admin (URLs signées)

### Lancer

```bash
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

### Checklist

- [ ] `/epreuves` et `/ressources` chargent  
- [ ] Soumission PDF → statut `En attente`  
- [ ] Admin valide → visible au catalogue  
- [ ] (Brevo) email reçu à la soumission / au contact  

---

## Configuration

### Variables d’environnement

| Variable | Obligatoire | Rôle |
|----------|:-----------:|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Oui | URL projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Oui | Clé anon (client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Oui* | Service role — **serveur uniquement** |
| `NEXT_PUBLIC_APP_URL` | Recommandé | URL publique (ex. `https://mon-site.vercel.app`) |
| `BREVO_API_KEY` | Non | Clé API v3 (`xkeysib-…`, pas SMTP) |
| `BREVO_SENDER_EMAIL` | Non | Expéditeur vérifié Brevo |
| `BREVO_SENDER_NAME` | Non | Nom affiché (défaut : Banque Epreuve) |
| `ADMIN_NOTIFICATION_EMAIL` | Non | Destinataire soumissions + contact |

\* Sans service role : catalogue / soumission OK ; « Autre » référentiel et certaines notifs limitées.

### Secrets GitHub Actions (keep-alive)

| Secret | Rôle |
|--------|------|
| `SUPABASE_URL` | URL Supabase |
| `SUPABASE_ANON_KEY` | Clé anon |
| `BREVO_API_KEY` | Envoi email keep-alive |
| `BREVO_SENDER_EMAIL` | Expéditeur vérifié |
| `BREVO_SENDER_NAME` | Optionnel |
| `KEEP_ALIVE_NOTIFY_EMAIL` | Destinataire du rapport ping |

Workflow : `.github/workflows/keep-supabase-alive.yml` (quotidien + manuel via **Actions → Run workflow**).

---

## Migrations SQL

Exécuter dans l’éditeur SQL Supabase, **dans l’ordre** :

| # | Fichier | Obligatoire | Rôle |
|---|---------|:-----------:|------|
| 1 | `epreuves_moderation_schema.sql` | Oui | Statuts + RLS modération |
| 2 | `epreuves_original_filename.sql` | Oui | `original_file_name` |
| 3 | `submission_reference_schema.sql` | Oui | Référentiels + seed |
| 4 | `etablissements_niveaux_migration.sql` | Oui | Établissements + niveaux |
| 5 | `catalog_search_unaccent.sql` | Recommandé | Recherche + filtre recueils |
| 6 | `recueil_epreuve_document_type.sql` | Si recueils | Type « Recueil d’épreuve » |
| 7 | `public_home_stats.sql` | Recommandé | Stats page d’accueil |
| 8 | `contributor_email_migration.sql` | Si opt-in | Contacts contributeurs |
| 9 | `document_duplicate_detection.sql` | Si doublons | Hash + RPC doublon |
| 10 | `site_analytics_schema.sql` | Recommandé | Analytics + fenêtres visiteurs |

### Backfill (base déjà peuplée)

```sql
-- Empreintes métier — db/backfill_document_fingerprints.sql
```

```bash
npm run backfill:content-hash   # nécessite SUPABASE_SERVICE_ROLE_KEY
```

---

## Déploiement (Vercel)

1. Connecter le dépôt GitHub à [Vercel](https://vercel.com)  
2. Copier **toutes** les variables d’environnement  
3. `NEXT_PUBLIC_APP_URL` = URL de production  
4. Build : `npm run build` (défaut Next.js)  
5. Supabase Auth → **Site URL** + **Redirect URLs** = URL Vercel  

---

## Scripts npm

| Commande | Description |
|----------|-------------|
| `npm run dev` | Dev (port 3000) |
| `npm run build` | Build production |
| `npm run start` | Servir le build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run backfill:content-hash` | Recalcul `content_hash` |

---

## Architecture

```
app/
  (public)/          Accueil, épreuves, ressources, soumettre
  admin/             Auth, dashboard, modération, référentiels, stats
  api/
    contact/         Formulaire contact → Brevo
    notify-*/        Notifications soumission / contributeur
    suggest-*/       Valeurs « Autre »
  not-found.tsx      404
  error.tsx          500 (segment)
  global-error.tsx   500 (layout racine)

components/client/   UI métier (soumission, admin, légal, contact, errors)
components/ui/       shadcn/ui
db/                  Migrations SQL
lib/                 Hooks, Brevo, Supabase, fingerprints, analytics
.github/workflows/   Keep-alive Supabase (+ éventuels autres)
```

### Flux métier

```
Visiteur → /soumettre → Storage + insert (En attente)
                      → check doublon → alerte ou succès
                      → email admin (Brevo)

Admin   → /admin/documents → valider → catalogue
                           → rejeter  → email contributeur (opt-in)
```

---

## Sécurité

- RLS : le public ne lit que les documents **Validé**  
- Emails contributeurs isolés (`submission_contacts`)  
- `SUPABASE_SERVICE_ROLE_KEY` **jamais** côté client  
- Soumission anonyme par défaut ; opt-in email explicite  
- Fichiers Storage en clés UUID  

---

## Liens utiles

| Ressource | Lien |
|-----------|------|
| Changelog | [CHANGELOG.md](./CHANGELOG.md) |
| Variables d’exemple | [.env.example](./.env.example) |
| Migrations | dossier [`db/`](./db/) |

---

## Licence

Projet privé / académique.  
Pour reprendre : lire ce README → migrations SQL → `.env` → admin `role: "admin"` → `npm run dev`.
