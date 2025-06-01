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
  /**
   * @type {boolean}
   */
  export let disabled = false

  const type = !href ? 'button' : undefined
  const element = type || 'a'
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element this={element} class={className} {href} {type} {disabled} on:click on:keyup>
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
  button:disabled,
  a[disabled] {
    /* Target 'a' tags if they have the disabled attribute for styling consistency */
    background: var(--light-color); /* Or a more appropriate disabled color */
    color: var(--transparent99-font-color); /* Or a muted text color */
    cursor: not-allowed;
    border-color: var(--transparent66-font-color); /* Or a muted border color */
  }
  button:disabled:hover,
  a[disabled]:hover {
    background: var(--light-color); /* Keep hover state same as disabled or slightly different */
    border-color: var(--transparent66-font-color);
    box-shadow: none;
    transform: scale(1); /* No scaling on hover for disabled */
  }
</style>
