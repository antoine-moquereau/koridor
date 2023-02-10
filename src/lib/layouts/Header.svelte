<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  import ColorModePicker from './ColorModePicker.svelte'
  import ColorPicker from './ColorPicker.svelte'
  import { GitHub as GitHubIcon, Koridor as KoridorIcon } from '$lib/icons'
  import { ExitGameConfirmation } from '$lib/popups'
  import { popup, winner } from '$lib/stores'

  $: isInGame = $page.route.id === '/game/[[players]]' && !$winner

  /**
   * @param {Event} event
   */
  function handleHome(event) {
    if (isInGame) {
      event.preventDefault()
      popup.set({
        component: ExitGameConfirmation,
        props: {
          handleConfirm: () => {
            goto('/')
          }
        }
      })
    }
  }

  /**
   * @param {Event} event
   */
  function handleGitHub(event) {
    if (isInGame) {
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

  $: clickable = $page.route.id !== '/'
</script>

<header>
  <div />
  <a class="Koridor" class:clickable href="/" on:click={handleHome}>
    <h1>
      <span>
        <KoridorIcon />
      </span>
      Koridor
    </h1>
  </a>
  <div>
    <ColorPicker />
    <ColorModePicker />
    <a
      class="GitHub"
      href="https://github.com/antoine-moquereau/koridor"
      on:click={handleGitHub}
      rel="external"
      title="GitHub Repo"
    >
      <GitHubIcon />
    </a>
  </div>
</header>

<style>
  header {
    align-items: center;
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
    width: 13vh;
  }
  .Koridor {
    color: var(--font-color);
    cursor: default;
    transition: color 0.3s;
  }
  .clickable {
    cursor: pointer;
  }
  a:hover {
    text-decoration: none;
  }
  h1 {
    align-items: center;
    display: flex;
    font-size: 3.3vh;
    font-weight: 900;
    line-height: 3.3vh;
    margin: 0;
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
    transition: 0.7s;
    width: auto;
  }
  .clickable:hover span :global(svg) {
    scale: -1 1 1;
  }
  .GitHub :global(svg) {
    display: flex;
    fill: var(--font-color);
    height: 3.3vh;
    transition: fill 0.3s;
    width: 3.3vh;
  }
  .GitHub:hover :global(svg) {
    fill: var(--transparent99-font-color);
  }
</style>
