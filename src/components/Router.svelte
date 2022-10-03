<script>
  export let current
  export let routes
</script>

<main>
  <svelte:component this={routes[current]} />
</main>

<style>
  main {
    background-color: var(--light-color);
    bottom: 0;
    display: flex;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
