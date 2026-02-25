<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { getAuthService } from '$infrastructure/auth'
  import { getRecipeService } from '$infrastructure/storage'
  import type { SavedRecipe } from '$core/models/Recipe'
  import { hasScalableQuantities } from '$core/utils/quantityScaler'
  import RecipeBody from '$presentation/components/recipe/RecipeBody.ui.svelte'
  import ServingsStepper from '$presentation/components/recipe/ServingsStepper.ui.svelte'

  let recipe = $state<SavedRecipe | null>(null)
  let isLoading = $state(true)
  let error = $state<string | null>(null)
  let selectedServings = $state(0)

  const baseServings = $derived(recipe?.metadata.servings ?? 4)
  const scale = $derived(selectedServings > 0 ? selectedServings / baseServings : 1)
  const isScalable = $derived(
    recipe != null &&
      recipe.metadata.scalable !== false &&
      hasScalableQuantities([
        ...recipe.ingredients.flatMap((g) => g.items),
        ...recipe.steps,
        ...(recipe.notes ?? []),
      ]),
  )

  const authService = getAuthService()
  const id = $page.params.id

  onMount(async () => {
    await authService?.initialize()
    const user = authService?.getUser()
    if (!user) {
      error = 'Connecte-toi pour accéder à cette recette.'
      isLoading = false
      return
    }

    try {
      const recipeService = getRecipeService()
      if (!recipeService) throw new Error('Recipe service unavailable')
      recipe = await recipeService.get(id, user.username)
      if (recipe) selectedServings = recipe.metadata.servings ?? 4
      else error = 'Recette introuvable.'
    } catch {
      error = 'Impossible de charger la recette.'
    } finally {
      isLoading = false
    }
  })

  const handleDelete = async () => {
    if (!recipe) return
    if (!confirm(`Supprimer "${recipe.metadata.title}" ?`)) return

    const user = authService?.getUser()
    if (!user) return

    try {
      const recipeService = getRecipeService()
      await recipeService?.delete(id, user.username)
      goto('/recipes')
    } catch {
      alert('Impossible de supprimer la recette.')
    }
  }
</script>

<a href="/recipes" class="back-btn">← Mes recettes</a>

<div class="recipe-page">
  {#if isLoading}
    <p class="status-message">Chargement...</p>
  {:else if error}
    <p class="error-message">{error}</p>
  {:else if recipe}
    <header class="recipe-header">
      <h1>{recipe.metadata.title}</h1>
      <div class="recipe-meta">
        {#if recipe.metadata.servings}
          {#if isScalable}
            <ServingsStepper bind:value={selectedServings} />
          {:else}
            <span class="meta-item">Pour {recipe.metadata.servings} personnes</span>
          {/if}
        {/if}
        {#if recipe.metadata.totalTime}
          <span class="meta-item">{recipe.metadata.totalTime}</span>
        {:else}
          {#if recipe.metadata.prepTime}
            <span class="meta-item">Prep : {recipe.metadata.prepTime}</span>
          {/if}
          {#if recipe.metadata.cookTime}
            <span class="meta-item">Cuisson : {recipe.metadata.cookTime}</span>
          {/if}
        {/if}
        {#if recipe.metadata.createdAt}
          <span class="meta-item meta-date">{recipe.metadata.createdAt}</span>
        {/if}
      </div>
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
    />

    <footer class="recipe-footer">
      <button class="delete-btn" onclick={handleDelete}>Supprimer la recette</button>
    </footer>
  {/if}
</div>

<style>
  .back-btn {
    position: fixed;
    top: var(--spacing-md);
    left: var(--spacing-md);
    z-index: var(--z-elevated);
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--radius-lg);
    text-decoration: none;
    font-size: var(--font-size-sm);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    transition: box-shadow var(--transition-fast);
  }

  .back-btn:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }

  .recipe-page {
    max-width: var(--container-sm);
    margin: 0 auto;
    padding: var(--spacing-lg);
    padding-top: calc(var(--spacing-lg) * 3);
  }

  .recipe-header {
    border-bottom: 2px solid var(--color-border-default);
    padding-bottom: var(--spacing-lg);
    margin-bottom: var(--spacing-2xl);
  }

  .recipe-header h1 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    margin-bottom: var(--spacing-sm);
  }

  .recipe-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-sm);
    align-items: center;
  }

  .meta-item {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .meta-date {
    margin-left: auto;
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
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
  }

  .recipe-footer {
    border-top: 1px solid var(--color-border-default);
    padding-top: var(--spacing-lg);
    margin-top: var(--spacing-2xl);
  }

  .delete-btn {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
  }

  .delete-btn:hover {
    color: #cc0000;
  }

  .status-message {
    color: var(--color-text-secondary);
    text-align: center;
    padding: var(--spacing-2xl);
  }

  .error-message {
    color: var(--color-error, #cc0000);
    text-align: center;
    padding: var(--spacing-2xl);
  }
</style>
