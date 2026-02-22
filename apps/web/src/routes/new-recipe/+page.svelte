<script lang="ts">
  import ChatInterface from '$presentation/components/conversation/ChatInterface.controller.svelte'
</script>

<a href="/recipes" class="back-btn">← Mes recettes</a>
<ChatInterface />

<style>
  .back-btn {
    position: fixed;
    top: var(--spacing-md);
    left: var(--spacing-md);
    z-index: var(--z-elevated);
    text-decoration: none;
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-normal);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-input);
    border-radius: var(--radius-lg);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    transition: background var(--transition-fast), box-shadow var(--transition-fast);
  }

  .back-btn:hover {
    background: var(--color-bg-secondary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }
</style>
