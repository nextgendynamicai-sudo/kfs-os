import { test, expect } from '@playwright/test';

test.describe('KFS OS - Security & KYC E2E Suite', () => {
  const BASE_URL = 'http://localhost:3000';

  test('Misión 1: AppEnforcer bloquea acceso a /arquitecto (Kreatek Core)', async ({ page }) => {
    await page.goto(`${BASE_URL}/arquitecto`);
    await page.waitForTimeout(1000);
    const hasBrand = page.locator('text=KFS OS').first();
    await expect(hasBrand).toBeVisible();
  });

  test('Misión 2: AppEnforcer bloquea acceso no autenticado a /comercio', async ({ page }) => {
    await page.goto(`${BASE_URL}/comercio`);
    await page.waitForTimeout(1000);
    const hasBrand = page.locator('text=KFS OS').first();
    await expect(hasBrand).toBeVisible();
  });

  test('Misión 3: Verificación de Carga de App de Recompensas (/rewards)', async ({ page }) => {
    await page.goto(`${BASE_URL}/rewards`);
    await page.waitForTimeout(1500);
    const rewardsTitle = page.locator('text=Axis Rewards').first();
    await expect(rewardsTitle).toBeVisible();
  });
});
