<script>
  import { fade } from 'svelte/transition'

  import { Button } from '$lib/components'
  import { Local2 as Local2Icon, Local4 as Local4Icon } from '$lib/icons'
</script>

<nav transition:fade|local={{ duration: 250 }}>
  <Button class="Button" href="/game">
    <Local2Icon />2 Players
  </Button>
  <Button class="Button" href="/game/4">
    <Local4Icon />4 Players
  </Button>
</nav>

<a href="rules">Rules</a>

<style>
  nav :global(.p1),
  nav :global(.p2),
  nav :global(.p3),
  nav :global(.p4) {
    /* fill: var(--font-color); */ /* Moved to critical.css */
    transition: fill 0.4s;
  }
  nav :global(.Button:hover .p1) {
    fill: #3465a4;
  }
  nav :global(.Button:hover .p2) {
    fill: #cc0000;
  }
  nav :global(.Button:hover .p3) {
    fill: #c4a000;
  }
  nav :global(.Button:hover .p4) {
    fill: #4e9a06;
  }
</style>
