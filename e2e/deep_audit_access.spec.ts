import { test, expect } from '@playwright/test';

test.describe('KFS OS - Auditoría de Integridad y Cero Regresiones (Acceso & Registro)', () => {

  test('Auditoría 1: Login Universal Dueño de Comercio (comercio@demo.com + 000)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('button:has-text("Acceder")').first().click();

    await page.locator('input[placeholder*="usuario@correo.com"]').fill('comercio@demo.com');
    await page.locator('input[placeholder*="clave de acceso"]').fill('000');
    await page.locator('button:has-text("Iniciar Sesión")').click();

    // Debe acceder al panel de comercio
    await expect(page.getByText(/Comercio|Punto de Venta|Inventario/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('Auditoría 2: Login Universal Vendedor POS (vendedor@demo.com + 000)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('button:has-text("Acceder")').first().click();

    await page.locator('input[placeholder*="usuario@correo.com"]').fill('vendedor@demo.com');
    await page.locator('input[placeholder*="clave de acceso"]').fill('000');
    await page.locator('button:has-text("Iniciar Sesión")').click();

    // Debe acceder a la caja o punto de venta
    await expect(page.getByText(/Vendedor|Cobrar|POS|Catálogo/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('Auditoría 3: Login Universal Promotora (promotora@demo.com + 000)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('button:has-text("Acceder")').first().click();

    await page.locator('input[placeholder*="usuario@correo.com"]').fill('promotora@demo.com');
    await page.locator('input[placeholder*="clave de acceso"]').fill('000');
    await page.locator('button:has-text("Iniciar Sesión")').click();

    // Debe acceder al panel de promotora
    await expect(page.getByText(/Promotora|Comisiones|Afiliados|Referidos/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('Auditoría 4: Login Universal Rider (rider@demo.com + 000)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('button:has-text("Acceder")').first().click();

    await page.locator('input[placeholder*="usuario@correo.com"]').fill('rider@demo.com');
    await page.locator('input[placeholder*="clave de acceso"]').fill('000');
    await page.locator('button:has-text("Iniciar Sesión")').click();

    // Debe acceder al panel de rider
    await expect(page.getByText(/Rider|Delivery|Despachos|Entregas/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('Auditoría 5: Login Universal Cliente por Teléfono (+584141234567 + 000)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('button:has-text("Acceder")').first().click();

    await page.locator('input[placeholder*="usuario@correo.com"]').fill('+584141234567');
    await page.locator('input[placeholder*="clave de acceso"]').fill('000');
    await page.locator('button:has-text("Iniciar Sesión")').click();

    // Debe acceder al panel de cliente / rewards
    await expect(page.getByText(/Rewards|Puntos|K-Points|Saldo/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('Auditoría 6: Acceso Maestro de Arquitecto con Clave Directa (199521)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('button:has-text("Acceder")').first().click();

    await page.locator('input[placeholder*="clave de acceso"]').fill('199521');
    await page.locator('button:has-text("Iniciar Sesión")').click();

    // Debe acceder a la consola Core de Arquitecto
    await expect(page.getByText(/Arquitecto|Core|Demostración/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('Auditoría 7: Integridad de Enlaces Profundos URL (?role=rider -> RegisterRiderForm)', async ({ page }) => {
    // Entrar con parámetro de rol para rider
    await page.goto('/?role=rider');
    await page.waitForLoadState('domcontentloaded');

    // Debe cargar directamente el formulario de registro de rider
    await expect(page.locator('text=Cambiar opción')).toBeVisible({ timeout: 10000 });
    const riderFormText = await page.textContent('body');
    expect(riderFormText).toMatch(/Rider|Delivery|Vehículo|Placa|Documentos/i);
  });

  test('Auditoría 8: Integridad de Enlaces Profundos URL (?role=promotora -> RegisterPromotoraForm)', async ({ page }) => {
    // Entrar con parámetro de rol para promotora
    await page.goto('/?role=promotora');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Cambiar opción')).toBeVisible({ timeout: 10000 });
    const promoFormText = await page.textContent('body');
    expect(promoFormText).toMatch(/Promotora|Comisiones|Afiliación/i);
  });

  test('Auditoría 9: Enlace de Referido (?ref=PROMO777 -> Formulario de Cliente con Referido)', async ({ page }) => {
    await page.goto('/?ref=PROMO777');
    await page.waitForLoadState('domcontentloaded');

    // Debe abrir automáticamente el formulario de cliente
    await expect(page.locator('text=Nombre Completo')).toBeVisible({ timeout: 10000 });
  });

  test('Auditoría 10: Selector de Propósito - Navegación Bidireccional Completa', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('button:has-text("Acceder")').first().click();
    await page.locator('button:has-text("Crear Cuenta Nueva")').click();

    // 1. Probar Rider
    await page.locator('button:has-text("Soy Rider")').click();
    await expect(page.locator('text=Cambiar opción')).toBeVisible();
    await page.locator('button:has-text("Cambiar opción")').click();

    // 2. Probar Promotora
    await page.locator('button:has-text("Soy Promotora")').click();
    await expect(page.locator('text=Cambiar opción')).toBeVisible();
    await page.locator('button:has-text("Cambiar opción")').click();

    // 3. Probar Cliente
    await page.locator('button:has-text("Soy Comprador / Cliente")').click();
    await expect(page.locator('text=Nombre Completo')).toBeVisible();
    await page.locator('button:has-text("Cambiar opción")').click();

    // 4. Regresar a Login
    await page.locator('button:has-text("Volver")').click();
    await expect(page.locator('input[placeholder*="clave de acceso"]')).toBeVisible();
  });

  test('Auditoría 11: Cumplimiento Infranqueable de la Regla 1 (Persistencia Absoluta de Datos)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Inyectar un comercio real de usuario en localStorage
    await page.evaluate(() => {
      const existingDB = JSON.parse(localStorage.getItem('kfs_local_db') || '{}');
      const customClient = {
        id: 'real-user-store-999',
        company: 'Bodegón Los Próceres C.A.',
        email: 'proceres@bodegon.com',
        password: 'password123',
        walletBalanceUSD: 5420.50,
        salesUSD: 18940.00
      };
      existingDB.clients = [...(existingDB.clients || []), customClient];
      localStorage.setItem('kfs_local_db', JSON.stringify(existingDB));
    });

    // Recargar la página simulando una actualización de versión / despliegue
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Verificar que los datos del usuario real siguen existiendo intactos
    const preserved = await page.evaluate(() => {
      const db = JSON.parse(localStorage.getItem('kfs_local_db') || '{}');
      const found = (db.clients || []).find((c: any) => c.id === 'real-user-store-999');
      return found && found.walletBalanceUSD === 5420.50 && found.company === 'Bodegón Los Próceres C.A.';
    });

    expect(preserved).toBe(true);
  });

});
