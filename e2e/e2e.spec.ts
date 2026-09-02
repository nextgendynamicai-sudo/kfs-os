import { test, expect } from '@playwright/test';

test.describe('KFS OS - Security, Core & Rewards E2E Suite', () => {
  const BASE_URL = 'http://localhost:3000';

  test('Misión 1: AppEnforcer intercepta acceso no autenticado a /arquitecto', async ({ page }) => {
    await page.goto(`${BASE_URL}/arquitecto`);
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/.*#landing/);
  });

  test('Misión 2: Carga y protección de rutas operativas en /comercio', async ({ page }) => {
    await page.goto(`${BASE_URL}/comercio`);
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/.*#landing/);
  });

  test('Misión 3: Verificación de Carga de App de Recompensas (/rewards)', async ({ page }) => {
    await page.goto(`${BASE_URL}/rewards`);
    await page.waitForTimeout(2000);
    const rewardsTitle = page.locator('text=Axis Rewards').first();
    await expect(rewardsTitle).toBeVisible();
  });
});
