# Contributing Guidelines

## Language & Type System

- Use **TypeScript** exclusively, not JavaScript
- Prefer `.ts` extension for all source files
- Svelte components use `.svelte` with TypeScript in `<script lang="ts">`

## Code Style

### Functions
- Use **arrow functions** exclusively: `const myFunc = () => {}`
- Never use `function` keyword

### Comments
- **No comments** unless truly necessary for complex logic
- **TODO comments are allowed** and encouraged for incomplete work
- Example: `// TODO: Implement YAML frontmatter parsing`

### Documentation
- **JSDoc is required** for all exported functions, classes, and types
- Include parameter types, return types, and descriptions
- Example:
  ```typescript
  /**
   * Parse a markdown recipe file with YAML frontmatter
   * @param content - Raw markdown content
   * @returns Parsed recipe with metadata and content
   */
  export const parseRecipe = (content: string): ParsedRecipe => {
    // ...
  }
  ```

## Architecture Conventions

### Component Naming (Svelte)
- `[Component].controller.svelte` - Stateful components with logic
  - Can import controllers or UI components
- `[Component].ui.svelte` - Pure UI components
  - Props-driven, minimal internal state
  - Can only import other UI components

### State Management (Svelte 5 Runes)

**Reactive State:**
- Use `$state()` for reactive local state
- Use `$derived()` for computed/derived values
- Use `$effect()` for side effects

**Props:**
- Use `$props()` with TypeScript interface for component props
- Use `$bindable()` for two-way binding
- Example:
  ```typescript
  interface Props {
    value: string
    count?: number
    onUpdate: (value: string) => void
  }

  let { value = $bindable(), count = 0, onUpdate }: Props = $props()
  ```

**State Patterns:**
1. **Default**: Component-local state with `$state()`
2. **Stores**: Only when necessary
   - Props drilling > 2 levels
   - Cross-component state sharing needed
   - Use Svelte 5 `$state()` in `.svelte.ts` files for shared state

### Imports
- Use path aliases:
  - `$presentation/*` for UI components and pages
  - `$core/*` for services and models
  - `$infrastructure/*` for adapters
  - `$shared/*` for shared utilities

## File Organization

### Directory Structure
```
apps/web/src/
├── presentation/     # Frontend (UI components, pages)
│   ├── components/   # Reusable components
│   └── styles/       # Global CSS and design tokens
├── core/            # Services & models (business logic)
├── infrastructure/  # Adapters (Firebase, etc.)
└── routes/          # SvelteKit routes
```

### Dependency Rules
- `presentation/` imports from `core/` only, never from `infrastructure/`
- `core/` defines interfaces, `infrastructure/` implements them
- No circular dependencies

### Design Tokens
- Use CSS custom properties defined in `presentation/styles/tokens.css`
- Never use magic values (colors, spacing, etc.) directly in components
- Always use `var(--token-name)` for consistent design system

## TypeScript Specific

- Enable strict mode
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, primitives, and utility types
- Avoid `any`, use `unknown` when type is truly unknown

## Best Practices

- Keep functions small and focused
- Prefer composition over inheritance
- Use descriptive variable names
- No magic numbers - use named constants
- Handle errors explicitly, avoid silent failures

## Testing (future)

- Test files: `*.test.ts` or `*.spec.ts`
- Unit tests for `core/` and `libs/`
- Component tests for `app/`
