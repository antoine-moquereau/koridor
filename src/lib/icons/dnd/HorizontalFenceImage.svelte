<script>
  import { game } from '$lib/stores'
  import color from './color'

  $: [fill, stroke] = color($game.activePlayer)
</script>

<svg {fill} {stroke} stroke-width="4px" style="overflow: visible;" viewBox="0 0 80 16">
  <rect x="0" y="0" width="80" height="16" />
</svg>
