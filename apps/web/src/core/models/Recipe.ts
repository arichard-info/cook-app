/**
 * Recipe metadata from YAML frontmatter
 */
export interface RecipeMetadata {
  title: string
  servings?: number
  tags?: string[]
  prepTime?: string
  cookTime?: string
  totalTime?: string
  /** Slug-based identifier, absent before first save */
  id?: string
  /** ISO date string YYYY-MM-DD */
  createdAt?: string
  /** ISO date string YYYY-MM-DD */
  updatedAt?: string
}

/**
 * A recipe that has been persisted to storage — id and dates are guaranteed
 */
export interface SavedRecipe extends Recipe {
  metadata: RecipeMetadata & {
    id: string
    createdAt: string
    updatedAt: string
  }
}

/**
 * Ingredient group for organizing ingredients
 */
export interface IngredientGroup {
  name?: string
  items: string[]
}

/**
 * Recipe structure
 */
export interface Recipe {
  metadata: RecipeMetadata
  ingredients: IngredientGroup[]
  steps: string[]
  notes?: string[]
}
