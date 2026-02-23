<script lang="ts">
  import { getToasts } from '$presentation/stores/toast.svelte'

  const toasts = $derived(getToasts())
</script>

{#if toasts.length > 0}
  <div class="toast-container">
    {#each toasts as toast (toast.id)}
      <div class="toast toast-{toast.type}">
        <span>{toast.message}</span>
        {#if toast.linkHref}
          <a href={toast.linkHref} class="toast-link">{toast.linkLabel ?? toast.linkHref}</a>
        {/if}
      </div>
    {/each}
  </div>
{/if}

<style>
  .toast-container {
    position: fixed;
    bottom: var(--spacing-2xl);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    z-index: var(--z-modal);
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    white-space: nowrap;
    pointer-events: auto;
    animation: toast-in 150ms ease forwards;
  }

  .toast-success {
    background: var(--color-black);
    color: var(--color-white);
  }

  .toast-error {
    background: #cc0000;
    color: var(--color-white);
  }

  .toast-link {
    color: var(--color-white);
    text-decoration: none;
    font-weight: var(--font-weight-normal);
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  }

  @keyframes toast-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
