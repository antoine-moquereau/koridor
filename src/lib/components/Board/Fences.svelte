<script>
  import { FENCES } from '$lib/constants'
  import { game } from '$lib/stores'

  /**
   * @typedef {import('$lib/types').CrossfadeTransition} CrossfadeTransition
   */

  /**
   * @type {number}
   */
  export let player
  /**
   * @type {CrossfadeTransition}
   */
  export let sendFence

  $: players = $game.playerPositions.length
  $: fourPlayers = players === 4
  $: right = fourPlayers && player === 1
  const left = player === 3
</script>

<div class="Fences" class:fourPlayers class:right class:left>
  {#each new Array(FENCES / players).fill(false) as _, i (i)}
    <div class="Fence-wrapper">
      {#if $game.fences.available[player] > i}
        <div class="Fence" out:sendFence|local={{ key: player * 10 + i }} />
      {/if}
    </div>
  {/each}
</div>

<style>
  .Fences {
    align-items: center;
    display: flex;
    height: 16%;
    justify-content: space-between;
    width: 82%;
  }
  .Fences.fourPlayers {
    margin: 0 33%;
    width: 33%;
  }
  .Fences.left.fourPlayers {
    align-items: center;
    flex-direction: column;
    height: 33%;
    justify-content: space-between;
    left: 0;
    margin: 33% 0;
    position: absolute;
    width: 16%;
  }
  .Fences.right.fourPlayers {
    align-items: center;
    flex-direction: column;
    height: 33%;
    justify-content: space-between;
    margin: 33% 0;
    position: absolute;
    right: 0;
    width: 16%;
  }
  .Fence-wrapper {
    height: 83.49%; /* (184% * 11%) * (66 / 16) */
    width: 1.54%; /* (14% * 11%) */
  }
  .Fences.fourPlayers .Fence-wrapper {
    width: 3.08%;
  }
  .Fences.left.fourPlayers .Fence-wrapper,
  .Fences.right.fourPlayers .Fence-wrapper {
    height: 3.08%;
    width: 83.49%;
  }
  .Fence {
    background: var(--font-color);
    box-shadow: 0 0 0.8vh var(--opposite-font-color);
    height: 100%;
    outline: 2px solid var(--font-color);
    position: relative;
    width: 100%;
    z-index: 2;
  }
</style>
