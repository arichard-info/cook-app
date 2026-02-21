# Architecture technique

## Stack

- **Frontend** : Svelte + Vite
- **Stockage** : GitHub (via API REST)
- **IA** : Firebase AI Logic (Gemini)
- **Format de données** : Markdown avec frontmatter YAML
- **Type** : PWA (Progressive Web App)

## Principes architecturaux

### Séparation frontend agnostique / infrastructure

L'application est structurée en deux parties distinctes :

1. **Frontend agnostique** (`app/`) : ne connaît pas les implémentations concrètes (GitHub, Firebase)
2. **Infrastructure** (`infrastructure/`) : implémentations concrètes des providers

Cette séparation permet de :
- Remplacer facilement un provider par un autre
- Migrer vers un backend dédié sans toucher au frontend
- Tester avec des adapters in-memory

### Stateless

- Aucun backend propriétaire
- Toute la logique métier portée par le frontend
- Les APIs tierces (GitHub, Firebase) servent uniquement d'infrastructure
- Authentification et clés stockées côté client

## Structure du projet

### Monorepo

Le projet est organisé en monorepo avec pnpm workspaces pour anticiper l'ajout futur de packages (backend, extension web, etc.).

```
cook/                                # Monorepo root
├── apps/
│   └── web/                        # 🎨 Application Svelte (PWA)
│       ├── src/
│       │   ├── app/                # Frontend agnostique
│       │   │   ├── components/     # Composants UI
│       │   │   │   ├── recipe/
│       │   │   │   ├── conversation/
│       │   │   │   └── shared/
│       │   │   ├── pages/          # Pages/Routes
│       │   │   ├── stores/         # État global (Svelte stores)
│       │   │   └── utils/          # Utilitaires frontend
│       │   │
│       │   ├── core/               # 🔌 Couche d'abstraction
│       │   │   ├── services/       # Services métier agnostiques
│       │   │   │   ├── RecipeService.ts
│       │   │   │   ├── LLMService.ts
│       │   │   │   └── AuthService.ts
│       │   │   └── models/         # Modèles de données
│       │   │       ├── Recipe.ts
│       │   │       └── Conversation.ts
│       │   │
│       │   ├── infrastructure/     # 🏗️ Implémentations concrètes
│       │   │   ├── storage/
│       │   │   │   ├── GitHubStorageAdapter.ts
│       │   │   │   ├── LocalStorageAdapter.ts
│       │   │   │   └── index.ts
│       │   │   ├── llm/
│       │   │   │   ├── FirebaseGeminiAdapter.ts
│       │   │   │   └── index.ts
│       │   │   ├── auth/
│       │   │   │   ├── GitHubAuthAdapter.ts
│       │   │   │   ├── FirebaseAuthAdapter.ts
│       │   │   │   └── index.ts
│       │   │   └── config.ts       # Configuration des adapters
│       │   │
│       │   ├── App.svelte
│       │   ├── main.ts
│       │   └── router.ts
│       │
│       ├── public/
│       │   ├── manifest.json       # PWA manifest
│       │   └── icons/
│       │
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── libs/
│   └── shared/                     # 🛠️ Utilitaires partagés
│       ├── markdown.ts             # Parser/formatter MD
│       ├── diff.ts                 # Génération de diffs
│       ├── date.ts                 # Utilitaires dates
│       ├── index.ts
│       └── package.json
│
├── docs/
│   ├── project.md                  # Documentation métier
│   ├── architecture.md             # Documentation technique
│   └── contributing.md             # Guidelines de contribution
│
├── pnpm-workspace.yaml
├── package.json                    # Root package.json
├── README.md
└── .gitignore


cook-data/                          # 📁 REPO DE DONNÉES (séparé)
├── recipes/
│   ├── risotto-champignons.md
│   └── ...
└── README.md
```

### Workspaces

- `apps/web` : Application principale
- `libs/shared` : Utilitaires partagés (markdown, diff, date)
- Futurs packages possibles : `apps/api`, `apps/extension`, `libs/core`

## Conventions de code

### Nommage des composants Svelte

Deux types de composants avec convention de nommage :

- **`[Component].controller.svelte`** : Composants stateful
  - Gèrent la logique et l'état
  - Peuvent importer des controllers ou des composants UI
  - Exemple : `RecipeEditor.controller.svelte`

- **`[Component].ui.svelte`** : Composants UI purs
  - Pas d'état interne (ou minimal)
  - Props uniquement
  - Ne peuvent importer que d'autres composants UI
  - Exemple : `Button.ui.svelte`, `RecipeCard.ui.svelte`

### Gestion de l'état

Règle de priorité :
1. **État interne par défaut** : utiliser `let` dans le composant
2. **Stores Svelte** : uniquement si :
   - Props drilling trop important (>2 niveaux)
   - Besoin de mutualisation entre composants non liés

### Flux de données

```
UI Component (app/)
    ↓
Service (core/services/)
    ↓
Adapter (infrastructure/)
    ↓
API externe (GitHub, Firebase)
```

Les composants UI ne communiquent **jamais** directement avec l'infrastructure.

## Format de données

### Structure d'une recette (Markdown)

```markdown
---
title: "Risotto champignons"
servings: 4
tags: [italien, végétarien, automne]
created: 2026-01-15
updated: 2026-02-10
---

# Ingrédients

## Base
- 300g riz arborio
- 1L bouillon légumes
- 100ml vin blanc

## Champignons
- 400g champignons mélangés
- 2 gousses ail

# Étapes

1. Faire revenir l'ail dans l'huile d'olive
2. Ajouter les champignons et cuire 5 min
3. ...

# Notes & Tips

- Version 2 (2026-02-10) : ajout crème fraîche pour onctuosité
- Astuce : toaster le riz avant de commencer

# Historique

- **2026-02-10** : Pour Sarah et Tom, un succès
- **2026-01-15** : Première version, un peu sec
```

### Métadonnées (frontmatter YAML)

- Structurées pour le parsing programmatique
- Permettent le tri, filtrage, recherche

### Contenu (Markdown)

- Lisible par un humain sans outil
- Portable sur n'importe quel éditeur/plateforme
- Versionnable via Git

## Authentification et sécurité

### GitHub OAuth
- Flow PKCE (sans serveur)
- Token stocké en localStorage
- Accès à un repo privé `cook-data`

### Firebase Auth
- Authentification Google
- Accès à Firebase AI Logic pour Gemini

### Clés API
- Fournies par l'utilisateur
- Stockées en localStorage
- Disclaimer de sécurité affiché

## Système de conversations IA

### Principe
- Chaque recette peut avoir plusieurs conversations
- Une conversation = un thread de discussion avec le LLM
- Contexte partagé : la recette elle-même + ses métadonnées

### Workflow de modification
1. Utilisateur discute avec l'IA
2. L'IA détecte une demande de création/modification
3. L'IA propose un diff (avant/après)
4. Utilisateur valide, refuse ou demande des ajustements
5. Si validé, la recette est mise à jour et commitée

### Stockage des conversations
- Format JSON en localStorage (ou dans le repo ?)
- Historique complet pour contexte
- Possibilité de reprise de conversation

## Migration vers un backend

Si besoin futur d'un backend :

1. Les services dans `core/services/` deviennent des appels HTTP
2. L'infrastructure côté backend implémente les mêmes interfaces
3. Le frontend (`app/`) ne change pas
4. Migration progressive possible (adapter par adapter)

## Performance

- Bundle minimal (Svelte compile en vanilla JS)
- Lazy loading des routes
- Cache des recettes en localStorage
- Sync GitHub uniquement sur modification

## Évolutions futures

- Service Worker pour mode offline complet
- Sync background avec GitHub
- Extension Web pour extraction de recettes
- Support de multiples repos de données
