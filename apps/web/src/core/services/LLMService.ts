export type MessageContentType = 'text' | 'recipe'

export interface MessageContent {
  type: MessageContentType
  content: string
}

export interface Message {
  role: 'user' | 'assistant'
  contents: MessageContent[]
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
   * @param systemPrompt - System prompt defining the conversation behavior
   * @returns Assistant response
   */
  sendMessage(messages: Message[], systemPrompt: string): Promise<string>

  /**
   * Stream a response (optional, for future)
   * @param messages - Conversation history
   * @param onChunk - Callback for each chunk
   * @param systemPrompt - System prompt defining the conversation behavior
   */
  streamMessage?(messages: Message[], onChunk: (chunk: string) => void, systemPrompt: string): Promise<void>
}
