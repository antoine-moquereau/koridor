<script>
  import { Palette as PaletteIcon } from '$lib/icons'
  import { Colors } from '$lib/popups'
  import { popup } from '$lib/stores'

  function handleColors() {
    popup.set({
      component: Colors
    })
  }
</script>

<button title="Change Color" type="button" on:click={handleColors}>
  <PaletteIcon />
</button>

<style>
  button {
    background: var(--normal-color);
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 0.7vh var(--transparent99-font-color);
    cursor: pointer;
    display: flex;
    height: 3.6vh;
    padding: 0.7vh;
    transition: box-shadow 0.2s ease 0s;
    width: 3.6vh;
    z-index: 1;
  }
  button:hover {
    background: var(--dark-color);
    box-shadow: 0 0 1vh var(--transparentcc-font-color);
  }
  button :global(svg) {
    fill: var(--font-color);
    height: 80%;
    margin: auto;
    width: auto;
  }
</style>
