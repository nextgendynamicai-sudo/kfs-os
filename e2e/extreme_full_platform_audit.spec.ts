import { test, expect } from '@playwright/test';

test.describe('KFS OS / Axis Nitro - Auditoría Extrema Integral en Vivo', () => {
  const targetBaseUrl = process.env.TEST_URL || 'https://axisnitro.store';

  test('Fase 1: Landing Page Pública y Botones de Entrada', async ({ page }) => {
    await page.goto(`${targetBaseUrl}/`);
    await page.waitForLoadState('domcontentloaded');

    // Title / Brand presence
    const brand = page.locator('text=AXIS NITRO').or(page.locator('text=KFS'));
    await expect(brand.first()).toBeVisible({ timeout: 15000 });

    // Navbar should have "Acceder" or "Afiliar Comercio"
    const accessBtn = page.locator('button:has-text("Acceder"), button:has-text("Probar Demo en Vivo"), button:has-text("Afiliar")').first();
    await expect(accessBtn).toBeVisible({ timeout: 10000 });
  });

  test('Fase 2: Smart Access Login con Demo ("000") y Validación de Entrada', async ({ page }) => {
    await page.goto(`${targetBaseUrl}/`);
    await page.waitForLoadState('domcontentloaded');

    // Click "Acceder" or "Probar Demo en Vivo"
    const demoBtn = page.locator('button:has-text("Probar Demo en Vivo")').first();
    if (await demoBtn.isVisible()) {
      await demoBtn.click();
      await page.waitForTimeout(1000);

      // Verify that merchant dashboard loaded
      const merchantView = page.locator('text=Bodegón').or(page.locator('text=Comercio')).or(page.locator('text=Axis Nitro POS'));
      await expect(merchantView.first()).toBeVisible({ timeout: 15000 });
    } else {
      const loginBtn = page.locator('button:has-text("Acceder")').first();
      await expect(loginBtn).toBeVisible();
      await loginBtn.click();
      await page.waitForTimeout(500);

      const demoCard = page.locator('button:has-text("MODO DEMO COMERCIO")').first();
      await expect(demoCard).toBeVisible();
      await demoCard.click();
      await page.waitForTimeout(1000);

      const merchantView = page.locator('text=Bodegón').or(page.locator('text=Comercio'));
      await expect(merchantView.first()).toBeVisible({ timeout: 15000 });
    }
  });

  test('Fase 3: Auditoría Directa de /comercio (Dashboard de Negocio)', async ({ page }) => {
    await page.goto(`${targetBaseUrl}/comercio`);
    await page.waitForLoadState('domcontentloaded');

    // Verify merchant dashboard loaded
    const merchantHeader = page.locator('text=Comercio').or(page.locator('text=Inventario')).or(page.locator('text=Bodegón')).or(page.locator('text=Ventas'));
    await expect(merchantHeader.first()).toBeVisible({ timeout: 15000 });

    // Check action buttons like "Punto de Venta POS"
    const posNavBtn = page.locator('button:has-text("Punto de Venta"), button:has-text("POS"), button:has-text("Caja")').first();
    await expect(posNavBtn).toBeVisible({ timeout: 10000 });
  });

  test('Fase 4: Auditoría Directa de /pos (Axis Nitro POS y Venta Fluida)', async ({ page }) => {
    await page.goto(`${targetBaseUrl}/pos`);
    await page.waitForLoadState('domcontentloaded');

    // POS Header
    const posHeader = page.getByText(/Axis Nitro POS/i).first();
    await expect(posHeader).toBeVisible({ timeout: 15000 });

    // Product Grid items
    const products = page.locator('[data-testid^="pos-product-"]');
    await expect(products.first()).toBeVisible({ timeout: 10000 });

    // Add product to cart
    await products.first().click();

    // On mobile, tap the floating cart bar to open drawer first
    const mobileCartBar = page.locator('button:has-text("Cobrar Caja")');
    if (await mobileCartBar.isVisible()) {
      await mobileCartBar.click();
      await page.waitForTimeout(300);
    }

    // If on mobile screen and drawer is not yet open, open mobile cart drawer
    const drawerOpen = await page.locator('text=Carrito & Cobro').isVisible();
    if (!drawerOpen) {
      const mobileBtn = page.locator('[data-testid="mobile-open-cart-btn"]');
      if (await mobileBtn.isVisible()) {
        await mobileBtn.click({ force: true });
        await page.waitForTimeout(400);
      }
    }

    // Verify Cobrar is enabled and click
    const cobrarBtn = page.locator('[data-testid="pos-cobrar-btn"]:visible').last();
    await expect(cobrarBtn).toBeVisible({ timeout: 10000 });
    await cobrarBtn.click();

    // Receipt Modal should display
    const receiptHeader = page.getByText(/TOTAL CANCELADO/i);
    await expect(receiptHeader).toBeVisible({ timeout: 10000 });

    // Verify Tear paper button and close
    const tearBtn = page.getByRole('button', { name: /Rasgar Recibo y Volver/i });
    await expect(tearBtn).toBeVisible();
    await tearBtn.click();
    await page.waitForTimeout(400);

    // Should return to POS
    await expect(posHeader).toBeVisible();
  });

  test('Fase 5: Auditoría Directa de /rewards (Fidelidad B2C y Carnet Digital)', async ({ page }) => {
    await page.goto(`${targetBaseUrl}/rewards`);
    await page.waitForLoadState('domcontentloaded');

    // Verify rewards branding
    const rewardsTitle = page.locator('text=Rewards').or(page.locator('text=Recompensas')).or(page.locator('text=Puntos')).or(page.locator('text=Ahorro'));
    await expect(rewardsTitle.first()).toBeVisible({ timeout: 15000 });
  });

  test('Fase 6: Auditoría Directa de /promotora (Panel de Promotora y Comisiones)', async ({ page }) => {
    await page.goto(`${targetBaseUrl}/promotora`);
    await page.waitForLoadState('domcontentloaded');

    // Verify Promotora Dashboard
    const promoHeader = page.locator('text=Promotora').or(page.locator('text=Afiliad')).or(page.locator('text=Comisiones'));
    await expect(promoHeader.first()).toBeVisible({ timeout: 15000 });
  });

  test('Fase 7: Auditoría Directa de /rider (Panel de Repartidor)', async ({ page }) => {
    await page.goto(`${targetBaseUrl}/rider`);
    await page.waitForLoadState('domcontentloaded');

    // Verify Rider Dashboard
    const riderHeader = page.locator('text=Rider').or(page.locator('text=Despacho')).or(page.locator('text=Entregas')).or(page.locator('text=Delivery'));
    await expect(riderHeader.first()).toBeVisible({ timeout: 15000 });
  });

  test('Fase 8: Auditoría Directa de /vendedor (Terminal de Mostrador)', async ({ page }) => {
    await page.goto(`${targetBaseUrl}/vendedor`);
    await page.waitForLoadState('domcontentloaded');

    // Verify Vendedor Dashboard
    const vendedorHeader = page.locator('text=Vendedor').or(page.locator('text=Caja')).or(page.locator('text=Cobrar')).or(page.locator('text=Ventas'));
    await expect(vendedorHeader.first()).toBeVisible({ timeout: 15000 });
  });

  test('Fase 9: Auditoría Directa de /arquitecto y /core (Consola Maestra)', async ({ page }) => {
    await page.goto(`${targetBaseUrl}/arquitecto`);
    await page.waitForLoadState('domcontentloaded');

    // Verify Master Core Dashboard
    const coreHeader = page.locator('text=Arquitecto').or(page.locator('text=Core')).or(page.locator('text=Métricas')).or(page.locator('text=BOS'));
    await expect(coreHeader.first()).toBeVisible({ timeout: 15000 });
  });

  test('Fase 10: Auditoría Directa de /s25 (Entorno Offline S25 Ultra)', async ({ page }) => {
    await page.goto(`${targetBaseUrl}/s25`);
    await page.waitForLoadState('domcontentloaded');

    // Verify S25 Header
    const s25Header = page.locator('text=Samsung Galaxy S25 Ultra').or(page.locator('text=100% Offline'));
    await expect(s25Header.first()).toBeVisible({ timeout: 15000 });

    // Verify Tab switching in S25
    const posTab = page.locator('button:has-text("POS")').first();
    await expect(posTab).toBeVisible();
    await posTab.click();
    await page.waitForTimeout(300);

    const dueñoTab = page.locator('button:has-text("Dueño")').first();
    await expect(dueñoTab).toBeVisible();
    await dueñoTab.click();
    await page.waitForTimeout(300);
  });

  test('Fase 11: Auditoría de /download-apk (Centro de Descarga PWA/APK)', async ({ page }) => {
    await page.goto(`${targetBaseUrl}/download-apk`);
    await page.waitForLoadState('domcontentloaded');

    const downloadTitle = page.locator('text=APK').or(page.locator('text=Descargar')).or(page.locator('text=Instalar'));
    await expect(downloadTitle.first()).toBeVisible({ timeout: 15000 });
  });
});
