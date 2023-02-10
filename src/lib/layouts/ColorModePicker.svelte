<script>
  import { browser } from '$app/environment'

  import { Dark as DarkIcon, Light as LightIcon } from '$lib/icons'
  import { color } from '$lib/stores'

  function handleChange() {
    color.change()
  }
</script>

{#if browser}
  <button
    title={$color.font === '#000' ? 'Dark mode' : 'Light mode'}
    type="button"
    on:click={handleChange}
  >
    {#if $color.font === '#000'}
      <DarkIcon />
    {:else}
      <LightIcon />
    {/if}
  </button>
{:else}
  <button class="dark" title="Light mode" type="button" on:click={handleChange}>
    <LightIcon />
  </button>

  <button class="light" title="Dark mode" type="button" on:click={handleChange}>
    <DarkIcon />
  </button>
{/if}

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
  .dark {
    display: var(--dark-display, inherit);
  }
  .light {
    display: var(--light-display, inherit);
  }
</style>
