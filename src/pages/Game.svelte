<script>
  import { fade } from 'svelte/transition'

  import { ActivePlayer, Board } from '../components'
  import { winner } from '../stores'
</script>

<div transition:fade>
  {#if !$winner}
    <ActivePlayer />
  {/if}
  <Board />
</div>
