<script lang="ts">
  import { onMount } from 'svelte'
  import '$presentation/styles/global.css'
  import { getAuthService } from '$infrastructure/auth'

  onMount(async () => {
    await getAuthService()?.initialize()
  })
</script>

<slot />
