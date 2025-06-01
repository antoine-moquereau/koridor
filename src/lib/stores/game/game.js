import { derived, writable } from 'svelte/store'

import { FENCES, MAX_HISTORY_LENGTH, SIZE } from '$lib/constants'
import {
  breadthFirstSearch,
  createGraph,
  getActivePlayerPointOfViewGraph,
  placeHorizontalFence,
  placeVerticalFence,
  shortestPath
} from './graph'

/**
 * @typedef {import('$lib/types').Error} Error
 * @typedef {import('$lib/types').Players} Players
 */

/**
 * @typedef {Object} Positions
 * @property {number[]} horizontal
 * @property {number[]} vertical
 */

/**
 * @typedef {Object} Fences
 * @property {Positions} positions
 * @property {number[]} available
 */

/**
 * @typedef {Object} Game
 * @property {Fences} fences
 * @property {number[]} playerPositions?
 * @property {number} activePlayer
 * @property {number[][]} graph?
 * @property {number[][]} playerWinningPositions?
 * @property {Game[]} history
 */

/**
 * @param {Players} players
 * @returns {Game}
 */
const defaultGame = players => ({
  fences: {
    positions: {
      horizontal: [],
      vertical: []
    },
    available: new Array(players).fill(FENCES / players)
  },
  playerPositions: players === 2 ? [4, 76] : [4, 44, 76, 36],
  activePlayer: 0,
  graph: createGraph(SIZE),
  playerWinningPositions:
    players === 2
      ? [
          Array.from({ length: SIZE }, (_, i) => SIZE * SIZE - i - 1),
          Array.from({ length: SIZE }, (_, i) => i)
        ]
      : [
          Array.from({ length: SIZE }, (_, i) => SIZE * SIZE - i - 1),
          Array.from({ length: SIZE }, (_, i) => i * SIZE),
          Array.from({ length: SIZE }, (_, i) => i),
          Array.from({ length: SIZE }, (_, i) => i * SIZE + SIZE - 1)
        ],
  history: []
})

function createGame() {
  const { set, subscribe, update } = writable(defaultGame(4))
  /**
   * @param {Game} game
   */
  const decrementActivePlayerAvailableFences = game =>
    game.fences.available.map((el, i) => (i === game.activePlayer ? el - 1 : el))
  /**
   * @param {Game} game
   * @returns {number}
   */
  const nextActivePlayer = game =>
    game.activePlayer === game.playerPositions.length - 1 ? 0 : game.activePlayer + 1
  return {
    subscribe,
    /**
     * @param {number} position
     */
    move: position => {
      update(game => {
        const newHistory = [...game.history, JSON.parse(JSON.stringify(game))]
        if (newHistory.length > MAX_HISTORY_LENGTH) {
          newHistory.shift()
        }
        return {
          ...game,
          playerPositions: game.playerPositions.map((el, i) =>
            i === game.activePlayer ? position : el
          ),
          activePlayer: nextActivePlayer(game),
          history: newHistory
        }
      })
    },
    /**
     * @param {number} position
     */
    placeHorizontalFence: position => {
      update(game => {
        const newHistory = [...game.history, JSON.parse(JSON.stringify(game))]
        if (newHistory.length > MAX_HISTORY_LENGTH) {
          newHistory.shift()
        }
        return {
          ...game,
          fences: {
            positions: {
              horizontal: [...game.fences.positions.horizontal, position],
              vertical: game.fences.positions.vertical
            },
            available: decrementActivePlayerAvailableFences(game)
          },
          activePlayer: nextActivePlayer(game),
          graph: placeHorizontalFence(game.graph, position),
          history: newHistory
        }
      })
    },
    /**
     * @param {number} position
     */
    placeVerticalFence: position => {
      update(game => {
        const newHistory = [...game.history, JSON.parse(JSON.stringify(game))]
        if (newHistory.length > MAX_HISTORY_LENGTH) {
          newHistory.shift()
        }
        return {
          ...game,
          fences: {
            positions: {
              horizontal: game.fences.positions.horizontal,
              vertical: [...game.fences.positions.vertical, position]
            },
            available: decrementActivePlayerAvailableFences(game)
          },
          activePlayer: nextActivePlayer(game),
          graph: placeVerticalFence(game.graph, position),
          history: newHistory
        }
      })
    },
    /**
     * @param {Players} players
     */
    set: players => set(defaultGame(players)),
    goBack: () => {
      update(game => {
        if (game.history.length === 0) {
          console.log('No history to go back to.')
          return game
        }
        const previousState = game.history.pop()
        // The history array is part of the state, so it's restored along with everything else.
        // We need to update the current game state to reflect the new history.
        return { ...previousState, history: [...game.history] }
      })
    }
  }
}

const game = createGame()

const winner = derived(game, $game => {
  let winner
  $game.playerPositions.forEach((position, player) => {
    if ($game.playerWinningPositions[player].includes(position)) {
      winner = player + 1
    }
  })
  return winner
})

const activePlayerPointOfView = derived(game, $game => {
  const players = $game.playerPositions.length
  /**
   * @param {number[]} explored
   * @param {number} i
   */
  const blockWinningCase = (explored, i) => {
    // prettier-ignore
    switch ((i + $game.activePlayer) % players) {
      case 0: return explored.every(el => el < SIZE * SIZE - SIZE)
      case 1: return players === 2 ? explored.every(el => el > SIZE - 1) : explored.every(el => el % SIZE !== 0)
      case 2: return explored.every(el => el > SIZE - 1)
      case 3: return explored.every(el => el % SIZE !== SIZE - 1)
      default: return false
    }
  }
  /**
   * @type {Error[]}
   */
  const horizontal = []
  /**
   * @type {Error[]}
   */
  const vertical = []
  $game.playerPositions
    .slice($game.activePlayer)
    .concat($game.playerPositions.slice(0, $game.activePlayer))
    .forEach((el, i) => {
      const player = (i + $game.activePlayer) % players
      const sP = shortestPath($game.graph, el, $game.playerWinningPositions[player])
      for (let j = 0; j < SIZE * SIZE; j++) {
        const exploredH = breadthFirstSearch(placeHorizontalFence($game.graph, j), el)
        if (blockWinningCase(exploredH, i)) {
          horizontal.push({ position: j, path: exploredH, shortestPath: sP, player })
        }
        const exploredV = breadthFirstSearch(placeVerticalFence($game.graph, j), el)
        if (blockWinningCase(exploredV, i)) {
          vertical.push({ position: j, path: exploredV, shortestPath: sP, player })
        }
      }
    })
  const error = { horizontal, vertical }
  const graph = getActivePlayerPointOfViewGraph(
    $game.graph,
    $game.playerPositions,
    $game.activePlayer
  )
  return { error, graph }
})

export { activePlayerPointOfView, game, winner }
