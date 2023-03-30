<script>
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  if (browser) import('vanilla-colorful')

  import { Suspense } from '$lib/components'
  import { GitHub as GitHubIcon, Koridor as KoridorIcon } from '$lib/icons'
  import { ExitGameConfirmation } from '$lib/popups'
  import { popup, winner } from '$lib/stores'
  import { ColorModePicker, ColorPicker } from './Pickers'

  $: isInGame = $page.route.id === '/game/[[players]]' && !$winner && $page.status === 200

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
          },
          href: '/'
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
          href: 'https://github.com/antoine-moquereau/koridor',
          navigation: true
        }
      })
    }
  }

  $: clickable = $page.route.id !== '/'
</script>

<header>
  <div class="Side" />
  <a class="Koridor" class:clickable href="/" on:click={handleHome}>
    <h1>
      <span style={!browser ? '--animation-name: logo-suspense;' : undefined}>
        <KoridorIcon />
      </span>
      Koridor
    </h1>
  </a>
  <div class="Side">
    <Suspense --border-radius="50%" --z-index="2">
      <ColorPicker />
    </Suspense>
    <Suspense --border-radius="50%" --z-index="2">
      <ColorModePicker />
    </Suspense>
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
  .Side {
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
  a::after {
    content: none;
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
  @keyframes -global-logo-suspense {
    0% {
      opacity: 0.7;
      scale: 1 1 1;
    }
    100% {
      opacity: 1;
      scale: -1 1 1;
    }
  }
  span :global(svg) {
    animation-delay: 0.7s;
    animation-direction: alternate;
    animation-duration: 0.7s;
    animation-iteration-count: infinite;
    animation-name: var(--animation-name, none);
    backface-visibility: hidden;
    display: block;
    height: 100%;
    scale: 1 1 1;
    transition: scale 0.7s;
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
