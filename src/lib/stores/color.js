import { browser } from '$app/environment'
import { writable } from 'svelte/store'
import { colord, extend } from 'colord'
import a11yPlugin from 'colord/plugins/a11y'

extend([a11yPlugin])

/**
 * @param {import('colord').Colord} color
 * @param {import('colord').Colord} backgroundColor
 * @param {boolean} isDark
 * @param {number} ratio
 * @returns {string}
 */
function adjustContrast(color, backgroundColor, isDark, ratio = 7.0) {
  const hslColor = color.toHsl()
  if (isDark) {
    if (hslColor.s < 100 && hslColor.l < 100) {
      const contrast = color.contrast(backgroundColor)
      if (contrast < ratio) {
        const s = Math.min(100, hslColor.s + 1)
        const l = Math.min(100, hslColor.l + ((100 - hslColor.l) * 1) / (100 - hslColor.s)) | 0
        return adjustContrast(colord({ h: hslColor.h, s, l }), backgroundColor, isDark)
      } else {
        return color.toHex()
      }
    } else {
      return '#fff'
    }
  } else {
    if (hslColor.s > 0 && hslColor.l > 0) {
      const contrast = color.contrast(backgroundColor)
      if (contrast < ratio) {
        const s = Math.min(100, hslColor.s - 1)
        const l = Math.min(100, hslColor.l - ((100 - hslColor.l) * 1) / (100 - hslColor.s)) | 0
        return adjustContrast(colord({ h: hslColor.h, s, l }), backgroundColor, isDark)
      } else {
        return color.toHex()
      }
    } else {
      return '#000'
    }
  }
}

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
    transparentFontcc: '#fffc',
    link: '#9fa8ff'
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
    transparentFontcc: '#000c',
    link: '#3344dd'
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
  mediaQueryList?.addEventListener('change', handleChange, false)

  /**
   * @param {string} light
   */
  function darkestColors(light) {
    const helper = colord(light)
    if (helper.contrast(colord('#000')) < helper.contrast(colord('#fff'))) {
      const font = '#fff'
      const normal = helper.darken(1 / helper.contrast(colord('#fff'))).toHex()
      const dark = helper.darken(2 / helper.contrast(colord('#fff'))).toHex()
      const fontOpposite = '#000'
      const transparentLight = /^#([A-Fa-f0-9]{6})$/.test(light) ? light + 'cc' : light + 'c'
      const transparentFont33 = '#fff3'
      const transparentFont99 = '#fff9'
      const transparentFontcc = '#fffc'
      const link = adjustContrast(colord('#3344dd'), helper, true)
      return {
        light,
        normal,
        dark,
        font,
        fontOpposite,
        transparentLight,
        transparentFont33,
        transparentFont99,
        transparentFontcc,
        link
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
      const link = adjustContrast(colord('#3344dd'), helper, false)
      return {
        light,
        normal,
        dark,
        font,
        fontOpposite,
        transparentLight,
        transparentFont33,
        transparentFont99,
        transparentFontcc,
        link
      }
    }
  }

  return {
    subscribe,
    /**
     * @param {string=} color
     */
    change: color => {
      mediaQueryList?.removeEventListener('change', handleChange, false)
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
