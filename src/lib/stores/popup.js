import { writable } from 'svelte/store'

/**
 * @typedef {Object} Popup
 * @property {typeof import('svelte').SvelteComponent=} component
 * @property {Object=} props
 */

/**
 * @type {import('svelte/store').Writable<Popup>}
 */
export const popup = writable({})
