<script lang="ts">
  import { onMount } from 'svelte'
  import { getAuthService } from '$infrastructure/auth'
  import { getRecipeService } from '$infrastructure/storage'
  import type { SavedRecipe } from '$core/models/Recipe'
  import RecipeListCard from '$presentation/components/recipe/RecipeListCard.ui.svelte'

  let recipes = $state<SavedRecipe[]>([])
  let isLoading = $state(true)
  let isAuthenticated = $state(false)
  let error = $state<string | null>(null)

  const authService = getAuthService()

  onMount(async () => {
    await authService?.initialize()
    const user = authService?.getUser()
    if (!user) {
      isAuthenticated = false
      isLoading = false
      return
    }

    isAuthenticated = true
    try {
      const recipeService = getRecipeService()
      if (!recipeService) throw new Error('Recipe service unavailable')
      recipes = await recipeService.list(user.username)
    } catch {
      error = 'Impossible de charger les recettes.'
    } finally {
      isLoading = false
    }
  })

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Supprimer "${title}" ?`)) return

    const user = authService?.getUser()
    if (!user) return

    try {
      const recipeService = getRecipeService()
      await recipeService?.delete(slug, user.username)
      recipes = recipes.filter((r) => r.metadata.id !== slug)
    } catch {
      alert('Impossible de supprimer la recette.')
    }
  }
</script>

<div class="recipes-page">
  {#if isLoading}
    <p class="status-message">Chargement...</p>
  {:else if !isAuthenticated}
    <div class="empty-state">
      <p>Connecte-toi à GitHub pour accéder à tes recettes.</p>
      <a href="/new-recipe" class="new-recipe-btn">Créer une recette</a>
    </div>
  {:else if error}
    <p class="error-message">{error}</p>
  {:else if recipes.length === 0}
    <div class="empty-state">
      <p>Aucune recette sauvegardée.</p>
      <a href="/new-recipe" class="new-recipe-btn">Créer ta première recette</a>
    </div>
  {:else}
    <div class="recipes-list">
      {#each recipes as recipe (recipe.metadata.id)}
        <RecipeListCard
          {recipe}
          href="/recipes/{recipe.metadata.id}"
          onDelete={() => handleDelete(recipe.metadata.id, recipe.metadata.title)}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .recipes-page {
    max-width: var(--container-sm);
    margin: 0 auto;
    padding: var(--spacing-lg);
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-2xl);
    border-bottom: var(--border-width-medium) solid var(--color-black);
    padding-bottom: var(--spacing-md);
  }

  .page-header h1 {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
  }

  .new-recipe-btn {
    background: var(--color-black);
    color: var(--color-white);
    padding: var(--spacing-sm) var(--spacing-lg);
    text-decoration: none;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }

  .recipes-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
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

  .empty-state {
    text-align: center;
    padding: var(--spacing-2xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .empty-state p {
    color: var(--color-text-secondary);
  }
</style>
