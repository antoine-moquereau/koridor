<script>
  import { browser } from '$app/environment'

  if (browser) import('vanilla-colorful')

  import { color as colorStore } from '../stores'

  let color = $colorStore.light

  // prettier-ignore
  const colors = [
    '#4a4a4a', '#555555', '#9b9b9b', '#f47373', '#f44336', '#ff5722', '#ff8a65', '#795548', '#ff6900', '#8b572a',
    '#ff9800', '#f5a623', '#fcb900', '#ffc107', '#ffeb3b', '#f8e71c', '#cddc39', '#dce775', '#8bc34a', '#417505',
    '#7ed321', '#b8e986', '#4caf50', '#37d67a', '#7bdcb5', '#00d084', '#50e3c2', '#009688', '#00bcd4', '#2ccce4',
    '#03a9f4', '#607d8b', '#0693e3', '#8ed1fc', '#2196f3', '#abb8c3', '#4a90e2', '#d9e3f0', '#697689', '#3f51b5',
    '#673ab7', '#9013fe', '#9900ef', '#bd10e0', '#ba68c8', '#9c27b0', '#e91e63', '#eb144c', '#f78da7', '#d0021b'
  ]

  /**
   * @param {string} newColor
   */
  function handleColor(newColor) {
    return () => {
      colorStore.change(newColor)
      color = newColor
    }
  }

  /**
   * @param {{ detail: { value: string; }; }} event
   */
  function handleColorChanged(event) {
    colorStore.change(event.detail.value)
  }
</script>

<section>
  <div class="triangle" />
  <hex-color-picker class="Picker" {color} on:color-changed={handleColorChanged} />
  <div class="colors">
    {#each colors as color}
      <button style="--color: {color};" on:click={handleColor(color)} />
    {/each}
  </div>
</section>

<style>
  section {
    background: var(--light-color);
    border: 1px solid var(--normal-color);
    border-radius: 2vh;
    box-shadow: 0 0 1vh var(--dark-color);
    color: var(--font-color);
    padding: 2vh;
    position: fixed;
    right: 9vh;
    top: 10vh;
  }
  .triangle {
    border-color: transparent transparent var(--normal-color) transparent;
    border-style: solid;
    border-width: 0 2vh 3vh 2vh;
    height: 0;
    position: absolute;
    right: 2vh;
    top: -3vh;
    width: 0;
  }
  .triangle::after {
    content: '';
    border-color: transparent transparent var(--light-color) transparent;
    border-style: solid;
    border-width: 0 2vh 3vh 2vh;
    height: 0;
    position: absolute;
    right: calc(-2vh + 1px);
    top: 4px;
    width: 0;
  }
  .Picker {
    height: 30vh;
    width: 50vw;
  }
  .colors {
    display: grid;
    grid-template-columns: repeat(auto-fill, 6vh);
    margin-top: 2vh;
  }
  button {
    background-color: var(--color);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    margin: 1.7vh;
    padding: 1.4vh;
    position: relative;
    transition: box-shadow 0.2s;
  }
  button:hover {
    box-shadow: 0 0 1.4vh var(--color);
  }
</style>
