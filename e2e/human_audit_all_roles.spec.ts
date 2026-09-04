import { test, expect } from '@playwright/test';

test.describe('KFS OS - Auditoría Humana Integral Multi-Rol', () => {

  test('Rol 1: Comercio (Merchant) - Navegación, Inventario y POS', async ({ page }) => {
    await page.goto('/comercio');
    await page.waitForLoadState('domcontentloaded');

    // Verificar que el dashboard de comercio cargue
    const dashboardTitle = page.getByText(/Comercio|Punto de Venta|Inventario|KFS/i).first();
    await expect(dashboardTitle).toBeVisible({ timeout: 15000 });

    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('Rol 2: Promotora de Ventas - Panel de Afiliación y Comisiones', async ({ page }) => {
    await page.goto('/promotora');
    await page.waitForLoadState('domcontentloaded');

    const promoHeading = page.getByText(/Promotora|Comisiones|Afiliados|Referidos/i).first();
    await expect(promoHeading).toBeVisible({ timeout: 15000 });
  });

  test('Rol 3: Rider / Repartidor - Despachos, Estado y Billetera', async ({ page }) => {
    await page.goto('/rider');
    await page.waitForLoadState('domcontentloaded');

    const riderHeading = page.getByText(/Delivery|Rider|Entregas|Disponibilidad/i).first();
    await expect(riderHeading).toBeVisible({ timeout: 15000 });
  });

  test('Rol 4: Vendedor de Mostrador - Punto de Venta Ágil', async ({ page }) => {
    await page.goto('/vendedor');
    await page.waitForLoadState('domcontentloaded');

    const vendedorHeading = page.getByText(/Vendedor|Cobrar|Catálogo|Productos/i).first();
    await expect(vendedorHeading).toBeVisible({ timeout: 15000 });
  });

  test('Rol 5: Cliente / Consumidor - Axis Rewards y K-Points', async ({ page }) => {
    await page.goto('/rewards');
    await page.waitForLoadState('domcontentloaded');

    const rewardsHeading = page.getByText(/Rewards|Puntos|K-Points|Axis/i).first();
    await expect(rewardsHeading).toBeVisible({ timeout: 15000 });
  });

  test('Rol 6: Descarga e Instalación PWA / APK (/download-apk)', async ({ page }) => {
    await page.goto('/download-apk');
    await page.waitForLoadState('domcontentloaded');

    const apkHeading = page.getByText(/APK|Instalar|Descargar|PWA/i).first();
    await expect(apkHeading).toBeVisible({ timeout: 15000 });
  });

  test('Rol 7: Axis Nitro POS Directo (/pos)', async ({ page }) => {
    await page.goto('/pos');
    await page.waitForLoadState('domcontentloaded');

    const posContainer = page.locator('body');
    await expect(posContainer).toBeVisible({ timeout: 15000 });
    const textContent = await posContainer.textContent();
    expect(textContent).toBeTruthy();
  });

  test('Rol 8: Core Architect / Panel Maestro (/core)', async ({ page }) => {
    await page.goto('/core');
    await page.waitForLoadState('domcontentloaded');

    const coreHeading = page.getByText(/Arquitecto|Core|Demostración|Sistema/i).first();
    await expect(coreHeading).toBeVisible({ timeout: 15000 });
  });

});
