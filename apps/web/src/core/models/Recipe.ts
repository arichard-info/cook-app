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

/**
 * Parse markdown recipe content into structured Recipe
 * @param markdown - Markdown content with YAML frontmatter
 * @returns Parsed recipe structure
 */
export const parseRecipe = (markdown: string): Recipe => {
  // TODO: Implement full YAML frontmatter + markdown parsing
  // For now, return a simple structure
  return {
    metadata: {
      title: 'Recipe',
      servings: 4
    },
    ingredients: [],
    steps: [],
    notes: []
  }
}
