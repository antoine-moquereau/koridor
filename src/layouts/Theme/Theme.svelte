<script>
  import { color } from '../../stores'
  import Wrapper from './Wrapper.svelte'
</script>

<Wrapper
  --font-color={$color.font}
  --opposite-font-color={$color.fontOpposite}
  --normal-color={$color.normal}
  --dark-color={$color.dark}
  --light-color={$color.light}
  --transparent-light-color={$color.transparentLight}
  --transparent99-font-color={$color.transparentFont99}
  --transparentcc-font-color={$color.transparentFontcc}
>
  <slot></slot>
</Wrapper>
