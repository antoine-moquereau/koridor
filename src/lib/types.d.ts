import { CrossfadeParams, TransitionConfig } from 'svelte/transition'

type CrossfadeTransition = (
  node: Element,
  params: CrossfadeParams & { key: any }
) => () => TransitionConfig

interface Error {
  position: number
  path: number[]
  shortestPath: number[]
  player: number
}

interface FenceHover {
  orientation?: Orientation
  position?: number
}

type Orientation = 'horizontal' | 'vertical'

type Players = 2 | 4

interface SpaceError {
  index: number
  marked: boolean
  player: number
  shortestPath: string
}

export { CrossfadeTransition, Error, FenceHover, Orientation, Players, SpaceError }
