<script lang="ts">
  const cookingTerms = [
    'Préparation',
    'Cuisson',
    'Émulsion',
    'Réduction',
    'Torréfaction',
    'Assaisonnement'
  ]

  let currentIndex = $state(0)

  const interval = setInterval(() => {
    currentIndex = (currentIndex + 1) % cookingTerms.length
  }, 2000)

  $effect(() => {
    return () => clearInterval(interval)
  })
</script>

<div class="recipe-loader">
  <div class="loader-icon">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round"/>
    </svg>
  </div>
  <p class="loader-text">{cookingTerms[currentIndex]}...</p>
</div>

<style>
  .recipe-loader {
    background: var(--color-surface-assistant);
    border: 2px solid var(--color-border-default);
    border-radius: var(--radius-md);
    padding: var(--spacing-2xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-lg);
    min-height: 200px;
  }

  .loader-icon {
    animation: rotate 2s linear infinite;
  }

  .loader-icon svg {
    color: var(--color-text-primary);
  }

  .loader-text {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    color: var(--color-text-primary);
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
