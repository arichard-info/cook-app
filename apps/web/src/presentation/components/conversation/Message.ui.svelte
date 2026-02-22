<script lang="ts">
  import { marked } from 'marked'
  import type { Recipe } from '$core/models/Recipe'
  import type { MessageContent } from '$core/services/LLMService'
  import RecipeCard from '$presentation/components/recipe/RecipeCard.ui.svelte'

  interface SaveStateEntry { status: 'saving' | 'saved' | 'error'; id?: string }

  interface Props {
    role: 'user' | 'assistant'
    contents: MessageContent[]
    isStreaming?: boolean
    onSaveRecipe?: (recipe: Recipe, key: string) => void
    recipeStates?: Record<string, SaveStateEntry>
  }

  let { role, contents, isStreaming = false, onSaveRecipe, recipeStates = {} }: Props = $props()

  const renderMarkdown = (text: string): string => {
    return marked.parse(text, { async: false, breaks: true }) as string
  }

  const parseRecipe = (recipeJson: string): Recipe | null => {
    try {
      return JSON.parse(recipeJson) as Recipe
    } catch {
      return null
    }
  }
</script>

<div class="message message-{role}" class:streaming={isStreaming}>
  <div class="message-contents">
    {#each contents as content}
      {#if content.type === 'text'}
        <div class="message-content">
          {#if role === 'assistant'}
            {@html renderMarkdown(content.content)}
          {:else}
            {content.content}
          {/if}
        </div>
      {:else if content.type === 'recipe'}
        {@const recipe = parseRecipe(content.content)}
        {@const state = recipeStates[content.content]}
        {#if recipe}
          <RecipeCard
            {recipe}
            onSave={() => onSaveRecipe?.(recipe, content.content)}
            saveState={state?.status ?? 'idle'}
            savedId={state?.id}
          />
        {/if}
      {/if}
    {/each}
  </div>
</div>

<style>
  .message {
    margin-bottom: var(--spacing-2xl);
    display: flex;
  }

  .message-user {
    justify-content: flex-end;
  }

  .message-content {
    max-width: 80%;
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--radius-md);
    line-height: var(--line-height-tight);
  }

  .message-user .message-content {
    background: var(--color-surface-user);
    color: var(--color-text-inverted);
    white-space: pre-wrap;
  }

  .message-assistant .message-content {
    background: var(--color-surface-assistant);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border-default);
  }

  .message-assistant .message-content :global(p) {
    margin: 0 0 var(--spacing-sm) 0;
  }

  .message-assistant .message-content :global(p:last-child) {
    margin-bottom: 0;
  }

  .message-assistant .message-content :global(ul),
  .message-assistant .message-content :global(ol) {
    margin: 0 0 var(--spacing-sm) 0;
    padding-left: var(--spacing-2xl);
  }

  .message-assistant .message-content :global(code) {
    background: var(--color-bg-tertiary);
    padding: var(--spacing-xs) var(--spacing-xs);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
  }

  .message-assistant .message-content :global(pre) {
    background: var(--color-interactive-hover);
    color: var(--color-text-inverted);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    overflow-x: auto;
    margin: 0 0 var(--spacing-sm) 0;
  }

  .message-assistant .message-content :global(pre code) {
    background: transparent;
    padding: 0;
  }

  .message.streaming .message-content {
    opacity: var(--opacity-streaming);
  }

  .message-contents {
    width: 100%;
  }
</style>
