<script lang="ts">
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'

  onMount(() => {
    goto('/new-recipe')
  })
</script>

<div class="home">
  <p>Redirection...</p>
</div>

<style>
  .home {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
</style>
