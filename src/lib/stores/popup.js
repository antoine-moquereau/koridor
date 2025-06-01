import { writable } from 'svelte/store'

/**
 * @typedef {Object} Popup
 * @property {typeof import('svelte').SvelteComponent<any, any, any>=} component - The Svelte component to be rendered in the popup.
 * @property {Object=} props - Props to be passed to the Svelte component.
 */

/**
 * @type {import('svelte/store').Writable<Popup>}
 */
export const popup = writable({})
