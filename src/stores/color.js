import { browser } from '$app/environment'
import { writable } from 'svelte/store'
import { colord, extend } from 'colord'
import a11yPlugin from 'colord/plugins/a11y'

extend([a11yPlugin])

function createColor() {
  const dark = {
    light: '#232323',
    normal: '#090909',
    dark: '#000000',
    font: '#fff',
    fontOpposite: '#000',
    transparentLight: '#232323cc',
    transparentFont33: '#fff3',
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
    transparentFont33: '#0003',
    transparentFont99: '#0009',
    transparentFontcc: '#000c'
  }

  /**
   * @type {MediaQueryList | undefined}
   */
  let mediaQueryList

  if (browser) {
    mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
  }

  const { set, subscribe, update } = writable(mediaQueryList?.matches ? dark : light)

  /**
   * @param {MediaQueryListEvent} event
   */
  const handleChange = event => (event.matches ? set(dark) : set(light))
  mediaQueryList?.addEventListener('change', handleChange)

  /**
   * @param {string} light
   */
  function darkestColors(light) {
    const helper = colord(light)
    if (helper.isDark()) {
      const font = '#fff'
      const normal = helper.darken(1 / helper.contrast(colord('#fff'))).toHex()
      const dark = helper.darken(2 / helper.contrast(colord('#fff'))).toHex()
      const fontOpposite = '#000'
      const transparentLight = /^#([A-Fa-f0-9]{6})$/.test(light) ? light + 'cc' : light + 'c'
      const transparentFont33 = '#fff3'
      const transparentFont99 = '#fff9'
      const transparentFontcc = '#fffc'
      return {
        light,
        normal,
        dark,
        font,
        fontOpposite,
        transparentLight,
        transparentFont33,
        transparentFont99,
        transparentFontcc
      }
    } else {
      const font = '#000'
      const normal = helper.lighten(1 / helper.contrast(colord('#000'))).toHex()
      const dark = helper.lighten(2 / helper.contrast(colord('#000'))).toHex()
      const fontOpposite = '#fff'
      const transparentLight = /^#([A-Fa-f0-9]{6})$/.test(light) ? light + 'cc' : light + 'c'
      const transparentFont33 = '#0003'
      const transparentFont99 = '#0009'
      const transparentFontcc = '#000c'
      return {
        light: dark,
        normal,
        dark: light,
        font,
        fontOpposite,
        transparentLight,
        transparentFont33,
        transparentFont99,
        transparentFontcc
      }
    }
  }

  return {
    subscribe,
    /**
     * @param {string=} color
     */
    change: color => {
      mediaQueryList?.removeEventListener('change', handleChange)
      if (color) {
        set(darkestColors(color))
        return
      }
      update(color => (color.font === '#000' ? dark : light))
    }
  }
}

const color = createColor()

export { color }
