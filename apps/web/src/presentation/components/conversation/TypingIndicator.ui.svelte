<div class="message message-assistant">
  <div class="message-contents">
    <div class="typing-bubble">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  </div>
</div>

<style>
  .message {
    margin-bottom: var(--spacing-2xl);
    display: flex;
  }

  .message-assistant {
    justify-content: flex-start;
  }

  .message-contents {
    width: 100%;
  }

  .typing-bubble {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--color-surface-assistant);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--color-text-secondary);
    animation: dot-bounce 1.2s ease-in-out infinite;
  }

  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dot-bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-5px); opacity: 1; }
  }
</style>
