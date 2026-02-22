<script lang="ts">
  import { onMount } from 'svelte'
  import '$presentation/styles/global.css'
  import { getAuthService } from '$infrastructure/auth'

  onMount(async () => {
    await getAuthService()?.initialize()
  })
</script>

<nav class="app-nav">
  <a href="/recipes" class="nav-link">Mes recettes</a>
  <a href="/new-recipe" class="nav-link nav-link-primary">+ Nouvelle</a>
</nav>

<slot />

<style>
  .app-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: var(--border-width-thin) solid var(--color-border-default);
    background: var(--color-bg-primary);
  }

  .nav-link {
    text-decoration: none;
    color: var(--color-text-primary);
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    padding: var(--spacing-sm) var(--spacing-md);
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }

  .nav-link-primary {
    background: var(--color-black);
    color: var(--color-white);
  }
</style>
