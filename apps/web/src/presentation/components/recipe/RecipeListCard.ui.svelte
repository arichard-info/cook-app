<script lang="ts">
  import type { SavedRecipe } from '$core/models/Recipe'

  interface Props {
    recipe: SavedRecipe
    href: string
    onDelete?: () => void
  }

  let { recipe, href, onDelete }: Props = $props()
</script>

<article class="recipe-card">
  <a {href} class="card-link">
    <h3 class="card-title">{recipe.metadata.title}</h3>
    {#if recipe.metadata.tags && recipe.metadata.tags.length > 0}
      <div class="tags">
        {#each recipe.metadata.tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}
    <p class="card-date">{recipe.metadata.createdAt}</p>
  </a>
  {#if onDelete}
    <button class="delete-btn" onclick={onDelete} aria-label="Supprimer la recette">×</button>
  {/if}
</article>

<style>
  .recipe-card {
    border: var(--border-width-thin) solid var(--color-border-default);
    padding: var(--spacing-lg);
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .card-link {
    flex: 1;
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .card-link:hover .card-title {
    text-decoration: underline;
  }

  .card-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    margin-bottom: var(--spacing-sm);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-sm);
  }

  .tag {
    font-size: var(--font-size-xs);
    background: var(--color-bg-secondary);
    padding: var(--spacing-xs) var(--spacing-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .card-date {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .delete-btn {
    background: none;
    border: none;
    font-size: var(--font-size-xl);
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: var(--spacing-xs);
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .delete-btn:hover {
    color: var(--color-text-primary);
  }
</style>
