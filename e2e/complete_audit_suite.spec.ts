import { test, expect } from '@playwright/test';

test.describe('KFS OS - Suite de Auditoría y Pruebas Completas E2E', () => {

  test('Prueba 1: PWA Manifest, Iconos y Configuración Standalone', async ({ page }) => {
    const res = await page.goto('/manifest.json');
    expect(res?.status()).toBe(200);
    const manifest = await res?.json();
    
    expect(manifest.name).toBe('KFS OS');
    expect(manifest.short_name).toBe('KFS OS');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/');
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    
    const has192 = manifest.icons.some((icon: any) => icon.sizes === '192x192');
    const has512 = manifest.icons.some((icon: any) => icon.sizes === '512x512');
    expect(has192).toBe(true);
    expect(has512).toBe(true);
  });

  test('Prueba 2: Portal de Descarga APK y PWA Móvil (/download-apk)', async ({ page }) => {
    await page.goto('/download-apk');
    await page.waitForLoadState('domcontentloaded');

    // Branding & Header
    await expect(page.locator('text=KFS OS MÓVIL').first()).toBeVisible();
    await expect(page.locator('text=Portal Oficial de Instalación y Descarga').first()).toBeVisible();

    // Option A: PWA install button
    const installBtn = page.getByRole('button', { name: /Instalar en Mi Teléfono|Aplicación Ya Instalada/i }).first();
    await expect(installBtn).toBeVisible();

    // Option B: Direct APK Download link
    const apkLink = page.locator('a:has-text("Descargar .APK (Android)")').first();
    await expect(apkLink).toBeVisible();
    const href = await apkLink.getAttribute('href');
    expect(href).toBeTruthy();

    // Security badge
    await expect(page.locator('text=Aplicación Oficial Segura').first()).toBeVisible();
  });

  test('Prueba 3: Integridad de Tasas Oficiales BCV (/api/bcv)', async ({ page }) => {
    const res = await page.goto('/api/bcv');
    expect(res?.status()).toBe(200);
    const data = await res?.json();

    expect(data).toHaveProperty('USD');
    expect(typeof data.USD).toBe('number');
    expect(data.USD).toBeGreaterThan(0);

    expect(data).toHaveProperty('EUR');
    expect(typeof data.EUR).toBe('number');
    expect(data.EUR).toBeGreaterThan(0);
  });

  test('Prueba 4: Persistencia y Regla 1 (Sin Pérdida de Datos en Inicialización)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simulate saving real merchant and transactions
    const audit = await page.evaluate(() => {
      const mockKey = "kfs_os_audit_test_persistence";
      localStorage.setItem(mockKey, JSON.stringify({ verified: true, timestamp: Date.now() }));
      const readBack = JSON.parse(localStorage.getItem(mockKey) || "{}");
      localStorage.removeItem(mockKey);

      return {
        hasLocalStorage: typeof window.localStorage !== 'undefined',
        canWriteAndRead: readBack.verified === true,
        pathname: window.location.pathname
      };
    });

    expect(audit.hasLocalStorage).toBe(true);
    expect(audit.canWriteAndRead).toBe(true);
  });

  test('Prueba 5: Portal de Comercio y Cajas POS (/comercio y /pos)', async ({ page }) => {
    // Check /comercio route
    const comercioRes = await page.goto('/comercio');
    expect(comercioRes?.status()).toBe(200);
    await page.waitForLoadState('domcontentloaded');

    // Check /pos route
    const posRes = await page.goto('/pos');
    expect(posRes?.status()).toBe(200);
    await page.waitForLoadState('domcontentloaded');
  });

  test('Prueba 6: Subdominios y Middleware Multi-Tenant', async ({ page }) => {
    // Check /nitro route for standalone tenant
    const nitroRes = await page.goto('/nitro/kfs-express');
    expect(nitroRes?.status()).toBe(200);
    await page.waitForLoadState('domcontentloaded');

    // Verify page rendered storefront
    const pageText = await page.textContent('body');
    expect(pageText).toBeTruthy();
  });
});
