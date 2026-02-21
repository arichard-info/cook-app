import { FirebaseGeminiAdapter } from './llm/FirebaseGeminiAdapter'
import { browser } from '$app/environment'

interface FirebaseConfig {
  apiKey: string
  authDomain?: string
  projectId: string
  storageBucket?: string
  messagingSenderId?: string
  appId?: string
}

const getFirebaseConfig = (): FirebaseConfig | null => {
  if (!browser) return null

  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }

  if (!config.apiKey || !config.projectId) {
    console.warn('Firebase configuration is incomplete')
    return null
  }

  return config
}

let llmServiceInstance: FirebaseGeminiAdapter | null = null

/**
 * Get or create the LLM service instance
 */
export const getLLMService = (): FirebaseGeminiAdapter | null => {
  if (!browser) return null

  if (llmServiceInstance) {
    return llmServiceInstance
  }

  const config = getFirebaseConfig()
  if (!config) {
    return null
  }

  llmServiceInstance = new FirebaseGeminiAdapter(config)
  return llmServiceInstance
}
