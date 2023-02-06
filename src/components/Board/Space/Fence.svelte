<script>
  import { game } from '../../../stores'

  /**
   * @type {number[]}
   */
  export let boardFences
  /**
   * @type {import('../../../stores/game/game.js').Error[]}
   */
  export let error
  /**
   * @type {(position: number) => void}
   */
  export let handleHover
  /**
   * @type {() => void}
   */
  export let handleLeave
  /**
   * @type {(position: number) => void}
   */
  export let moveFenceTo
  /**
   * @type {number}
   */
  export let position
  /**
   * @type {(
      node: Element,
      params: import('svelte/transition').CrossfadeParams & { key: any; }
    ) => () => import('svelte/transition').TransitionConfig}
   */
  export let receiveFence

  $: previousPlayer =
    $game.activePlayer === 0 ? $game.playerPositions.length - 1 : $game.activePlayer - 1
</script>

{#if boardFences.includes(position)}
  <div
    class="Fence"
    in:receiveFence={{ key: previousPlayer * 10 + $game.fences.available[previousPlayer] }}
  />
{:else if $game.fences.available[$game.activePlayer] > 0 && error.some(el => el.position === position)}
  <div
    class="Fence marked"
    on:focus={() => {}}
    on:mouseover={() => handleHover(position)}
    on:mouseleave={() => handleLeave()}
  />
{:else if $game.fences.available[$game.activePlayer] > 0}
  <div class="PlaceableFence" on:click={() => moveFenceTo(position)} on:keyup />
{/if}

<style>
  .Fence {
    background-color: var(--font-color);
    box-shadow: 0.4vh 0.4vh 0.6vh var(--opposite-font-color);
    height: 100%;
    outline: 2px solid var(--font-color);
    position: relative;
    transition: opacity 0.4s, background-color 0.4s, box-shadow 0.4s, outline 0.4s;
    width: 100%;
    z-index: 2;
  }
  .Fence.marked {
    background-color: transparent;
    border-left: 6px dashed red;
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0;
    outline: none;
  }
  :global(.Space-bottom) .Fence.marked {
    border-bottom: 6px dashed red;
    border-left: none;
  }
  .Fence.marked:hover {
    opacity: 1;
  }
  .PlaceableFence {
    cursor: pointer;
    height: 100%;
    position: relative;
    width: 100%;
    z-index: 2;
  }
  .PlaceableFence:hover {
    background-color: rgb(50 160 20);
    outline: 1px solid var(--font-color);
  }
  .PlaceableFence:hover::before {
    border: 1px black solid;
    box-sizing: border-box;
    content: '';
    position: absolute;
    width: 100%;
  }
  .PlaceableFence:hover::after {
    bottom: 0;
    border: 1px black solid;
    box-sizing: border-box;
    content: '';
    height: 2px;
    position: absolute;
    width: 100%;
  }
  :global(.Space-bottom) .PlaceableFence:hover::before {
    height: 100%;
    width: 2px;
  }
  :global(.Space-bottom) .PlaceableFence:hover::after {
    height: 100%;
    right: 0;
    width: 2px;
  }
  :global(.Board.player1) .PlaceableFence:hover {
    background-color: rgb(40 40 190 / 40%);
  }
  :global(.Board.player2) .PlaceableFence:hover {
    background-color: rgb(190 40 40 / 40%);
  }
  :global(.Board.player3) .PlaceableFence:hover {
    background-color: rgb(190 160 40 / 40%);
  }
  :global(.Board.player4) .PlaceableFence:hover {
    background-color: rgb(40 160 40 / 40%);
  }

  :global(.Space-bottom) .PlaceableFence:hover {
    transform: scaleY(2) translateY(12%);
  }
  :global(.Space-right) .PlaceableFence:hover {
    transform: scaleX(2);
  }
</style>
