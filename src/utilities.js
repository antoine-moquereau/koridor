import { quintOut } from 'svelte/easing'
import { crossfade } from 'svelte/transition'

function clickOutside(node) {
  const handleClick = event => {
    if (!node.contains(event.target)) {
      node.dispatchEvent(new CustomEvent('outsideClick', node))
    }
  }
	document.addEventListener('click', handleClick, true)
  return {
    destroy() {
      document.removeEventListener('click', handleClick, true)
    }
	}
}

function crossfadeTransition() {
  return crossfade({
    duration: d => Math.sqrt(d * 300),
    fallback: () => ({
      duration: 700,
      easing: quintOut,
      css: t => `
        scale: ${t};
        opacity: ${t}
      `
    })
  })
}

export { clickOutside, crossfadeTransition }
