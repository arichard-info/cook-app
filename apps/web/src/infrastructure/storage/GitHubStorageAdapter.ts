import type { IRecipeService } from '$core/services/RecipeService'
import type { Recipe, SavedRecipe } from '$core/models/Recipe'
import { formatRecipeToMarkdown } from '$core/utils/recipeFormatter'
import { parseMarkdownToRecipe } from '$core/utils/recipeParser'
import { toISODate } from '$shared/date'
import { encodeBase64, decodeBase64 } from '$shared/base64'
import { slugify } from '$shared/string'

const API_BASE = 'https://api.github.com'

/**
 * GitHub storage adapter — stores recipes as markdown files in a private GitHub repo
 * Repo structure: {username}/{repoName}/recipes/{slug}.md
 */
export class GitHubStorageAdapter implements IRecipeService {
  private readonly token: string
  private readonly repoName: string

  constructor(token: string, repoName: string) {
    this.token = token
    this.repoName = repoName
  }

  /**
   * Save a recipe to GitHub. Creates the cook-data repo if it doesn't exist.
   * @param recipe - Recipe to save (id/dates will be generated if absent)
   * @param username - GitHub username
   */
  async save(recipe: Recipe, username: string): Promise<SavedRecipe> {
    const today = toISODate(new Date())
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
    const encoded = encodeBase64(content)
    const path = `recipes/${id}.md`
    const url = `${API_BASE}/repos/${username}/${this.repoName}/contents/${path}`

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
      await this.ensureRepo()
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
      `${API_BASE}/repos/${username}/${this.repoName}/contents/recipes`,
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
      `${API_BASE}/repos/${username}/${this.repoName}/contents/recipes/${slug}.md`,
      { headers: this.headers() },
    )

    if (!response.ok) return null

    const data = await response.json()
    const markdown = decodeBase64(data.content)
    return parseMarkdownToRecipe(markdown, slug)
  }

  /**
   * Delete a recipe by slug
   * @param slug - Recipe slug identifier
   * @param username - GitHub username
   */
  async delete(slug: string, username: string): Promise<void> {
    const url = `${API_BASE}/repos/${username}/${this.repoName}/contents/recipes/${slug}.md`
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
  private async ensureRepo(): Promise<void> {
    await fetch(`${API_BASE}/user/repos`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        name: this.repoName,
        private: true,
        description: 'Cook — recipe journal data',
        auto_init: true,
      }),
    })
  }
}
