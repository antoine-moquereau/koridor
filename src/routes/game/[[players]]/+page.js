import { error } from '@sveltejs/kit'

/**
 * @type {import('@sveltejs/kit').Load}
 */
export function load({ params }) {
  let players
  if (!params.players) {
    players = 2
  } else if (!['2', '4'].includes(params.players)) {
    throw error(404, 'Not Found')
  } else {
    players = parseInt(params.players, 10)
  }
  return {
    players
  }
}
