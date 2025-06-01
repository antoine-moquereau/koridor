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
    /* font-size: clamp(1rem, 1.7vh, 1.5rem); Preferring slightly larger min based on 1.7vh @ typical ~1000px height */
    font-size: clamp(14px, 1.7vh, 22px);
    justify-content: center;
    left: 0;
    /* line-height: clamp(1rem, 1.7vh, 1.5rem); */
    line-height: clamp(14px, 1.7vh, 22px);
    position: fixed;
    right: 0;
    top: 9vh;
  }
  div::before {
    border-radius: 50%;
    content: '';
    /* height: clamp(1.1rem, 1.9vh, 1.7rem); */
    height: clamp(16px, 1.9vh, 25px);
    /* margin: 0 clamp(1rem, 1.7vh, 1.5rem) 0 clamp(-2.5rem, -3.6vh, -1.5rem); */
    margin-right: clamp(14px, 1.7vh, 22px);
    margin-left: clamp(-30px, -3.6vh, -20px);
    /* width: clamp(1.1rem, 1.9vh, 1.7rem); */
    width: clamp(16px, 1.9vh, 25px);
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
