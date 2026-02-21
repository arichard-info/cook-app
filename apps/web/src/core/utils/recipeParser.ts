import type { Recipe } from '$core/models/Recipe'
import type { MessageContent } from '$core/services/LLMService'

/**
 * Parse stream content into ordered MessageContent array
 * @param streamContent - LLM stream content
 * @returns Array of MessageContent preserving order
 */
export const parseMessageContents = (streamContent: string): MessageContent[] => {
  const contents: MessageContent[] = []

  const startMarker = '<<<RECIPE_START>>>'
  const endMarker = '<<<RECIPE_END>>>'

  if (!streamContent.includes(startMarker) || !streamContent.includes(endMarker)) {
    // No recipe, just text
    return [{ type: 'text', content: streamContent.trim() }]
  }

  const startIndex = streamContent.indexOf(startMarker)
  const endIndex = streamContent.indexOf(endMarker) + endMarker.length

  // Text before
  const textBefore = streamContent.substring(0, startIndex).trim()
  if (textBefore) {
    contents.push({ type: 'text', content: textBefore })
  }

  // Recipe
  const recipeJson = streamContent.substring(
    startIndex + startMarker.length,
    endIndex - endMarker.length
  ).trim()

  try {
    // Validate JSON
    JSON.parse(recipeJson)
    contents.push({ type: 'recipe', content: recipeJson })
  } catch (error) {
    console.error('Invalid recipe JSON:', error)
  }

  // Text after
  const textAfter = streamContent.substring(endIndex).trim()
  if (textAfter) {
    contents.push({ type: 'text', content: textAfter })
  }

  return contents
}

/**
 * Extract recipe JSON from LLM response (DEPRECATED - use parseMessageContents)
 * @param content - LLM response content
 * @returns Parsed recipe and remaining text, or null if no recipe found
 */
export const extractRecipe = (content: string): { recipe: Recipe; text: string } | null => {
  const startMarker = '<<<RECIPE_START>>>'
  const endMarker = '<<<RECIPE_END>>>'

  const startIndex = content.indexOf(startMarker)
  const endIndex = content.indexOf(endMarker)

  if (startIndex === -1 || endIndex === -1) {
    return null
  }

  const jsonString = content.substring(startIndex + startMarker.length, endIndex).trim()
  const textBefore = content.substring(0, startIndex).trim()
  const textAfter = content.substring(endIndex + endMarker.length).trim()

  try {
    const recipe = JSON.parse(jsonString) as Recipe
    const text = [textBefore, textAfter].filter(Boolean).join('\n\n')
    return { recipe, text }
  } catch (error) {
    console.error('Failed to parse recipe JSON:', error)
    return null
  }
}
