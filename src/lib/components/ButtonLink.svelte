<script>
  /**
   * @type {string | undefined}
   */
  let className = undefined
  export { className as class }
  /**
   * @type {string}
   */
  export let href
</script>

<a class={className} {href}>
  <slot />
</a>

<style>
  a {
    background: var(--normal-color);
    border: 2px solid var(--transparentcc-font-color);
    border-radius: 1vh;
    box-sizing: content-box;
    color: var(--font-color);
    cursor: pointer;
    font-size: 1.7vh;
    padding: 3vh;
    transform: scale(1);
    transition: 0.2s ease-in-out;
    width: 22vh;
  }
  a:hover {
    background: var(--dark-color);
    border: 2px solid var(--font-color);
    box-shadow: 0 0 1vh var(--transparent99-font-color);
    font-weight: 600;
    text-decoration: none;
    transform: scale(1.12);
  }
  a::after {
    content: none;
  }
</style>
