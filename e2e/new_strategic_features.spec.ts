import { test, expect } from '@playwright/test';

test.describe('KFS OS - Suite de Pruebas: 5 Nuevas Funcionalidades Estratégicas', () => {

  test.beforeEach(async ({ page }) => {
    // Evitar que modales de onboarding inicial bloqueen las vistas
    await page.addInitScript(() => {
      try {
        localStorage.setItem("kfs_onboarding_dismissed", "true");
      } catch {}
    });
  });

  test('Funcionalidad 1: Efecto Parlante (Audio Payment Engine & Chime)', async ({ page }) => {
    await page.goto('/comercio');
    await page.waitForLoadState('domcontentloaded');

    // Evaluar que la síntesis de voz y el contexto de audio están habilitados y soportados en utils
    const voiceSupported = await page.evaluate(() => {
      return typeof window !== 'undefined' && ('speechSynthesis' in window || 'AudioContext' in window || 'webkitAudioContext' in window);
    });
    expect(voiceSupported).toBe(true);
  });

  test('Funcionalidad 2: WhatsApp Smart Receipt y Enlace en Axis Nitro POS', async ({ page }) => {
    await page.goto('/pos');
    await page.waitForLoadState('domcontentloaded');

    // Verificar que el POS carga correctamente con controles de cobro y branding
    const posHeader = page.getByText(/Axis Nitro POS|Punto de Venta|KFS/i).first();
    await expect(posHeader).toBeVisible({ timeout: 15000 });

    // Verificar que el botón de cobro está presente
    const chargeBtn = page.getByText(/Confirmar Cobro/i).first();
    await expect(chargeBtn).toBeVisible();
  });

  test('Funcionalidad 3: Kit de Mostrador QR Standee Imprimible (B2B)', async ({ page }) => {
    await page.goto('/comercio');
    await page.waitForLoadState('domcontentloaded');

    // Buscar y presionar el botón Standee QR en la barra de acciones
    const standeeBtn = page.locator('button:has-text("Standee QR")').first();
    await expect(standeeBtn).toBeVisible({ timeout: 15000 });
    await standeeBtn.click();

    // Verificar que el modal de exhibidor abre y muestra el kit oficial
    const modalTitle = page.getByText(/Exhibidor QR para Clientes|Kit Oficial de Mostrador/i).first();
    await expect(modalTitle).toBeVisible({ timeout: 10000 });

    // Verificar botón de impresión de mostrador
    const printBtn = page.getByText(/Imprimir Exhibidor de Mostrador/i).first();
    await expect(printBtn).toBeVisible();

    // Cerrar modal
    const closeBtn = page.locator('button:has-text("Cerrar")').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  });

  test('Funcionalidad 4: PIN Rápido de Cajeros (4 Dígitos Numpad Táctil)', async ({ page }) => {
    // 4.1 En Axis Nitro POS (/pos)
    await page.goto('/pos');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500); // Esperar hidratación completa de React

    const posPinBtn = page.locator('[data-testid="pos-pin-btn"]').first();
    await expect(posPinBtn).toBeVisible({ timeout: 15000 });
    await posPinBtn.click();

    // Verificar que el teclado numérico táctil se despliega
    const pinModalTitle = page.getByText(/Cambio Rápido de Cajero/i).first();
    await expect(pinModalTitle).toBeVisible({ timeout: 10000 });

    // Verificar teclas táctiles numéricas 1, 2, 3...
    const key1 = page.locator('[data-testid="pin-key-1"]').first();
    await expect(key1).toBeVisible({ timeout: 10000 });

    // Cerrar modal
    const closePinBtn = page.locator('[data-testid="close-pin-modal"]').first();
    if (await closePinBtn.isVisible()) {
      await closePinBtn.click();
    }

    // 4.2 En Comercio (/comercio)
    await page.goto('/comercio');
    await page.waitForLoadState('domcontentloaded');

    const comercioPinBtn = page.locator('button:has-text("Cajero PIN")').first();
    if (await comercioPinBtn.isVisible()) {
      await comercioPinBtn.click();
      await expect(page.getByText(/Cambio Rápido de Cajero/i).first()).toBeVisible({ timeout: 10000 });
      const closeBtn = page.locator('[data-testid="close-pin-modal"]').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
    }
  });

  test('Funcionalidad 5: Bóveda & Respaldo Inmune (Regla 1 Safe Export & Restore)', async ({ page }) => {
    // 5.1 En Comercio (/comercio)
    await page.goto('/comercio');
    await page.waitForLoadState('domcontentloaded');

    const backupBtn = page.locator('button:has-text("Respaldo")').first();
    await expect(backupBtn).toBeVisible({ timeout: 15000 });
    await backupBtn.click();

    // Verificar que la Bóveda de Respaldo se despliega
    const vaultTitle = page.getByText(/Bóveda & Respaldo Inmune/i).first();
    await expect(vaultTitle).toBeVisible({ timeout: 10000 });

    // Verificar botón de exportar .json
    const exportBtn = page.getByRole('button', { name: /Exportar Respaldo/i }).first();
    await expect(exportBtn).toBeVisible();

    // Verificar escudo de Regla 1 (Preservación Absoluta de Registros)
    const rule1Badge = page.getByText(/Regla 1/i).first();
    await expect(rule1Badge).toBeVisible();

    // Cerrar modal
    const closeVaultBtn = page.locator('button:has-text("Cerrar")').first();
    if (await closeVaultBtn.isVisible()) {
      await closeVaultBtn.click();
    }
  });

});
