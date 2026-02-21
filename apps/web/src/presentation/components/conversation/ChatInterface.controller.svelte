<script lang="ts">
  import type { Message } from '$core/services/LLMService'
  import { getLLMService } from '$infrastructure/config'
  import MessageComponent from './Message.ui.svelte'
  import MessageInput from './MessageInput.ui.svelte'

  let messages = $state<Message[]>([])
  let inputValue = $state('')
  let isLoading = $state(false)
  let streamingContent = $state('')

  const llmService = getLLMService()

  const sendMessage = async () => {
    if (!inputValue.trim() || !llmService || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    messages = [...messages, userMessage]
    inputValue = ''
    isLoading = true
    streamingContent = ''

    try {
      await llmService.streamMessage(messages, (chunk: string) => {
        streamingContent += chunk
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: streamingContent,
        timestamp: new Date()
      }

      messages = [...messages, assistantMessage]
      streamingContent = ''
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      isLoading = false
    }
  }

  const handleInput = () => {
    // Input handler for MessageInput component
  }
</script>

<div class="chat-container">
  <div class="messages">
    {#if messages.length === 0 && !streamingContent}
      <div class="empty-state">
        <h1>Nouvelle session de cuisine</h1>
        <p>Discutons de ton idée de recette !</p>
      </div>
    {:else}
      {#each messages as message}
        <MessageComponent role={message.role} content={message.content} />
      {/each}

      {#if streamingContent}
        <MessageComponent role="assistant" content={streamingContent} isStreaming={true} />
      {/if}
    {/if}
  </div>

  <MessageInput
    bind:value={inputValue}
    disabled={!llmService || isLoading}
    onSend={sendMessage}
    onInput={handleInput}
  />
</div>

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
