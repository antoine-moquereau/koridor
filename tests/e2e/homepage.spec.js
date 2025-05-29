// @ts-check
import { test, expect } from '@playwright/test'

test('homepage has Koridor title', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/')

  // Check for an element containing the text "Koridor"
  // This could be a heading, title, or any prominent element.
  // Using a text selector for flexibility.
  const titleElement = page.locator('text=Koridor')

  // Assert that the element is visible
  await expect(titleElement).toBeVisible()

  // As an additional check, let's also look for a "Local 2 Players" button if it's a main call to action.
  // This makes the test a bit more robust in verifying the homepage content.
  const local2PlayersButton = page.locator('button:has-text("Local 2 Players")')
  await expect(local2PlayersButton).toBeVisible()
})

test('navigate to rules page', async ({ page }) => {
  await page.goto('/')

  // Click the link/button that navigates to the rules page
  // Assuming there's a link with text "Rules" or an href like "/rules"
  const rulesLink = page.locator('a[href="/rules"], button:has-text("Rules")').first()
  await rulesLink.click()

  // Assert that the URL is now /rules
  await expect(page).toHaveURL(/.*\/rules/)

  // Assert that a key element on the rules page is visible
  // For example, a heading with the text "Rules of Koridor"
  const rulesHeading = page.locator(
    'h1:has-text("Rules of Koridor"), h2:has-text("Rules of Koridor")'
  )
  await expect(rulesHeading).toBeVisible()
})
