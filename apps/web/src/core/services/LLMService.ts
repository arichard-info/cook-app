export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

/**
 * Interface for LLM service
 * Abstracts the underlying LLM provider (Gemini, OpenAI, etc.)
 */
export interface ILLMService {
  /**
   * Send a message and get a response
   * @param messages - Conversation history
   * @returns Assistant response
   */
  sendMessage(messages: Message[]): Promise<string>

  /**
   * Stream a response (optional, for future)
   * @param messages - Conversation history
   * @param onChunk - Callback for each chunk
   */
  streamMessage?(messages: Message[], onChunk: (chunk: string) => void): Promise<void>
}
