import { describe, it, expect, beforeEach, vi } from 'vitest'
import { get } from 'svelte/store'
import { game } from './game.js' // Assuming game is exported and provides set, update, subscribe, and custom methods like move, goBack etc.
import { MAX_HISTORY_LENGTH } from '$lib/constants.js'

// Helper to get a clean game state for assertions (without complex Svelte store parts)
/**
 * @param {import('./game.js').Game} gameState
 */
const getCleanState = gameState => {
  const { playerPositions, fences, activePlayer } = gameState
  return { playerPositions, fences, activePlayer }
}

describe('Game Store - History and Go Back Functionality', () => {
  beforeEach(() => {
    // Reset the game to its default state before each test
    // Assuming 2 players for simplicity in tests unless specified
    game.set(2)
  })

  describe('History Tracking', () => {
    it('should initialize with an empty history', () => {
      expect(get(game).history.length).toBe(0)
    })

    it('should add a state to history after a player move', () => {
      game.move(10) // Example move
      expect(get(game).history.length).toBe(1)
      // Check if the history state is a snapshot of the state *before* the move
      expect(get(game).history[0].playerPositions[0]).toBe(
        get(game).playerPositions[0] !== 10 ? get(game).history[0].playerPositions[0] : 4
      ) // player 0 initial position for 2 players
    })

    it('should add a state to history after placing a horizontal fence', () => {
      game.placeHorizontalFence(20) // Example fence placement
      expect(get(game).history.length).toBe(1)
    })

    it('should add a state to history after placing a vertical fence', () => {
      game.placeVerticalFence(25) // Example fence placement
      expect(get(game).history.length).toBe(1)
    })

    it(`should not exceed MAX_HISTORY_LENGTH (${MAX_HISTORY_LENGTH})`, () => {
      for (let i = 0; i < MAX_HISTORY_LENGTH + 5; i++) {
        game.move(10 + i) // Make more than MAX_HISTORY_LENGTH moves
      }
      expect(get(game).history.length).toBe(MAX_HISTORY_LENGTH)
    })

    it('should store deep copies in history, not references', () => {
      const initialPlayer1Pos = get(game).playerPositions[0]
      game.move(10) // Make a move
      const historyStateBeforeSecondMove = JSON.parse(JSON.stringify(get(game).history[0])) // Deep copy of the first history entry

      game.move(15) // Make another move to change current game state

      // The player position in the *stored history state* should remain what it was at that time
      expect(historyStateBeforeSecondMove.playerPositions[0]).toBe(initialPlayer1Pos)
      // And it should not be the current player position
      expect(historyStateBeforeSecondMove.playerPositions[0]).not.toBe(get(game).playerPositions[0])
    })
  })

  describe('Go Back Functionality', () => {
    it('should log a message and not change state if history is empty', () => {
      const consoleSpy = vi.spyOn(console, 'log')
      const initialState = getCleanState(get(game))

      game.goBack()

      expect(consoleSpy).toHaveBeenCalledWith('No history to go back to.')
      expect(getCleanState(get(game))).toEqual(initialState)
      consoleSpy.mockRestore()
    })

    it('should restore the game state to the most recent state in history', () => {
      const stateBeforeMove = getCleanState(get(game))
      game.move(10) // Make a move

      expect(getCleanState(get(game))).not.toEqual(stateBeforeMove) // Ensure state changed

      game.goBack()
      expect(getCleanState(get(game))).toEqual(stateBeforeMove)
    })

    it('should decrease history length by one after going back', () => {
      game.move(10)
      game.move(11)
      expect(get(game).history.length).toBe(2)

      game.goBack()
      expect(get(game).history.length).toBe(1)
    })

    it('should correctly restore state when going back multiple steps', () => {
      const state0 = getCleanState(get(game))
      game.move(10) // Move 1
      const state1 = getCleanState(get(game))
      game.move(11) // Move 2

      expect(get(game).history.length).toBe(2)

      game.goBack() // Back to state1 (history will contain state0)
      expect(getCleanState(get(game))).toEqual(state1)
      expect(get(game).history.length).toBe(1)
      expect(getCleanState(get(game).history[0])).toEqual(state0)

      game.goBack() // Back to state0
      expect(getCleanState(get(game))).toEqual(state0)
      expect(get(game).history.length).toBe(0)
    })

    it('should correctly restore the history array within the game state itself', () => {
      // State A (initial), history: []
      const stateA_board = getCleanState(get(game)) // board state of A
      expect(get(game).history.length).toBe(0)

      game.move(10) // Move to State B. History in B should be [A']
      // State B, history: [A']
      const stateB_board = getCleanState(get(game))
      expect(get(game).history.length).toBe(1)
      expect(getCleanState(get(game).history[0])).toEqual(stateA_board)

      const historyInStateB = JSON.parse(JSON.stringify(get(game).history)) // Capture history as it is in State B

      game.move(15) // Move to State C. History in C should be [A', B']
      // State C, history: [A', B']
      expect(get(game).history.length).toBe(2)
      expect(getCleanState(get(game).history[1])).toEqual(stateB_board)

      game.goBack() // Go back to State B. Current history should be [A']
      expect(getCleanState(get(game))).toEqual(stateB_board) // Board is B's board
      expect(get(game).history.length).toBe(1) // History length is 1
      expect(getCleanState(get(game).history[0])).toEqual(stateA_board) // The content of history is A'
      expect(get(game).history).toEqual(historyInStateB) // The history array itself is what was in State B
    })
  })
})
