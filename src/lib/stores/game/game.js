/**
 * @file Manages the core game state and logic for the Quoridor game.
 * This includes player positions, fence placements, active player, winning conditions,
 * and derived state for the active player's point of view.
 * @module lib/stores/game/game
 */
import { derived, writable } from 'svelte/store'

import { FENCES, SIZE } from '$lib/constants'
import {
  breadthFirstSearch,
  createGraph,
  getActivePlayerPointOfViewGraph,
  placeHorizontalFence,
  placeVerticalFence,
  shortestPath
} from './graphUtils'

/**
 * @typedef {import('$lib/types').Error} ErrorObject
 * @typedef {import('$lib/types').Players} PlayersCount
 */

/**
 * Represents the positions of placed fences on the game board.
 * Each number in the arrays typically refers to the top-left cell index involved in the fence placement.
 * @typedef {Object} FencePositions
 * @property {number[]} horizontal - Array of cell indices where horizontal fences are placed.
 * @property {number[]} vertical - Array of cell indices where vertical fences are placed.
 */

/**
 * Represents the state of all fences in the game.
 * @typedef {Object} FencesState
 * @property {FencePositions} positions - Object containing the positions of all horizontal and vertical fences.
 * @property {number[]} available - Array indicating the number of fences still available to each player.
 *                                  The index in the array corresponds to the player index.
 */

/**
 * Represents the complete state of a Quoridor game at any point in time.
 * @typedef {Object} GameState
 * @property {FencesState} fences - Current state of all fences on the board and available to players.
 * @property {number[]} playerPositions - Array of cell indices representing the current position of each player.
 *                                       The index in the array corresponds to the player index.
 * @property {number} activePlayer - The index (0-based) of the player whose turn it is.
 * @property {number[][]} graph - An adjacency list representation of the game board, where each inner array
 *                                 lists the reachable neighboring cell indices. This graph is updated
 *                                 as fences are placed.
 * @property {number[][]} playerWinningPositions - An array where each sub-array contains the cell indices
 *                                                that the corresponding player must reach to win the game.
 */

/**
 * Creates and returns a default game state object.
 * This state initializes player positions, fence counts, the game graph, and winning conditions
 * based on the specified number of players.
 * @param {PlayersCount} players - The number of players for the game (typically 2 or 4).
 * @returns {GameState} A new game state object initialized for the start of a game.
 */
const defaultGame = (players) => ({
  fences: {
    positions: {
      horizontal: [],
      vertical: []
    },
    available: new Array(players).fill(FENCES / players) // Distribute fences equally
  },
  // Standard starting positions based on number of players.
  // For SIZE 9: P1 (idx 0) at cell 4 (bottom center). P2 (idx 1) at cell 76 (top center).
  // For 4P: P3 (idx 2) at cell 44 (middle right), P4 (idx 3) at cell 36 (middle left).
  playerPositions: players === 2 ? [4, 76] : [4, 44, 76, 36],
  activePlayer: 0, // Player 1 (index 0) always starts.
  graph: createGraph(SIZE), // Initialize the board graph without any fences.
  // Define winning positions for each player based on board SIZE.
  playerWinningPositions:
    players === 2
      ? [
          Array.from({ length: SIZE }, (_, i) => SIZE * SIZE - i - 1), // Player 1 (idx 0) wins by reaching any cell in the top row.
          Array.from({ length: SIZE }, (_, i) => i) // Player 2 (idx 1) wins by reaching any cell in the bottom row.
        ]
      : [
          Array.from({ length: SIZE }, (_, i) => SIZE * SIZE - i - 1), // Player 1 (idx 0) wins at the top row.
          Array.from({ length: SIZE }, (_, i) => i * SIZE), // Player 2 (idx 1) wins at the leftmost column.
          Array.from({ length: SIZE }, (_, i) => i), // Player 3 (idx 2) wins at the bottom row.
          Array.from({ length: SIZE }, (_, i) => i * SIZE + SIZE - 1) // Player 4 (idx 3) wins at the rightmost column.
        ]
})

/**
 * Creates and manages the Quoridor game state using a Svelte writable store.
 * This factory function initializes the game with a default of 4 players and provides
 * methods to interact with and update the game state, such as moving players,
 * placing fences, and resetting the game.
 *
 * @returns {Object} An object containing Svelte store subscription and game action methods.
 * @property {Function} subscribe - The Svelte store `subscribe` method for the game state.
 * @property {Function} move - Action to move the current active player to a new position.
 *                             Expects the target cell index as an argument.
 * @property {Function} placeHorizontalFence - Action to place a horizontal fence on the board.
 *                                            Expects the top-left cell index of the fence as an argument.
 * @property {Function} placeVerticalFence - Action to place a vertical fence on the board.
 *                                          Expects the top-left cell index of the fence as an argument.
 * @property {Function} set - Action to reset the game to a new default state for a specified number of players.
 *                            Expects the number of players (2 or 4) as an argument.
 */
function createGame() {
  const { set, subscribe, update } = writable(defaultGame(4)) // Default to a 4-player game.

  /**
   * Decrements the available fence count for the currently active player.
   * This is an internal helper function.
   * @param {GameState} currentGame - The current game state.
   * @returns {number[]} A new array with the updated fence counts for each player.
   */
  const decrementActivePlayerAvailableFences = (currentGame) =>
    currentGame.fences.available.map((fenceCount, playerIndex) =>
      playerIndex === currentGame.activePlayer ? fenceCount - 1 : fenceCount
    )

  /**
   * Determines the index of the next active player in a turn-based sequence.
   * This is an internal helper function.
   * @param {GameState} currentGame - The current game state.
   * @returns {number} The index of the next player to take a turn.
   */
  const nextActivePlayer = (currentGame) =>
    currentGame.activePlayer === currentGame.playerPositions.length - 1 ? 0 : currentGame.activePlayer + 1

  return {
    subscribe,
    /**
     * Updates the game state by moving the active player to the specified new position.
     * After the move, it advances the turn to the next player.
     * @param {number} newPosition - The cell index to which the active player will move.
     */
    move: (newPosition) => {
      update((currentGame) => ({
        ...currentGame,
        playerPositions: currentGame.playerPositions.map((currentPos, playerIndex) =>
          playerIndex === currentGame.activePlayer ? newPosition : currentPos
        ),
        activePlayer: nextActivePlayer(currentGame)
      }))
    },
    /**
     * Updates the game state by placing a horizontal fence at the specified position.
     * This action also decrements the active player's available fence count,
     * updates the game graph to reflect the new barrier, and advances the turn.
     * @param {number} fencePosition - The cell index for the top-left part of the horizontal fence.
     */
    placeHorizontalFence: (fencePosition) => {
      update((currentGame) => ({
        ...currentGame,
        fences: {
          positions: {
            horizontal: [...currentGame.fences.positions.horizontal, fencePosition],
            vertical: currentGame.fences.positions.vertical
          },
          available: decrementActivePlayerAvailableFences(currentGame)
        },
        activePlayer: nextActivePlayer(currentGame),
        graph: placeHorizontalFence(currentGame.graph, fencePosition) // Assumes this updates the graph and returns it
      }))
    },
    /**
     * Updates the game state by placing a vertical fence at the specified position.
     * Similar to placing a horizontal fence, this updates fence counts, the graph, and player turn.
     * @param {number} fencePosition - The cell index for the top-left part of the vertical fence.
     */
    placeVerticalFence: (fencePosition) => {
      update((currentGame) => ({
        ...currentGame,
        fences: {
          positions: {
            horizontal: currentGame.fences.positions.horizontal,
            vertical: [...currentGame.fences.positions.vertical, fencePosition]
          },
          available: decrementActivePlayerAvailableFences(currentGame)
        },
        activePlayer: nextActivePlayer(currentGame),
        graph: placeVerticalFence(currentGame.graph, fencePosition) // Assumes this updates the graph and returns it
      }))
    },
    /**
     * Resets the game to a new default state based on the specified number of players.
     * @param {PlayersCount} playersCount - The number of players for the new game (e.g., 2 or 4).
     */
    set: (playersCount) => set(defaultGame(playersCount))
  }
}

/**
 * The main Svelte store holding the {@link GameState} and providing methods for game interaction.
 * @type {ReturnType<typeof createGame>}
 */
const game = createGame()

/**
 * A Svelte derived store that computes the winner of the game.
 * It observes the `game` store and updates when any player's position
 * matches one of their designated winning positions.
 *
 * @type {import('svelte/store').Readable<number|undefined>} - A readable store that emits the
 * winning player's number (1-indexed) if there is a winner, otherwise `undefined`.
 */
const winner = derived(game, ($game) => {
  let winnerPlayer = undefined // Use a more descriptive variable name for clarity
  $game.playerPositions.forEach((position, playerIndex) => {
    // Check if the player's current position is one of their winning positions
    if ($game.playerWinningPositions[playerIndex].includes(position)) {
      winnerPlayer = playerIndex + 1 // playerIndex is 0-indexed, so add 1 for 1-indexed player number
    }
  })
  return winnerPlayer
})

/**
 * Calculates potential "errors" for fence placements from each player's perspective.
 * An "error" in this context means that placing a fence at a certain position would
 * illegally block a player's last path to their winning side. This is a critical check
 * for Quoridor game rules, as fences cannot be placed if they completely remove all paths
 * for any player to their destination.
 *
 * The function iterates through all players (ordered from the active player's perspective)
 * and then considers every possible cell on the board as a potential spot for placing
 * both horizontal and vertical fences. For each such hypothetical fence placement:
 * 1. It simulates the fence being placed by modifying a temporary copy of the graph.
 * 2. It performs a Breadth-First Search (BFS) from the player's current position on this
 *    modified graph to see what cells are still reachable.
 * 3. The `blockWinningCase` helper function then checks if this set of reachable cells
 *    means the player has no path left to any of their designated winning cells.
 * 4. If a player is indeed blocked, an {@link ErrorObject} is created and added to the
 *    respective `horizontalErrors` or `verticalErrors` array.
 *
 * @param {GameState} $game - The current game state obtained from the Svelte store.
 * @returns {{horizontal: ErrorObject[], vertical: ErrorObject[]}} An object containing two arrays:
 *  - `horizontal`: A list of {@link ErrorObject}s for horizontal fence placements that would block a player.
 *  - `vertical`: A list of {@link ErrorObject}s for vertical fence placements that would block a player.
 * Each {@link ErrorObject} details the problematic fence's position, the resulting (blocked) path,
 * the player's original shortest path (before the hypothetical fence), and the index of the player who would be blocked.
 */
function getFencePlacementErrors($game) {
  const players = $game.playerPositions.length; // Number of players in the game

  /**
   * Checks if a player is completely blocked from reaching their winning side,
   * given the set of cells they can reach after a hypothetical fence placement.
   * This function encapsulates the game's specific winning conditions for each player
   * (e.g., Player 1 wins at top row, Player 2 at bottom/left, etc.).
   *
   * @param {number[]} exploredPath - An array of cell indices that are reachable by the player
   *                                  *after* a simulated fence has been placed.
   * @param {number} playerIndexInOrderedLoop - The index of the player being evaluated within the
   *                                 `orderedPlayerPositions` loop. This index is relative to the
   *                                 active player (0 is the active player, 1 is the next, and so on).
   * @returns {boolean} Returns `true` if the player is determined to be blocked from all
   *                    their winning positions, and `false` otherwise.
   */
  const blockWinningCase = (exploredPath, playerIndexInOrderedLoop) => {
    const absolutePlayerIndex = (playerIndexInOrderedLoop + $game.activePlayer) % players; // Determine the actual player index (0-3)
    // prettier-ignore
    switch (absolutePlayerIndex) {
      case 0: // Player 1 (typically starts bottom, aims for top row)
        return exploredPath.every(cellIndex => cellIndex < SIZE * SIZE - SIZE); // Blocked if all reachable cells are NOT in the top row.
      case 1: // Player 2
        return players === 2
          ? exploredPath.every(cellIndex => cellIndex > SIZE - 1) // 2P game: P2 (top to bottom) - blocked if all reachable cells are NOT in the bottom row.
          : exploredPath.every(cellIndex => cellIndex % SIZE !== 0); // 4P game: P2 (right to left) - blocked if all reachable cells are NOT in the leftmost column.
      case 2: // Player 3 (4P game, typically top to bottom)
        return exploredPath.every(cellIndex => cellIndex > SIZE - 1); // Blocked if all reachable cells are NOT in the bottom row.
      case 3: // Player 4 (4P game, typically left to right)
        return exploredPath.every(cellIndex => cellIndex % SIZE !== SIZE - 1); // Blocked if all reachable cells are NOT in the rightmost column.
      default: return false
    }
  }

  /** @type {ErrorObject[]} */
  const horizontalErrors = []
  /** @type {ErrorObject[]} */
  const verticalErrors = []

  // Iterate through players starting from the active player, then in game order.
  // This is important because Quoridor rules state a fence cannot be placed if it
  // blocks *any* player's last path, not just the active player.
  const orderedPlayerPositions = $game.playerPositions
    .slice($game.activePlayer) // Start with active player
    .concat($game.playerPositions.slice(0, $game.activePlayer)) // Wrap around to other players

  orderedPlayerPositions.forEach((startPosition, playerIndexInLoop) => {
    const currentPlayerAbsoluteIndex = (playerIndexInLoop + $game.activePlayer) % players
    const currentWinningPositions = $game.playerWinningPositions[currentPlayerAbsoluteIndex]
    // Determine the shortest path for the current player *before* any hypothetical fence placement.
    const sP = shortestPath($game.graph, startPosition, currentWinningPositions)

    // Test placing a fence at every possible location on the board.
    // `fenceCellIndex` refers to the top-left cell of a potential 2x1 or 1x2 fence area.
    for (let fenceCellIndex = 0; fenceCellIndex < SIZE * SIZE; fenceCellIndex++) {
      // Simulate and check horizontal fence placement
      const graphAfterSimulatedHSFence = placeHorizontalFence($game.graph, fenceCellIndex)
      const pathAfterSimulatedHSFence = breadthFirstSearch(graphAfterSimulatedHSFence, startPosition)
      if (blockWinningCase(pathAfterSimulatedHSFence, playerIndexInLoop)) {
        horizontalErrors.push({
          position: fenceCellIndex, // The problematic fence position
          path: pathAfterSimulatedHSFence, // The (lack of) path after placing this fence
          shortestPath: sP, // The player's shortest path *before* this fence
          player: currentPlayerAbsoluteIndex // The player who would be blocked
        })
      }

      // Simulate and check vertical fence placement
      const graphAfterSimulatedVSFence = placeVerticalFence($game.graph, fenceCellIndex)
      const pathAfterSimulatedVSFence = breadthFirstSearch(graphAfterSimulatedVSFence, startPosition)
      if (blockWinningCase(pathAfterSimulatedVSFence, playerIndexInLoop)) {
        verticalErrors.push({
          position: fenceCellIndex,
          path: pathAfterSimulatedVSFence,
          shortestPath: sP,
          player: currentPlayerAbsoluteIndex
        })
      }
    }
  })

  return { horizontal: horizontalErrors, vertical: verticalErrors }
}

/**
 * A Svelte derived store that provides game data tailored to the active player's perspective.
 * This is crucial for UI rendering and validating moves from the viewpoint of the player whose turn it is.
 * It recalculates whenever the base `game` state changes.
 *
 * The store provides two main pieces of information:
 *  1. `error`: Contains arrays of horizontal and vertical fence placements that are deemed illegal
 *     because they would completely block a player's path to their winning side. This is determined
 *     by {@link getFencePlacementErrors}. This information can be used by the UI to prevent or
 *     highlight such illegal moves.
 *  2. `graph`: The game board's graph structure, specifically adjusted for the active player.
 *     This version of the graph, generated by {@link getActivePlayerPointOfViewGraph}, incorporates
 *     special Quoridor rules like allowing jumps over an opponent if they are directly in front.
 *
 * @type {import('svelte/store').Readable<{error: {horizontal: ErrorObject[], vertical: ErrorObject[]}, graph: number[][]}>}
 * A readable Svelte store. When subscribed to, it provides an object with:
 *   - `error`: An object with `horizontal` and `vertical` arrays of {@link ErrorObject}s.
 *   - `graph`: An adjacency list representing the board from the active player's view.
 */
const activePlayerPointOfView = derived(game, ($game) => {
  const error = getFencePlacementErrors($game)
  const graph = getActivePlayerPointOfViewGraph(
    $game.graph,
    $game.playerPositions,
    $game.activePlayer
  )
  return { error, graph }
})

// Export defaultGame for testing purposes
export { activePlayerPointOfView, game, winner, defaultGame }
