<script>
  import { SIZE } from './../../../constants'
  import Fence from './Fence.svelte'
  import Pawn from './Pawn.svelte'
  import { activePlayerPointOfView, game } from './../../../stores'

  export let error
  export let handleFenceHover
  export let handleFenceLeave
  export let position
  export let receiveFence

  $: ({ marked, player, shortestPath } = error)
  $: accessible = $activePlayerPointOfView.graph[$game.playerPositions[$game.activePlayer]].includes(position)
  $: handleClick = accessible ? () => game.move(position) : undefined
</script>

<div class='Space-wrapper'>
  <div
    class='Space player{player + 1}'
    class:accessible
    class:marked
    class:shortestPath
    on:click={handleClick}
  >
    {shortestPath}
  </div>

  {#each $game.playerPositions as playerPosition, i}
    {#if position === playerPosition}
      <Pawn player={i + 1} />
    {/if}
  {/each}

  {#if !$game.fences.positions.horizontal.includes(position) &&
    !$game.fences.positions.vertical.includes(position - SIZE) &&
    !$game.fences.positions.vertical.includes(position + SIZE)
  }
    <div class='Space-right'>
      <Fence {...{
        boardFences: $game.fences.positions.vertical,
        position,
        receiveFence,
        error: $activePlayerPointOfView.error.vertical,
        handleHover: handleFenceHover('vertical'),
        handleLeave: handleFenceLeave,
        moveFenceTo: game.placeVerticalFence,
      }} />
    </div>
  {/if}

  {#if !$game.fences.positions.vertical.includes(position) &&
    !$game.fences.positions.horizontal.includes(position - 1) &&
    !$game.fences.positions.horizontal.includes(position + 1)
  }
    <div class='Space-bottom'>
      <Fence {...{
        boardFences: $game.fences.positions.horizontal,
        position,
        receiveFence,
        error: $activePlayerPointOfView.error.horizontal,
        handleHover: handleFenceHover('horizontal'),
        handleLeave: handleFenceLeave,
        moveFenceTo: game.placeHorizontalFence,
      }} />
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
    background: rgb(255 255 255 / 30%);
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
    width: 86%;
  }
  .Space.marked {
    background: rgba(255 0 0 / 40%);
  }
  .Space.shortestPath.player1:not(.marked) {
    background: rgba(80 80 190 / 60%);
    border-color: rgba(80 80 255 / 60%);
  }
  .Space.shortestPath.player2:not(.marked) {
    background: rgba(190 80 80 / 60%);
    border-color: rgba(255 80 80 / 60%);
  }
  .Space.shortestPath.player3:not(.marked) {
    background: rgba(190 160 80 / 60%);
    border-color: rgba(255 160 80 / 60%);
  }
  .Space.shortestPath.player4:not(.marked) {
    background: rgba(80 160 80 / 60%);
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
  .Space-wrapper:nth-last-child(n+10) .Space-bottom {
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
  .Space.accessible:hover {
    border: 1px solid var(--font-color);
    cursor: pointer;
  }
  :global(.Board.player1) .Space.accessible:hover { background: rgb(40 40 190 / 40%); }
  :global(.Board.player2) .Space.accessible:hover { background: rgb(190 40 40 / 40%); }
  :global(.Board.player3) .Space.accessible:hover { background: rgb(190 160 40 / 40%); }
  :global(.Board.player4) .Space.accessible:hover { background: rgb(40 160 40 / 40%); }

  @media (max-aspect-ratio: 3/4) {
    .Space {
      font-size: 4vw;
    }
  }
</style>
