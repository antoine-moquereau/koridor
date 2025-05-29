// @ts-check
import { test, expect } from '@playwright/test';

test.describe('UI and Navigation', () => {
  test('navigates to the Rules page from homepage', async ({ page }) => {
    await page.goto('/');

    // Find and click the link/button that leads to the "Rules" page
    // Common selectors could be: a link with text "Rules", an element with data-testid="rules-link"
    const rulesLink = page.locator('a[href="/rules"], button:has-text("Rules"), [data-testid="rules-link"]').first();
    await rulesLink.click();

    // Assert that the URL is updated to /rules
    await expect(page).toHaveURL(/.*\/rules/, { timeout: 5000 });

    // Assert that a specific element unique to the rules page is visible
    // This could be a heading or a specific section.
    const rulesPageHeading = page.locator('h1:has-text("Rules of Koridor"), h2:has-text("Rules of Koridor"), [data-testid="rules-title"]');
    await expect(rulesPageHeading).toBeVisible();

    // Example of checking for a specific section content if available
    const pawnMovementSection = page.locator('section:has-text("Pawn Movement")'); // Adjust if needed
    if (await pawnMovementSection.count() > 0) {
      await expect(pawnMovementSection).toBeVisible();
    }
  });

  test('switches between light and dark themes', async ({ page }) => {
    await page.goto('/'); // Or any page with the theme switcher

    const themeSwitcherButton = page.locator('[data-testid="theme-switcher"], .theme-toggle-button, #theme-button'); // Adjust selector

    // Check if the theme switcher button is present
    await expect(themeSwitcherButton).toBeVisible();

    // Determine initial theme by checking class on html or body
    const htmlElement = page.locator('html');
    const initialTheme = await htmlElement.evaluate(element => {
      if (element.classList.contains('dark')) return 'dark';
      if (element.classList.contains('light')) return 'light';
      // Fallback: check prefers-color-scheme or default theme if no class is set
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    console.log(`Initial theme detected: ${initialTheme}`);

    // Click the theme switcher
    await themeSwitcherButton.click();
    // Add a small delay or wait for a specific class change if the theme change is not instantaneous
    await page.waitForTimeout(500); // Allow time for theme transition/class update

    // Assert that the theme has changed
    if (initialTheme === 'light') {
      await expect(htmlElement).toHaveClass(/dark/, { timeout: 2000 });
      console.log('Theme changed to dark');
    } else {
      await expect(htmlElement).toHaveClass(/light/, { timeout: 2000 });
      console.log('Theme changed to light');
    }

    // Click the theme switcher again
    await themeSwitcherButton.click();
    await page.waitForTimeout(500);

    // Assert that the theme has reverted to the original theme
    if (initialTheme === 'light') {
      await expect(htmlElement).toHaveClass(/light/, { timeout: 2000 });
      await expect(htmlElement).not.toHaveClass(/dark/, { timeout: 1000});
      console.log('Theme reverted to light');
    } else {
      await expect(htmlElement).toHaveClass(/dark/, { timeout: 2000 });
      await expect(htmlElement).not.toHaveClass(/light/, { timeout: 1000 });
      console.log('Theme reverted to dark');
    }
  });
});
