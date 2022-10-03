<script>
  import { Dark as DarkIcon, Light as LightIcon} from '../icons'
  import { color } from '../stores'
</script>

<div on:click={color.change}>
  {#if $color.font === '#000'}
    <DarkIcon />
  {:else}
    <LightIcon />
  {/if}
</div>

<style>
  div {
    background: var(--normal-color);
    border-radius: 50%;
    box-shadow: 0 0 0.7vh var(--transparent99-font-color);
    cursor: pointer;
    display: flex;
    height: 3vh;
    padding: 0.7vh;
    transition: box-shadow 0.2s ease 0s;
    width: 3vh;
    z-index: 1;
  }
  div:hover {
    background: var(--dark-color);
    box-shadow: 0 0 1vh var(--transparentcc-font-color);
  }
  div :global(svg) {
    fill: var(--font-color);
    height: 80%;
    margin: auto;
    width: auto;
  }
</style>
