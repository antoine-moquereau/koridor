<script>
  import { fade, scale } from 'svelte/transition'

  import { ActivePlayer, Board, Button, Confetti } from '../../../components'
  import { game, winner } from '../../../stores'

  /**
   * @type {{ players: number }}
   */
  export let data

  game.set(data.players)

  function handleReturnMatch() {
    game.set(data.players)
  }
</script>

{#if !$winner}
  <div transition:fade={{ duration: 700 }}>
    <ActivePlayer />
    <Board />
  </div>
{:else}
  <div class="Congratulations" transition:fade>
    <Confetti />
    <section transition:scale>
      <h1>Congratulations</h1>
      {#if $winner}
        <p class={`player${$winner}`}>Player {$winner} won</p>
      {/if}
      <nav>
        <Button class="Button" on:click={handleReturnMatch}>Return match</Button>
        <a href="/"> Home </a>
      </nav>
    </section>
  </div>
{/if}

<style>
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
    border: 1px solid var(--normal-color);
    border-radius: 5vh;
    box-shadow: 0 0 1vh var(--dark-color);
    color: var(--font-color);
    display: flex;
    flex-direction: column;
    height: 58vh;
    justify-content: space-evenly;
    margin: auto;
    padding: 0 15%;
    z-index: 2;
  }
  h1 {
    font-size: 4vh;
    margin-top: 2vh;
  }
  p {
    font-size: 2.5vh;
    padding: 1.7vh;
  }
  p.player1 {
    border-bottom: 2px solid rgb(40, 40, 190);
  }
  p.player2 {
    border-bottom: 2px solid rgb(190, 40, 40);
  }
  p.player3 {
    border-bottom: 2px solid rgb(190, 160, 40);
  }
  p.player4 {
    border-bottom: 2px solid rgb(40, 160, 40);
  }
  nav {
    text-align: center;
  }
  nav :global(.Button) {
    display: block;
    margin: 3vh 0;
  }
  a {
    font-size: 1.7vh;
    margin-top: 4vh;
  }
</style>
