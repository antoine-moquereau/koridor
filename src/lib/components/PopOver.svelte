<script>
  import { fade } from 'svelte/transition'

  import { popup } from '$lib/stores'
  import { clickOutside } from '$lib/utilities'

  function handleOutsideClick() {
    popup.set({})
  }
</script>

{#if $popup.component}
  <div class="PopOver" transition:fade={{ duration: 200 }}>
    <div use:clickOutside on:outsideClick={handleOutsideClick}>
      <svelte:component this={$popup.component} {...$popup.props} />
    </div>
  </div>
{/if}

<style>
  .PopOver {
    background-color: var(--transparent33-font-color);
    display: flex;
    height: 100vh;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 9;
  }
  .PopOver div {
    margin: auto;
  }
</style>
