import type { IngredientGroup, Recipe, SavedRecipe } from '$core/models/Recipe'
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
 * Parse a markdown recipe file into a SavedRecipe object
 * @param markdown - Full markdown content with YAML frontmatter
 * @param slug - Recipe slug identifier (used as id)
 */
export const parseMarkdownToRecipe = (markdown: string, slug: string): SavedRecipe => {
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/)
  const frontmatter = frontmatterMatch ? frontmatterMatch[1] : ''
  const body = frontmatterMatch ? markdown.slice(frontmatterMatch[0].length).trim() : markdown

  const getField = (key: string): string | undefined => {
    const match = frontmatter.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, 'm'))
    return match ? match[1].trim() : undefined
  }

  const tagsMatch = frontmatter.match(/^tags:\s*\[([^\]]*)\]/m)
  const tags = tagsMatch
    ? tagsMatch[1].split(',').map((t) => t.trim()).filter(Boolean)
    : []

  const servingsRaw = getField('servings')

  const metadata = {
    id: slug,
    title: getField('title') ?? slug,
    servings: servingsRaw ? parseInt(servingsRaw, 10) : undefined,
    tags,
    prepTime: getField('prepTime'),
    cookTime: getField('cookTime'),
    createdAt: getField('created') ?? new Date().toISOString().split('T')[0],
    updatedAt: getField('updated') ?? new Date().toISOString().split('T')[0],
  }

  const ingredients = parseIngredients(body)
  const steps = parseSteps(body)
  const notes = parseNotes(body)

  return { metadata, ingredients, steps, notes }
}

const parseIngredients = (body: string): IngredientGroup[] => {
  const section = body.match(/# Ingrédients\n([\s\S]*?)(?=\n# |$)/)
  if (!section) return []

  const content = section[1]
  const groups: IngredientGroup[] = []
  let currentGroup: IngredientGroup = { items: [] }

  for (const line of content.split('\n')) {
    if (line.startsWith('## ')) {
      if (currentGroup.items.length > 0) groups.push(currentGroup)
      currentGroup = { name: line.slice(3).trim(), items: [] }
    } else if (line.startsWith('- ')) {
      currentGroup.items.push(line.slice(2).trim())
    }
  }

  if (currentGroup.items.length > 0) groups.push(currentGroup)
  return groups
}

const parseSteps = (body: string): string[] => {
  const section = body.match(/# Étapes\n([\s\S]*?)(?=\n# |$)/)
  if (!section) return []

  return section[1]
    .split('\n')
    .filter((line) => /^\d+\. /.test(line))
    .map((line) => line.replace(/^\d+\. /, '').trim())
}

const parseNotes = (body: string): string[] => {
  const section = body.match(/# Notes & Tips\n([\s\S]*?)(?=\n# |$)/)
  if (!section) return []

  return section[1]
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
}
