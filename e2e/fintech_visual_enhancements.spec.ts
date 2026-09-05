import { test, expect } from '@playwright/test';

test.describe('KFS OS - Mejoras Visuales Fintech de Élite', () => {

  test('Misión 1: Chip de Plataforma en Vivo con Tasa BCV y Estado Operativo', async ({ page }) => {
    await page.goto('/#login');
    await page.waitForLoadState('domcontentloaded');

    // Validar chip de red en vivo
    await expect(page.locator('text=Red KFS Activa')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Tasa Oficial BCV:')).toBeVisible();
    
    // Validar indicador pulsante
    const liveChip = page.locator('div:has-text("Red KFS Activa")').first();
    await expect(liveChip).toBeVisible();
  });

  test('Misión 2: Badges de Confianza y Seguridad Bancaria (Trust Badges)', async ({ page }) => {
    await page.goto('/#login');
    await page.waitForLoadState('domcontentloaded');

    // Validar los 3 micro-badges de confianza dentro de la tarjeta
    await expect(page.locator('text=Cifrado TLS 256-bit')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Persistencia Blindada')).toBeVisible();
    await expect(page.locator('text=Tasa Oficial BCV').first()).toBeVisible();
  });

  test('Misión 3: Tarjeta Holográfica Interactiva VIP Axis Rewards en Perfil Cliente', async ({ page }) => {
    await page.goto('/#login');
    await page.waitForLoadState('domcontentloaded');

    // Validar elementos de la tarjeta digital VIP
    await expect(page.locator('text=VIP PASS')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=CHIP')).toBeVisible();
    await expect(page.locator('text=NFC •)))')).toBeVisible();
    await expect(page.locator('text=CLIENTE FRECUENTE')).toBeVisible();
    await expect(page.locator('text=AXIS REWARDS')).toBeVisible();
  });

  test('Misión 4: Micro-Animación de Carga en Botón de Inicio de Sesión', async ({ page }) => {
    await page.goto('/#login');
    await page.waitForLoadState('domcontentloaded');

    const passInput = page.locator('input[placeholder*="clave de acceso"]');
    await passInput.fill('000');

    // Clic en iniciar sesión
    const submitBtn = page.locator('button:has-text("Iniciar Sesión")');
    await submitBtn.click();

    // Debe mostrar estado de carga o acceso concedido
    await expect(page.getByText(/Acceso Concedido|Verificando credenciales|Panel|Modo Demostración/i).first()).toBeVisible({ timeout: 15000 });
  });

});
