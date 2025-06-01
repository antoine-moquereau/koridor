/**
 * @file Utility functions for graph operations related to the Quoridor game board.
 * This includes creating the initial board graph, modifying it with fences,
 * pathfinding (BFS, shortest path), and adjusting the graph based on player perspectives.
 * @module lib/stores/game/graphUtils
 */

/**
 * Performs a Breadth-First Search (BFS) on a graph to find all reachable nodes from a start position.
 * The graph is represented as an adjacency list.
 *
 * @param {number[][]} graph - The graph represented as an adjacency list, where `graph[i]`
 *                             is an array of nodes adjacent to node `i`.
 * @param {number} startPosition - The index of the starting node for the BFS.
 * @returns {number[]} An array containing all node indices reachable from the `startPosition`,
 *                     including the `startPosition` itself. The order of nodes in the returned array
 *                     reflects the order they were explored by BFS.
 */
function breadthFirstSearch(graph, startPosition) {
  /**
   * @type {number[]}
   */
  const path = []
  const explored = [startPosition]
  /**
   * @type {number | undefined}
   */
  let v = startPosition
  while (v !== undefined) {
    graph[v].forEach(w => {
      if (!explored.includes(w)) {
        explored.push(w)
        path.push(w)
      }
    })
    v = path.shift()
  }
  return explored
}

/**
 * Creates an initial graph representation of an empty Quoridor board of a given size.
 * The board is a grid, and the graph is an adjacency list where each node `i` (representing a cell)
 * lists its directly connected neighbors (up, down, left, right), assuming no fences are present.
 * Cell indices range from 0 to `size*size - 1`.
 *
 * @param {number} size - The dimension of the square board (e.g., 9 for a 9x9 board).
 * @returns {number[][]} An adjacency list representing the empty board graph.
 *                       `graph[i]` contains an array of cell indices adjacent to cell `i`.
 */
function createGraph(size) {
  return Array.from({ length: size * size }, (_, i) => {
    const edges = [];
    // Check for edge cases (board boundaries) before adding neighbors.
    if (i >= size) edges.push(i - size); // Cell above (if not in the first row)
    if ((i + 1) % size !== 0) edges.push(i + 1); // Cell to the right (if not in the last column)
    if (i < size * size - size) edges.push(i + size); // Cell below (if not in the last row)
    if (i % size !== 0) edges.push(i - 1); // Cell to the left (if not in the first column)
    return edges
  })
}

/**
 * Modifies the game graph to reflect the active player's point of view,
 * specifically handling Quoridor's jump rules over opponent pawns.
 *
 * Quoridor rules for pawn movement:
 * - Pawns move one cell orthogonally (not diagonally).
 * - If an adjacent cell is occupied by an opponent's pawn, the player can jump
 *   over that pawn to the cell immediately beyond it, provided that cell is empty.
 * - If the cell for a direct jump is blocked (by a fence or the edge of the board),
 *   the player can instead move to an empty cell adjacent (diagonally) to the
 *   opponent's pawn, provided these diagonal cells are not blocked by a fence from the
 *   opponent's cell.
 *
 * This function alters the graph's adjacency list for cells around opponents
 * to include these special jump moves for the active player.
 *
 * @param {number[][]} graph - The current game graph (adjacency list), reflecting existing fences
 *                             and standard orthogonal movements.
 * @param {number[]} playerPositions - An array of current cell indices for all players.
 *                                   The index in the array corresponds to the player's index.
 * @param {number} activePlayer - The index of the currently active player.
 * @returns {number[][]} A new graph (adjacency list) adjusted for the active player's
 *                       possible moves, including jumps. The modifications are primarily to the
 *                       adjacency lists of cells that are adjacent to opponents, enabling jumps
 *                       from those cells.
 */
function getActivePlayerPointOfViewGraph(graph, playerPositions, activePlayer) {
  // Create a list of opponents with their positions.
  const opponents = playerPositions
    .filter((_, i) => i !== activePlayer)
    .map(position => ({
      position,
      /**
       * @type {number[]}
       */
      newEdges: []
    }))
  /**
   * @type {number[]}
   */
  const opponentsPositionsEdges = []
  opponents
    .map(el => el.position)
    .forEach(position =>
      graph[position].forEach(
        position =>
          !opponentsPositionsEdges.includes(position) &&
          !opponents.map(el => el.position).includes(position) &&
          opponentsPositionsEdges.push(position)
      )
    )
  opponentsPositionsEdges.forEach(position => {
    const newEdges = playerPositions
      .filter((_, i) => i !== activePlayer)
      .reduce(
        (opponentsEdges, playerPosition) => {
          const newPosition = playerPosition + playerPosition - position
          if (!graph[position].includes(playerPosition)) {
            return [...opponentsEdges]
          }
          return [
            ...opponentsEdges,
            ...(graph[playerPosition].includes(newPosition) &&
            !playerPositions.filter((_, i) => i !== activePlayer).includes(newPosition)
              ? [newPosition]
              : graph[playerPosition].filter(
                  e =>
                    e !== position &&
                    e !== newPosition &&
                    !playerPositions.filter((_, i) => i !== activePlayer).includes(e)
                ))
          ]
        },
        [
          ...graph[position].filter(
            el => !playerPositions.filter((_, i) => i !== activePlayer).includes(el)
          )
        ]
      )
    opponents.push({ position, newEdges })
  })
  return graph.map((el, i) => {
    if (opponents.map(el => el.position).includes(i)) {
      return opponents.filter(el => el.position === i)[0].newEdges
    }
    return el
  })
}

/**
 * Updates the game graph to reflect the placement of a horizontal fence.
 * A horizontal fence is 2 cells wide and effectively sits on the edge between two rows.
 * It blocks travel between `position` and `position + size`, and between
 * `position + 1` and `position + 1 + size`.
 *
 * @param {number[][]} graph - The current graph (adjacency list).
 * @param {number} position - The cell index of the top-left cell of the 2x1 area
 *                            that the fence affects. For a 9x9 board, if `position` is 0,
 *                            the fence is between cells 0 and 9, and cells 1 and 10.
 * @returns {number[][]} A new graph (adjacency list) with edges removed where the fence blocks paths.
 *                       The original graph is not modified.
 */
function placeHorizontalFence(graph, position) {
  const size = Math.sqrt(graph.length); // Determine board size from graph length
  return graph.map((edges, cellIndex) => {
    // A horizontal fence placed at `position` affects connections for 4 cells:
    // 1. `position`: loses connection to `position + size` (cell below it).
    // 2. `position + 1`: loses connection to `position + 1 + size` (cell below it).
    // 3. `position + size`: loses connection to `position` (cell above it).
    // 4. `position + size + 1`: loses connection to `position + 1` (cell above it).
    if (cellIndex === position) return edges.filter(edge => edge !== position + size);
    if (cellIndex === position + 1) return edges.filter(edge => edge !== position + 1 + size);
    if (cellIndex === position + size) return edges.filter(edge => edge !== position);
    if (cellIndex === position + size + 1) return edges.filter(edge => edge !== position + 1);
    return edges;
  });
}

/**
 * Updates the game graph to reflect the placement of a vertical fence.
 * A vertical fence is 2 cells tall and effectively sits on the edge between two columns.
 * It blocks travel between `position` and `position + 1`, and between
 * `position + size` and `position + size + 1`.
 *
 * @param {number[][]} graph - The current graph (adjacency list).
 * @param {number} position - The cell index of the top-left cell of the 1x2 area
 *                            that the fence affects. For a 9x9 board, if `position` is 0,
 *                            the fence is between cells 0 and 1, and cells 9 and 10.
 * @returns {number[][]} A new graph (adjacency list) with edges removed where the fence blocks paths.
 *                       The original graph is not modified.
 */
function placeVerticalFence(graph, position) {
  const size = Math.sqrt(graph.length); // Determine board size
  return graph.map((edges, cellIndex) => {
    // A vertical fence placed at `position` affects connections for 4 cells:
    // 1. `position`: loses connection to `position + 1` (cell to its right).
    // 2. `position + 1`: loses connection to `position` (cell to its left).
    // 3. `position + size`: loses connection to `position + size + 1` (cell to its right).
    // 4. `position + size + 1`: loses connection to `position + size` (cell to its left).
    if (cellIndex === position) return edges.filter(edge => edge !== position + 1);
    if (cellIndex === position + 1) return edges.filter(edge => edge !== position);
    if (cellIndex === position + size) return edges.filter(edge => edge !== position + size + 1);
    if (cellIndex === position + size + 1) return edges.filter(edge => edge !== position + size);
    return edges;
  });
}

/**
 * Finds the shortest path between a start position and any one of several possible end positions
 * in a graph, using a Breadth-First Search (BFS) based approach.
 * The graph is an adjacency list. The function reconstructs the path once an end position is reached.
 * If multiple end positions are reachable at the same shortest distance, the one first encountered by
 * the BFS traversal (which can be somewhat arbitrary based on graph structure and neighbor order)
 * will determine the path.
 *
 * @param {number[][]} graph - The graph as an adjacency list. `graph[i]` contains neighbors of cell `i`.
 * @param {number} startPosition - The starting node (cell index).
 * @param {number[]} endPositions - An array of target node indices (cell indices). The path to the
 *                                 first one of these reached by BFS will be returned.
 * @returns {number[]} An array of node indices representing the shortest path from `startPosition`
 *                     to one of the `endPositions`. The path includes the first reached `endPosition`
 *                     but *does not* include the `startPosition`. Returns an empty array if no path
 *                     is found to any of the `endPositions`.
 */
function shortestPath(graph, startPosition, endPositions) {
  let stopSearch = false; // Flag to stop BFS once an end position is found
  /**
   * Stores parent pointers to reconstruct the path.
   * Each element is an object: { key: childNodeIndex, from: parentNodeIndex }
   * @type {{ key: number; from: number; }[]}
   */
  const parentLinks = [];
  /**
   * Queue for BFS traversal. Stores nodes to visit.
   * @type {number[]}
   */
  const visitQueue = [];
  const exploredNodes = [startPosition]; // Nodes that have been visited or added to the queue

  visitQueue.push(startPosition); // Start BFS from the startPosition

  let currentNode = startPosition;
  while (visitQueue.length > 0 && !stopSearch) {
    currentNode = visitQueue.shift(); // Get the next node from the queue

    if (graph[currentNode]) { // Check if currentNode exists in the graph
      for (const neighbor of graph[currentNode]) {
        if (!exploredNodes.includes(neighbor) && !stopSearch) {
          exploredNodes.push(neighbor);
          visitQueue.push(neighbor);
          parentLinks.push({ key: neighbor, from: currentNode });
          if (endPositions.includes(neighbor)) {
            stopSearch = true; // Found one of the end positions
            // No break here, BFS level needs to complete for shortest path property if multiple endPositions at same level
          }
        }
      }
    }
  }

  const resultPath = [];
  // Find the specific end position that was reached.
  // If multiple were reached at the same BFS depth, this picks one based on `exploredNodes` order.
  let targetNode = exploredNodes.find(node => endPositions.includes(node) && parentLinks.some(link => link.key === node));

  // If no endPosition was actually linked via parentLinks (e.g. startPosition is an endPosition)
  if (!targetNode && endPositions.includes(startPosition)) {
      return []; // Path to itself is empty as per spec (path doesn't include start)
  }

  if (!targetNode) {
    return []; // No path found to any of the end positions
  }

  // Reconstruct the path backwards from the targetNode using parentLinks
  let pathTracer = targetNode;
  while (pathTracer !== startPosition) {
    resultPath.push(pathTracer);
    const link = parentLinks.find(entry => entry.key === pathTracer);
    if (!link) break; // Should not happen if targetNode was properly found
    pathTracer = link.from;
  }
  return resultPath.reverse(); // Reverse to get path from start to end (excluding start)
}

export {
  breadthFirstSearch,
  createGraph,
  getActivePlayerPointOfViewGraph,
  placeHorizontalFence,
  placeVerticalFence,
  shortestPath
}
