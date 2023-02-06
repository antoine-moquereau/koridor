import { derived, writable } from 'svelte/store'

import { winner } from './game'

const page = writable('Home')
const currentPage = derived([page, winner], ([$page, $winner]) => {
  if ($winner) page.set('Congratulations')
  return $page
})

export { currentPage, page }
