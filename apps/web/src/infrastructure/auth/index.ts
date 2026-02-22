import { browser } from '$app/environment'
import { GitHubPATAdapter } from './GitHubAuthAdapter'
import type { IAuthService } from '$core/services/AuthService'

let instance: IAuthService | null = null

/**
 * Get or create the GitHub auth service singleton.
 * Call initialize() once on app startup to decrypt credentials from storage.
 */
export const getAuthService = (): IAuthService | null => {
  if (!browser) return null
  if (!instance) {
    instance = new GitHubPATAdapter()
  }
  return instance
}
