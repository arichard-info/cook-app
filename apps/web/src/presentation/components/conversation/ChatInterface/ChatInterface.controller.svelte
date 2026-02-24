<script lang="ts">
  import { createStreamingSession } from './streaming.composable.svelte'
  import { createSaveFlow } from './saveFlow.composable.svelte'
  import MessageComponent from '../Message.ui.svelte'
  import MessageInput from '../MessageInput.ui.svelte'
  import TypingIndicator from '../TypingIndicator.ui.svelte'
  import QuizInput from '../QuizInput.controller.svelte'
  import QuizLoader from '../QuizLoader.ui.svelte'
  import RecipeLoader from '$presentation/components/recipe/RecipeLoader.ui.svelte'
  import SaveRecipeFlow from '$presentation/components/recipe/SaveRecipeFlow.controller.svelte'

  const chat = createStreamingSession()
  const save = createSaveFlow()
</script>

<div class="chat-container">
  <div class="messages">
    {#if chat.messages.length === 0 && !chat.streamingContent && chat.specialStream !== 'quiz'}
      <div class="empty-state">
        <h1>Nouvelle session de cuisine</h1>
        <p>Discutons de ton idée de recette !</p>
      </div>
    {:else}
      {#each chat.messages as message, index}
        <MessageComponent
          role={message.role}
          contents={message.contents}
          onSaveRecipe={save.handleSaveRecipe}
          recipeStates={save.recipeStates}
          isPending={chat.sendStatus === 'pending' && index === chat.messages.length - 1}
        />
      {/each}

      {#if chat.sendStatus === 'pending'}
        <TypingIndicator />
      {:else if chat.specialStream === 'recipe'}
        {#each chat.streamingContents as content}
          {#if content.type === 'text'}
            <MessageComponent role="assistant" contents={[content]} isStreaming={true} />
          {/if}
        {/each}
        <RecipeLoader />
      {:else if chat.specialStream === 'quiz'}
        {#if chat.streamTextBefore}
          <MessageComponent
            role="assistant"
            contents={[{ type: 'text', content: chat.streamTextBefore }]}
            isStreaming={true}
          />
        {/if}
      {:else if chat.streamingContent}
        <MessageComponent role="assistant" contents={chat.streamingContents} isStreaming={true} />
      {/if}
    {/if}
  </div>

  {#if chat.specialStream === 'quiz'}
    <QuizLoader />
  {:else if chat.activeQuiz}
    <QuizInput
      quiz={chat.activeQuiz}
      disabled={chat.sendStatus !== 'idle'}
      onSubmit={chat.handleQuizSubmit}
    />
  {:else}
    <MessageInput
      bind:value={chat.inputValue}
      disabled={!chat.llmService || chat.sendStatus !== 'idle'}
      onSend={chat.sendMessage}
      onInput={() => {}}
    />
  {/if}
</div>

{#if save.savingRecipe}
  <SaveRecipeFlow
    recipe={save.savingRecipe.recipe}
    onSaved={save.handleSaved}
    onError={save.handleSaveError}
    onDismiss={save.handleDismiss}
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
