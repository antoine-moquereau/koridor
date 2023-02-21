<!-- Cherry picked from https://svelte.dev/tutorial/congratulations -->
<script>
  import { onMount } from 'svelte'

  let characters = ['🥳', '🎉', '✨']
  let confetti = new Array(100)
    .fill(undefined)
    .map((_, i) => {
      return {
        character: characters[i % characters.length],
        x: Math.random() * 100,
        y: -20 - Math.random() * 100,
        r: 0.1 + Math.random() * 1
      }
    })
    .sort((a, b) => a.r - b.r)

  onMount(() => {
    /**
     * @type {number}
     */
    let frame
    function loop() {
      frame = requestAnimationFrame(loop)
      confetti = confetti.map(emoji => {
        emoji.y += 0.7 * emoji.r
        if (emoji.y > 120) emoji.y = -20
        return emoji
      })
    }
    loop()
    return () => cancelAnimationFrame(frame)
  })
</script>

{#each confetti as c}
  <span style="left: {c.x}%; top: {c.y}%; scale: {c.r}">{c.character}</span>
{/each}

<style>
  span {
    font-size: 5vh;
    position: absolute;
    -webkit-user-select: none;
    user-select: none;
  }
</style>
