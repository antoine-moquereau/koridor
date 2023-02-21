<script>
  /**
   * @type {string | undefined}
   */
  let className = undefined
  export { className as class }
  /**
   * @type {string | undefined}
   */
  export let href = undefined

  const type = !href ? 'button' : undefined
  const element = type || 'a'
</script>

<svelte:element this={element} class={className} {href} {type} on:click on:keyup>
  <slot />
</svelte:element>

<style>
  a,
  button {
    background: var(--normal-color);
    border: 2px solid var(--transparentcc-font-color);
    border-radius: 1vh;
    box-sizing: content-box;
    color: var(--font-color);
    cursor: pointer;
    font-size: 1.7vh;
    font-weight: 500;
    padding: 3vh;
    transform: scale(1);
    transition: 0.2s ease-in-out;
    width: 22vh;
  }
  a:hover,
  button:hover {
    background: var(--dark-color);
    border: 2px solid var(--font-color);
    box-shadow: 0 0 1vh var(--transparent99-font-color);
    font-weight: 600;
    transform: scale(1.12);
  }
  a:hover {
    text-decoration: none;
  }
  a::after {
    content: none;
  }
</style>
