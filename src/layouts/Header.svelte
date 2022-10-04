<script>
  import ColorModePicker from './ColorModePicker.svelte'
  import { GitHub as GitHubIcon, Koridor as KoridorIcon } from '../icons'
  import { ExitGameConfirmation } from '../popups'
  import { currentPage, game, page, popup } from '../stores'

  $: clickable = ['Congratulations', 'Game'].includes($currentPage)
  $: handleHome = (event) => {
    event.preventDefault()
    if ($currentPage === 'Game') {
      popup.set({
        component: ExitGameConfirmation,
        props: {
          handleConfirm: () => {
            page.set('Home')
          }
        }
      })
    } else if ($currentPage === 'Congratulations') {
      game.set($game.playerPositions.length)
      page.set('Home')
    }
  }
  $: handleGitHub = (event) => {
    if ($currentPage === 'Game') {
      event.preventDefault()
      popup.set({
        component: ExitGameConfirmation,
        props: {
          handleConfirm: () => {
            location.assign('https://github.com/antoine-moquereau/koridor')
          },
          navigation: true
        }
      })
    }
  }
</script>

<header>
  <div />
  <h1 class:clickable on:click={handleHome}>
    <span>
      <KoridorIcon />
    </span> 
    Koridor
  </h1>
  <div>
    <ColorModePicker />
    <a href="https://github.com/antoine-moquereau/koridor" on:click={handleGitHub} rel="external" title="GitHub Repo">
      <GitHubIcon />
    </a>
  </div>
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
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 10vh;
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
  a :global(svg) {
    fill: var(--font-color);
    height: 3.3vh;
    width: 3.3vh;
  }
  a:hover :global(svg) {
    fill: var(--transparent99-font-color);
  }
</style>
