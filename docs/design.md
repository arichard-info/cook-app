# Design System - Cook

## Philosophie générale

### Objectif premier : Lisibilité maximale
L'application sera principalement utilisée sur téléphone, dans un environnement de cuisine, téléphone posé sur une table. La lisibilité immédiate est critique.

### Direction artistique
- **Minimalisme utilitaire** : ni minimalisme "Apple" élaboré, ni brutalisme design poussé
- **Fonctionnel avant tout** : la richesse est dans la feature, pas dans la forme
- **Palette propriétaire** : pas de design "Bootstrap" ou "Tailwind" générique

### Ce qu'on veut
- Aplats de couleur francs
- Polices noires et suffisamment grosses
- Peu d'arrondis, peu de shadows
- Délimitateurs simples (traits noirs basiques)
- Sophistication minimale mais présente

### Ce qu'on ne veut PAS
- Minimalisme élaboré à la Apple
- Brutalisme trop design/artistique
- Interfaces génériques type Bootstrap/Tailwind
- Effets visuels superflus

## Stack technique

### CSS
- **Pas de Tailwind** : on utilise les capacités natives de Svelte
- **Classes préfixées Svelte** pour le scoping
- Fichiers de styles communs pour tokens et utilitaires

## Ergonomie

### Mobile-first
- Focus principal sur l'expérience mobile
- Téléphone posé sur table dans un environnement de cuisine
- Contrôles positionnés **en bas de l'écran** pour faciliter l'accès

### Desktop
- Version desktop avec sidebar possible
- Moins de focus que le mobile pour le MVP

### Zones d'interaction
- Boutons et contrôles principaux en bas
- Navigation accessible au pouce
- Zones de touch suffisamment grandes

## Tokens

### Typographie

#### Famille de polices
- **Texte courant** : Roboto
- **Titres** : Roboto Bold ou Uppercase
- Fallback : system-ui, -apple-system, sans-serif

#### Échelle typographique
```css
--font-size-xs: 0.75rem;    /* 12px - petits labels */
--font-size-sm: 0.875rem;   /* 14px - texte secondaire */
--font-size-base: 1rem;     /* 16px - texte standard */
--font-size-lg: 1.125rem;   /* 18px - texte mis en avant */
--font-size-xl: 1.25rem;    /* 20px - sous-titres */
--font-size-2xl: 1.5rem;    /* 24px - titres secondaires */
--font-size-3xl: 2rem;      /* 32px - titres principaux */
--font-size-4xl: 2.5rem;    /* 40px - titres hero */
```

#### Graisses
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;
--font-weight-black: 900;
```

### Couleurs

#### Palette de base
```css
/* Neutre */
--color-black: #000000;
--color-white: #FFFFFF;
--color-gray-50: #FAFAFA;
--color-gray-100: #F5F5F5;
--color-gray-200: #E5E5E5;
--color-gray-300: #D4D4D4;
--color-gray-400: #A3A3A3;
--color-gray-500: #737373;
--color-gray-600: #525252;
--color-gray-700: #404040;
--color-gray-800: #262626;
--color-gray-900: #171717;
```

#### Couleurs d'accentuation (à définir selon les besoins)
```css
/* Primaire - pour les actions principales */
--color-primary: TBD;
--color-primary-hover: TBD;

/* Secondaire - pour les actions secondaires */
--color-secondary: TBD;

/* Succès / Erreur / Warning */
--color-success: TBD;
--color-error: TBD;
--color-warning: TBD;
```

### Spacing

#### Échelle d'espacement
```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
```

### Largeurs de conteneur

```css
--container-sm: 640px;   /* Mobile large */
--container-md: 768px;   /* Tablet */
--container-lg: 1024px;  /* Desktop */
--container-xl: 1280px;  /* Large desktop */

--container-reading: 65ch;  /* Largeur optimale de lecture */
```

### Rayons de bordure

Minimaliste - peu d'arrondis :
```css
--radius-none: 0;
--radius-sm: 2px;     /* Très subtil */
--radius-md: 4px;     /* Bordures standards */
--radius-lg: 8px;     /* Cartes / conteneurs */
--radius-full: 9999px; /* Badges, pills */
```

### Ombres

Minimaliste - peu de shadows :
```css
--shadow-none: none;
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
```

### Bordures

```css
--border-width-thin: 1px;
--border-width-medium: 2px;
--border-width-thick: 4px;

--border-color: var(--color-gray-300);
--border-color-dark: var(--color-black);
```

### Transitions

```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
```

## Classes utilitaires

### Layout
- `.container` : conteneur centré avec max-width
- `.stack` : empilage vertical avec espacement
- `.cluster` : disposition horizontale avec espacement
- `.grid-auto` : grille auto-responsive

### Texte
- `.text-{size}` : tailles de texte
- `.font-{weight}` : graisses
- `.uppercase` : texte en majuscules
- `.truncate` : texte tronqué avec ellipse

### Espacement
- `.p-{size}` : padding
- `.m-{size}` : margin
- `.gap-{size}` : gap pour flex/grid

### Couleurs
- `.bg-{color}` : couleur de fond
- `.text-{color}` : couleur de texte
- `.border-{color}` : couleur de bordure

## Composants de base

### Boutons
- Fond plein noir ou aplat de couleur
- Texte blanc et bold
- Peu ou pas d'arrondi (radius-sm ou radius-md)
- Hauteur minimum de 44px (zone de touch)
- Padding horizontal généreux

### Inputs
- Bordure noire simple
- Pas d'ombre
- Hauteur minimum 44px
- Font-size suffisant (au moins base, voire lg)
- Focus visible et net

### Cards
- Bordure noire ou fond gris clair
- Pas d'ombre ou ombre très légère
- Padding généreux
- Séparations par traits noirs

### Navigation mobile
- Barre fixe en bas de l'écran
- Icônes + labels
- Hauteur min 56px pour l'accessibilité
- Fond plein contrasté

## Organisation des fichiers

```
apps/web/src/
├── styles/
│   ├── tokens.css        # Variables CSS (couleurs, spacing, fonts, etc.)
│   ├── reset.css         # Reset CSS
│   ├── utilities.css     # Classes utilitaires
│   └── global.css        # Styles globaux
```

## Responsive

### Breakpoints
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

### Stratégie
1. **Mobile-first** : design et développement pour mobile en priorité
2. Progressive enhancement pour tablet et desktop
3. Contrôles en bas sur mobile, possibilité de sidebar sur desktop

## Accessibilité

- Contrastes respectant WCAG AA minimum
- Tailles de touch minimum 44x44px
- Focus visible sur tous les éléments interactifs
- Hiérarchie de titres respectée (h1, h2, h3...)
- Labels sur tous les inputs

## Évolution

Ce design system est un point de départ. Il évoluera au fil des besoins :
- Ajout de tokens si nécessaire
- Raffinement de la palette de couleurs
- Nouveaux composants selon les fonctionnalités
