/**
 * @typedef {Object} Image
 * @property {typeof import('svelte').SvelteComponent} component
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} DragOptions
 * @property {string=} type
 * @property {Image=} image
 */

/**
 * @typedef {Object} DropOptions
 * @property {string=} type
 */

let shouldBePassive = false
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function () {
      shouldBePassive = CSS.supports('touch-action', 'none')
    }
  })
  window.addEventListener('testPassive', () => {}, opts)
  window.removeEventListener('testPassive', () => {}, opts)
} catch (e) {}

/**
 * @param {HTMLElement} node
 * @param {DragOptions} options
 */
function drag(node, options) {
  /**
   * @type {string}
   */
  let type
  /**
   * @type {Image | undefined}
   */
  let image

  /**
   * @type {HTMLDivElement | undefined}
   */
  let imageElement
  /**
   * @type {{ x: number; y: number; width: number; height: number; }}
   */
  let offset
  /**
   * @type {Element | null}
   */
  let lastDrop
  /**
   * @type {NodeJS.Timeout}
   */
  let timeout

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  function getImageStyle(x, y, width, height, visibility = 'visible', opacity = '0.9') {
    return `
      height:${height}px;
      left:0;
      opacity:${opacity};
      overflow:visible;
      position:absolute;
      top:0;
      transform: translate(${x - width / 2}px, ${y - height - 60}px);
      transition: opacity .2s;
      visibility: ${visibility};
      width:${width}px;
      z-index:100;
    `
  }

  /**
   * @param {DragOptions} options
   */
  function update(options = {}) {
    type = options.type || 'default'
    if (imageElement) document.body.removeChild(imageElement)
    if (options.image) {
      image = options.image
      imageElement = document.createElement('div')
      const { x, y, width, height } = node.getBoundingClientRect()
      offset = { x, y, width, height }
      imageElement.style.cssText = getImageStyle(
        x + width / 2,
        y + image.height / 2 + 60 + height / 2,
        image.width,
        image.height,
        'hidden',
        '0'
      )
      new image.component({ target: imageElement })
      document.body.appendChild(imageElement)
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  function elementFromPoint(x, y) {
    return document.elementFromPoint(x - (image?.width || 0) / 2, y - 60 - (image?.height || 0))
  }

  /**
   * @param {TouchEvent} event
   */
  function handleTouchstart(event) {
    if (!shouldBePassive) event.preventDefault()
    node.dispatchEvent(new Event('dragstart'))
    node.classList.add('dragging')
    if (image && imageElement) {
      const { clientX, clientY } = event.changedTouches[0]
      imageElement.style.cssText = getImageStyle(clientX, clientY, image.width, image.height)
      imageElement.style.transition = 'opacity .7s, transform .7s'
    }
  }

  /**
   * @param {TouchEvent} event
   */
  function handleTouchmove(event) {
    const { clientX, clientY } = event.changedTouches[0]
    if (image && imageElement) {
      imageElement.style.cssText = getImageStyle(
        clientX,
        clientY,
        image.width,
        image.height,
        'hidden'
      )
    }
    const drop = elementFromPoint(clientX, clientY)
    if (imageElement) imageElement.style.visibility = 'visible'
    if (drop instanceof HTMLElement && drop.dataset.dropType === type) {
      drop?.dispatchEvent(new Event('dragover'))
      drop?.classList.add('dragover')
      if (imageElement) imageElement.style.opacity = '0.3'
    } else if (imageElement) {
      imageElement.style.opacity = '0.9'
    }
    if (lastDrop !== drop) {
      if (lastDrop instanceof HTMLElement && lastDrop.dataset.dropType === type)
        lastDrop.dispatchEvent(new Event('dragleave'))
      if (drop instanceof HTMLElement && drop.dataset.dropType === type)
        drop.dispatchEvent(new Event('dragenter'))
      lastDrop?.classList.remove('dragover')
      lastDrop = drop
    }
  }

  /**
   * @param {TouchEvent} event
   */
  function handleTouchend(event) {
    if (imageElement) imageElement.style.visibility = 'hidden'
    const { clientX, clientY } = event.changedTouches[0]
    const drop = elementFromPoint(clientX, clientY)
    if (drop instanceof HTMLElement && drop.dataset.dropType === type) {
      if (image && imageElement) {
        imageElement.style.cssText = getImageStyle(
          offset.x + offset.width / 2,
          offset.y + image.height / 2 + 60 + offset.height / 2,
          image.width,
          image.height,
          'hidden',
          '0'
        )
      }
      drop?.dispatchEvent(new Event('drop'))
      drop?.dispatchEvent(new Event('dragleave'))
      drop?.classList.remove('dragover')
      lastDrop = null
    } else if (image && imageElement) {
      imageElement.style.visibility = 'visible'
      imageElement.style.transition = 'opacity .7s, transform .7s'
      imageElement.style.opacity = '0'
      imageElement.style.transform = `translate(${
        offset.x + offset.width / 2 - image.width / 2
      }px, ${offset.y + offset.height / 2 - image.height / 2}px)`
      timeout = setTimeout(() => imageElement && (imageElement.style.visibility = 'hidden'), 700)
    }
    node.dispatchEvent(new Event('dragend'))
    node.classList.remove('dragging')
  }

  update(options)
  node.style.touchAction = 'none'
  node.addEventListener('touchstart', handleTouchstart, shouldBePassive ? { passive: true } : false)
  node.addEventListener('touchmove', handleTouchmove, shouldBePassive ? { passive: true } : false)
  node.addEventListener('touchend', handleTouchend, false)

  return {
    update,
    destroy() {
      clearTimeout(timeout)
      if (imageElement) document.body.removeChild(imageElement)
      node.removeEventListener('touchstart', handleTouchstart, false)
      node.removeEventListener('touchmove', handleTouchmove, false)
      node.removeEventListener('touchend', handleTouchend, false)
    }
  }
}

/**
 * @param {HTMLElement} node
 * @param {DropOptions=} options
 */
function drop(node, options) {
  /**
   * @param {DropOptions} options
   */
  function update(options = {}) {
    node.dataset.dropType = options.type || 'default'
  }
  update(options)
  return { update }
}

export { drag, drop }
