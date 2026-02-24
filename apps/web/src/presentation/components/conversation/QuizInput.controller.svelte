<script lang="ts">
  import type { Quiz, QuizAnswer } from '$core/models/Quiz'
  import { formatQuizAnswers } from '$core/utils/quizParser'
  import QuizQuestion from './QuizQuestion.ui.svelte'

  interface Props {
    quiz: Quiz
    disabled?: boolean
    onSubmit: (formattedMessage: string) => void
  }

  let { quiz, disabled = false, onSubmit }: Props = $props()

  let answers = $state<QuizAnswer[]>(
    quiz.questions.map((q) => ({
      questionId: q.id,
      selectedOptionIds: [],
      otherText: undefined,
    }))
  )
  let freeText = $state('')

  const updateAnswer = (updated: QuizAnswer) => {
    answers = answers.map((a) => (a.questionId === updated.questionId ? updated : a))
  }

  const hasQuizAnswer = $derived(
    answers.some((a) => a.selectedOptionIds.length > 0 || a.otherText !== undefined)
  )

  const canSubmit = $derived(hasQuizAnswer || freeText.trim().length > 0)

  const handleSubmit = () => {
    if (!canSubmit || disabled) return

    if (freeText.trim()) {
      onSubmit(freeText.trim())
    } else {
      onSubmit(formatQuizAnswers(quiz, answers))
    }
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }
</script>

<div class="input-wrapper">
  <div class="quiz-container">
    <div class="quiz-questions">
      {#each quiz.questions as question}
        {@const answer = answers.find((a) => a.questionId === question.id)!}
        <QuizQuestion {question} {answer} onAnswerChange={updateAnswer} />
      {/each}
    </div>

    <div class="input-container">
      <textarea
        bind:value={freeText}
        onkeydown={handleKeydown}
        placeholder="Ou décris directement ta préférence..."
        rows="1"
        {disabled}
      ></textarea>
      <button
        class="send-button"
        onclick={handleSubmit}
        disabled={!canSubmit || disabled}
        aria-label="Envoyer"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="hint">⌘ + Enter</div>
  </div>
</div>

<style>
  .input-wrapper {
    padding: var(--spacing-lg);
    background: var(--color-bg-primary);
    border-top: 2px solid var(--color-border-default);
  }

  .quiz-container {
    max-width: var(--container-sm);
    width: 100%;
    margin: 0 auto;
  }

  .quiz-questions {
    background: var(--color-surface-input);
    border: 2px solid var(--color-border-input);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-sm);
  }

  .input-container {
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
    max-height: 20vh;
  }

  @supports not (field-sizing: content) {
    textarea { overflow-y: auto; }
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
    text-align: center;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-top: var(--spacing-sm);
  }
</style>
