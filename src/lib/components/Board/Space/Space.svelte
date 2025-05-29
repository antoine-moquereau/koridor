<script>
  import { fly } from 'svelte/transition'

  import { SIZE } from '$lib/constants'
  import { drop } from '$lib/dnd'
  import Fence from './Fence.svelte'
  import Pawn from './Pawn.svelte'
  import { activePlayerPointOfView, game } from '$lib/stores'

  /**
   * @typedef {import('$lib/types').CrossfadeTransition} CrossfadeTransition
   * @typedef {import('$lib/types').Orientation} Orientation
   * @typedef {import('$lib/types').SpaceError} SpaceError
   */

  /**
   * @type {SpaceError}
   */
  export let error
  /**
   * @type {(orientation: Orientation) => (position: number) => void}
   */
  export let handleFenceHover
  /**
   * @type {() => void}
   */
  export let handleFenceLeave
  /**
   * @type {number}
   */
  export let position
  /**
   * @type {CrossfadeTransition}
   */
  export let receiveFence

  let delayedError = false
  /**
   * @type {NodeJS.Timeout | undefined}
   */
  let timeout

  $: ({ index, marked, player, shortestPath } = error)
  $: delay = 150 * (index + 1)
  $: x = ['⇢', '→'].includes(shortestPath) ? -10 : ['⇠', '←'].includes(shortestPath) ? 10 : 0
  $: y = ['⇣', '↓'].includes(shortestPath) ? -10 : ['⇡', '↑'].includes(shortestPath) ? 10 : 0
  $: accessible =
    $activePlayerPointOfView.graph[$game.playerPositions[$game.activePlayer]].includes(position)
  $: {
    if (!timeout) {
      timeout = setTimeout(
        () => {
          delayedError = player !== -1
          timeout = undefined
        },
        marked ? 900 : 300
      )
    }
  }
</script>

<div class="Space-wrapper">
  {#if accessible}
    <button
      type="button"
      class="Space player{player + 1} accessible"
      class:marked
      class:shortestPath
      style="--delay: {delay}ms; {!delayedError && player === -1 ? 'transition: none;' : ''}"
      on:click={() => window.matchMedia('(hover: hover)').matches && game.move(position)}
      use:drop={{ type: 'Pawn' }}
      on:drop={() => game.move(position)}
    >
      {#key shortestPath}
        <div style={x ? 'height: 90%;' : undefined} in:fly={{ delay, x, y }}>
          {shortestPath}
        </div>
      {/key}
    </button>
  {:else}
    <div
      class="Space player{player + 1}"
      class:marked
      class:shortestPath
      style="--delay: {delay}ms;"
    >
      {#key shortestPath}
        <div style={x ? 'height: 90%;' : undefined} in:fly={{ delay, x, y }}>
          {shortestPath}
        </div>
      {/key}
    </div>
  {/if}
  {#each $game.playerPositions as playerPosition, i}
    {#if position === playerPosition}
      <Pawn player={i + 1} />
    {/if}
  {/each}
  <!-- prettier-ignore -->
  {#if !$game.fences.positions.horizontal.includes(position) &&
    !$game.fences.positions.vertical.includes(position - SIZE) &&
    !$game.fences.positions.vertical.includes(position + SIZE)
  }
    <div class="Space-right">
      <Fence
        {...{
          boardFences: $game.fences.positions.vertical,
          position,
          receiveFence,
          error: $activePlayerPointOfView.error.vertical,
          handleHover: handleFenceHover('vertical'),
          handleLeave: handleFenceLeave,
          moveFenceTo: game.placeVerticalFence,
          type: 'VerticalFence'
        }}
      />
    </div>
  {/if}
  <!-- prettier-ignore -->
  {#if !$game.fences.positions.vertical.includes(position) &&
    !$game.fences.positions.horizontal.includes(position - 1) &&
    !$game.fences.positions.horizontal.includes(position + 1)
  }
    <div class="Space-bottom">
      <Fence
        {...{
          boardFences: $game.fences.positions.horizontal,
          position,
          receiveFence,
          error: $activePlayerPointOfView.error.horizontal,
          handleHover: handleFenceHover('horizontal'),
          handleLeave: handleFenceLeave,
          moveFenceTo: game.placeHorizontalFence,
          type: 'HorizontalFence'
        }}
      />
    </div>
  {/if}
</div>

<style>
  .Space-wrapper {
    height: 11%;
    position: relative;
    width: 11%;
  }
  .Space {
    align-items: center;
    background-color: rgb(255 255 255 / 42%);
    border: 1px solid #0006;
    border-radius: 20%;
    box-sizing: border-box;
    color: var(--transparent99-font-color);
    display: flex;
    font-size: 3vh;
    height: 86%;
    justify-content: center;
    position: absolute;
    right: 8%;
    top: 8%;
    transition:
      background-color 0.3s var(--delay),
      border-color 0.3s var(--delay);
    width: 86%;
  }
  .Space.marked {
    background-color: rgba(255 0 0 / 40%);
    transition: background-color 0.9s;
  }
  .Space.shortestPath.player1:not(.marked) {
    background-color: rgba(80 80 190 / 60%);
    border-color: rgba(80 80 255 / 60%);
  }
  .Space.shortestPath.player2:not(.marked) {
    background-color: rgba(190 80 80 / 60%);
    border-color: rgba(255 80 80 / 60%);
  }
  .Space.shortestPath.player3:not(.marked) {
    background-color: rgba(190 160 80 / 60%);
    border-color: rgba(255 160 80 / 60%);
  }
  .Space.shortestPath.player4:not(.marked) {
    background-color: rgba(80 160 80 / 60%);
    border-color: rgba(80 255 80 / 60%);
  }
  .Space-right {
    height: 184%;
    left: 92%;
    position: absolute;
    top: 8%;
    width: 14%;
    z-index: 2;
  }
  .Space-wrapper:nth-child(9n) .Space-right,
  .Space-wrapper:nth-last-child(1) .Space-right,
  .Space-wrapper:nth-last-child(2) .Space-right,
  .Space-wrapper:nth-last-child(3) .Space-right,
  .Space-wrapper:nth-last-child(4) .Space-right,
  .Space-wrapper:nth-last-child(5) .Space-right,
  .Space-wrapper:nth-last-child(6) .Space-right,
  .Space-wrapper:nth-last-child(7) .Space-right,
  .Space-wrapper:nth-last-child(8) .Space-right,
  .Space-wrapper:nth-last-child(9) .Space-right {
    display: none;
  }
  .Space-bottom {
    display: none;
    z-index: 2;
  }
  .Space-wrapper:nth-last-child(n + 10) .Space-bottom {
    display: block;
    height: 14%;
    left: 8%;
    position: absolute;
    top: 92%;
    width: 184%;
  }
  .Space-wrapper:nth-child(9n) .Space-bottom {
    display: none;
  }
  @media (max-aspect-ratio: 3/4) {
    .Space {
      font-size: 4vw;
    }
  }
  @media (hover: hover) {
    .Space.accessible:hover {
      border: 2px solid var(--font-color);
      cursor: pointer;
    }
    :global(.Board.player1) .Space.accessible:hover {
      background-color: rgb(40 40 190 / 40%);
    }
    :global(.Board.player2) .Space.accessible:hover {
      background-color: rgb(190 40 40 / 40%);
    }
    :global(.Board.player3) .Space.accessible:hover {
      background-color: rgb(190 160 40 / 40%);
    }
    :global(.Board.player4) .Space.accessible:hover {
      background-color: rgb(40 160 40 / 40%);
    }
  }
  @media (hover: none) {
    .Space.accessible:global(.dragover) {
      border: 2px solid var(--font-color);
      cursor: pointer;
    }
    :global(.Board.player1) .Space.accessible:global(.dragover) {
      background-color: rgb(40 40 190 / 40%);
    }
    :global(.Board.player2) .Space.accessible:global(.dragover) {
      background-color: rgb(190 40 40 / 40%);
    }
    :global(.Board.player3) .Space.accessible:global(.dragover) {
      background-color: rgb(190 160 40 / 40%);
    }
    :global(.Board.player4) .Space.accessible:global(.dragover) {
      background-color: rgb(40 160 40 / 40%);
    }
  }
</style>
