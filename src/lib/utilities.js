import { quintOut } from 'svelte/easing'
import { crossfade } from 'svelte/transition'

/**
 * @param {HTMLElement} node
 */
function clickOutside(node) {
  /**
   * @param {MouseEvent} event
   */
  const handleClick = event => {
    if (event.target instanceof HTMLElement && !node.contains(event.target)) {
      node.dispatchEvent(new Event('outsideClick'))
    }
  }
  document?.addEventListener('click', handleClick, true)
  return {
    destroy() {
      document?.removeEventListener('click', handleClick, true)
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
