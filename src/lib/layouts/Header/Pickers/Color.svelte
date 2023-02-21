<script>
  import { Palette as PaletteIcon } from '$lib/icons'
  import { Colors } from '$lib/popups'
  import { popup } from '$lib/stores'
  import Button from './Button.svelte'

  function handleColors() {
    popup.set({
      component: Colors
    })
  }
</script>

<Button title="Change Color" on:click={handleColors}>
  <PaletteIcon />
</Button>
