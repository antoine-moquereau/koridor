// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Game Setup', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/')
  })

  test('starts a local 2-player game', async ({ page }) => {
    // Click the "Local 2 Players" button
    const local2PlayersButton = page.locator('button:has-text("Local 2 Players")')
    await local2PlayersButton.click()

    // Assert that the URL changes to reflect the game page
    // Allowing for flexibility in URL structure (e.g., /game/local2, /game/2, /game?players=2)
    await expect(page).toHaveURL(/.*\/game(\/local2|\/2|\?.*players=2.*)?/)

    // Assert that the game board is visible
    // Assuming the game board has a specific, identifiable class or data-testid
    const gameBoard = page.locator('.board') // Replace with a more specific selector if available
    await expect(gameBoard).toBeVisible()

    // Assert that there are two pawns on the board
    // Assuming pawns have a class 'pawn' or a role that can be selected
    // Adjust selector based on actual implementation
    const pawns = page.locator('.pawn, [data-testid^="pawn-"]')
    await expect(pawns).toHaveCount(2)

    // Further assertions could include checking pawn starting positions if they are consistent
  })

  test('starts a local 4-player game', async ({ page }) => {
    // Click the "Local 4 Players" button
    const local4PlayersButton = page.locator('button:has-text("Local 4 Players")')
    await local4PlayersButton.click()

    // Assert that the URL changes to reflect the game page
    await expect(page).toHaveURL(/.*\/game(\/local4|\/4|\?.*players=4.*)?/)

    // Assert that the game board is visible
    const gameBoard = page.locator('.board') // Replace with a more specific selector
    await expect(gameBoard).toBeVisible()

    // Assert that there are four pawns on the board
    const pawns = page.locator('.pawn, [data-testid^="pawn-"]')
    await expect(pawns).toHaveCount(4)

    // Further assertions could include checking pawn starting positions
  })
})
