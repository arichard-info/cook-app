import type { Recipe } from '$core/models/Recipe'
import { showToast } from '$presentation/stores/toast.svelte'

type SaveStatus = 'saving' | 'saved' | 'error'
export interface SaveStateEntry { status: SaveStatus; id?: string }

export const createSaveFlow = () => {
  let recipeStates = $state<Record<string, SaveStateEntry>>({})
  let savingRecipe = $state<{ recipe: Recipe; key: string } | null>(null)

  const handleSaveRecipe = (recipe: Recipe, key: string) => {
    recipeStates = { ...recipeStates, [key]: { status: 'saving' } }
    savingRecipe = { recipe, key }
  }

  const handleSaved = (id: string) => {
    if (!savingRecipe) return
    recipeStates = { ...recipeStates, [savingRecipe.key]: { status: 'saved', id } }
    showToast({
      type: 'success',
      message: '✓ Recette enregistrée',
      linkHref: `/recipes/${id}`,
      linkLabel: 'Voir la recette →',
    })
    savingRecipe = null
  }

  const handleSaveError = () => {
    if (!savingRecipe) return
    recipeStates = { ...recipeStates, [savingRecipe.key]: { status: 'error' } }
    showToast({ type: 'error', message: 'Impossible de sauvegarder la recette' })
    savingRecipe = null
  }

  const handleDismiss = () => {
    if (savingRecipe) {
      recipeStates = { ...recipeStates, [savingRecipe.key]: { status: 'error' } }
    }
    savingRecipe = null
  }

  return {
    get recipeStates() { return recipeStates },
    get savingRecipe() { return savingRecipe },
    handleSaveRecipe,
    handleSaved,
    handleSaveError,
    handleDismiss,
  }
}
