import { writable } from 'svelte/store'

/**
 * @typedef {Object} Popup
 * @property {import('svelte').ComponentType=} component
 * @property {Object=} props
 */

/**
 * @type {import('svelte/store').Writable<Popup>}
 */
export const popup = writable({})
