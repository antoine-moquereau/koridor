function breadthFirstSearch(graph, startPosition) {
  const path = []
  const explored = [startPosition]
  path.push(startPosition)
  while (path.length !== 0) {
    const v = path.shift()
    graph[v].forEach(w => {
      if (!explored.includes(w)) {
        explored.push(w)
        path.push(w)
      }
    })
  }
  return explored
}

function createGraph(size) {
  return Array.from({ length: size * size }, (_, i) => {
    const edges = []
    if (i > size - 1) edges.push(i - size)
    if ((i + 1) % size) edges.push(i + 1)
    if (i < size * size - size) edges.push(i + size)
    if (i % size) edges.push(i - 1)
    return edges
  })
}

function getActivePlayerPointOfViewGraph(graph, playerPositions, activePlayer) {
  const opponents = playerPositions
    .filter((_, i) => i !== activePlayer)
    .map(position => ({ position, newEdges: [] }))
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
            ...(
              graph[playerPosition].includes(newPosition) &&
              !playerPositions
                .filter((_, i) => i !== activePlayer)
                .includes(newPosition)
                  ? [newPosition]
                  : graph[playerPosition].filter(
                    e =>
                      e !== position &&
                      e !== newPosition &&
                      !playerPositions
                        .filter((_, i) => i !== activePlayer)
                        .includes(e)
                  )
            ),
          ]
        },
        [
          ...graph[position].filter(
            el =>
              !playerPositions
                .filter((_, i) => i !== activePlayer)
                .includes(el)
          ),
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

function placeHorizontalFence(graph, position) {
  const size = Math.sqrt(graph.length)
  return graph.map((el, i) => {
    if (i === position) return el.filter(e => e !== i + size)
    if (i === position + 1) return el.filter(e => e !== i + size)
    if (i === position + size) return el.filter(e => e !== i - size)
    if (i === position + size + 1) return el.filter(e => e !== i - size)
    return el
  })
}

function placeVerticalFence(graph, position) {
  const size = Math.sqrt(graph.length)
  return graph.map((el, i) => {
    if (i === position) return el.filter(e => e !== i + 1)
    if (i === position + 1) return el.filter(e => e !== i - 1)
    if (i === position + size) return el.filter(e => e !== i + 1)
    if (i === position + size + 1) return el.filter(e => e !== i - 1)
    return el
  })
}

function shortestPath(graph, startPosition, endPositions) {
  let stop = false
  const keyFrom = []
  const path = []
  const explored = [startPosition]
  path.push(startPosition)
  while (path.length !== 0 && !stop) {
    const v = path.shift()
    graph[v].forEach(w => {
      if (!explored.includes(w) && !stop) {
        explored.push(w)
        path.push(w)
        keyFrom.push({ key: w, from: v })
        if(endPositions.includes(w)) {
          stop = true
        }
      }
    })
  }
  const shortestPath = []
  let from = explored[explored.length - 1]
  while (from !== explored[0]) {
    shortestPath.push(from)
    from = keyFrom.filter(e => e.key === from)[0].from
  }
  return shortestPath.reverse()
}

export { breadthFirstSearch, createGraph, getActivePlayerPointOfViewGraph, placeHorizontalFence, placeVerticalFence, shortestPath }
