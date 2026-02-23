# Backlog - Cook

## MVP : Session de cuisine "live"

### EPIC 1 : Conversation avec LLM ✅
**Objectif** : Permettre à l'utilisateur de discuter avec un LLM pour co-créer une idée de recette

#### User Stories

- **US-1.1** ✅ : En tant qu'utilisateur, je veux lancer une nouvelle session de cuisine pour commencer à discuter d'une idée de recette
  - Critères d'acceptation :
    - Un bouton/lien permet de démarrer une nouvelle session
    - L'interface de chat s'affiche
    - Le LLM se présente et invite à exprimer une idée

- **US-1.2** ✅ : En tant qu'utilisateur, je veux envoyer des messages au LLM pour échanger sur mon idée
  - Critères d'acceptation :
    - Champ de saisie de message
    - Envoi du message (bouton ou Enter)
    - Le message s'affiche dans la conversation
    - Le LLM répond de manière contextuelle

- **US-1.3** ✅ : En tant qu'utilisateur, je veux voir l'historique de la conversation pour suivre l'évolution de mon idée
  - Critères d'acceptation :
    - Les messages sont affichés chronologiquement
    - Distinction visuelle entre mes messages et ceux du LLM
    - Scroll automatique vers le dernier message

### EPIC 2 : Génération de recette formatée ✅
**Objectif** : Le LLM peut formaliser la conversation en une recette structurée

#### User Stories

- **US-2.1** ✅ : En tant qu'utilisateur, je veux demander au LLM de formaliser notre discussion en recette
  - Critères d'acceptation :
    - Possibilité de demander la formalisation explicitement
    - Le LLM peut aussi proposer la formalisation quand l'idée semble mature
    - Message de confirmation avant génération

- **US-2.2** ✅ : En tant qu'utilisateur, je veux visualiser la recette générée dans un format structuré
  - Critères d'acceptation :
    - La recette s'affiche avec : titre, ingrédients, étapes, tips
    - Format lisible et organisé
    - Séparation claire entre la conversation et la recette générée

- **US-2.3** : En tant qu'utilisateur, je veux que la recette respecte notre format markdown
  - Critères d'acceptation :
    - Frontmatter YAML avec métadonnées (titre, portions, tags)
    - Sections markdown : Ingrédients, Étapes, Notes & Tips
    - Groupes d'ingrédients si pertinent
    - Format exportable/copiable

---

## Post-MVP : Fonctionnalités principales

### EPIC 3 : Persistance des recettes
**Objectif** : Sauvegarder et gérer les recettes générées

**Note technique** : Stockage sur GitHub (repo privé `cook-data`), format markdown avec frontmatter YAML. Voir `architecture.md`.

#### User Stories

- **US-3.1** ✅ : En tant qu'utilisateur, je veux sauvegarder une recette générée pour la retrouver plus tard
  - Critères d'acceptation :
    - Bouton "Sauvegarder" sur une recette générée
    - La recette est commitée sur GitHub (repo `cook-data`)
    - Confirmation visuelle de la sauvegarde
    - Génération d'un ID unique pour la recette

- **US-3.2** ✅ : En tant qu'utilisateur, je veux lister toutes mes recettes sauvegardées
  - Critères d'acceptation :
    - Page/vue dédiée au listing des recettes
    - Affichage des recettes sous forme de cards
    - Informations visibles : titre, tags, date de création
    - Accès rapide à chaque recette

- **US-3.3** ✅ : En tant qu'utilisateur, je veux consulter une recette sauvegardée
  - Critères d'acceptation :
    - Vue détaillée de la recette
    - Affichage de tous les champs (ingrédients, étapes, notes, métadonnées)
    - Navigation retour vers le listing

- **US-3.4** ✅ : En tant qu'utilisateur, je veux supprimer une recette
  - Critères d'acceptation :
    - Action de suppression disponible
    - Confirmation avant suppression
    - Retrait de la liste après suppression

### EPIC 4 : Édition manuelle de recettes
**Objectif** : Pouvoir modifier une recette sauvegardée sans passer par le LLM

#### User Stories

- **US-4.1** : En tant qu'utilisateur, je veux modifier le titre et les métadonnées d'une recette
  - Critères d'acceptation :
    - Mode édition activable sur une recette
    - Champs éditables : titre, portions, tags
    - Sauvegarde des modifications
    - Annulation possible

- **US-4.2** : En tant qu'utilisateur, je veux modifier les ingrédients d'une recette
  - Critères d'acceptation :
    - Édition des ingrédients (ajout, modification, suppression)
    - Gestion des groupes d'ingrédients
    - Sauvegarde des modifications

- **US-4.3** : En tant qu'utilisateur, je veux modifier les étapes de préparation
  - Critères d'acceptation :
    - Édition des étapes (ajout, modification, suppression, réordonnancement)
    - Numérotation automatique
    - Sauvegarde des modifications

- **US-4.4** : En tant qu'utilisateur, je veux ajouter ou modifier des notes et tips
  - Critères d'acceptation :
    - Section notes/tips éditable
    - Format libre
    - Sauvegarde des modifications

### EPIC 5 : Commentaires et notes sur recettes
**Objectif** : Enrichir une recette avec des retours d'expérience

#### User Stories

- **US-5.1** : En tant qu'utilisateur, je veux ajouter une note de réalisation sur une recette
  - Critères d'acceptation :
    - Formulaire pour ajouter une note de réalisation
    - Champs : date, pour qui, commentaires
    - Ajout à l'historique de la recette
    - Affichage chronologique des réalisations

- **US-5.2** : En tant qu'utilisateur, je veux consulter l'historique de mes réalisations d'une recette
  - Critères d'acceptation :
    - Section dédiée dans la vue recette
    - Liste des réalisations avec dates et notes
    - Possibilité de modifier/supprimer une réalisation

### EPIC 6 : Recherche et filtrage
**Objectif** : Retrouver facilement une recette parmi sa collection

#### User Stories

- **US-6.1** : En tant qu'utilisateur, je veux rechercher une recette par titre
  - Critères d'acceptation :
    - Champ de recherche textuelle
    - Résultats en temps réel
    - Mise en évidence des termes recherchés

- **US-6.2** : En tant qu'utilisateur, je veux filtrer les recettes par tags
  - Critères d'acceptation :
    - Liste des tags disponibles
    - Sélection multiple de tags
    - Filtrage des résultats

- **US-6.3** : En tant qu'utilisateur, je veux rechercher par ingrédient
  - Critères d'acceptation :
    - Recherche dans les listes d'ingrédients
    - Affichage des recettes contenant l'ingrédient
    - Possibilité de combiner avec d'autres filtres

### EPIC 7 : Threads de conversation sur recette
**Objectif** : Pouvoir discuter avec le LLM à propos d'une recette existante

**Note** : La persistance et le listing des conversations sont traités dans l'EPIC 9.

#### User Stories

- **US-7.1** : En tant qu'utilisateur, je veux démarrer une conversation sur une recette existante
  - Critères d'acceptation :
    - Action "Discuter" disponible sur une recette
    - Nouvelle conversation liée à cette recette
    - Le LLM a le contexte de la recette

- **US-7.2** : En tant qu'utilisateur, je veux poser des questions sur une recette au LLM
  - Critères d'acceptation :
    - Interface de chat contextuelle
    - Le LLM répond en tenant compte de la recette
    - Questions types : substitutions, techniques, timing, etc.

### EPIC 8 : Modification de recette assistée par LLM
**Objectif** : Le LLM peut proposer des modifications à une recette existante

#### User Stories

- **US-8.1** : En tant qu'utilisateur, je veux que le LLM me propose des modifications sur ma recette
  - Critères d'acceptation :
    - Lors d'une conversation, le LLM peut suggérer des modifications
    - Les modifications sont présentées en mode diff (avant/après)
    - Distinction visuelle des ajouts/suppressions/modifications

- **US-8.2** : En tant qu'utilisateur, je veux approuver une modification suggérée par le LLM
  - Critères d'acceptation :
    - Boutons "Approuver", "Refuser", "Ajuster"
    - Si approuvé : la recette est mise à jour
    - Si refusé : retour à la conversation
    - Si ajusté : possibilité de demander des changements

- **US-8.3** : En tant qu'utilisateur, je veux demander des ajustements sur une modification proposée
  - Critères d'acceptation :
    - Formulaire de feedback sur la modification
    - Le LLM repropose une version ajustée
    - Cycle itératif jusqu'à validation

### EPIC 9 : Persistance et reprise des conversations AI
**Objectif** : Sauvegarder les conversations AI de manière cross-device et permettre de les reprendre

**Note technique** : Stockage via Firestore (déjà dans le projet pour Firebase AI Logic). Les recettes vont sur GitHub ; les threads AI ont leur place sur Firestore (données structurées, éphémères/utilitaires, sync temps réel).

Structure Firestore envisagée :
```
users/{userId}/conversations/{conversationId}
  - type: 'newChat' | 'recipeEdit' | ...
  - title (généré ou saisi)
  - recipeId (optionnel, si lié à une recette)
  - createdAt / updatedAt
  messages/ (subcollection)
    - role, contents, timestamp
```

#### User Stories

- **US-9.1** : En tant qu'utilisateur, je veux que ma conversation en cours soit sauvegardée automatiquement
  - Critères d'acceptation :
    - Chaque message est persisté en Firestore après envoi
    - Si je ferme et rouvre l'app, je retrouve ma conversation
    - Fonctionne sur tous mes appareils (cross-device)

- **US-9.2** : En tant qu'utilisateur, je veux voir la liste de mes conversations passées pour les reprendre
  - Critères d'acceptation :
    - Page ou panneau listant les conversations
    - Informations visibles : date, type, premier message ou titre
    - Action "Reprendre" qui recharge la conversation complète

- **US-9.3** : En tant qu'utilisateur, je veux reprendre une conversation là où je l'avais laissée
  - Critères d'acceptation :
    - L'historique complet est rechargé
    - Je peux continuer à discuter avec le LLM comme si je n'avais pas quitté
    - La recette éventuelle déjà générée est réaffichée

- **US-9.4** : En tant qu'utilisateur, je veux voir les conversations liées à une recette depuis la fiche recette
  - Critères d'acceptation :
    - Section "Conversations" dans la vue recette
    - Liste des threads liés (date, extrait du premier message)
    - Accès direct à chaque conversation

---

## Fonctionnalités avancées (Futures)

### EPIC 10 : Historique et versioning de recettes
**Objectif** : Tracer l'évolution d'une recette dans le temps

#### User Stories

- **US-10.1** : En tant qu'utilisateur, je veux voir l'historique de toutes les modifications d'une recette
  - Critères d'acceptation :
    - Timeline des versions
    - Affichage de la date et nature du changement
    - Comparaison entre versions (diff)

- **US-10.2** : En tant qu'utilisateur, je veux revenir à une version antérieure d'une recette
  - Critères d'acceptation :
    - Action "Restaurer cette version"
    - Confirmation avant restauration
    - Création d'une nouvelle version (pas d'écrasement)

- **US-10.3** : En tant qu'utilisateur, je veux visualiser l'évolution d'une recette sous forme de changelog
  - Critères d'acceptation :
    - Vue synthétique des changements
    - Format lisible et chronologique
    - Export possible du changelog

### EPIC 11 : Session de cuisine guidée
**Objectif** : Mode "pas à pas" pour suivre une recette pendant la cuisine

#### User Stories

- **US-11.1** : En tant qu'utilisateur, je veux lancer une session de cuisine pour suivre une recette
  - Critères d'acceptation :
    - Mode plein écran/focus
    - Navigation étape par étape
    - Timer intégré si nécessaire

- **US-11.2** : En tant qu'utilisateur, je veux naviguer facilement entre les étapes
  - Critères d'acceptation :
    - Boutons Précédent/Suivant
    - Affichage de l'étape courante en gros
    - Indicateur de progression

- **US-11.3** : En tant qu'utilisateur, je veux voir les ingrédients nécessaires pour chaque étape
  - Critères d'acceptation :
    - Affichage contextuel des ingrédients
    - Possibilité de cocher les ingrédients utilisés

### EPIC 12 : Annotations contextuelles
**Objectif** : Pouvoir commenter des parties spécifiques d'une recette

#### User Stories

- **US-12.1** : En tant qu'utilisateur, je veux sélectionner un texte dans une recette pour y ajouter un commentaire
  - Critères d'acceptation :
    - Sélection de texte activable
    - Action "Ajouter un commentaire"
    - Le commentaire est lié à cette portion de texte

- **US-12.2** : En tant qu'utilisateur, je veux voir les commentaires directement dans le contexte de la recette
  - Critères d'acceptation :
    - Indicateur visuel sur les portions commentées
    - Affichage au survol ou au clic
    - Possibilité d'éditer/supprimer

### EPIC 13 : Variantes de recettes
**Objectif** : Gérer plusieurs variantes d'une même recette de base

#### User Stories

- **US-13.1** : En tant qu'utilisateur, je veux créer une variante d'une recette existante
  - Critères d'acceptation :
    - Action "Créer une variante"
    - Copie de la recette de base
    - Lien maintenu avec la recette originale

- **US-13.2** : En tant qu'utilisateur, je veux voir toutes les variantes d'une recette
  - Critères d'acceptation :
    - Section "Variantes" dans la vue recette
    - Liste des variantes avec leurs différences principales
    - Navigation entre variantes

- **US-13.3** : En tant qu'utilisateur, je veux comparer deux variantes d'une recette
  - Critères d'acceptation :
    - Vue côte à côte ou diff
    - Mise en évidence des différences
    - Possibilité de fusionner des éléments

---

## Bugfix

- **BUG-2** ✅ : UX chat — feedback visuel pendant l'attente de réponse LLM
  - ✅ Message user grisé + animation `pending-pulse` tant que le premier chunk n'est pas reçu (`isPending` state)
  - ✅ `TypingIndicator` (3 points animés) affiché côté assistant pendant la phase d'attente
  - ✅ Fix race condition auth dans `/recipes` : `await authService?.initialize()` avant `getUser()`

- **BUG-1** ✅ : UX sauvegarde recette — polish
  - ✅ `min-width: 13rem` sur le bouton primary pour éviter le layout shift entre les états
  - ✅ `text-decoration: none` sur `.action-button`
  - ✅ Toast centralisé via Svelte store (`presentation/stores/toast.ts`) + `ToastManager.ui.svelte` monté dans le layout — indépendant de toute hiérarchie de composant

---

## Backlog technique

### Infrastructure

- **TECH-1** ✅ : Intégration Firebase AI Logic (Gemini)
- **TECH-2** : Configuration GitHub OAuth pour stockage recettes
- **TECH-3** : Implémentation du formatter Markdown (recette → `.md` pour GitHub)
- **TECH-4** ✅ : Système de routing (SvelteKit)
- **TECH-5** : PWA configuration (manifest, service worker)
- **TECH-10** : Intégration Firestore pour la persistance des conversations

### Architecture

- **TECH-6** : Mise en place des adapters de stockage (GitHub pour recettes, Firestore pour conversations)
- **TECH-7** ✅ : Abstraction LLM service (`ILLMService` + `FirebaseGeminiAdapter`)
- **TECH-8** ✅ : Modèle de données Recipe TypeScript
- **TECH-9** : Modèle de données Conversation TypeScript (type `Message` défini, modèle `Conversation` à compléter)
