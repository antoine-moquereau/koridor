<script>
  import ColorModePicker from './ColorModePicker.svelte'
  import { Koridor as KoridorIcon } from '../icons'
  import { Back } from '../popups'
  import { currentPage, game, page, popup } from '../stores'

  $: clickable = ['Congratulations', 'Game'].includes($currentPage)
  $: handleClick = (event) => {
    event.preventDefault()
    if ($currentPage === 'Game') {
      popup.set({ component: Back })
    } else if ($currentPage === 'Congratulations') {
      game.set($game.playerPositions.length)
      page.set('Home')
    }
  }
</script>

<header>
  <div />
  <h1 class:clickable on:click={handleClick}>
    <span>
      <KoridorIcon />
    </span> 
    Koridor
  </h1>
  <ColorModePicker />
</header>

<style>
  header {
    align-items: center;
    color: var(--font-color);
    display: flex;
    height: 6vh;
    justify-content: space-between;
    margin: 2vh;
    position: relative;
    z-index: 9;
  }
  div {
    width: 4.4vh;
  }
  h1 {
    align-items: center;
    display: flex;
    font-size: 3.3vh;
    font-weight: 900;
    line-height: 3.3vh;
    margin: 0;
  }
  .clickable {
    cursor: pointer;
  }
  span {
    height: 6vh;
    margin-left: -9vh;
    padding-right: 3vh;
    position: absolute;
  }
  span :global(svg) {
    backface-visibility: hidden;
    height: 100%;
    scale: 1 1 1;
    transition: .7s;
    width: auto;
  }
  .clickable:hover span :global(svg) {
    scale: -1 1 1;
  }
</style>
