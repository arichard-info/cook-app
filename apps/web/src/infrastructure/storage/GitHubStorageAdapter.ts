import type { IRecipeService } from '$core/services/RecipeService'
import type { Recipe, SavedRecipe } from '$core/models/Recipe'
import { formatRecipeToMarkdown, slugify } from '$core/utils/recipeFormatter'

const API_BASE = 'https://api.github.com'
const REPO_NAME = 'cook-data'

/**
 * GitHub storage adapter — stores recipes as markdown files in a private GitHub repo
 * Repo structure: {username}/cook-data/recipes/{slug}.md
 */
export class GitHubStorageAdapter implements IRecipeService {
  private readonly token: string

  constructor(token: string) {
    this.token = token
  }

  /**
   * Save a recipe to GitHub. Creates the cook-data repo if it doesn't exist.
   * @param recipe - Recipe to save (id/dates will be generated if absent)
   * @param username - GitHub username
   */
  async save(recipe: Recipe, username: string): Promise<SavedRecipe> {
    const today = new Date().toISOString().split('T')[0]
    const id = recipe.metadata.id ?? slugify(recipe.metadata.title)

    const savedRecipe: SavedRecipe = {
      ...recipe,
      metadata: {
        ...recipe.metadata,
        id,
        createdAt: recipe.metadata.createdAt ?? today,
        updatedAt: today,
      },
    }

    const content = formatRecipeToMarkdown(savedRecipe)
    const encoded = btoa(unescape(encodeURIComponent(content)))
    const path = `recipes/${id}.md`
    const url = `${API_BASE}/repos/${username}/${REPO_NAME}/contents/${path}`

    // Check for existing file to get SHA (required for updates)
    let sha: string | undefined
    try {
      const existing = await fetch(url, { headers: this.headers() })
      if (existing.ok) {
        const data = await existing.json()
        sha = data.sha
      }
    } catch { /* file doesn't exist yet */ }

    const body: Record<string, unknown> = {
      message: sha ? `Update: ${recipe.metadata.title}` : `Add: ${recipe.metadata.title}`,
      content: encoded,
    }
    if (sha) body.sha = sha

    const response = await fetch(url, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(body),
    })

    if (response.status === 404) {
      await this.ensureRepo(username)
      return this.save(recipe, username)
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return savedRecipe
  }

  /**
   * List all saved recipes by fetching the recipes/ directory and parsing each file
   * @param username - GitHub username
   */
  async list(username: string): Promise<SavedRecipe[]> {
    const response = await fetch(
      `${API_BASE}/repos/${username}/${REPO_NAME}/contents/recipes`,
      { headers: this.headers() },
    )

    if (!response.ok) return []

    const files: Array<{ name: string; download_url: string }> = await response.json()
    const mdFiles = files.filter((f) => f.name.endsWith('.md'))

    const recipes = await Promise.all(
      mdFiles.map(async (file) => {
        const slug = file.name.replace('.md', '')
        return this.get(slug, username)
      }),
    )

    return recipes.filter((r): r is SavedRecipe => r !== null)
  }

  /**
   * Fetch a single recipe by slug
   * @param slug - Recipe slug identifier
   * @param username - GitHub username
   */
  async get(slug: string, username: string): Promise<SavedRecipe | null> {
    const response = await fetch(
      `${API_BASE}/repos/${username}/${REPO_NAME}/contents/recipes/${slug}.md`,
      { headers: this.headers() },
    )

    if (!response.ok) return null

    const data = await response.json()
    const markdown = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ''))))
    return this.parseMarkdownToRecipe(markdown, slug)
  }

  /**
   * Delete a recipe by slug
   * @param slug - Recipe slug identifier
   * @param username - GitHub username
   */
  async delete(slug: string, username: string): Promise<void> {
    const url = `${API_BASE}/repos/${username}/${REPO_NAME}/contents/recipes/${slug}.md`
    const getResponse = await fetch(url, { headers: this.headers() })
    if (!getResponse.ok) return

    const data = await getResponse.json()
    await fetch(url, {
      method: 'DELETE',
      headers: this.headers(),
      body: JSON.stringify({
        message: `Delete: ${slug}`,
        sha: data.sha,
      }),
    })
  }

  private headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    }
  }

  /**
   * Create the cook-data repo if it doesn't exist
   * auto_init: true ensures there's an initial commit so file writes work immediately
   */
  private async ensureRepo(username: string): Promise<void> {
    await fetch(`${API_BASE}/user/repos`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        name: REPO_NAME,
        private: true,
        description: 'Cook — recipe journal data',
        auto_init: true,
      }),
    })
  }

  /**
   * Parse a markdown recipe file back into a SavedRecipe object
   */
  private parseMarkdownToRecipe(markdown: string, slug: string): SavedRecipe {
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

    const ingredients = this.parseIngredients(body)
    const steps = this.parseSteps(body)
    const notes = this.parseNotes(body)

    return { metadata, ingredients, steps, notes }
  }

  private parseIngredients(body: string) {
    const section = body.match(/# Ingrédients\n([\s\S]*?)(?=\n# |$)/)
    if (!section) return []

    const content = section[1]
    const groups: Array<{ name?: string; items: string[] }> = []
    let currentGroup: { name?: string; items: string[] } = { items: [] }

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

  private parseSteps(body: string): string[] {
    const section = body.match(/# Étapes\n([\s\S]*?)(?=\n# |$)/)
    if (!section) return []

    return section[1]
      .split('\n')
      .filter((line) => /^\d+\. /.test(line))
      .map((line) => line.replace(/^\d+\. /, '').trim())
  }

  private parseNotes(body: string): string[] {
    const section = body.match(/# Notes & Tips\n([\s\S]*?)(?=\n# |$)/)
    if (!section) return []

    return section[1]
      .split('\n')
      .filter((line) => line.startsWith('- '))
      .map((line) => line.slice(2).trim())
  }
}
