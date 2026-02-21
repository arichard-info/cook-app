<script lang="ts">
  interface Props {
    value: string
    disabled?: boolean
    onSend: () => void
    onInput: () => void
  }

  let { value = $bindable(), disabled = false, onSend, onInput }: Props = $props()

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onSend()
    }
  }

  const handleInput = () => {
    onInput()
  }
</script>

<div class="input-wrapper">
  <div class="input-container">
    <textarea
      bind:value
      on:keydown={handleKeydown}
      on:input={handleInput}
      id="message-input"
      placeholder="Décris ton idée de recette..."
      rows="1"
      disabled={disabled}
    ></textarea>
    <button
      class="send-button"
      on:click={onSend}
      disabled={!value.trim() || disabled}
      aria-label="Envoyer"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
  <div class="hint">⌘ + Enter</div>
</div>

<style>
  .input-wrapper {
    padding: var(--spacing-lg);
    background: var(--color-bg-primary);
    border-top: 2px solid var(--color-border-default);
  }

  .input-container {
    max-width: var(--container-sm);
    width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    gap: var(--spacing-sm);
    background: var(--color-surface-input);
    border: 2px solid var(--color-border-input);
    border-radius: var(--radius-lg);
    padding: var(--spacing-sm);
  }

  textarea {
    flex: 1;
    border: none;
    background: transparent;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-base);
    font-family: inherit;
    resize: none;
    line-height: var(--line-height-tight);
    overflow-y: hidden;
    field-sizing: content;
    min-height: 1.5em;
    max-height: 50vh;
  }

  @supports not (field-sizing: content) {
    textarea {
      overflow-y: auto;
    }
  }

  textarea:focus {
    outline: none;
  }

  textarea:disabled {
    opacity: var(--opacity-loading);
    cursor: not-allowed;
  }

  .send-button {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    padding: 0;
    background: var(--color-interactive-default);
    color: var(--color-text-inverted);
    border: none;
    border-radius: var(--radius-full);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background var(--transition-fast);
  }

  .send-button:hover:not(:disabled) {
    background: var(--color-interactive-hover);
  }

  .send-button:disabled {
    opacity: var(--opacity-disabled);
    cursor: not-allowed;
  }

  .hint {
    max-width: var(--container-sm);
    width: 100%;
    margin: var(--spacing-sm) auto 0;
    text-align: center;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }
</style>
