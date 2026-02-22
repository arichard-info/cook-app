import { browser } from '$app/environment'
import { GitHubStorageAdapter } from './GitHubStorageAdapter'
import { getAuthService } from '$infrastructure/auth'
import type { IRecipeService } from '$core/services/RecipeService'

/**
 * Get a recipe service instance authenticated with the current user's token.
 * Not a singleton — always reads the latest token from the auth service.
 * Returns null if not authenticated or not in browser.
 */
export const getRecipeService = (): IRecipeService | null => {
  if (!browser) return null

  const user = getAuthService()?.getUser()
  if (!user) return null

  return new GitHubStorageAdapter(user.token, user.repoName)
}
