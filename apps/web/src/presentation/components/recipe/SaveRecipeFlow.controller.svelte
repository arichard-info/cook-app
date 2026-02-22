<script lang="ts">
  import type { Recipe } from '$core/models/Recipe'
  import { getAuthService } from '$infrastructure/auth'
  import { getRecipeService } from '$infrastructure/storage'
  import PATInputModal from '$presentation/components/auth/PATInputModal.ui.svelte'

  interface Props {
    recipe: Recipe
    onSaved?: (id: string) => void
    onDismiss: () => void
  }

  let { recipe, onSaved, onDismiss }: Props = $props()

  let showAuthModal = $state(false)
  let isSaving = $state(false)
  let savedSuccess = $state(false)
  let errorMessage = $state<string | null>(null)

  const authService = getAuthService()

  const handleSave = async () => {
    errorMessage = null
    const user = authService?.getUser()

    if (!user) {
      showAuthModal = true
      return
    }

    await performSave(user.username)
  }

  const handleTokenSubmit = async (pat: string) => {
    if (!authService) throw new Error('Service d\'authentification non disponible.')
    await authService.setToken(pat)
    showAuthModal = false
    const user = authService.getUser()!
    await performSave(user.username)
  }

  const performSave = async (username: string) => {
    isSaving = true
    try {
      const recipeService = getRecipeService()
      if (!recipeService) throw new Error('Recipe service unavailable')
      const saved = await recipeService.save(recipe, username)
      savedSuccess = true
      onSaved?.(saved.metadata.id)
    } catch {
      errorMessage = 'La sauvegarde a échoué. Vérifie ta connexion et réessaie.'
    } finally {
      isSaving = false
    }
  }

  // Trigger save immediately on mount
  $effect(() => {
    handleSave()
  })
</script>

{#if showAuthModal}
  <PATInputModal
    onSubmit={handleTokenSubmit}
    onDismiss={onDismiss}
  />
{/if}

{#if isSaving && !showAuthModal}
  <div class="save-status">Sauvegarde en cours...</div>
{/if}

{#if savedSuccess}
  <div class="save-success">Recette sauvegardée !</div>
{/if}

{#if errorMessage && !showAuthModal}
  <div class="save-error">{errorMessage}</div>
{/if}

<style>
  .save-status,
  .save-success,
  .save-error {
    position: fixed;
    bottom: var(--spacing-2xl);
    left: 50%;
    transform: translateX(-50%);
    padding: var(--spacing-md) var(--spacing-xl);
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-sm);
    z-index: var(--z-modal, 100);
  }

  .save-status {
    background: var(--color-bg-secondary);
    border: var(--border-width-thin) solid var(--color-border-default);
  }

  .save-success {
    background: var(--color-black);
    color: var(--color-white);
  }

  .save-error {
    background: var(--color-error, #cc0000);
    color: var(--color-white);
  }
</style>
