<script lang="ts">
  interface Props {
    onSubmit: (token: string, repoName: string) => Promise<void>
    onDismiss: () => void
  }

  let { onSubmit, onDismiss }: Props = $props()

  let token = $state('')
  let repoName = $state('cook-data')
  let isLoading = $state(false)
  let error = $state<string | null>(null)

  const handleSubmit = async () => {
    if (!token.trim() || !repoName.trim()) return
    isLoading = true
    error = null
    try {
      await onSubmit(token.trim(), repoName.trim())
    } catch (e) {
      error = e instanceof Error ? e.message : 'Erreur inconnue.'
    } finally {
      isLoading = false
    }
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }
</script>

<div class="modal-overlay" role="dialog" aria-modal="true" aria-label="Connexion GitHub">
  <div class="modal">
    <h2>Connexion GitHub</h2>

    <p class="instructions">
      Génère un <strong>Fine-grained Personal Access Token</strong> sur GitHub avec accès
      <strong>Contents</strong> (read & write) sur le repo de stockage.
    </p>

    <a
      href="https://github.com/settings/personal-access-tokens/new"
      target="_blank"
      rel="noopener noreferrer"
      class="github-link"
    >
      Créer un token →
    </a>

    <div class="input-group">
      <label for="pat-input">Token</label>
      <input
        id="pat-input"
        type="password"
        bind:value={token}
        onkeydown={handleKeydown}
        placeholder="github_pat_..."
        disabled={isLoading}
        autocomplete="off"
        spellcheck={false}
      />
    </div>

    <div class="input-group">
      <label for="repo-input">Repo de stockage</label>
      <input
        id="repo-input"
        type="text"
        bind:value={repoName}
        onkeydown={handleKeydown}
        placeholder="cook-data"
        disabled={isLoading}
        autocomplete="off"
        spellcheck={false}
      />
    </div>

    {#if error}
      <p class="error-message">{error}</p>
    {/if}

    <p class="disclaimer">
      Le token est chiffré avant d'être stocké localement. Il ne quitte jamais ton appareil.
    </p>

    <div class="modal-actions">
      <button class="btn-primary" onclick={handleSubmit} disabled={isLoading || !token.trim() || !repoName.trim()}>
        {isLoading ? 'Vérification...' : 'Connecter'}
      </button>
      <button class="btn-secondary" onclick={onDismiss} disabled={isLoading}>Annuler</button>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal, 100);
  }

  .modal {
    background: var(--color-bg-primary);
    border: var(--border-width-medium) solid var(--color-black);
    padding: var(--spacing-2xl);
    max-width: 440px;
    width: 90%;
  }

  .modal h2 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    margin-bottom: var(--spacing-lg);
  }

  .instructions {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-md);
    line-height: 1.5;
  }

  .github-link {
    display: inline-block;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-lg);
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-md);
  }

  .input-group label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
  }

  .input-group input {
    border: var(--border-width-medium) solid var(--color-black);
    padding: var(--spacing-md);
    font-size: var(--font-size-base);
    font-family: monospace;
    min-height: 44px;
    width: 100%;
    box-sizing: border-box;
  }

  .input-group input:focus {
    outline: 2px solid var(--color-black);
    outline-offset: 1px;
  }

  .error-message {
    color: var(--color-error, #cc0000);
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-md);
  }

  .disclaimer {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
  }

  .modal-actions {
    display: flex;
    gap: var(--spacing-md);
  }

  .btn-primary {
    background: var(--color-black);
    color: var(--color-white);
    border: none;
    padding: var(--spacing-md) var(--spacing-xl);
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-base);
    cursor: pointer;
    min-height: 44px;
    flex: 1;
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: transparent;
    color: var(--color-text-primary);
    border: var(--border-width-thin) solid var(--color-border-default);
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: var(--font-size-base);
    cursor: pointer;
    min-height: 44px;
  }
</style>
