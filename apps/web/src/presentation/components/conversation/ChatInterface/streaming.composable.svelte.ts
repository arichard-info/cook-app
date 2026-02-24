import type { Message, MessageContent } from '$core/services/LLMService'
import type { Quiz } from '$core/models/Quiz'
import { getLLMService } from '$infrastructure/config'
import { parseMessageContents } from '$core/utils/recipeParser'
import { hasQuizStart, parseQuiz, extractIntroText } from '$core/utils/quizParser'
import { getNewChatPrompt } from '$core/prompts/newChat'

type SendStatus = 'idle' | 'pending' | 'streaming'
type SpecialStream = 'recipe' | 'quiz' | null

export const createStreamingSession = () => {
  let messages = $state<Message[]>([])
  let inputValue = $state('')
  let sendStatus = $state<SendStatus>('idle')
  let streamingContent = $state('')
  let specialStream = $state<SpecialStream>(null)
  let streamTextBefore = $state('')
  let streamTextAfter = $state('')
  let activeQuiz = $state<Quiz | null>(null)

  const llmService = getLLMService()

  const streamingContents = $derived<MessageContent[]>(
    !streamingContent
      ? []
      : specialStream !== 'recipe'
      ? [{ type: 'text', content: streamingContent }]
      : [
          streamTextBefore ? { type: 'text', content: streamTextBefore } : null,
          streamTextAfter ? { type: 'text', content: streamTextAfter } : null,
        ].filter((c): c is MessageContent => c !== null)
  )

  const processChunk = (chunk: string) => {
    if (sendStatus === 'pending') sendStatus = 'streaming'
    streamingContent += chunk

    if (streamingContent.includes('<<<RECIPE_START>>>') && specialStream !== 'recipe') {
      specialStream = 'recipe'
      const startIndex = streamingContent.indexOf('<<<RECIPE_START>>>')
      streamTextBefore = streamingContent.substring(0, startIndex).trim()
    }
    if (specialStream === 'recipe' && streamingContent.includes('<<<RECIPE_END>>>')) {
      const endIndex = streamingContent.indexOf('<<<RECIPE_END>>>') + '<<<RECIPE_END>>>'.length
      streamTextAfter = streamingContent.substring(endIndex).trim()
    }

    if (hasQuizStart(streamingContent) && specialStream !== 'quiz') {
      specialStream = 'quiz'
      streamTextBefore = extractIntroText(streamingContent)
    }
  }

  const finalizeStream = () => {
    if (specialStream === 'quiz') {
      const quiz = parseQuiz(streamingContent)
      specialStream = null

      if (quiz) {
        if (streamTextBefore) {
          messages = [...messages, {
            role: 'assistant',
            contents: [{ type: 'text', content: streamTextBefore }],
            timestamp: new Date(),
          }]
        }
        activeQuiz = quiz
        streamingContent = ''
        streamTextBefore = ''
        return
      }
      // Malformed JSON fallback — fall through to plain-text commit
      streamTextBefore = ''
    }

    specialStream = null
    messages = [...messages, {
      role: 'assistant',
      contents: parseMessageContents(streamingContent),
      timestamp: new Date(),
    }]
    streamingContent = ''
    streamTextBefore = ''
    streamTextAfter = ''
  }

  const sendContent = async (content: string) => {
    if (!llmService) return
    messages = [...messages, {
      role: 'user',
      contents: [{ type: 'text', content }],
      timestamp: new Date(),
    }]
    sendStatus = 'pending'
    streamingContent = ''

    try {
      await llmService.streamMessage(messages, processChunk, getNewChatPrompt())
      finalizeStream()
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      sendStatus = 'idle'
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || !llmService || sendStatus !== 'idle') return
    const content = inputValue.trim()
    inputValue = ''
    await sendContent(content)
  }

  const handleQuizSubmit = async (formattedMessage: string) => {
    activeQuiz = null
    await sendContent(formattedMessage)
  }

  return {
    get messages() { return messages },
    get inputValue() { return inputValue },
    set inputValue(v: string) { inputValue = v },
    get sendStatus() { return sendStatus },
    get streamingContent() { return streamingContent },
    get streamingContents() { return streamingContents },
    get specialStream() { return specialStream },
    get activeQuiz() { return activeQuiz },
    get streamTextBefore() { return streamTextBefore },
    get llmService() { return llmService },
    sendMessage,
    handleQuizSubmit,
  }
}
