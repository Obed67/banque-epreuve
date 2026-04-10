# Banque Epreuve

Plateforme web de partage de documents académiques (épreuves, cours, TD, ressources), construite avec Next.js et Supabase.

## Etat actuel (version fonctionnelle)

Cette version permet deja le flux principal suivant:

- n'importe quel visiteur peut soumettre un document via la page `soumettre`
- les soumissions arrivent avec le statut `En attente`
- un admin se connecte dans `admin/login`
- l'admin consulte les documents en attente dans `admin/dashboard`
- l'admin peut ouvrir le fichier soumis, puis valider ou rejeter
- seuls les documents `Validé` apparaissent dans les pages publiques
- les visiteurs peuvent consulter les listes et filtrer les documents

## Fonctionnalites disponibles

### Public

- page d'accueil
- catalogue des epreuves valides (`/epreuves`)
- catalogue des ressources valides (`/ressources`)
- filtres par filiere, UE, annee, session/type selon la page
- soumission anonyme de documents (`/soumettre`)

### Admin

- login admin (`/admin/login`)
- protection des routes admin via `middleware.ts`
- redirection vers le login si non connecte ou non admin
- dashboard admin avec:
  - liste des documents en attente
  - ouverture d'un fichier soumis via URL signee Supabase
  - validation/rejet
  - statistiques globales
  - deconnexion

## Stack technique

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- Lucide React (icones)

## Prerequis

- Node.js 18+
- projet Supabase configure

## Configuration

1. Installer les dependances:

```bash
npm install
```

2. Creer le fichier `.env` avec:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3. Lancer en local:

```bash
npm run dev
```

## Scripts utiles

- `npm run dev` : lancement local
- `npm run build` : build de production
- `npm run start` : execution du build
- `npm run lint` : verification lint
- `npm run typecheck` : verification TypeScript

## Notes importantes

- Le bouton "Telecharger" sur les pages publiques est present visuellement, mais le telechargement public complet est a finaliser selon les regles Storage/RLS.
- La gestion des comptes utilisateurs (inscription + validation admin des acces) est prevue dans la prochaine version.

## Suivi du projet

Le suivi d'avancement est maintenu dans `CHANGELOG.md` (fait, en cours, prochaines etapes).
