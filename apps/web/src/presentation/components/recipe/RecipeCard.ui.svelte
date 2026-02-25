<script lang="ts">
  import type { Recipe } from '$core/models/Recipe'
  import { hasScalableQuantities } from '$core/utils/quantityScaler'
  import RecipeBody from './RecipeBody.ui.svelte'
  import ServingsStepper from './ServingsStepper.ui.svelte'

  interface Props {
    recipe: Recipe
    onSave?: () => void
    onModify?: () => void
    saveState?: 'idle' | 'saving' | 'saved' | 'error'
    savedId?: string
  }

  let { recipe, onSave, onModify, saveState = 'idle', savedId }: Props = $props()

  let selectedServings = $state(recipe.metadata.servings ?? 4)

  const baseServings = $derived(recipe.metadata.servings ?? 4)
  const scale = $derived(selectedServings / baseServings)
  const isScalable = $derived(
    recipe.metadata.scalable !== false &&
      hasScalableQuantities([
        ...recipe.ingredients.flatMap((g) => g.items),
        ...recipe.steps,
        ...(recipe.notes ?? []),
      ]),
  )
</script>

<div class="recipe-card">
  <header class="recipe-header">
    <h2>{recipe.metadata.title}</h2>
    {#if recipe.metadata.servings}
      {#if isScalable}
        <ServingsStepper bind:value={selectedServings} />
      {:else}
        <p class="servings">Pour {recipe.metadata.servings} personnes</p>
      {/if}
    {/if}
    {#if recipe.metadata.tags && recipe.metadata.tags.length > 0}
      <div class="tags">
        {#each recipe.metadata.tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}
  </header>

  <RecipeBody
    ingredients={recipe.ingredients}
    steps={recipe.steps}
    notes={recipe.notes}
    {scale}
    sectionTag="h3"
  />

  <footer class="recipe-actions">
    {#if onSave}
      {#if saveState === 'saved' && savedId}
        <button class="action-button primary saved" disabled>
          ✓ Enregistrée
        </button>
        <a href="/recipes/{savedId}" class="action-button secondary">
          Voir la recette →
        </a>
      {:else}
        <button
          class="action-button primary"
          class:saving={saveState === 'saving'}
          onclick={onSave}
          disabled={saveState === 'saving'}
        >
          {#if saveState === 'saving'}
            <span class="spinner"></span>
          {:else}
            Enregistrer la recette
          {/if}
        </button>
      {/if}
    {/if}
    {#if onModify}
      <button class="action-button secondary" onclick={onModify}>
        Modifier
      </button>
    {/if}
  </footer>
</div>

<style>
  .recipe-card {
    background: var(--color-bg-primary);
    border: 2px solid var(--color-border-default);
    border-radius: var(--radius-md);
    padding: var(--spacing-2xl);
    margin: var(--spacing-lg) 0;
  }

  .recipe-header {
    border-bottom: 2px solid var(--color-border-default);
    padding-bottom: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
  }

  .recipe-header h2 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    margin-bottom: var(--spacing-sm);
  }

  .servings {
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
  }

  .tags {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    margin-top: var(--spacing-sm);
  }

  .tag {
    background: var(--color-bg-secondary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
  }

  .recipe-actions {
    display: flex;
    gap: var(--spacing-md);
    border-top: 2px solid var(--color-border-default);
    padding-top: var(--spacing-lg);
    margin-top: var(--spacing-lg);
  }

  .action-button {
    padding: var(--spacing-md) var(--spacing-2xl);
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    border: 2px solid transparent;
    text-decoration: none;
    transition: all var(--transition-fast);
  }

  .action-button.primary {
    background: var(--color-interactive-default);
    color: var(--color-text-inverted);
    min-width: 13rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .action-button.primary:hover {
    background: var(--color-interactive-hover);
  }

  .action-button.secondary {
    background: transparent;
    color: var(--color-text-primary);
    border-color: var(--color-border-input);
  }

  .action-button.secondary:hover {
    background: var(--color-bg-secondary);
  }

  .action-button.saved {
    opacity: 0.6;
    cursor: default;
  }

  .action-button:disabled {
    cursor: not-allowed;
  }

  .action-button.saving {
    opacity: var(--opacity-loading);
  }

  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
