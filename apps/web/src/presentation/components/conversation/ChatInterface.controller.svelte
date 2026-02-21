<script lang="ts">
  import { onMount } from 'svelte'
  import type { Message } from '$core/services/LLMService'
  import { getLLMService } from '$infrastructure/config'

  let messages: Message[] = []
  let inputValue = ''
  let isLoading = false
  let textareaElement: HTMLTextAreaElement
  let llmService = getLLMService()

  const adjustTextareaHeight = () => {
    if (!textareaElement) return
    textareaElement.style.height = 'auto'
    textareaElement.style.height = `${Math.min(textareaElement.scrollHeight, window.innerHeight / 2)}px`
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || !llmService || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    messages = [...messages, userMessage]
    inputValue = ''
    adjustTextareaHeight()
    isLoading = true

    try {
      const response = await llmService.sendMessage(messages)

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      messages = [...messages, assistantMessage]
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      isLoading = false
    }
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInput = () => {
    adjustTextareaHeight()
  }

  onMount(() => {
    adjustTextareaHeight()
  })
</script>

<div class="chat-container">
  <div class="messages">
    {#if messages.length === 0}
      <div class="empty-state">
        <h1>Nouvelle session de cuisine</h1>
        <p>Discutons de ton idée de recette !</p>
      </div>
    {:else}
      {#each messages as message}
        <div class="message message-{message.role}">
          <div class="message-content">
            {message.content}
          </div>
        </div>
      {/each}
    {/if}

    {#if isLoading}
      <div class="message message-assistant loading">
        <div class="message-content">...</div>
      </div>
    {/if}
  </div>

  <div class="input-wrapper">
    <div class="input-container">
      <textarea
        bind:this={textareaElement}
        bind:value={inputValue}
        on:keydown={handleKeydown}
        on:input={handleInput}
        placeholder="Décris ton idée de recette..."
        rows="1"
        disabled={!llmService || isLoading}
      ></textarea>
      <button
        class="send-button"
        on:click={sendMessage}
        disabled={!inputValue.trim() || !llmService || isLoading}
        aria-label="Envoyer"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
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
    padding: 1rem;
    max-width: 768px;
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
    font-size: 2rem;
    font-weight: 900;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }

  .empty-state p {
    color: #737373;
    font-size: 1.125rem;
  }

  .message {
    margin-bottom: 1.5rem;
    display: flex;
  }

  .message-user {
    justify-content: flex-end;
  }

  .message-content {
    max-width: 80%;
    padding: 0.875rem 1.125rem;
    border-radius: 4px;
    line-height: 1.5;
  }

  .message-user .message-content {
    background: #000;
    color: #fff;
  }

  .message-assistant .message-content {
    background: #f5f5f5;
    color: #000;
    border: 1px solid #e5e5e5;
  }

  .message.loading .message-content {
    opacity: 0.5;
  }

  .input-wrapper {
    padding: 1rem;
    background: #fff;
    border-top: 2px solid #e5e5e5;
  }

  .input-container {
    max-width: 768px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    background: #f5f5f5;
    border: 2px solid #d4d4d4;
    border-radius: 24px;
    padding: 0.5rem;
  }

  textarea {
    flex: 1;
    border: none;
    background: transparent;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    font-family: inherit;
    resize: none;
    max-height: 50vh;
    overflow-y: auto;
    line-height: 1.5;
  }

  textarea:focus {
    outline: none;
  }

  textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .send-button {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    padding: 0;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 150ms ease;
  }

  .send-button:hover:not(:disabled) {
    background: #262626;
  }

  .send-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
</style>
