<script>
  import { fade } from 'svelte/transition'

  import { Button } from '../components'
  import { Local2 as Local2Icon, Local4 as Local4Icon} from '../icons'
  import { game, page } from '../stores'

  function handleClick(players) {
    return () => {
      game.set(players)
      page.set('Game')
    }
  }
</script>

<nav transition:fade>
  <Button class='Button' on:click={handleClick(2)}>
    <Local2Icon />2 Players
  </Button>
  <Button class='Button' on:click={handleClick(4)}>
    <Local4Icon />4 Players
  </Button>
</nav>

<style>
  nav {
    align-items: center;
    display: flex;
    justify-content: center;
    margin: auto;
    max-width: 100%;
  }
  nav :global(.Button) {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 12vh 3vh;
  }
  nav :global(svg) {
    height: 22vh;
    margin-top: -22vh;
    position: absolute;
    width: 22vh;
  }
  nav :global(.p1),
  nav :global(.p2),
  nav :global(.p3),
  nav :global(.p4) {
    fill: var(--font-color);
    transition: fill .4s;
  }
  nav :global(.Button:hover .p1) { fill: #3465a4; }
  nav :global(.Button:hover .p2) { fill: #cc0000; }
  nav :global(.Button:hover .p3) { fill: #c4a000; }
  nav :global(.Button:hover .p4) { fill: #4e9a06; }

  @media (max-aspect-ratio: 3/4) {
    nav {
      flex-direction: column;
      padding-top: 13vh;
    }
  }
</style>
