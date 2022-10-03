<script>
  let className = undefined
  export { className as class }
</script>

<button class={className} type='button' on:click>
  <slot></slot>
</button>

<style>
  button {
    background: var(--normal-color);
    border: 2px solid var(--transparentcc-font-color);
    border-radius: 1vh;
    box-sizing: content-box;
    color: var(--font-color);
    cursor: pointer;
    font-size: 1.7vh;
    padding: 3vh;
    transform: scale(1);
    transition: .2s ease-in-out;
    width: 22vh;
  }
  button:hover {
    background: var(--dark-color);
    border: 2px solid var(--font-color);
    box-shadow: 0 0 1vh var(--transparent99-font-color);
    font-weight: 600;
    transform: scale(1.12);
  }
</style>
