/**
 * @file Provides miscellaneous utility functions for the Svelte application.
 * These include UI helpers like detecting clicks outside an element and managing transitions.
 * @module lib/utilities
 */
import { quintOut } from 'svelte/easing'
import { crossfade } from 'svelte/transition'

/**
 * A Svelte action that triggers an 'outsideClick' event on the node when a click occurs outside of it.
 * This is useful for components like modals or dropdowns that should close when the user clicks elsewhere.
 *
 * Usage:
 * ```html
 * <div use:clickOutside on:outsideClick="{() => console.log('Clicked outside!')}">
 *   ... content ...
 * </div>
 * ```
 *
 * @param {HTMLElement} node - The HTML element to attach the outside click listener to.
 * @returns {Object} An action object with a `destroy` method to clean up the event listener.
 * @property {Function} destroy - Called by Svelte when the component is unmounted. Removes the event listener.
 */
function clickOutside(node) {
  /**
   * Handles the click event on the document.
   * If the click target is outside the specified `node`, it dispatches an 'outsideClick' custom event from the `node`.
   * @param {MouseEvent} event - The mouse event.
   */
  const handleClick = (event) => {
    // Check if the event target is an HTMLElement and if the node does not contain the event target.
    // Also checks if the node itself is still connected to the DOM.
    if (node && node.parentNode && event.target instanceof HTMLElement && !node.contains(event.target)) {
      node.dispatchEvent(new CustomEvent('outsideClick')) // Dispatch a custom event
    }
  }

  // Add event listener to the document in the capture phase.
  document?.addEventListener('click', handleClick, true)

  // Return an object with a destroy method, which Svelte will call when the node is unmounted.
  return {
    destroy() {
      document?.removeEventListener('click', handleClick, true)
    }
  }
}

function crossfadeTransition() {
  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 300), // Duration based on distance
    fallback: () => ({ // Fallback transition for elements without a counterpart
      duration: 700,
      easing: quintOut,
      css: (t) => `
        transform: scale(${t});
        opacity: ${t};
      `
    })
  });
  return [send, receive];
}

/**
 * Creates and configures a Svelte crossfade transition.
 * This function wraps Svelte's `crossfade` to provide a pre-configured transition effect
 * often used for elements that are added and removed from the DOM, allowing them to
 * smoothly transition between states or to a corresponding element.
 *
 * The duration of the transition is proportional to the square root of the distance
 * the element travels, providing a natural-feeling animation. A fallback transition
 * is defined for elements that don't have a direct counterpart to crossfade with,
 * making them scale and fade.
 *
 * @returns {[send: Function, receive: Function]} A tuple containing the `send` and `receive` transition functions
 * configured with specific durations, easing, and CSS effects.
 * These can be used with Svelte's `in:` and `out:` directives.
 *
 * Example Usage:
 * ```html
 * <script>
 *   import { crossfadeTransition } from '$lib/utilities';
 *   const [send, receive] = crossfadeTransition();
 *   let show = true;
 *   let items = [{ id: 1, text: 'Item 1' }];
 * </script>
 *
 * {#if show}
 *   {#each items as item (item.id)}
 *     <div in:receive={{ key: item.id }} out:send={{ key: item.id }}>
 *       {item.text}
 *     </div>
 *   {/each}
 * {/if}
 * ```
 */
export { clickOutside, crossfadeTransition }
