<script lang="ts">
  import type { Recipe } from '$core/models/Recipe'
  import { getAuthService } from '$infrastructure/auth'
  import { getRecipeService } from '$infrastructure/storage'
  import PATInputModal from '$presentation/components/auth/PATInputModal.ui.svelte'

  interface Props {
    recipe: Recipe
    onSaved?: (id: string) => void
    onError?: () => void
    onDismiss: () => void
  }

  let { recipe, onSaved, onError, onDismiss }: Props = $props()

  let showAuthModal = $state(false)

  const authService = getAuthService()

  const handleSave = async () => {
    const user = authService?.getUser()

    if (!user) {
      showAuthModal = true
      return
    }

    await performSave(user.username)
  }

  const handleTokenSubmit = async (pat: string, repoName: string) => {
    if (!authService) throw new Error('Service d\'authentification non disponible.')
    await authService.setToken(pat, repoName)
    showAuthModal = false
    const user = authService.getUser()!
    await performSave(user.username)
  }

  const performSave = async (username: string) => {
    try {
      const recipeService = getRecipeService()
      if (!recipeService) throw new Error('Recipe service unavailable')
      const saved = await recipeService.save(recipe, username)
      onSaved?.(saved.metadata.id)
    } catch {
      onError?.()
    }
  }

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
