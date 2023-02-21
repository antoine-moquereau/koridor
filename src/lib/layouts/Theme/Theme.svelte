<script>
  import { browser } from '$app/environment'

  import { color } from '$lib/stores'
  import Wrapper from './Wrapper.svelte'
</script>

<div>
  <Wrapper
    --font-color={browser ? $color.font : 'inherit'}
    --link-color={browser ? $color.link : 'inherit'}
    --opposite-font-color={browser ? $color.fontOpposite : 'inherit'}
    --normal-color={browser ? $color.normal : 'inherit'}
    --dark-color={browser ? $color.dark : 'inherit'}
    --light-color={browser ? $color.light : 'inherit'}
    --transparent-light-color={browser ? $color.transparentLight : 'inherit'}
    --transparent33-font-color={browser ? $color.transparentFont33 : 'inherit'}
    --transparent99-font-color={browser ? $color.transparentFont99 : 'inherit'}
    --transparentcc-font-color={browser ? $color.transparentFontcc : 'inherit'}
  >
    <slot />
  </Wrapper>
</div>

<style>
  @media (prefers-color-scheme: dark) {
    div {
      --light-color: #232323;
      --normal-color: #090909;
      --dark-color: #000000;
      --font-color: #fff;
      --link-color: #9fa8ff;
      --opposite-font-color: #000;
      --transparent-light-color: #232323cc;
      --transparent33-font-color: #fff3;
      --transparent99-font-color: #fff9;
      --transparentcc-font-color: #fffc;
      --no-light-display: none;
    }
  }
  @media (prefers-color-scheme: light) {
    div {
      --light-color: #ffffff;
      --normal-color: #f0f0f7;
      --dark-color: #e0e0e9;
      --font-color: #000;
      --link-color: #3344dd;
      --opposite-font-color: #fff;
      --transparent-light-color: #ffffffcc;
      --transparent33-font-color: #0003;
      --transparent99-font-color: #0009;
      --transparentcc-font-color: #000c;
      --no-dark-display: none;
    }
  }
</style>
