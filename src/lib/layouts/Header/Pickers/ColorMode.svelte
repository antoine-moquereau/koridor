<script>
  import { browser } from '$app/environment'

  import { Dark as DarkIcon, Light as LightIcon } from '$lib/icons'
  import { color } from '$lib/stores'
  import Button from './Button.svelte'

  function handleChange() {
    color.change()
  }
</script>

{#if browser}
  <Button title={$color.font === '#000' ? 'Dark mode' : 'Light mode'} on:click={handleChange}>
    {#if $color.font === '#000'}
      <DarkIcon />
    {:else}
      <LightIcon />
    {/if}
  </Button>
{:else}
  <Button --display="var(--no-dark-display)" title="Light mode" on:click={handleChange}>
    <LightIcon />
  </Button>
  <Button --display="var(--no-light-display)" title="Dark mode" on:click={handleChange}>
    <DarkIcon />
  </Button>
{/if}
