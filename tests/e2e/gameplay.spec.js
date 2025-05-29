// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Core Gameplay Mechanics (2-Player Local Game)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    // Start a local 2-player game
    await page.locator('button:has-text("Local 2 Players")').click();
    // Wait for the game board to be visible and ready
    const gameBoard = page.locator('.board'); // Use a more specific selector for the game board
    await expect(gameBoard).toBeVisible({ timeout: 10000 }); // Increased timeout for game load

    // It might be necessary to wait for some initial game state to be established,
    // e.g., pawns rendered, active player highlighted.
    // Example: await page.waitForSelector('.pawn.active-player', { timeout: 5000 });
    // For now, we assume the board visibility is enough.
  });

  test('pawn movement and turn switch', async ({ page }) => {
    // Identify the active player's pawn (e.g., Player 1)
    // This requires knowing how the active player/pawn is marked.
    // Assuming Player 1 (typically starts at the "bottom" or "top" middle) is active first.
    // And pawns have a data-testid like 'pawn-0' for player 1, 'pawn-1' for player 2.
    // Let's assume pawn-0 is player 1.
    const player1Pawn = page.locator('[data-testid="pawn-0"]'); // Selector for Player 1's pawn
    const initialPawnPosition = await player1Pawn.getAttribute('data-cell-id'); // e.g., 'cell-4-0'

    // Identify a valid destination cell for the pawn (e.g., one step forward)
    // This depends on board coordinates. Let's assume cells have 'data-cell-id="cell-X-Y"'.
    // If Player 1 (pawn-0) starts at 'cell-4-0' (middle of row 0), a valid move is 'cell-4-1'.
    // This needs to be determined based on actual game logic and board representation.
    // For this example, let's hardcode a potential valid move.
    // A more robust test would calculate valid moves based on pawn position.
    const destinationCellId = `cell-${initialPawnPosition.split('-')[1]}-${parseInt(initialPawnPosition.split('-')[2]) + 1}`; // Simplistic: move one cell "up"
    const destinationCell = page.locator(`[data-cell-id="${destinationCellId}"]`); // Selector for the destination cell

    // Click the destination cell
    await destinationCell.click();

    // Assert that the pawn has moved to the new cell
    await expect(player1Pawn).toHaveAttribute('data-cell-id', destinationCellId);

    // Assert that the turn has switched to the other player
    // This requires knowing how the active player is indicated.
    // e.g., Player 2's pawn (pawn-1) now has an 'active' class or Player 1's pawn does not.
    const player2Pawn = page.locator('[data-testid="pawn-1"]');
    await expect(player2Pawn).toHaveClass(/active-player/); // Or some other indicator
    await expect(player1Pawn).not.toHaveClass(/active-player/);
    
    // Also, check player indicator if available (e.g. "Player 2's Turn")
    const activePlayerIndicator = page.locator('.active-player-display'); // Placeholder
    if (await activePlayerIndicator.count() > 0) {
        await expect(activePlayerIndicator).toHaveText(/Player 2/);
    }
  });

  test('place a valid wall and turn switch', async ({ page }) => {
    const initialWallCountPlayer1 = 10; // Standard Koridor rules
    // Check initial wall count for Player 1 (assuming it's displayed)
    // Selector for player 1's wall count: e.g., '[data-testid="player-0-wall-count"]'
    const player1WallCountDisplay = page.locator('[data-testid="player-0-wall-count"]');
    if (await player1WallCountDisplay.count() > 0) {
        await expect(player1WallCountDisplay).toHaveText(String(initialWallCountPlayer1));
    }


    // Identify a valid location to place a wall (horizontally or vertically)
    // This is highly dependent on the UI for placing walls.
    // Let's assume there are clickable areas between cells, e.g., '[data-wall-id="wall-h-3-3"]' for horizontal
    const wallPlacementArea = page.locator('[data-wall-id="wall-h-3-3"]'); // Example selector
    await wallPlacementArea.click();

    // Assert that the wall is visible on the board
    // The placed wall might get a specific class or style.
    const placedWall = page.locator('[data-wall-id="wall-h-3-3"].placed'); // Example if it gets a 'placed' class
    await expect(placedWall).toBeVisible();
    // Or check for a new wall element created at that position.

    // Assert that the current player has one less wall available
    if (await player1WallCountDisplay.count() > 0) {
        await expect(player1WallCountDisplay).toHaveText(String(initialWallCountPlayer1 - 1));
    }


    // Assert that the turn has switched to the other player
    const player1Pawn = page.locator('[data-testid="pawn-0"]');
    const player2Pawn = page.locator('[data-testid="pawn-1"]');
    await expect(player2Pawn).toHaveClass(/active-player/);
    await expect(player1Pawn).not.toHaveClass(/active-player/);
  });

  test('attempt to place an invalid intersecting wall', async ({ page }) => {
    // First, place a valid wall
    const wallLocation1 = '[data-wall-id="wall-h-3-3"]'; // Horizontal wall
    await page.locator(wallLocation1).click();
    await expect(page.locator(`${wallLocation1}.placed`)).toBeVisible(); // Wait for it to be placed

    // Player 1 has placed a wall, turn should switch to Player 2.
    // We need Player 1 to be active again to test invalid placement by the same player (or handle turn switch)
    // For simplicity, let's assume the test environment allows Player 1 to try again,
    // OR the game logic handles the turn switch and now it's Player 2's turn.
    // Let's make Player 2 place a pawn move to pass the turn back to Player 1
    
    // Identify Player 2's pawn and a valid move
    const player2Pawn = page.locator('[data-testid="pawn-1"]');
    await expect(player2Pawn).toHaveClass(/active-player/, { timeout: 5000 }); // Ensure P2 is active
    const p2InitialPos = await player2Pawn.getAttribute('data-cell-id'); // e.g. 'cell-4-8'
    // Simplistic move for P2:
    const p2DestCellId = `cell-${p2InitialPos.split('-')[1]}-${parseInt(p2InitialPos.split('-')[2]) - 1}`;
    await page.locator(`[data-cell-id="${p2DestCellId}"]`).click();
    await expect(player2Pawn).toHaveAttribute('data-cell-id', p2DestCellId);

    // Now it should be Player 1's turn again.
    const player1Pawn = page.locator('[data-testid="pawn-0"]');
    await expect(player1Pawn).toHaveClass(/active-player/, { timeout: 5000 });

    const player1WallCountDisplay = page.locator('[data-testid="player-0-wall-count"]');
    const initialWallCountPlayer1AfterFirstWall = 9; 
    if (await player1WallCountDisplay.count() > 0) {
      await expect(player1WallCountDisplay).toHaveText(String(initialWallCountPlayer1AfterFirstWall));
    }

    // Attempt to place a wall that intersects the previously placed wall
    // e.g., a vertical wall that crosses the horizontal one at 'wall-h-3-3'
    // An intersecting vertical wall could be 'wall-v-3-3' (if IDs are cell centers)
    // or 'wall-v-2-3' if it's top-left of the cell.
    // Assuming 'wall-v-3-2' would intersect 'wall-h-3-3' if 'wall-h-3-3' is between (3,3) and (4,3)
    // and 'wall-v-3-2' is between (3,2) and (3,3). The intersection point is (3,3).
    // This needs very precise understanding of wall placement logic and IDs.
    const intersectingWallLocation = '[data-wall-id="wall-v-3-2"]'; // Adjust if necessary
    
    await page.locator(intersectingWallLocation).click();

    // Assert that the intersecting wall is NOT placed
    // It might briefly appear then disappear, or simply not appear with 'placed' status
    await expect(page.locator(`${intersectingWallLocation}.placed`)).not.toBeVisible({timeout: 1000}); 
    // Or check that there's no new wall element at that specific position/ID

    // Assert that an error message is displayed (optional, if the game has one)
    const errorMessage = page.locator('.error-message, [data-testid="error-invalid-wall"]');
    if (await errorMessage.count() > 0 && await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText(/invalid wall placement|cannot intersect/i);
    } else {
      // If no error message, the primary check is that the wall isn't placed and turn doesn't change.
      console.log("No visible error message for invalid wall placement, relying on other assertions.");
    }
    
    // Assert that the player's wall count has not changed
    if (await player1WallCountDisplay.count() > 0) {
        await expect(player1WallCountDisplay).toHaveText(String(initialWallCountPlayer1AfterFirstWall));
    }

    // Assert that the turn has *not* switched (Player 1 should still be active)
    await expect(player1Pawn).toHaveClass(/active-player/);
  });
});
