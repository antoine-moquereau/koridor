<script>
  import { game } from '$lib/stores'
  import color from './color'

  $: [fill, stroke] = color($game.activePlayer)
</script>

<svg {fill} {stroke} stroke-width="8px" style="overflow: visible;" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="40" />
</svg>
