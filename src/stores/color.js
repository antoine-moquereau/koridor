import { writable } from 'svelte/store'

function createColor() {
  const dark = {
    light: '#232323',
    normal: '#090909',
    dark: '#000000',
    font: '#fff', 
    fontOpposite: '#000',
    transparentLight: '#232323cc',
    transparentFont99: '#fff9',
    transparentFontcc: '#fffc'
  }
  const light = {
    light: '#ffffff',
    normal: '#f0f0f7',
    dark: '#e0e0e9',
    font: '#000', 
    fontOpposite: '#fff',
    transparentLight: '#ffffffcc',
    transparentFont99: '#0009',
    transparentFontcc: '#000c'
  }

  const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')

  const { set, subscribe, update } = writable(mediaQueryList.matches ? dark : light)

  const handleChange = event => event.matches ? set(dark) : set(light)
  mediaQueryList.addEventListener('change', handleChange)

  return {
    subscribe,
    change: () => {
      mediaQueryList.removeEventListener('change', handleChange)
      update(color => color.font === '#000' ? dark : light)
    }
  }
}

const color = createColor()

export { color }
