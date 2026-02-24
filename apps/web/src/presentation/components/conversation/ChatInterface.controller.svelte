<script lang="ts">
  import type { Message, MessageContent } from '$core/services/LLMService'
  import type { Recipe } from '$core/models/Recipe'
  import type { Quiz } from '$core/models/Quiz'
  import { getLLMService } from '$infrastructure/config'
  import { parseMessageContents } from '$core/utils/recipeParser'
  import { hasQuizStart, parseQuiz, extractIntroText } from '$core/utils/quizParser'
  import { getNewChatPrompt } from '$core/prompts/newChat'
  import MessageComponent from './Message.ui.svelte'
  import MessageInput from './MessageInput.ui.svelte'
  import RecipeLoader from '$presentation/components/recipe/RecipeLoader.ui.svelte'
  import SaveRecipeFlow from '$presentation/components/recipe/SaveRecipeFlow.controller.svelte'
  import TypingIndicator from '$presentation/components/conversation/TypingIndicator.ui.svelte'
  import QuizInput from '$presentation/components/conversation/QuizInput.controller.svelte'
  import QuizLoader from '$presentation/components/conversation/QuizLoader.ui.svelte'
  import { showToast } from '$presentation/stores/toast.svelte'

  type SaveStatus = 'saving' | 'saved' | 'error'
  interface SaveStateEntry { status: SaveStatus; id?: string }

  let messages = $state<Message[]>([])
  let inputValue = $state('')
  let isLoading = $state(false)
  let isPending = $state(false)
  let streamingContent = $state('')
  let isGeneratingRecipe = $state(false)
  let textBeforeRecipe = $state('')
  let textAfterRecipe = $state('')
  let isGeneratingQuiz = $state(false)
  let activeQuiz = $state<Quiz | null>(null)
  let quizIntroText = $state('')

  // keyed by recipe JSON string (content.content), stable across re-renders
  let recipeStates = $state<Record<string, SaveStateEntry>>({})
  let pendingRecipe = $state<{ recipe: Recipe; key: string } | null>(null)

  const llmService = getLLMService()

  const streamingContents = $derived<MessageContent[]>(
    !streamingContent
      ? []
      : !isGeneratingRecipe
      ? [{ type: 'text', content: streamingContent }]
      : [
          textBeforeRecipe ? { type: 'text', content: textBeforeRecipe } : null,
          textAfterRecipe ? { type: 'text', content: textAfterRecipe } : null
        ].filter((c): c is MessageContent => c !== null)
  )

  const handleSaveRecipe = (recipe: Recipe, key: string) => {
    recipeStates = { ...recipeStates, [key]: { status: 'saving' } }
    pendingRecipe = { recipe, key }
  }

  const handleSaved = (id: string) => {
    if (!pendingRecipe) return
    recipeStates = { ...recipeStates, [pendingRecipe.key]: { status: 'saved', id } }
    showToast({
      type: 'success',
      message: '✓ Recette enregistrée',
      linkHref: `/recipes/${id}`,
      linkLabel: 'Voir la recette →',
    })
    pendingRecipe = null
  }

  const handleSaveError = () => {
    if (!pendingRecipe) return
    recipeStates = { ...recipeStates, [pendingRecipe.key]: { status: 'error' } }
    showToast({ type: 'error', message: 'Impossible de sauvegarder la recette' })
    pendingRecipe = null
  }

  const handleDismiss = () => {
    if (pendingRecipe) {
      recipeStates = { ...recipeStates, [pendingRecipe.key]: { status: 'error' } }
    }
    pendingRecipe = null
  }

  // --- Streaming helpers ---

  const processChunk = (chunk: string) => {
    if (isPending) isPending = false
    streamingContent += chunk

    if (streamingContent.includes('<<<RECIPE_START>>>') && !isGeneratingRecipe) {
      isGeneratingRecipe = true
      const startIndex = streamingContent.indexOf('<<<RECIPE_START>>>')
      textBeforeRecipe = streamingContent.substring(0, startIndex).trim()
    }
    if (isGeneratingRecipe && streamingContent.includes('<<<RECIPE_END>>>')) {
      const endIndex = streamingContent.indexOf('<<<RECIPE_END>>>') + '<<<RECIPE_END>>>'.length
      textAfterRecipe = streamingContent.substring(endIndex).trim()
    }

    if (hasQuizStart(streamingContent) && !isGeneratingQuiz) {
      isGeneratingQuiz = true
      quizIntroText = extractIntroText(streamingContent)
    }
  }

  const finalizeStream = () => {
    isGeneratingRecipe = false
    isPending = false

    if (isGeneratingQuiz) {
      const quiz = parseQuiz(streamingContent)
      isGeneratingQuiz = false

      if (quiz) {
        if (quizIntroText) {
          messages = [...messages, {
            role: 'assistant',
            contents: [{ type: 'text', content: quizIntroText }],
            timestamp: new Date()
          }]
        }
        activeQuiz = quiz
        streamingContent = ''
        quizIntroText = ''
        return
      }
      // Malformed JSON fallback — fall through to plain-text commit
      quizIntroText = ''
    }

    messages = [...messages, {
      role: 'assistant',
      contents: parseMessageContents(streamingContent),
      timestamp: new Date()
    }]
    streamingContent = ''
    textBeforeRecipe = ''
    textAfterRecipe = ''
  }

  const sendContent = async (content: string) => {
    if (!llmService) return
    messages = [...messages, {
      role: 'user',
      contents: [{ type: 'text', content }],
      timestamp: new Date()
    }]
    isLoading = true
    isPending = true
    streamingContent = ''

    try {
      await llmService.streamMessage(messages, processChunk, getNewChatPrompt())
      finalizeStream()
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      isLoading = false
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || !llmService || isLoading) return
    const content = inputValue.trim()
    inputValue = ''
    await sendContent(content)
  }

  const handleQuizSubmit = async (formattedMessage: string) => {
    activeQuiz = null
    await sendContent(formattedMessage)
  }

  const handleInput = () => {}
</script>

<div class="chat-container">
  <div class="messages">
    {#if messages.length === 0 && !streamingContent && !isGeneratingQuiz}
      <div class="empty-state">
        <h1>Nouvelle session de cuisine</h1>
        <p>Discutons de ton idée de recette !</p>
      </div>
    {:else}
      {#each messages as message, index}
        <MessageComponent
          role={message.role}
          contents={message.contents}
          onSaveRecipe={handleSaveRecipe}
          {recipeStates}
          isPending={isPending && index === messages.length - 1}
        />
      {/each}

      {#if isPending}
        <TypingIndicator />
      {:else if isGeneratingRecipe}
        {#each streamingContents as content}
          {#if content.type === 'text'}
            <MessageComponent role="assistant" contents={[content]} isStreaming={true} />
          {/if}
        {/each}
        <RecipeLoader />
      {:else if isGeneratingQuiz}
        {#if quizIntroText}
          <MessageComponent
            role="assistant"
            contents={[{ type: 'text', content: quizIntroText }]}
            isStreaming={true}
          />
        {/if}
      {:else if streamingContent}
        <MessageComponent role="assistant" contents={streamingContents} isStreaming={true} />
      {/if}
    {/if}
  </div>

  {#if isGeneratingQuiz}
    <QuizLoader />
  {:else if activeQuiz}
    <QuizInput
      quiz={activeQuiz}
      disabled={isLoading}
      onSubmit={handleQuizSubmit}
    />
  {:else}
    <MessageInput
      bind:value={inputValue}
      disabled={!llmService || isLoading}
      onSend={sendMessage}
      onInput={handleInput}
    />
  {/if}
</div>

{#if pendingRecipe}
  <SaveRecipeFlow
    recipe={pendingRecipe.recipe}
    onSaved={handleSaved}
    onError={handleSaveError}
    onDismiss={handleDismiss}
  />
{/if}

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-lg);
    max-width: var(--container-sm);
    width: 100%;
    margin: 0 auto;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
  }

  .empty-state h1 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-sm);
    text-transform: uppercase;
  }

  .empty-state p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
  }
</style>
