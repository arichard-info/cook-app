import type { IAuthService, AuthUser } from '$core/services/AuthService'

const TOKEN_KEY = 'cook_github_token'
const USER_KEY = 'cook_github_user'
const ENC_KEY_KEY = 'cook_enc_key'
const GITHUB_USER_URL = 'https://api.github.com/user'

// --- Crypto helpers (AES-GCM, 256-bit key) ---

const getOrCreateEncKey = async (): Promise<CryptoKey> => {
  const stored = localStorage.getItem(ENC_KEY_KEY)
  if (stored) {
    return crypto.subtle.importKey(
      'jwk',
      JSON.parse(stored),
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt'],
    )
  }
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ])
  const exported = await crypto.subtle.exportKey('jwk', key)
  localStorage.setItem(ENC_KEY_KEY, JSON.stringify(exported))
  return key
}

const encryptToken = async (token: string): Promise<string> => {
  const key = await getOrCreateEncKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(token)
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
  const payload = { iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted)) }
  return btoa(JSON.stringify(payload))
}

const decryptToken = async (ciphertext: string): Promise<string> => {
  const key = await getOrCreateEncKey()
  const { iv, data } = JSON.parse(atob(ciphertext))
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    key,
    new Uint8Array(data),
  )
  return new TextDecoder().decode(decrypted)
}

// --- Adapter ---

/**
 * GitHub authentication adapter using Personal Access Token (PAT)
 * The token is encrypted with AES-GCM before being stored in localStorage.
 * Note: the encryption key is also in localStorage — this is obfuscation, not full security.
 */
export class GitHubPATAdapter implements IAuthService {
  private user: AuthUser | null = null

  /**
   * Load and decrypt credentials from localStorage into memory.
   * Call once on app startup.
   */
  async initialize(): Promise<void> {
    const encrypted = localStorage.getItem(TOKEN_KEY)
    const username = localStorage.getItem(USER_KEY)
    if (!encrypted || !username) return

    try {
      const token = await decryptToken(encrypted)
      this.user = { token, username }
    } catch {
      // Corrupted data — clear it
      this.signOut()
    }
  }

  /**
   * Get current authenticated user from in-memory cache
   */
  getUser(): AuthUser | null {
    return this.user
  }

  /**
   * Validate a PAT by calling the GitHub API, then encrypt and store it
   * @param pat - GitHub Personal Access Token
   * @throws Error if the token is invalid
   */
  async setToken(pat: string): Promise<void> {
    const response = await fetch(GITHUB_USER_URL, {
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: 'application/vnd.github+json',
      },
    })

    if (!response.ok) {
      throw new Error('Token invalide ou permissions insuffisantes.')
    }

    const data = await response.json()
    const username: string = data.login

    const encrypted = await encryptToken(pat)
    localStorage.setItem(TOKEN_KEY, encrypted)
    localStorage.setItem(USER_KEY, username)

    this.user = { token: pat, username }
  }

  /**
   * Clear stored credentials and sign out
   */
  signOut(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(ENC_KEY_KEY)
    this.user = null
  }
}
