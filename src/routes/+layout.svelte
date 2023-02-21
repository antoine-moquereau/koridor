<script>
  import { PopOver } from '$lib/components'
  import { Header, Theme } from '$lib/layouts'
  import { popup } from '$lib/stores'
</script>

<Theme>
  <Header />
  <main style={$popup.component ? '--blur-overlay: 2px;' : undefined}>
    <slot />
  </main>
  <PopOver />
</Theme>

<style>
  main {
    bottom: 0;
    display: flex;
    filter: blur(var(--blur-overlay, 0));
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    overflow: hidden;
    transition: filter 0.9s;
  }
</style>
