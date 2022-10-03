<script>
  import { onMount } from 'svelte'
  import { draw, scale } from 'svelte/transition'

  import { Koridor as KoridorIcon } from '../icons'

  let visible = false
  onMount(async () => {
    visible = true
    const timeout = setTimeout(() => {
      visible = false
    }, 1600)
    return () => {
      clearTimeout(timeout)
    }
  })
</script>

{#if visible}
  <div class='SplashScreen' out:scale={{ opacity: 0, start: 8 }}>
    <KoridorIcon />
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 200'>
        <g transform='matrix(0.81992121,0,0,0.81992121,-690.80752,-19.618818)' stroke-width='100' fill='transparent'>
          <path in:draw={{delay: 200, duration: 1000}} clip-path='url(#clipk1)' id='k1' d='m 901.94922,217.5625 h -26.71875 v -138 h 26.71875 c 0,138 -0.0529,76.0017 0,138 z' />
          <path in:draw={{delay: 300, duration: 1000}} clip-path='url(#clipk2)' id='k2' d='m 984.44926,217.5625 h -34.40629 l -43.96875,-60.84375 c -2.62295,-5.70747 -3.10919,-13.4404 0.0937,-18.84375 l 42,-58.3125 h 32.15625 l -51.375,65.90625 z' />
          <path in:draw={{delay: 400, duration: 1000}} clip-path='url(#clipo1)' id='o1' d='m 988.10547,168.90625 c 0,-16.125 4.75001,-28.84375 14.25003,-38.15625 9.5,-9.375 22.375,-14.0625 38.625,-14.0625 15.6875,0 28.0625,4.59375 37.125,13.78125 9.125,9.125 13.6875,21.375 13.6875,36.75 0,16 -4.7188,28.8125 -14.1563,38.4375 -9.375,9.5625 -22.0937,14.34375 -38.1562,14.34375 -15.75,0 -28.25,-4.59375 -37.5,-13.78125 -9.25002,-9.25 -13.87503,-21.6875 -13.87503,-37.3125 z m 26.43753,-0.375 c 0,20.6875 8.5937,31.03125 25.7812,31.03125 16.5625,0 24.8438,-10.59375 24.8438,-31.78125 0,-20.5 -8.3125,-30.75 -24.9375,-30.75 -8.125,0 -14.4375,2.8125 -18.9375,8.4375 -4.5,5.5625 -6.75,13.25 -6.75,23.0625 z' />
          <path in:draw={{delay: 500, duration: 1000}} clip-path='url(#clipr1)' id='r1' d='m 1173.543,143.125 q -5.1563,-3.09375 -12.6563,-3.09375 -9.8437,0 -15.75,8.0625 -5.9062,7.96875 -5.9062,21.46875 v 48 h -26.1563 v -98.53125 h 26.1563 v 18.9375 h 0.2812 q 7.2188,-20.625 25.9688,-20.625 5.3437,0 8.0625,1.3125 z' />
          <path in:draw={{delay: 600, duration: 1000}} clip-path='url(#clipi)' id='i' d='m 1186.8555,86.59375 q 0,-6 4.2187,-10.03125 4.3125,-4.03125 11.0625,-4.03125 6.5625,0 10.9688,4.03125 4.4062,3.9375 4.4062,10.03125 0,6.09375 -4.4062,10.125 -4.3125,4.03125 -10.9688,4.03125 -6.6562,0 -10.9687,-4.125 -4.3125,-4.125 -4.3125,-10.03125 z m 2.0625,130.96875 v -98.53125 h 26.0625 v 98.53125 z' />
          <path in:draw={{delay: 700, duration: 1000}} clip-path='url(#clipd)' id='d' d='m 1334.793,217.5625 h -26.0625 v -14.53125 h -0.4688 Q 1297.7617,220 1276.8555,220 q -18.5625,0 -29.7188,-13.3125 -11.1562,-13.3125 -11.1562,-36.1875 0,-24.28125 12.4687,-39 12.4688,-14.8125 32.4375,-14.8125 19.4063,0 27.375,14.34375 h 0.4688 v -59.25 h 26.0625 z m -25.6875,-56.34375 q 0,-10.40625 -6.375,-17.25 -6.375,-6.9375 -16.0313,-6.9375 -11.25,0 -17.8125,8.8125 -6.4687,8.8125 -6.4687,23.90625 0,14.15625 6.2812,22.03125 6.2813,7.78125 16.9688,7.78125 10.3125,0 16.875,-8.15625 6.5625,-8.15625 6.5625,-20.8125 z' />
          <path in:draw={{delay: 800, duration: 1000}} clip-path='url(#clipo2)' id='o2' d='m 1356.168,168.90625 q 0,-24.1875 14.25,-38.15625 14.25,-14.0625 38.625,-14.0625 23.5312,0 37.125,13.78125 13.6875,13.6875 13.6875,36.75 0,24 -14.1563,38.4375 Q 1431.6367,220 1407.543,220 q -23.625,0 -37.5,-13.78125 -13.875,-13.875 -13.875,-37.3125 z m 26.4375,-0.375 q 0,31.03125 25.7812,31.03125 24.8438,0 24.8438,-31.78125 0,-30.75 -24.9375,-30.75 -12.1875,0 -18.9375,8.4375 -6.75,8.34375 -6.75,23.0625 z' />
          <path in:draw={{delay: 900, duration: 1000}} clip-path='url(#clipr2)' id='r2' d='m 1541.6055,143.125 q -5.1563,-3.09375 -12.6563,-3.09375 -9.8437,0 -15.75,8.0625 -5.9062,7.96875 -5.9062,21.46875 v 48 h -26.1563 v -98.53125 h 26.1563 v 18.9375 h 0.2812 q 7.2188,-20.625 25.9688,-20.625 5.3437,0 8.0625,1.3125 z' />
        </g>
        <clipPath id='clipk1'><use href='#k1'/></clipPath>
        <clipPath id='clipk2'><use href='#k2'/></clipPath>
        <clipPath id='clipo1'><use href='#o1'/></clipPath>
        <clipPath id='clipr1'><use href='#r1'/></clipPath>
        <clipPath id='clipi'><use href='#i'/></clipPath>
        <clipPath id='clipd'><use href='#d'/></clipPath>
        <clipPath id='clipo2'><use href='#o2'/></clipPath>
        <clipPath id='clipr2'><use href='#r2'/></clipPath>
    </svg>
  </div>
{/if}

<style>
  @keyframes logo {
    0%   { opacity: 0; scale: -1 1 1; }
    50%  { opacity: 1; scale: -1 1 1; }
    100% { opacity: 1; scale: 1 1 1; }
  }
  .SplashScreen {
    align-items: center;
    background: var(--light-color);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
    padding: 10vh 10vh 30vh;
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 9;
  }
  .SplashScreen :global(svg):first-child {
    animation: 1s linear logo;
    backface-visibility: hidden;
    height: auto;
    width: 30%;
  }
  svg {
    stroke: var(--font-color);
  }
</style>
