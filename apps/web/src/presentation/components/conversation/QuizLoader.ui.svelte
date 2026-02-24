<div class="quiz-loader-wrapper">
  <div class="quiz-loader">
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="label">Préparation du questionnaire...</span>
  </div>
</div>

<style>
  .quiz-loader-wrapper {
    padding: var(--spacing-lg);
    background: var(--color-bg-primary);
    border-top: 2px solid var(--color-border-default);
  }

  .quiz-loader {
    max-width: var(--container-sm);
    width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) 0;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: var(--radius-full);
    background: var(--color-text-secondary);
    animation: dot-bounce 1.2s ease-in-out infinite;
    flex-shrink: 0;
  }

  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  .label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-left: var(--spacing-xs);
  }

  @keyframes dot-bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-5px); opacity: 1; }
  }
</style>
