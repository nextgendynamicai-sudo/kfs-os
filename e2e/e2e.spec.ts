import { test, expect } from '@playwright/test';

test.describe('KFS OS - Security, Core & Rewards E2E Suite', () => {
  const BASE_URL = 'http://localhost:3000';

  test('Misión 1: Carga y verificación de consola Core en /arquitecto', async ({ page }) => {
    await page.goto(`${BASE_URL}/arquitecto`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Demostración en Vivo & Activación').first()).toBeVisible({ timeout: 15000 });
  });

  test('Misión 2: Carga de portal operativo en /comercio', async ({ page }) => {
    await page.goto(`${BASE_URL}/comercio`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Punto de Venta').first()).toBeVisible({ timeout: 15000 });
  });

  test('Misión 3: Verificación de Carga de App de Recompensas (/rewards)', async ({ page }) => {
    await page.goto(`${BASE_URL}/rewards`, { waitUntil: 'domcontentloaded' });
    const rewardsTitle = page.locator('text=Axis Rewards').first();
    await expect(rewardsTitle).toBeVisible({ timeout: 15000 });
  });
});
