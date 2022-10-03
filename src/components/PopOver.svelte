<script>
  import { popup } from '../stores'
  import { clickOutside } from '../utilities'

  function handleOutsideClick() {
    popup.set({ component: undefined })
  }
</script>

{#if $popup.component}
  <div class='PopOver'>
    <div use:clickOutside on:outsideClick={handleOutsideClick}>
      <svelte:component this={$popup.component} />
    </div>
  </div>
{/if}

<style>
  .PopOver {
    background-color: var(--transparent-light-color);
    bottom: 0;
    display: flex;
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
