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

### State Management
1. **Default**: Internal component state (`let` in Svelte)
2. **Stores**: Only when necessary
   - Props drilling > 2 levels
   - Cross-component state sharing needed

### Imports
- Use path aliases:
  - `@/app/*` for frontend components
  - `@/core/*` for services and models
  - `@/infrastructure/*` for adapters
  - `@cook/shared` for shared utilities

## File Organization

### Directory Structure
```
apps/web/src/
├── app/          # Frontend (UI components, pages)
├── core/         # Services & models (business logic)
├── infrastructure/  # Adapters (GitHub, Firebase, etc.)
```

### Dependency Rules
- `app/` imports from `core/` only, never from `infrastructure/`
- `core/` defines interfaces, `infrastructure/` implements them
- No circular dependencies

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
