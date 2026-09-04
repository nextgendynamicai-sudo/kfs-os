import { test, expect } from '@playwright/test';

test.describe('KFS OS - Guía de Registros por Perfil y FAQ Desplegables', () => {

  test('Misión 1: Visualización de las 4 Tarjetas de Registro con Explicación y Botón Directo', async ({ page }) => {
    await page.goto('/#login');
    await page.waitForLoadState('domcontentloaded');

    // Validar encabezado de la guía de perfiles
    await expect(page.locator('text=¿Cuál es la cuenta ideal para ti?')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Perfiles y Accesos KFS OS')).toBeVisible();

    // 1. Tarjeta Cliente / Comprador
    await expect(page.locator('text=Cliente / Comprador').first()).toBeVisible();
    await expect(page.locator('button:has-text("Registrarme como Cliente")')).toBeVisible();

    // 2. Tarjeta Comercio o Negocio
    await expect(page.locator('text=Comercio o Negocio').first()).toBeVisible();
    await expect(page.locator('button:has-text("Afiliar mi Comercio")')).toBeVisible();

    // 3. Tarjeta Rider / Repartidor
    await expect(page.locator('text=Rider / Repartidor').first()).toBeVisible();
    await expect(page.locator('button:has-text("Postularme como Rider")')).toBeVisible();

    // 4. Tarjeta Promotora de Afiliación
    await expect(page.locator('text=Promotora de Afiliación').first()).toBeVisible();
    await expect(page.locator('button:has-text("Registrarme como Promotora")')).toBeVisible();
  });

  test('Misión 2: Botones Directos de Registro - Navegación Fluida a cada Formulario', async ({ page }) => {
    await page.goto('/#login');
    await page.waitForLoadState('domcontentloaded');

    // 1. Probar botón directo de Cliente
    await page.locator('button:has-text("Registrarme como Cliente")').click();
    await expect(page.locator('text=Nombre Completo')).toBeVisible({ timeout: 10000 });
    await page.locator('button:has-text("Iniciar Sesión")').click();

    // 2. Probar botón directo de Rider
    await page.locator('button:has-text("Postularme como Rider")').click();
    await expect(page.locator('text=Cambiar opción')).toBeVisible({ timeout: 10000 });
    const riderText = await page.textContent('body');
    expect(riderText).toMatch(/Rider|Delivery|Vehículo/i);
    await page.locator('button:has-text("Iniciar Sesión")').click();

    // 3. Probar botón directo de Promotora
    await page.locator('button:has-text("Registrarme como Promotora")').click();
    await expect(page.locator('text=Cambiar opción')).toBeVisible({ timeout: 10000 });
    const promoText = await page.textContent('body');
    expect(promoText).toMatch(/Promotora|Comisiones|Afiliación/i);
    await page.locator('button:has-text("Iniciar Sesión")').click();
  });

  test('Misión 3: Acordeón Interactivo de Preguntas Frecuentes (FAQ Desplegables)', async ({ page }) => {
    await page.goto('/#login');
    await page.waitForLoadState('domcontentloaded');

    // Validar presencia de la sección FAQ
    await expect(page.locator('text=Todo lo que necesitas saber')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Preguntas Frecuentes (FAQ)')).toBeVisible();

    // Primera pregunta sobre costos
    const faqBtn = page.locator('button:has-text("tiene algún costo")').first();
    await expect(faqBtn).toBeVisible();

    // Expandir pregunta
    await faqBtn.click();
    await expect(page.locator('text=100% gratuito')).toBeVisible();

    // Plegar pregunta
    await faqBtn.click();
    await expect(page.locator('text=100% gratuito')).not.toBeVisible();

    // Probar búsqueda interactiva de FAQ
    const searchInput = page.locator('input[placeholder*="Buscar duda"]');
    await searchInput.fill('BCV');
    const bcvFaqBtn = page.locator('button:has-text("métodos de pago")');
    await expect(bcvFaqBtn).toBeVisible();
    await bcvFaqBtn.click();
    await expect(page.locator('text=Banco Central de Venezuela')).toBeVisible();
    
    // Limpiar búsqueda
    await page.locator('button:has-text("✕")').click();
    await expect(faqBtn).toBeVisible();
  });

  test('Misión 4: Enlace Directo a Soporte WhatsApp', async ({ page }) => {
    await page.goto('/#login');
    await page.waitForLoadState('domcontentloaded');

    // Validar tarjeta de soporte
    const waLink = page.locator('a:has-text("Contactar por WhatsApp")');
    await expect(waLink).toBeVisible();
    const href = await waLink.getAttribute('href');
    expect(href).toContain('wa.me');
  });

});
