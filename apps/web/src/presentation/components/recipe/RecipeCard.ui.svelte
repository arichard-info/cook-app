<script lang="ts">
  import type { Recipe } from '$core/models/Recipe'

  interface Props {
    recipe: Recipe
    onSave?: () => void
    onModify?: () => void
    saveState?: 'idle' | 'saving' | 'saved' | 'error'
    savedId?: string
  }

  let { recipe, onSave, onModify, saveState = 'idle', savedId }: Props = $props()
</script>

<div class="recipe-card">
  <header class="recipe-header">
    <h2>{recipe.metadata.title}</h2>
    {#if recipe.metadata.servings}
      <p class="servings">Pour {recipe.metadata.servings} personnes</p>
    {/if}
    {#if recipe.metadata.tags && recipe.metadata.tags.length > 0}
      <div class="tags">
        {#each recipe.metadata.tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}
  </header>

  <section class="recipe-section">
    <h3>Ingrédients</h3>
    {#each recipe.ingredients as group}
      {#if group.name}
        <h4>{group.name}</h4>
      {/if}
      <ul>
        {#each group.items as item}
          <li>{item}</li>
        {/each}
      </ul>
    {/each}
  </section>

  <section class="recipe-section">
    <h3>Étapes</h3>
    <ol class="steps">
      {#each recipe.steps as step, index}
        <li>
          <span class="step-number">{index + 1}</span>
          <span class="step-content">{step}</span>
        </li>
      {/each}
    </ol>
  </section>

  {#if recipe.notes && recipe.notes.length > 0}
    <section class="recipe-section">
      <h3>Notes & Tips</h3>
      <ul>
        {#each recipe.notes as note}
          <li>{note}</li>
        {/each}
      </ul>
    </section>
  {/if}

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

  .recipe-section {
    margin-bottom: var(--spacing-2xl);
  }

  .recipe-section h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    margin-bottom: var(--spacing-md);
  }

  .recipe-section h4 {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    margin: var(--spacing-md) 0 var(--spacing-sm) 0;
  }

  .recipe-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .recipe-section ul li {
    padding: var(--spacing-xs) 0;
    padding-left: var(--spacing-lg);
    position: relative;
  }

  .recipe-section ul li::before {
    content: '•';
    position: absolute;
    left: 0;
    font-weight: var(--font-weight-bold);
  }

  .steps {
    list-style: none;
    padding: 0;
    margin: 0;
    counter-reset: step-counter;
  }

  .steps li {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .step-number {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    background: var(--color-interactive-default);
    color: var(--color-text-inverted);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-sm);
  }

  .step-content {
    flex: 1;
    line-height: var(--line-height-tight);
    padding-top: var(--spacing-xs);
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
