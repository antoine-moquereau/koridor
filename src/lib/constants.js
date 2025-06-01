/**
 * @file Defines global constants used throughout the Quoridor game application.
 * These constants help in standardizing game parameters like board size and fence counts.
 * Using constants improves maintainability and readability of the codebase.
 * @module lib/constants
 */

/**
 * The total number of fences available in a standard Quoridor game.
 * This number is typically divided among the players. For example, in a 2-player game,
 * each player gets 10 fences. In a 4-player game, each gets 5.
 * @type {number}
 */
const FENCES = 20

/**
 * The size of one dimension of the square Quoridor game board.
 * A standard board is 9x9 cells. This means `SIZE` will be 9.
 * The total number of cells on the board is `SIZE * SIZE`.
 * @type {number}
 */
const SIZE = 9

export { FENCES, SIZE }
