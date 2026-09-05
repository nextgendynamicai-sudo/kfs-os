import { test, expect } from '@playwright/test';

test.describe('KFS OS - Glassmorphism Navbar & Million-Dollar Clean Brand Verification', () => {
  test('Navbar renders translucent glassmorphism with AXIS NITRO branding and commercial clean buttons on public view', async ({ page }) => {
    await page.goto('http://localhost:3000/#login');
    await page.waitForLoadState('networkidle');

    // Verify brand typography within navbar
    const navbar = page.locator('nav');
    await expect(navbar.getByText('AXIS NITRO', { exact: true })).toBeVisible();
    await expect(navbar.getByText('OS 8.0')).toBeVisible();

    // Verify commercial buttons on public view
    await expect(navbar.locator('button:has-text("Afiliar Negocio")')).toBeVisible();

    // Verify developer telemetry buttons are cleanly HIDDEN on public view
    await expect(navbar.locator('button:has-text("ONLINE (NUBE)")')).not.toBeVisible();
    await expect(navbar.getByText('CLOUD ACTIVE')).not.toBeVisible();
  });
});
