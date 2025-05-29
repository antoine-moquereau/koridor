// @ts-check
import { test, expect } from '@playwright/test'

// Helper function to get pawn's current cell ID
async function getPawnCellId(page, pawnSelector) {
  const cellId = await page.locator(pawnSelector).getAttribute('data-cell-id')
  if (!cellId) {
    throw new Error(`Pawn ${pawnSelector} does not have a data-cell-id attribute or is not found.`)
  }
  return cellId
}

// Helper function to parse cell ID (e.g., "cell-4-0" -> { col: 4, row: 0 })
function parseCellId(cellId) {
  const parts = cellId.split('-')
  return { col: parseInt(parts[1]), row: parseInt(parts[2]) }
}

test.describe('Game End Condition (2-Player Local Game)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("Local 2 Players")').click()
    const gameBoard = page.locator('.board') // Use a more specific selector
    await expect(gameBoard).toBeVisible({ timeout: 10000 })
    // Ensure Player 1 (pawn-0) is active first
    await expect(page.locator('[data-testid="pawn-0"]')).toHaveClass(/active-player/, {
      timeout: 5000
    })
  })

  test('Player 1 wins by reaching the opposite baseline', async ({ page }) => {
    const player1Pawn = '[data-testid="pawn-0"]'
    const player2Pawn = '[data-testid="pawn-1"]'
    const player1WinRow = 8 // Assuming 0-indexed board, Player 1 starts at row 0

    // Simulate moves for Player 1 to reach the winning row.
    // Player 2 will make simple moves that don't interfere significantly.
    for (let i = 0; i < player1WinRow; i++) {
      // Player 1's turn
      await expect(page.locator(player1Pawn)).toHaveClass(/active-player/, { timeout: 2000 })
      let p1CellId = await getPawnCellId(page, player1Pawn)
      let p1Pos = parseCellId(p1CellId)
      // Move Player 1 one step forward (incrementing row)
      const p1NextCellId = `cell-${p1Pos.col}-${p1Pos.row + 1}`
      await page.locator(`[data-cell-id="${p1NextCellId}"]`).click()
      await expect(page.locator(player1Pawn)).toHaveAttribute('data-cell-id', p1NextCellId, {
        timeout: 2000
      })

      // Check for win condition after Player 1 moves
      p1CellId = await getPawnCellId(page, player1Pawn) // get updated position
      p1Pos = parseCellId(p1CellId)
      if (p1Pos.row === player1WinRow) {
        break // Player 1 has won
      }

      // Player 2's turn (if game not won by P1)
      await expect(page.locator(player2Pawn)).toHaveClass(/active-player/, { timeout: 2000 })
      let p2CellId = await getPawnCellId(page, player2Pawn)
      let p2Pos = parseCellId(p2CellId)
      // Move Player 2 one step forward (decrementing row) - simple non-interfering move
      const p2NextCellId = `cell-${p2Pos.col}-${p2Pos.row - 1}`
      // Check if the cell exists and is clickable before clicking
      if ((await page.locator(`[data-cell-id="${p2NextCellId}"]`).count()) > 0) {
        await page.locator(`[data-cell-id="${p2NextCellId}"]`).click()
        await expect(page.locator(player2Pawn)).toHaveAttribute('data-cell-id', p2NextCellId, {
          timeout: 2000
        })
      } else {
        // Fallback if P2 cannot move forward (e.g. blocked or edge of board for some reason)
        // Place a dummy wall or skip turn - for simplicity, we'll assume P2 can always move.
        // In a real test, might need to place a non-interfering wall for P2.
        console.warn(
          `Player 2 cannot move to ${p2NextCellId}, this might affect test outcome if P1 path is not clear.`
        )
        // As a basic fallback, try to place a wall far away (very simplistic, assumes wall placement UI)
        // This part is highly dependent on wall placement UI.
        // await page.locator('[data-wall-id="wall-h-0-0"]').click({ MiamiclickDelay: 100 }); // Example
      }
    }

    // Assert that Player 1 has reached the winning row
    const finalP1CellId = await getPawnCellId(page, player1Pawn)
    const finalP1Pos = parseCellId(finalP1CellId)
    expect(finalP1Pos.row).toEqual(player1WinRow)

    // Assert that a win message is displayed
    const winMessage = page.locator('[data-testid="win-message"], .game-over-message') // Adjust selector
    await expect(winMessage).toBeVisible({ timeout: 5000 })
    await expect(winMessage).toContainText(/Player 1 Wins|P1 Wins/i) // Adjust text as needed

    // Assert that the game board becomes inactive or further moves are not possible
    // This could be an overlay, disabled cells, or specific class on the board.
    const gameOverOverlay = page.locator('[data-testid="game-over-overlay"]')
    const boardDisabledIndicator = page.locator('.board.disabled, .board.game-over') // Adjust selector

    if ((await gameOverOverlay.count()) > 0) {
      await expect(gameOverOverlay).toBeVisible()
    } else if ((await boardDisabledIndicator.count()) > 0) {
      await expect(boardDisabledIndicator).toBeVisible()
    } else {
      // As a fallback, try to make another move and expect it to fail or not change state
      console.log(
        'No explicit game over overlay/indicator found. Attempting a post-win move to check inactivity.'
      )
      const p1CurrentCellId = await getPawnCellId(page, player1Pawn)
      const p1CurrentPos = parseCellId(p1CurrentCellId)
      // Attempt to move Player 1 again (e.g., one step back, if possible)
      if (p1CurrentPos.row > 0) {
        const oneStepBackCell = `cell-${p1CurrentPos.col}-${p1CurrentPos.row - 1}`
        await page
          .locator(`[data-cell-id="${oneStepBackCell}"]`)
          .click({ MiamiclickDelay: 100, failOnTimeout: false, timeout: 500 }) // Short timeout, expect to fail or do nothing
        // Pawn should not have moved from its winning position
        await expect(page.locator(player1Pawn)).toHaveAttribute('data-cell-id', p1CurrentCellId)
      } else {
        // If pawn is at row 0, cannot move back further. This check is less effective.
        console.log('Pawn is at row 0, cannot attempt move-back check for board inactivity.')
      }
    }
  })
})
