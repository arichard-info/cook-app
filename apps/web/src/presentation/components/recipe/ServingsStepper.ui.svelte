<script lang="ts">
  interface Props {
    value: number
    min?: number
    max?: number
  }

  let { value = $bindable(), min = 1, max = 50 }: Props = $props()
</script>

<div class="servings-stepper">
  <button
    class="stepper-btn"
    onclick={() => (value = Math.max(min, value - 1))}
    disabled={value <= min}
    aria-label="Moins de portions"
  >−</button>
  <span class="stepper-value">Pour {value} personne{value > 1 ? 's' : ''}</span>
  <button
    class="stepper-btn"
    onclick={() => (value = Math.min(max, value + 1))}
    aria-label="Plus de portions"
  >+</button>
</div>

<style>
  .servings-stepper {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .stepper-btn {
    width: 36px;
    height: 36px;
    min-width: 36px;
    background: var(--color-interactive-default);
    color: var(--color-text-inverted);
    border: none;
    border-radius: var(--radius-sm);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    transition: opacity var(--transition-fast);
  }

  .stepper-btn:disabled {
    opacity: 0.25;
    cursor: default;
  }

  .stepper-btn:not(:disabled):hover {
    opacity: 0.8;
  }

  .stepper-value {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    min-width: 9rem;
    text-align: center;
  }
</style>
