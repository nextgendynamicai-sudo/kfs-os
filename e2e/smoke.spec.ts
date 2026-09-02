import { test, expect } from '@playwright/test';

test.describe('KFS OS Smoke Tests', () => {
  test('Landing page loads successfully', async ({ page }) => {
    // Navigate to the root URL
    await page.goto('/');

    // Check that the main application mounts without crashing
    await expect(page).toHaveTitle(/KFS OS/i);
    
    // Check for a critical UI element, like the login container or branding
    const mainBrand = page.locator('text=KFS OS').first();
    await expect(mainBrand).toBeVisible();
  });
});
