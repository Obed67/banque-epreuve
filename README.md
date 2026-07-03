# Banque Epreuve

Plateforme web de partage de documents académiques (épreuves, cours, TD, mémoires, ressources) construite avec **Next.js** (App Router) et **Supabase**. Modération admin obligatoire, référentiels dynamiques, notifications email (Brevo), catalogue public avec recherche insensible aux accents et filtres avancés.

## Fonctionnement général

- Un visiteur soumet un document via `/soumettre` (**anonyme par défaut**, option pour être notifié par email).
- La soumission arrive avec le statut `En attente` et déclenche une notification email à l'admin.
- L'admin se connecte via `/admin/login`, consulte les soumissions dans `/admin/documents`, ouvre le fichier, puis **valide** ou **rejette**.
- Si le contributeur a laissé un email, il reçoit automatiquement un mail (publié ou non).
- Les visiteurs consultent uniquement les documents `Validé` via `/epreuves` (examens) ou `/ressources` (cours, TD, mémoires, supports).

## Fonctionnalités disponibles

### Public

- Accueil, catalogue épreuves (`/epreuves`) et catalogue ressources (`/ressources`).
- **Barre de recherche** sur les catalogues (titre, filière, UE, établissement, nom de fichier).
  - Insensible à la casse et aux accents (`algèbre` = `algebre`).
  - Debounce 300 ms, RPC serveur `get_catalog_page` en priorité, repli `ilike` côté client si la RPC est indisponible.
- Filtres par filière, UE, année, niveau, session, établissement, type.
  - Desktop : grille de sélecteurs inline.
  - Mobile : bouton « Filtrer » ouvrant un bottom sheet, avec pastilles des filtres actifs.
- Séparation épreuves / ressources via le champ `type`, avec gestion des variantes d'accents (`Epreuve`, `Épreuve`, `EPREUVE`…).
- **Soumission de document** (`/soumettre`) :
  - Formulaire structuré en sections (Document, Établissement et parcours, Formation, Contributeur, Fichier).
  - Drag & drop du fichier (PDF, DOC, DOCX — max 10 Mo).
  - Choix ou saisie libre pour chaque référentiel (option « Autre à préciser »).
  - Retour de succès immédiat, avec envoi des notifications et enregistrement des valeurs libres en arrière-plan.
  - **Opt-in contributeur** : case pour être notifié par email du résultat (nom affiché optionnel, email optionnel jamais publié).

### Admin

- Connexion / création de compte / mot de passe oublié / réinitialisation.
- Middleware protégeant `/admin/*` (redirection si non connecté ou non admin).
- Dashboard `/admin/dashboard` avec statistiques.
- File de modération `/admin/documents` :
  - Ouverture du fichier via URL signée Supabase.
  - **Confirmation avant validation / rejet** (dialog de sécurité).
  - Envoi automatique d'un email au contributeur (si opt-in) via Brevo.
- Gestion des référentiels `/admin/referentiels` (types, filières, UE, années, niveaux, établissements).
- Gestion complète des documents `/admin/documents/tous` (édition, suppression).
- Ajustement manuel des soumissions type « Autre » proposées par les contributeurs.

### Notifications email (Brevo)

- **À la soumission** : mail à l'admin avec tous les champs du document et lien vers la file de modération.
- **Au contributeur (opt-in)** :
  - **Validé** : message de remerciement + lien vers le catalogue.
  - **Rejeté** : message bienveillant listant les causes courantes (document illisible / doublon), encouragements et lien pour re-soumettre.

## Stack technique

- **Next.js 13** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix) + **lucide-react**
- **Supabase** : Auth, Postgres, Storage, RLS, RPC
- **Brevo** (Sendinblue) : emails transactionnels
- **Zod** : validation des payloads API
- **@tanstack/react-table** : tables admin
- **Recharts** : statistiques dashboard

## Prérequis

- Node.js 18+
- Projet Supabase configuré (URL, anon key, service role key)
- Compte Brevo avec clé API v3 (`xkeysib-…`) — optionnel mais recommandé pour les notifications

## Installation

```bash
npm install
```

## Variables d'environnement

Copier `.env.example` en `.env` et compléter :

```env
# Supabase (public)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase service role — serveur uniquement
# Requis pour : suggestions de référentiels « Autre », lecture des contacts contributeurs
SUPABASE_SERVICE_ROLE_KEY=

# URL publique du site (utilisée dans les liens des emails)
NEXT_PUBLIC_APP_URL=https://votre-domaine.netlify.app

# Brevo — clé API v3 (xkeysib-…) et non SMTP (xsmtpsib-…)
BREVO_API_KEY=
BREVO_SENDER_EMAIL=noreply@votre-domaine.com
BREVO_SENDER_NAME=Banque Epreuve
ADMIN_NOTIFICATION_EMAIL=admin@votre-domaine.com
```

**Ne jamais** commiter le `.env` ni exposer `SUPABASE_SERVICE_ROLE_KEY` côté client.

## Migrations SQL

Les scripts sont dans le dossier `db/`. Les exécuter dans l'éditeur SQL Supabase, dans cet ordre pour un premier déploiement :

| Fichier | Rôle |
|---|---|
| `epreuves_moderation_schema.sql` | Contraintes de statut + policies RLS (validation / rejet par admin) |
| `epreuves_original_filename.sql` | Colonne `original_file_name` |
| `submission_reference_schema.sql` | Tables référentiels (types, filières, UE, années) et seed initial |
| `etablissements_niveaux_migration.sql` | Ajout des tables `etablissements` et `niveaux`, plus colonnes correspondantes sur `epreuves` |
| `catalog_search_unaccent.sql` | RPC `get_catalog_page` + fonctions de normalisation `fold_search_text` pour la recherche insensible aux accents |
| `contributor_email_migration.sql` | Table `submission_contacts` (email opt-in du contributeur, RLS admin) |
| `site_analytics_schema.sql` | Compteurs simples (soumissions par période, contributeurs uniques) |

## Lancement

```bash
npm run dev
```

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Exécution du build |
| `npm run lint` | Vérification ESLint |
| `npm run typecheck` | Vérification TypeScript |

## Structure

```
app/
  (public)/         — pages publiques (accueil, catalogues, soumettre)
  admin/            — pages admin (auth, dashboard, modération, référentiels)
  api/              — routes serveur (notify-submission, notify-contributor, suggest-referentiel)
  components/       — composants partagés (Navbar, Footer, CatalogSearchBar, FilterBar…)
components/client/  — composants clients riches (formulaires, tables admin, dialogs)
db/                 — migrations SQL Supabase
lib/                — helpers, hooks, clients Supabase, wrappers Brevo, validation
```

## Sécurité et confidentialité

- Emails et noms de contributeurs stockés dans une **table séparée** (`submission_contacts`) avec RLS admin seulement. Jamais exposés au public.
- Les routes API sensibles (`/api/notify-contributor`, `/api/suggest-referentiel`) utilisent `SUPABASE_SERVICE_ROLE_KEY` **exclusivement côté serveur**.
- Anti-doublon d'envoi : chaque contact a un `notified_status` qui empêche de renvoyer plusieurs fois le même email en cas de re-validation.
- Consentement explicite du contributeur via une case à cocher (RGPD-friendly, soumission anonyme par défaut).

## Suivi du projet

Le suivi d'avancement (livré, en cours, roadmap) est maintenu dans `CHANGELOG.md`.
