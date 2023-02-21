<script>
  import { browser } from '$app/environment'
  import { fade } from 'svelte/transition'
</script>

<div class="Suspense" style={!browser ? '--animation-name: suspense;' : undefined}>
  <slot />
  {#if !browser}
    <div transition:fade />
  {/if}
</div>

<style>
  @keyframes -global-suspense {
    0% {
      background-color: var(--light-color);
      opacity: 0.4;
    }
    100% {
      background-color: var(--normal-color);
      opacity: 0.8;
    }
  }
  .Suspense {
    position: relative;
  }
  .Suspense div {
    animation-delay: 0.7s;
    animation-direction: alternate;
    animation-duration: 0.7s;
    animation-iteration-count: infinite;
    animation-name: var(--animation-name, none);
    border-radius: var(--border-radius, 0);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: var(--z-index, auto);
  }
</style>
