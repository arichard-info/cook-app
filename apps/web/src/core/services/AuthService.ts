/** Authenticated GitHub user */
export interface AuthUser {
  username: string
  token: string
  repoName: string
}

/**
 * Interface for authentication service
 * Implementations: GitHubPATAdapter
 */
export interface IAuthService {
  /**
   * Load and decrypt credentials from storage.
   * Must be called once on app startup before using getUser().
   */
  initialize(): Promise<void>

  /**
   * Get current authenticated user (synchronous, from in-memory cache).
   * Returns null if not authenticated or initialize() hasn't been called yet.
   */
  getUser(): AuthUser | null

  /**
   * Validate a GitHub Personal Access Token, encrypt it, and store it.
   * Fetches the GitHub username from the API to validate the token.
   * @param pat - GitHub Personal Access Token
   * @param repoName - GitHub repository name to use for storage
   */
  setToken(pat: string, repoName: string): Promise<void>

  /**
   * Clear stored credentials and sign out
   */
  signOut(): void
}
