<script lang="ts">
  import { onMount } from 'svelte'
  import '$presentation/styles/global.css'
  import { getAuthService } from '$infrastructure/auth'
  import ToastManager from '$presentation/components/ToastManager.ui.svelte'

  onMount(async () => {
    await getAuthService()?.initialize()
  })
</script>

<slot />
<ToastManager />
