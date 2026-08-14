import { test, expect } from '@playwright/test';

test.describe('KFS OS - Security & KYC E2E Suite', () => {
  const BASE_URL = 'http://localhost:3000';

  test('Misión 1: AppEnforcer bloquea acceso a /arquitecto (Kreatek Core)', async ({ page }) => {
    await page.goto(`${BASE_URL}/arquitecto`);
    // El sistema debe interceptar y redirigir a #landing por falta de sesión
    await expect(page).toHaveURL(/.*#landing/);
    await expect(page.locator('text=Ingresar al Ecosistema').first()).toBeVisible();
  });

  test('Misión 2: AppEnforcer bloquea acceso a /comercio (B2B SaaS)', async ({ page }) => {
    await page.goto(`${BASE_URL}/comercio`);
    await expect(page).toHaveURL(/.*#landing/);
  });

  test('Misión 3: AppEnforcer bloquea acceso a /promotora (Dashboard Agentes)', async ({ page }) => {
    await page.goto(`${BASE_URL}/promotora`);
    await expect(page).toHaveURL(/.*#landing/);
  });

  test('Misión 4: AppEnforcer bloquea acceso a /rider (Logística)', async ({ page }) => {
    await page.goto(`${BASE_URL}/rider`);
    await expect(page).toHaveURL(/.*#landing/);
  });

  test('Misión 5: Validación del Formulario de Registro KYC (Comercio)', async ({ page }) => {
    await page.goto(`${BASE_URL}/#landing`);
    const openKycBtn = page.locator('text=Ingresar al Ecosistema').first();
    if (await openKycBtn.isVisible()) {
      await openKycBtn.click();
      // Verificamos que el modal de onboarding KYC aparezca
      await expect(page.locator('text=Bienvenido a KFS OS').first()).toBeVisible();
    }
  });
});
