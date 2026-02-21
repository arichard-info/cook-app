# Cook

Journal technique de cuisine - Un carnet personnel pour historiser, classifier et faire évoluer vos recettes dans le temps.

## Documentation

- [Vision & Fonctionnalités](docs/project.md) - Description métier, cas d'usage, principes
- [Architecture technique](docs/architecture.md) - Stack, structure du projet, conventions
- [Contributing Guidelines](docs/contributing.md) - Guide de contribution et conventions de code

## Démarrage rapide

```bash
# Installation des dépendances
pnpm install

# Lancement en dev
pnpm dev
```

## Structure du projet

```
cook/
├── apps/web/          # Application Svelte (PWA)
├── libs/shared/       # Utilitaires partagés
└── docs/              # Documentation
```

## Technologie

- Frontend: Svelte + Vite
- Stockage: GitHub API
- IA: Firebase AI Logic (Gemini)
- Type: PWA (Progressive Web App)

## License

MIT
