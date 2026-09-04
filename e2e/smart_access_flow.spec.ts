import { test, expect } from '@playwright/test';

test.describe('KFS OS - Smart SSO & Guided Registration Flow', () => {

  test('Misión 1: Landing Page - Botones de Acceso y Afiliación B2B visibles', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Botón de afiliar comercio
    const b2bBtn = page.locator('button:has-text("Comercio")').first();
    await expect(b2bBtn).toBeVisible({ timeout: 15000 });

    // Botón de acceder
    const accessBtn = page.locator('button:has-text("Acceder")').first();
    await expect(accessBtn).toBeVisible({ timeout: 15000 });
  });

  test('Misión 2: Smart SSO Login - Detección Universal y Botón de Registro Prominente', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Ir a login
    const accessBtn = page.locator('button:has-text("Acceder")').first();
    await accessBtn.click();

    // Validar título y campos unificados
    await expect(page.locator('text=Access')).toBeVisible({ timeout: 10000 });
    const idInput = page.locator('input[placeholder*="usuario@correo.com"]');
    await expect(idInput).toBeVisible();

    const passInput = page.locator('input[placeholder*="clave de acceso"]');
    await expect(passInput).toBeVisible();

    // Validar botón de registro de alta visibilidad
    const registerCTA = page.locator('button:has-text("Crear Cuenta Nueva")');
    await expect(registerCTA).toBeVisible();
  });

  test('Misión 3: Selector Guiado por Propósito - 3 Vertientes Claras (Cliente, Negocio, Red)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('button:has-text("Acceder")').first().click();

    // Clic en registrarse
    const registerCTA = page.locator('button:has-text("Crear Cuenta Nueva")');
    await registerCTA.click();

    // Validar que carga el selector guiado
    await expect(page.locator('text=¿Cómo deseas usar Axis Nitro?')).toBeVisible({ timeout: 10000 });

    // Validar las 3 vertientes
    await expect(page.locator('text=Soy Comprador / Cliente')).toBeVisible();
    await expect(page.locator('text=Tengo un Comercio / Negocio')).toBeVisible();
    await expect(page.locator('text=Quiero Generar Ingresos con la Red')).toBeVisible();

    // Probar abrir formulario de cliente
    await page.locator('button:has-text("Soy Comprador / Cliente")').click();
    await expect(page.locator('text=Nombre Completo')).toBeVisible({ timeout: 10000 });

    // Probar volver al selector
    const backBtn = page.locator('button:has-text("Cambiar opción")');
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    await expect(page.locator('text=¿Cómo deseas usar Axis Nitro?')).toBeVisible();
  });

  test('Misión 4: Acceso Smart Demo ("000") y Clave Maestra', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('button:has-text("Acceder")').first().click();

    const passInput = page.locator('input[placeholder*="clave de acceso"]');
    await passInput.fill('000');

    // Debe mostrar badge de Modo Demo
    await expect(page.locator('text=Modo Demo Activado')).toBeVisible();

    // Iniciar sesión
    const submitBtn = page.locator('button:has-text("Iniciar Sesión")');
    await submitBtn.click();

    // Debe acceder exitosamente al panel de control
    await expect(page.getByText(/Punto de Venta|Comercio|KFS/i).first()).toBeVisible({ timeout: 15000 });
  });

});
