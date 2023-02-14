<script>
  import { browser } from '$app/environment'
  import { fade, scale } from 'svelte/transition'

  import { ActivePlayer, Board, Button, Confetti, Loading } from '$lib/components'
  import { game, winner } from '$lib/stores'

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
  <div transition:fade|local={{ duration: 700 }} class="Game" style={!browser ? '--blur-overlay: 2px;' : undefined}>
    <ActivePlayer />
    <Board />
  </div>
{:else}
  <div class="Congratulations" transition:fade|local>
    <div transition:fade>
      <Confetti />
    </div>
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

{#if !browser}
  <div class="Loading">
    <Loading />
    Loading
  </div>
{/if}

<style>
  @keyframes game {
    0% {
      filter: blur(0);
    }
    100% {
      filter: blur(0);
    }
  }
  .Game {
    animation: 0.7s game;
    border: 0;
    display: block;
    filter: blur(var(--blur-overlay, 0));
    height: 100vh;
    position: fixed;
    transition: filter 0.9s;
    width: 100vw;
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
  @keyframes loading-start {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes loading-end {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .Loading {
    align-items: center;
    animation: 0.7s loading-start, 0.7s 0.7s loading-end;
    bottom: 0;
    color: var(--font-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    overflow: hidden;
    z-index: 999;
  }
</style>
