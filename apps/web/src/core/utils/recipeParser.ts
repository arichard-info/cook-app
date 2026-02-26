import type { IngredientGroup, Recipe, SavedRecipe } from '$core/models/Recipe'
import type { MessageContent } from '$core/services/LLMService'

/**
 * Parse stream content into ordered MessageContent array
 * @param streamContent - LLM stream content
 * @returns Array of MessageContent preserving order
 */
export const parseMessageContents = (streamContent: string): MessageContent[] => {
  const contents: MessageContent[] = []

  // Strip any quiz block before processing — the quiz is ephemeral and handled separately
  const QUIZ_START = '<<<QUIZ_START>>>'
  const QUIZ_END = '<<<QUIZ_END>>>'
  let cleanContent = streamContent
  if (cleanContent.includes(QUIZ_START) && cleanContent.includes(QUIZ_END)) {
    const qs = cleanContent.indexOf(QUIZ_START)
    const qe = cleanContent.indexOf(QUIZ_END) + QUIZ_END.length
    cleanContent = (cleanContent.substring(0, qs) + cleanContent.substring(qe)).trim()
  }

  const startMarker = '<<<RECIPE_START>>>'
  const endMarker = '<<<RECIPE_END>>>'

  if (!cleanContent.includes(startMarker) || !cleanContent.includes(endMarker)) {
    return [{ type: 'text', content: cleanContent.trim() }]
  }

  const startIndex = cleanContent.indexOf(startMarker)
  const endIndex = cleanContent.indexOf(endMarker) + endMarker.length

  const textBefore = cleanContent.substring(0, startIndex).trim()
  if (textBefore) {
    contents.push({ type: 'text', content: textBefore })
  }

  const recipeJson = cleanContent.substring(
    startIndex + startMarker.length,
    endIndex - endMarker.length
  ).trim()

  try {
    JSON.parse(recipeJson)
    contents.push({ type: 'recipe', content: recipeJson })
  } catch (error) {
    console.error('Invalid recipe JSON:', error)
  }

  const textAfter = cleanContent.substring(endIndex).trim()
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
