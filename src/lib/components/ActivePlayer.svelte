<script>
  import { fly } from 'svelte/transition'

  import { game } from '$lib/stores'

  $: fourPlayers = $game.playerPositions.length === 4
  $: player = $game.activePlayer + 1
</script>

{#key player}
  <div in:fly={{ y: -100 }} out:fly|local={{ y: 100 }} class="player{player}" class:fourPlayers>
    Player {player}'s turn
  </div>
{/key}

<style>
  div {
    align-items: center;
    display: flex;
    font-size: 1.7vh;
    justify-content: center;
    left: 0;
    line-height: 1.7vh;
    position: fixed;
    right: 0;
    top: 9vh;
  }
  div::before {
    border-radius: 50%;
    content: '';
    height: 1.9vh;
    margin: 0 1.7vh 0 -3.6vh;
    width: 1.9vh;
  }
  .player1::before {
    background: rgb(40 40 190);
  }
  .player2::before {
    background: rgb(190 40 40);
  }
  .player3::before {
    background: rgb(190 160 40);
  }
  .player4::before {
    background: rgb(40 160 40);
  }
  @media (max-aspect-ratio: 3/4) {
    div {
      top: max(calc((100vh - 112.75vw) / 2 - 9vw), 9vh);
    }
  }
  @media (hover: none) and (max-aspect-ratio: 5/8) {
    div.fourPlayers {
      top: max(calc((100vh - 90.75vw) / 2 - 9vw), 9vh);
    }
  }
</style>
