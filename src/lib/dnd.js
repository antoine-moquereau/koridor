/**
 * @file Implements custom touch-based drag-and-drop functionality as Svelte actions.
 * This module provides a `drag` action for draggable elements and a `drop` action for drop targets.
 * It includes features like visual feedback (displaying an image of the dragged item),
 * type matching between draggable items and drop zones, and custom event dispatching
 * for various drag-and-drop lifecycle events.
 *
 * It also includes a mechanism to detect if passive event listeners are supported and preferred,
 * particularly for touch events to optimize scrolling performance.
 * @module lib/dnd
 */

/**
 * Defines the visual representation of the item being dragged.
 * This is typically a Svelte component instance that appears near the touch point.
 * @typedef {Object} DragImage
 * @property {import('svelte').ComponentType} component - The Svelte component to render as the drag image.
 * @property {number} width - The width of the drag image in pixels.
 * @property {number} height - The height of the drag image in pixels.
 */

/**
 * Configuration options for the `drag` Svelte action.
 * @typedef {Object} DragActionOptions
 * @property {string} [type='default'] - A string identifying the type of the draggable item.
 *                                      Drop zones will only accept items of a matching type.
 * @property {DragImage} [image] - Optional configuration for rendering an image that follows the touch point
 *                                 during the drag operation. If not provided, no visual feedback image is shown
 *                                 besides changes to the source node itself (e.g., via 'dragging' class).
 */

/**
 * Configuration options for the `drop` Svelte action.
 * @typedef {Object} DropActionOptions
 * @property {string} [type='default'] - A string identifying the type of items this drop zone accepts.
 *                                      Must match the `type` of a `drag` action for a drop to be considered valid.
 */

// Feature detection for passive event listeners.
// Passive listeners are a browser feature that can improve scroll performance,
// especially on touch devices. The `touch-action: none` CSS property is related
// as it tells the browser that touch events on an element will not cause scrolling,
// allowing the browser to not delay the touchstart event to see if a scroll gesture is starting.
let shouldBePassive = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    get: function () {
      // If the browser attempts to read the 'passive' property, it supports passive listeners.
      // We also check if `CSS.supports('touch-action', 'none')` is true,
      // indicating good support for related touch optimizations.
      shouldBePassive = CSS.supports('touch-action', 'none');
      return true; // Indicate that the passive property was successfully accessed.
    }
  });
  // Create a dummy event listener with these options to trigger the getter.
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {
  // If an error occurs (e.g., in very old browsers), `shouldBePassive` remains false.
}

/**
 * A Svelte action to make an HTML element draggable via touch events.
 *
 * This action handles the lifecycle of a drag operation:
 * - `touchstart`: Initiates the drag. Dispatches a 'dragstart' event. Adds 'dragging' class.
 *                 If an `image` option is provided, it creates and displays a component instance
 *                 that follows the touch point.
 * - `touchmove`: Updates the position of the drag image. Detects underlying elements
 *                that are potential drop targets (those with the `drop` action and matching type).
 *                Dispatches 'dragenter', 'dragover', and 'dragleave' events on these targets.
 *                Adjusts drag image opacity based on whether it's over a valid drop target.
 * - `touchend`: Finalizes the drag. If over a valid drop target, dispatches a 'drop' event on it.
 *               Manages the animation of the drag image returning to the start or disappearing.
 *               Dispatches a 'dragend' event on the source node. Removes 'dragging' class.
 *
 * The action also sets `touch-action: none` on the node to prevent scrolling during drag.
 *
 * @param {HTMLElement} node - The HTML element to make draggable.
 * @param {DragActionOptions} options - Configuration options for the drag behavior.
 * @returns {Object} A Svelte action object with `update` and `destroy` methods.
 * @property {function(DragActionOptions): void} update - Called by Svelte when the action's parameters change.
 *                                                       Allows updating the `type` or `image`.
 * @property {Function} destroy - Called by Svelte when the component is unmounted.
 *                                Cleans up event listeners and removes the drag image element.
 */
function drag(node, options) {
  /** @type {string} */
  let type; // Type of the draggable item, e.g., 'card', 'player'.
  /** @type {DragImage | undefined} */
  let image; // Configuration for the visual representation of the item being dragged.

  /** @type {HTMLDivElement | undefined} */
  let imageElement; // The DIV element that hosts the Svelte component for the drag image.
  /** @type {{ x: number; y: number; width: number; height: number; }} */
  let offset; // Bounding client rect of the original draggable node, used for animations.
  /** @type {Element | null} */
  let lastDropTarget; // The last valid drop target element the drag was over.
  /** @type {NodeJS.Timeout} */
  let returnAnimationTimeout; // Timeout ID for the drag image return animation.

  /**
   * Generates the CSS style string for the drag image element.
   * @param {number} x - Target x-coordinate for the center of the drag image.
   * @param {number} y - Target y-coordinate for a point slightly above the center of the drag image (to simulate holding it).
   * @param {number} width - Width of the drag image.
   * @param {number} height - Height of the drag image.
   * @param {string} [visibility='visible'] - CSS visibility property.
   * @param {string} [opacity='0.9'] - CSS opacity property.
   * @returns {string} The CSS style string.
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
   * Updates the drag action's configuration. Called initially and when parameters change.
   * @param {DragActionOptions} newOptions - The new options for the drag action.
   */
  function update(newOptions = {}) {
    type = newOptions.type || 'default';
    // Clean up existing image element if present
    if (imageElement) {
      document.body.removeChild(imageElement);
      imageElement = undefined; // Ensure it's reset
    }
    if (newOptions.image) {
      image = newOptions.image;
      imageElement = document.createElement('div');
      const nodeRect = node.getBoundingClientRect();
      offset = { x: nodeRect.x, y: nodeRect.y, width: nodeRect.width, height: nodeRect.height };
      // Initial style for the image, positioned relative to the source node and hidden.
      imageElement.style.cssText = getImageStyle(
        offset.x + offset.width / 2,
        offset.y + image.height / 2 + 60 + offset.height / 2, // Positioned to appear as if lifted
        image.width,
        image.height,
        'hidden', // Initially hidden
        '0'       // Initially transparent
      );
      // Instantiate the Svelte component for the drag image
      new image.component({ target: imageElement });
      document.body.appendChild(imageElement);
    } else {
      image = undefined; // Clear image if not provided in new options
    }
  }

  /**
   * Gets the topmost element at a specified point, adjusted for the drag image's offset.
   * This helps in identifying what element is directly under the "grab point" of the drag image.
   * @param {number} x - The clientX coordinate (typically from a touch event).
   * @param {number} y - The clientY coordinate (typically from a touch event).
   * @returns {Element | null} The element at the adjusted point, or null.
   */
  function elementFromPoint(x, y) {
    // Adjust point to be where the "tip" of the cursor would be relative to the drag image
    const checkX = x - (image?.width || 0) / 2;
    const checkY = y - 60 - (image?.height || 0); // 60 is an arbitrary offset used in getImageStyle
    return document.elementFromPoint(checkX, checkY);
  }

  /**
   * Handles the 'touchstart' event on the draggable node.
   * Initiates the drag operation.
   * @param {TouchEvent} event - The touch event.
   */
  function handleTouchstart(event) {
    if (!shouldBePassive) event.preventDefault(); // Prevent default only if not using passive listeners.
    node.dispatchEvent(new CustomEvent('dragstart')); // Dispatch custom dragstart event.
    node.classList.add('dragging'); // Add class for styling the source node.

    if (image && imageElement) {
      clearTimeout(returnAnimationTimeout); // Clear any pending return animation.
      const touch = event.changedTouches[0];
      // Immediately move and show the drag image at the touch point.
      imageElement.style.cssText = getImageStyle(touch.clientX, touch.clientY, image.width, image.height, 'visible', '0.9');
      // Set transition for smooth movement and opacity changes if needed later.
      imageElement.style.transition = 'opacity .7s, transform .7s';
    }
  }

  /**
   * Handles the 'touchmove' event.
   * Updates drag image position and interacts with potential drop targets.
   * @param {TouchEvent} event - The touch event.
   */
  function handleTouchmove(event) {
    const touch = event.changedTouches[0];
    if (image && imageElement) {
      // Update drag image position to follow the touch point.
      // Keep it 'hidden' during move then make visible to avoid flicker if elementFromPoint is slow.
      imageElement.style.cssText = getImageStyle(
        touch.clientX,
        touch.clientY,
        image.width,
        image.height,
        'hidden' // Temporarily hide while checking underlying element
      );
    }

    const currentElementUnderTouch = elementFromPoint(touch.clientX, touch.clientY);
    if (imageElement) imageElement.style.visibility = 'visible'; // Make image visible again

    if (currentElementUnderTouch instanceof HTMLElement && currentElementUnderTouch.dataset.dropType === type) {
      // Over a valid drop target
      currentElementUnderTouch.dispatchEvent(new CustomEvent('dragover', { detail: { type } }));
      currentElementUnderTouch.classList.add('dragover');
      if (imageElement) imageElement.style.opacity = '0.3'; // Dim image to show acceptance
    } else if (imageElement) {
      imageElement.style.opacity = '0.9'; // Full opacity if not over a valid target
    }

    // Manage dragenter/dragleave events for drop targets
    if (lastDropTarget !== currentElementUnderTouch) {
      if (lastDropTarget instanceof HTMLElement && lastDropTarget.dataset.dropType === type) {
        lastDropTarget.dispatchEvent(new CustomEvent('dragleave', { detail: { type } }));
        lastDropTarget.classList.remove('dragover');
      }
      if (currentElementUnderTouch instanceof HTMLElement && currentElementUnderTouch.dataset.dropType === type) {
        currentElementUnderTouch.dispatchEvent(new CustomEvent('dragenter', { detail: { type } }));
      }
      lastDropTarget = currentElementUnderTouch;
    }
  }

  /**
   * Handles the 'touchend' event.
   * Finalizes the drag, triggers drop or return animation.
   * @param {TouchEvent} event - The touch event.
   */
  function handleTouchend(event) {
    if (imageElement) imageElement.style.visibility = 'hidden'; // Hide image during final processing.

    const touch = event.changedTouches[0];
    const finalElementUnderTouch = elementFromPoint(touch.clientX, touch.clientY);

    if (finalElementUnderTouch instanceof HTMLElement && finalElementUnderTouch.dataset.dropType === type) {
      // Successful drop on a valid target
      if (image && imageElement) {
        // Animate image to its original spot then hide (or could be to the drop spot)
        imageElement.style.cssText = getImageStyle(
          offset.x + offset.width / 2,
          offset.y + image.height / 2 + 60 + offset.height / 2,
          image.width,
          image.height,
          'hidden', // Will be hidden after transition
          '0'
        );
      }
      finalElementUnderTouch.dispatchEvent(new CustomEvent('drop', { detail: { type } }));
      finalElementUnderTouch.dispatchEvent(new CustomEvent('dragleave', { detail: { type } })); // Clean up target
      finalElementUnderTouch.classList.remove('dragover');
      lastDropTarget = null;
    } else if (image && imageElement) {
      // No valid drop target, animate image returning to its original position then hide.
      imageElement.style.visibility = 'visible';
      imageElement.style.transition = 'opacity .7s, transform .7s'; // Ensure transition is set
      imageElement.style.opacity = '0'; // Fade out
      imageElement.style.transform = `translate(${
        offset.x + offset.width / 2 - image.width / 2
      }px, ${offset.y + offset.height / 2 - image.height / 2}px)`; // Move to origin
      // Set timeout to hide element after transition.
      returnAnimationTimeout = setTimeout(() => {
        if (imageElement) imageElement.style.visibility = 'hidden';
      }, 700); // Duration should match transition time.
    }
    node.dispatchEvent(new CustomEvent('dragend'));
    node.classList.remove('dragging');
  }

  update(options); // Initialize with provided options.
  node.style.touchAction = 'none'; // Recommended for draggable elements to prevent scrolling.

  // Add event listeners. Use passive if detected and appropriate.
  node.addEventListener('touchstart', handleTouchstart, shouldBePassive ? { passive: true } : false);
  node.addEventListener('touchmove', handleTouchmove, shouldBePassive ? { passive: true } : false);
  node.addEventListener('touchend', handleTouchend, false); // touchend is not typically passive.

  return {
    update,
    destroy() {
      clearTimeout(returnAnimationTimeout);
      if (imageElement && imageElement.parentNode === document.body) {
        document.body.removeChild(imageElement);
      }
      // Remove event listeners. Ensure capture/passive flags match those used in addEventListener.
      node.removeEventListener('touchstart', handleTouchstart, shouldBePassive ? { passive: true } : false);
      node.removeEventListener('touchmove', handleTouchmove, shouldBePassive ? { passive: true } : false);
      node.removeEventListener('touchend', handleTouchend, false);
    }
  };
}

/**
 * A Svelte action to make an HTML element a drop target for draggable items.
 *
 * This action primarily sets a `data-drop-type` attribute on the node based on the
 * `type` option. This attribute is used by the `drag` action to identify valid drop targets.
 * The actual handling of drop events (like 'dragenter', 'dragleave', 'dragover', 'drop')
 * should be done by adding event listeners to the node where this action is used.
 *
 * @param {HTMLElement} node - The HTML element to designate as a drop target.
 * @param {DropActionOptions} [options] - Configuration options for the drop zone.
 * @returns {Object} A Svelte action object with an `update` method.
 * @property {function(DropActionOptions=): void} update - Called by Svelte when the action's parameters change.
 *                                                        Allows updating the `type` of the drop zone.
 */
function drop(node, options) {
  /**
   * Updates the drop zone's configuration.
   * @param {DropActionOptions} [newOptions={}] - The new options.
   */
  function update(newOptions = {}) {
    node.dataset.dropType = newOptions.type || 'default';
  }
  update(options); // Initialize with provided options.
  return { update };
}

export { drag, drop };
