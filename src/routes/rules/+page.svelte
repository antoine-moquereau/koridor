<script>
  import { beforeNavigate } from '$app/navigation'
  import { navigating } from '$app/stores'
  import { onMount } from 'svelte'
  import { fade, scale, fly } from 'svelte/transition'

  import { Board, Button, Confetti } from '../../components'
  import { game, winner } from '../../stores'

  /**
   * @typedef {'horizontal' | 'vertical'} Orientation
   */

  /**
   * @type {{ orientation: Orientation | undefined; position: number | undefined; }}
   */
  let fenceHover = { orientation: undefined, position: undefined }

  game.set(2)

  let restart = {}

  function handleReplay() {
    restart = {}
    game.set(2)
    key = -1
    loop(1000)
  }

  let key = -1
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
    [undefined, undefined],
    ['move', 31],
    ['horizontal', 40],
    [undefined, undefined],

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
    ['move', 66],
    // The goal is to reach the opposite side with your pawn first
    ['move', 4]
  ]

  let confetti = true

  /**
   * @type {NodeJS.Timeout}
   */
  let timeout

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
          setTimeout(() => {
            confetti = false
          }, 4000)
          return
        }
        default: {
          const [action, position] = actions[key]
          // @ts-ignore
          game[action](position)
          loop([7, 15, 27].includes(key) ? 1200 : 400)
          return
        }
      }
    }, delay)
  }

  beforeNavigate(() => {
    clearTimeout(timeout)
  })

  onMount(() => {
    loop(!$navigating ? 700 : 1700)
    return () => {
      clearTimeout(timeout)
    }
  })
</script>

{#key restart}
  <div class="Wrapper" transition:fade>
    {#if $winner}
      <div class="CongratulationsWrapper">
        <div class="Congratulations" transition:fade>
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
              <Button class="Button" on:click={handleReplay}>Replay</Button>
              <a href="/"> Play </a>
            </nav>
          </section>
        </div>
      </div>
    {:else}
      <div
        class="RulesWrapper"
        class:fenceHover={fenceHover.position}
        in:fade={{ delay: 900, duration: 700 }}
        out:fade
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
            {#if key > 16}
              <li in:fly={{ x: 200 }}>Pawns can jump over other pawns, but not over walls</li>
            {/if}
            {#if key > 22}
              <li in:fly={{ x: 200 }}>
                The goal is to reach the opposite side with your pawn first
              </li>
            {/if}
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
  nav :global(.Button) {
    display: block;
    margin: 3vh 0;
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
</style>
