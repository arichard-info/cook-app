<script lang="ts">
  import type { QuizQuestion, QuizAnswer } from '$core/models/Quiz'

  interface Props {
    question: QuizQuestion
    answer: QuizAnswer
    onAnswerChange: (updated: QuizAnswer) => void
  }

  let { question, answer, onAnswerChange }: Props = $props()

  const toggleOption = (optionId: string) => {
    if (question.type === 'single') {
      onAnswerChange({ ...answer, selectedOptionIds: [optionId], otherText: undefined })
    } else {
      const already = answer.selectedOptionIds.includes(optionId)
      const next = already
        ? answer.selectedOptionIds.filter((id) => id !== optionId)
        : [...answer.selectedOptionIds, optionId]
      onAnswerChange({ ...answer, selectedOptionIds: next })
    }
  }

  const toggleOther = () => {
    if (answer.otherText !== undefined) {
      onAnswerChange({ ...answer, otherText: undefined })
    } else {
      if (question.type === 'single') {
        onAnswerChange({ ...answer, selectedOptionIds: [], otherText: '' })
      } else {
        onAnswerChange({ ...answer, otherText: '' })
      }
    }
  }

  const isOtherChecked = $derived(answer.otherText !== undefined)
</script>

<div class="quiz-question">
  <p class="question-text">{question.text}</p>
  <div class="options" role={question.type === 'single' ? 'radiogroup' : 'group'} aria-label={question.text}>
    {#each question.options as option}
      <label class="option-label">
        <input
          type={question.type === 'single' ? 'radio' : 'checkbox'}
          name={question.id}
          value={option.id}
          checked={answer.selectedOptionIds.includes(option.id)}
          onchange={() => toggleOption(option.id)}
        />
        <span>{option.label}</span>
      </label>
    {/each}

    {#if question.allowOther}
      <label class="option-label">
        <input
          type={question.type === 'single' ? 'radio' : 'checkbox'}
          name={question.id}
          value="__other__"
          checked={isOtherChecked}
          onchange={toggleOther}
        />
        <span class="other-label">Autre...</span>
      </label>
      {#if isOtherChecked}
        <input
          class="other-input"
          type="text"
          placeholder="Précise ta réponse..."
          value={answer.otherText}
          oninput={(e) => onAnswerChange({ ...answer, otherText: (e.target as HTMLInputElement).value })}
        />
      {/if}
    {/if}
  </div>
</div>

<style>
  .quiz-question {
    padding-bottom: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border-default);
  }

  .quiz-question:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: none;
  }

  .question-text {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: var(--spacing-sm);
    color: var(--color-text-primary);
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .option-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
  }

  .option-label input {
    accent-color: var(--color-interactive-default);
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .other-label {
    color: var(--color-text-secondary);
    font-style: italic;
  }

  .other-input {
    margin-top: var(--spacing-xs);
    border: 1px solid var(--color-border-input);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-base);
    font-family: inherit;
    background: var(--color-bg-primary);
    width: 100%;
    box-sizing: border-box;
  }

  .other-input:focus {
    outline: 2px solid var(--color-interactive-default);
    outline-offset: 1px;
  }
</style>
