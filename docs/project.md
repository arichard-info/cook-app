# Cook - Journal Technique de Cuisine

## Vision

Cook est un carnet personnel de cuisine, une sorte de journal de laboratoire culinaire permettant d'historiser, classifier et faire évoluer ses recettes dans le temps.

## Raison d'être

Le constat : en cuisine moderne, on utilise de plus en plus l'IA (ChatGPT, Gemini) pour générer des idées de recettes, les challenger, les faire évoluer. C'est très utile au moment de cuisiner, mais :
- On oublie ce qu'on a cuisiné
- C'est difficile d'historiser tout ça sur les apps de chatbot
- On n'a pas le sentiment d'avoir "sa" recette, qui évolue dans le temps

Cook résout ce problème en permettant de se sentir owner de ses recettes. Ce n'est pas juste une recette mise en favori, c'est "ma" recette. Avec ma touche, mes évolutions, mes idées.

## Principes fondamentaux

### Carnet personnel avant tout
- Pas de service tiers de scraping
- Pas de mode communautaire
- Pas d'optimisation de liste de courses / frigo
- Focus sur l'expérimentation et l'évolution personnelle

### Agnosticité de la donnée
- Les données produites et stockées sont complètement agnostiques de la solution
- Format markdown pour une portabilité maximale
- Visualisables sur d'autres plateformes sans problème
- Versioning via Git pour l'historique naturel

### Stateless et portable
- Application cliente uniquement (PWA)
- Pas de backend propriétaire
- Utilisation d'APIs tierces (GitHub, Firebase) en tant qu'infrastructure
- Architecture permettant de migrer facilement vers d'autres solutions

## Cas d'usage principaux

### 1. Saisie et évolution d'une recette existante
- Créer une recette qu'on a déjà concocté
- Indiquer les fois où on l'a cuisinée, et pour qui
- Ajouter des notes, des tips
- Faire évoluer la recette elle-même (nouvelles techniques, variantes, nouveaux ingrédients)
- Visualiser le changelog des évolutions

### 2. Co-construction d'une recette avec l'IA
- Exprimer un besoin ou une envie en mode conversationnel
- Discuter avec un LLM pour affiner l'idée
- Valider une recette formatée (ingrédients, étapes, cuisson, tips)
- Sauvegarder comme base pour une nouvelle recette
- Possibilité de discussions multiples par recette (comme les "conversations" de ChatGPT)
- L'IA propose les modifications en mode diff (comme Claude Code)
- L'utilisateur valide, refuse ou demande des ajustements

## Identité visuelle

Minimalisme brut et utilitaire :
- Pas de minimalisme "classe" à la Apple
- On va droit au but
- La richesse est dans la feature, pas dans la forme
- Design fonctionnel avant tout

## Structure d'une recette

- Titre
- Ingrédients (avec possibilité de groupes)
- Étapes de préparation
- Nombre de personnes / portions
- Tags / catégories
- Notes et tips
- Historique des réalisations (date, pour qui, notes)
- Changelog (évolutions dans le temps)

## MVP - Session de cuisine "live"

Le MVP se concentre sur l'expérience conversationnelle avec l'IA pour co-créer une recette :

### Fonctionnalité principale
Lancer une session de cuisine "live" où l'utilisateur :
- Questionne le LLM sur un besoin, une idée, une envie
- Échange de manière conversationnelle pour affiner le concept
- Le LLM détecte quand l'idée est mature (ou l'utilisateur décide)
- Le LLM formalise une recette structurée selon notre format
- La recette est affichée (pas encore sauvegardée dans le MVP)

### Objectif
Valider le flux conversationnel et la génération de recette formatée avant d'ajouter la persistance.

## Roadmap post-MVP

Voir [backlog.md](backlog.md) pour le détail des fonctionnalités par EPIC.
