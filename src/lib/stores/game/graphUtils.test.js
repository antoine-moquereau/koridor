import { describe, it, expect } from 'vitest'
import { createGraph, shortestPath } from './graphUtils'

describe('createGraph', () => {
  it('should create a graph with the correct number of nodes for a given size', () => {
    const size2 = createGraph(2)
    expect(size2.length).toBe(4) // 2x2 grid

    const size3 = createGraph(3)
    expect(size3.length).toBe(9) // 3x3 grid
  })

  it('should create correct edges for a 2x2 graph', () => {
    const graph = createGraph(2)
    // Node 0 (top-left): expects [right, down] -> [1, 2]
    expect(graph[0].sort()).toEqual([1, 2].sort())
    // Node 1 (top-right): expects [left, down] -> [0, 3]
    expect(graph[1].sort()).toEqual([0, 3].sort())
    // Node 2 (bottom-left): expects [up, right] -> [0, 3]
    expect(graph[2].sort()).toEqual([0, 3].sort())
    // Node 3 (bottom-right): expects [up, left] -> [1, 2]
    expect(graph[3].sort()).toEqual([1, 2].sort())
  })

  it('should create correct edges for a 3x3 graph (corners and center)', () => {
    const graph = createGraph(3)
    // Node 0 (top-left): expects [1, 3]
    expect(graph[0].sort()).toEqual([1, 3].sort())
    // Node 2 (top-right): expects [1, 5]
    expect(graph[2].sort()).toEqual([1, 5].sort())
    // Node 4 (center): expects [1, 3, 5, 7] (up, left, right, down from its perspective)
    // Actual: up from 4 is 1, left from 4 is 3, right from 4 is 5, down from 4 is 7
    expect(graph[4].sort()).toEqual([1, 3, 5, 7].sort())
    // Node 6 (bottom-left): expects [3, 7]
    expect(graph[6].sort()).toEqual([3, 7].sort())
    // Node 8 (bottom-right): expects [5, 7]
    expect(graph[8].sort()).toEqual([5, 7].sort())
  })
})

describe('shortestPath', () => {
  // Graph for testing:
  // 0 - 1 - 2
  // |   |
  // 3 - 4
  // Path 0->2: [0,1,2] (length 2)
  // Path 0->4: [0,1,4] (length 2) or [0,3,4] (length 2)
  const graph = [
    [1, 3], // 0
    [0, 2, 4], // 1
    [1], // 2
    [0, 4], // 3
    [1, 3] // 4
  ]

  it('should find the shortest path when one exists', () => {
    // Path from 0 to 2 is [1, 2] (nodes in path, excluding start)
    expect(shortestPath(graph, 0, [2])).toEqual([1, 2])
  })

  it('should find one of the shortest paths if multiple exist', () => {
    const path = shortestPath(graph, 0, [4])
    // Possible paths: [1, 4] or [3, 4]
    const isPath1 = path.length === 2 && path[0] === 1 && path[1] === 4
    const isPath2 = path.length === 2 && path[0] === 3 && path[1] === 4
    expect(isPath1 || isPath2).toBe(true)
  })

  it('should return an empty array if start and end are the same', () => {
    expect(shortestPath(graph, 0, [0])).toEqual([])
  })

  it('should return an empty array if no path exists to any end position', () => {
    // Create a disconnected graph scenario for node 5
    const disconnectedGraph = [...graph, []] // Add node 5 with no edges
    expect(shortestPath(disconnectedGraph, 0, [5])).toEqual([])
  })

  it('should handle multiple end positions, finding the closest', () => {
    // Path to 2 is [1, 2], path to 4 could be [1, 4] or [3, 4]
    // Both are of length 2 from start 0. BFS might find one over the other.
    // If endPositions includes a node reachable "earlier" in BFS traversal, it should be preferred.
    // In our BFS implementation, for 0 -> [2,4], 2 is usually explored via 1 before 4 is.
    expect(shortestPath(graph, 0, [4, 2])).toEqual([1, 2]) // Expecting path to 2
    expect(shortestPath(graph, 0, [2, 4])).toEqual([1, 2]) // Order shouldn't matter if path length is same
  })

  it('should work with a linear graph', () => {
    // 0 - 1 - 2 - 3
    const linearGraph = [
      [1], // 0
      [0, 2], // 1
      [1, 3], // 2
      [2] // 3
    ]
    expect(shortestPath(linearGraph, 0, [3])).toEqual([1, 2, 3])
  })

  it('should return empty array for out-of-bounds startPosition if graph is not well-defined there', () => {
    // This test depends on how graph[startPosition] behaves.
    // If graph[7] is undefined or has no valid neighbors, it should result in no path.
    expect(shortestPath(graph, 7, [0])).toEqual([])
  })
})
