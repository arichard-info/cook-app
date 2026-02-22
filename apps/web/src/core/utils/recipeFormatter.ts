import type { SavedRecipe } from '$core/models/Recipe'

/**
 * Format a SavedRecipe object into the markdown file format used in cook-data
 * @param recipe - Saved recipe with id, createdAt, updatedAt present
 * @returns Full markdown string ready to write to GitHub
 */
export const formatRecipeToMarkdown = (recipe: SavedRecipe): string => {
  const { title, servings, tags, prepTime, cookTime, createdAt, updatedAt } = recipe.metadata
  const tagsYaml = tags && tags.length > 0 ? `[${tags.join(', ')}]` : '[]'

  const frontmatterLines = [
    '---',
    `title: "${title}"`,
    servings !== undefined ? `servings: ${servings}` : null,
    `tags: ${tagsYaml}`,
    prepTime ? `prepTime: "${prepTime}"` : null,
    cookTime ? `cookTime: "${cookTime}"` : null,
    `created: ${createdAt}`,
    `updated: ${updatedAt}`,
    '---',
  ].filter((line): line is string => line !== null)

  const ingredientsLines = ['# Ingrédients', '']
  for (const group of recipe.ingredients) {
    if (group.name) {
      ingredientsLines.push(`## ${group.name}`)
    }
    for (const item of group.items) {
      ingredientsLines.push(`- ${item}`)
    }
    ingredientsLines.push('')
  }

  const stepsLines = ['# Étapes', '']
  recipe.steps.forEach((step, i) => {
    stepsLines.push(`${i + 1}. ${step}`)
  })
  stepsLines.push('')

  const sections = [
    frontmatterLines.join('\n'),
    ingredientsLines.join('\n'),
    stepsLines.join('\n'),
  ]

  if (recipe.notes && recipe.notes.length > 0) {
    const notesLines = ['# Notes & Tips', '']
    for (const note of recipe.notes) {
      notesLines.push(`- ${note}`)
    }
    sections.push(notesLines.join('\n'))
  }

  return sections.join('\n')
}
