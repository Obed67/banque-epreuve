# Changelog

Toutes les evolutions du projet sont suivies ici.

## [Unreleased]

### En cours (prochaine version)

- mise en place d'un **admin principal** (seed initial) pour demarrer la moderation
- workflow "inscription -> attente de validation admin -> acces accorde"
- modelisation des roles applicatifs (`admin`, `user`, `pending`)

### Ajoute (auth admin)

- page `admin/register` (creation de compte)
- page `admin/login` completee avec liens vers register/forgot password
- page `admin/forgot-password` (envoi email de reinitialisation)
- page `admin/reset-password` (mise a jour du mot de passe via lien email)
- extension des helpers auth (`signUpWithEmail`, `sendPasswordResetEmail`, `updateCurrentUserPassword`)
- middleware mis a jour pour autoriser les routes d'auth admin publiques

### A faire (roadmap produit)

- espace utilisateur connecte
- favoris sur les epreuves
- soumission avec nom du contributeur (ou mode anonyme)
- historique personnel des soumissions
- classement personnel des epreuves par categories
- telechargement public robuste via Storage avec regles securisees

## [0.1.0] - 2026-04-10

### Ajoute

- authentification admin (Supabase Auth) avec verification du role
- protection des routes `/admin/*` via middleware
- page de login admin avec affichage/masquage du mot de passe (icone oeil)
- redirection auto vers le dashboard si admin deja connecte
- dashboard admin pour moderer les soumissions
- ouverture des documents depuis le dashboard via URL signee Supabase
- actions de moderation: valider / rejeter
- pages publiques:
  - accueil
  - liste des epreuves valides avec filtres
  - liste des ressources valides avec filtres
  - page de soumission de documents

### Comportement actuel

- n'importe qui peut soumettre un document
- les documents soumis passent en `En attente`
- un admin valide/rejette
- les visiteurs voient uniquement les documents `Validé`

---

Format inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et semver.
