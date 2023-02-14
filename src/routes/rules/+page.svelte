<script>
  import { browser } from '$app/environment'
  import { beforeNavigate } from '$app/navigation'
  import { onDestroy } from 'svelte'
  import { fade, scale, fly } from 'svelte/transition'

  import { Board, Button, Confetti } from '$lib/components'
  import { game } from '$lib/stores'

  let actions = [
    ['move', 13],
    ['move', 67],
    ['move', 22],
    ['placeHorizontalFence', 36],
    ['placeHorizontalFence', 38],
    ['placeHorizontalFence', 52],
    ['placeVerticalFence', 51],
    ['placeHorizontalFence', 42],
    // Wall cannot block only path to opposite side
    ['horizontal', 40],
    [,],
    ['move', 31],
    ['horizontal', 40],
    [,],
    ['move', 58],
    ['move', 40],
    ['move', 49],
    ['move', 58],
    ['move', 40],
    ['placeHorizontalFence', 40],
    ['move', 31],
    ['move', 67],
    ['placeHorizontalFence', 67],
    ['move', 66],
    ['placeHorizontalFence', 65],
    ['move', 65],
    ['move', 22],
    ['move', 64],
    ['placeHorizontalFence', 63],
    ['move', 65],
    ['move', 13],
    ['placeHorizontalFence', 4],
    ['placeVerticalFence', 2],
    ['placeVerticalFence', 12],
    ['placeHorizontalFence', 13],
    ['placeHorizontalFence', 6],
    ['placeHorizontalFence', 15],
    ['move', 66],
    ['move', 14],
    ['move', 67],
    ['move', 15],
    ['move', 68],
    ['move', 16],
    ['move', 68],
    ['placeVerticalFence', 59],
    ['move', 59],
    ['move', 17],
    ['move', 50],
    // The goal is to reach the opposite side with your pawn first
    ['move', 8]
  ]
  let confetti = false
  let demo = false
  /**
   * @typedef {'horizontal' | 'vertical'} Orientation
   */
  /**
   * @type {{ orientation: Orientation | undefined; position: number | undefined; }}
   */
  let fenceHover = { orientation: undefined, position: undefined }
  let key = -1
  let restart = {}
  /**
   * @type {NodeJS.Timeout}
   */
  let timeout

  beforeNavigate(() => {
    clearTimeout(timeout)
  })

  function handleDemo() {
    game.set(2)
    restart = {}
    key = -1
    confetti = true
    demo = true
    loop(1000)
  }

  /**
   * @param {number | undefined} delay
   */
  function loop(delay) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      key += 1
      switch (key) {
        case 11:
        case 8: {
          const [orientation, position] = actions[key]
          // @ts-ignore
          fenceHover = { orientation, position }
          loop(1700)
          return
        }
        case 12:
        case 9: {
          const [orientation, position] = actions[key]
          // @ts-ignore
          fenceHover = { orientation, position }
          loop(1000)
          return
        }
        case actions.length: {
          demo = false
          confetti = true
          setTimeout(() => {
            confetti = false
          }, 4000)
          return
        }
        default: {
          const [action, position] = actions[key]
          // @ts-ignore
          game[action](position)
          loop(key === 15 ? 1200 : 500)
          return
        }
      }
    }, delay)
  }

  onDestroy(() => {
    clearTimeout(timeout)
  })
</script>

{#key restart}
  <div class="Wrapper" transition:fade|local>
    {#if !demo}
      <div class="CongratulationsWrapper">
        <div class="Congratulations" transition:fade|local>
          {#if confetti}
            <div transition:fade>
              <Confetti />
            </div>
          {/if}
          <section class:confetti transition:scale>
            <h1>Rules</h1>
            <ul>
              <li>Each player starts with 10 walls and their pawn on opposite sides</li>
              <li>On each turn, a player can move their pawn straight or place a wall</li>
              <li>Wall cannot block only path to opposite side</li>
              <li>Pawns can jump over other pawns, but not over walls</li>
              <li>The goal is to reach the opposite side with your pawn first</li>
            </ul>
            <nav>
              <div class="Suspense" style={!browser ? '--animation-name: suspense;' : undefined}>
                <Button class="Button" on:click={handleDemo}>Demo</Button>
                {#if !browser}
                  <div transition:fade />
                {/if}
              </div>
              <a href="/"> Play </a>
            </nav>
          </section>
        </div>
      </div>
    {:else}
      <div
        class="RulesWrapper"
        class:fenceHover={fenceHover.position}
        in:fade|local={{ delay: 900, duration: 700 }}
        out:fade|local
      >
        <div>
          <Board {fenceHover} />
        </div>
        <div class="Rules">
          <h1>Rules</h1>
          <ul>
            <li>Each player starts with 10 walls and their pawn on opposite sides</li>
            {#if key > 0}
              <li in:fly={{ x: 200 }}>
                On each turn, a player can move their pawn straight or place a wall
              </li>
            {/if}
            {#if key > 7}
              <li in:fly={{ x: 200 }}>Wall cannot block only path to opposite side</li>
            {/if}
            {#if key > 14}
              <li in:fly={{ x: 200 }}>Pawns can jump over other pawns, but not over walls</li>
            {/if}
            {#if key > 22}
              <li in:fly={{ x: 200 }}>
                The goal is to reach the opposite side with your pawn first
              </li>
            {/if}
            <li style="visibility: hidden;">On each turn, a player can move their pawn straight or place a wall</li>
          </ul>
        </div>
        <div class="Overlay" />
      </div>
    {/if}
  </div>
{/key}

<style>
  .Wrapper {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    position: fixed;
  }
  .RulesWrapper,
  .CongratulationsWrapper {
    display: flex;
    color: var(--font-color);
    justify-content: center;
    width: 100vw;
  }
  .RulesWrapper :global(.Board) {
    margin: 14vh auto auto 2vh;
    position: relative;
  }
  .RulesWrapper .Rules {
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: 14vh 2vh auto;
    overflow: hidden;
    position: relative;
  }
  .RulesWrapper.fenceHover :global(.Fence.marked) {
    opacity: 1;
  }
  .Congratulations {
    display: flex;
    height: 100vh;
    left: 0;
    position: fixed;
    top: 0;
    width: 100vw;
  }
  section {
    align-items: center;
    background: var(--light-color);
    border: none;
    border-radius: 5vh;
    box-shadow: none;
    color: var(--font-color);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin: auto;
    padding: 0 15%;
    transition: border 0.7s, box-shadow 0.7s;
    z-index: 2;
  }
  section.confetti {
    border: 1px solid var(--normal-color);
    box-shadow: 0 0 1vh var(--dark-color);
  }
  h1 {
    font-size: 4vh;
    margin-top: 6vh;
    text-align: center;
  }
  li {
    list-style: auto;
    margin: 2vh;
    font-size: 1.4rem;
  }
  nav {
    text-align: center;
  }
  .Suspense {
    display: block;
    margin: 3vh 0;
    position: relative;
  }
  .Suspense div {
    animation-delay: 0.7s;
    animation-direction: alternate;
    animation-duration: 0.7s;
    animation-iteration-count: infinite;
    animation-name: var(--animation-name, none);
    border-radius: 1vh;
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
  a {
    display: block;
    font-size: 1.7vh;
    margin: 4vh;
  }
  .Overlay {
    bottom: 0;
    display: flex;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 99;
  }

  @media (max-aspect-ratio: 1/1) {
    .RulesWrapper {
      flex-direction: column;
    }
    .RulesWrapper :global(.Board) {
      height: 41vh;
      margin: 14vh auto auto;
      position: relative;
      width: 33vh;
    }
    .RulesWrapper .Rules {
      margin: auto;
    }
    h1 {
      font-size: 2rem;
    }
    li {
      font-size: 1rem;
    }
  }
</style>
