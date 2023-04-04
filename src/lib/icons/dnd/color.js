/**
 * @param {number} activePlayer
 */
function color(activePlayer) {
  switch (activePlayer) {
    case 0:
      return ['rgb(40 40 190 / 40%)', 'rgb(40 40 190 / 90%)']
    case 1:
      return ['rgb(190 40 40 / 40%)', 'rgb(190 40 40 / 90%)']
    case 2:
      return ['rgb(190 160 40 / 40%)', 'rgb(190 160 40 / 90%)']
    default:
      return ['rgb(40 160 40 / 40%)', 'rgb(40 160 40 / 90%)']
  }
}

export default color
