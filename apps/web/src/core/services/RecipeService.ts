import type { Recipe, SavedRecipe } from '$core/models/Recipe'

/**
 * Interface for recipe persistence service
 * Implementations: GitHubStorageAdapter
 */
export interface IRecipeService {
  /**
   * Save a new recipe or update an existing one
   * @param recipe - Recipe object (id/dates optional, will be generated if absent)
   * @param username - GitHub username for repo path
   * @returns The saved recipe with id, createdAt, updatedAt populated
   */
  save(recipe: Recipe, username: string): Promise<SavedRecipe>

  /**
   * List all saved recipes
   * @param username - GitHub username
   */
  list(username: string): Promise<SavedRecipe[]>

  /**
   * Fetch a single recipe by slug
   * @param slug - Recipe slug identifier
   * @param username - GitHub username
   */
  get(slug: string, username: string): Promise<SavedRecipe | null>

  /**
   * Delete a recipe by slug
   * @param slug - Recipe slug identifier
   * @param username - GitHub username
   */
  delete(slug: string, username: string): Promise<void>
}
