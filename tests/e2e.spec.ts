import { test, expect } from '@playwright/test';

test.describe('KFS OS E2E Suite', () => {
  const url = 'https://kfs-os.vercel.app/';

  test('Customer Portal Registration and Dashboard', async ({ page }) => {
    // 1. Visit the production URL
    await page.goto(url);

    // 2. Go to the login system
    await page.click('button:has-text("Soy Comprador")');

    // 3. Select the Customer Tab
    await page.click('button:has-text("Comprador")');

    // 4. Click Register
    await page.click('button:has-text("¿Nuevo Comprador? Crea tu cuenta")');

    // 5. Fill out the registration form
    const phone = `0414${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.fill('input[placeholder="Nombre y Apellido"]', 'Test Automático');
    await page.fill('input[placeholder="Teléfono Móvil (Ej: 0414...)"]', phone);
    await page.fill('input[placeholder="Crear Contraseña"]', '123456');
    
    await page.click('button:has-text("Crear Cuenta")');

    // 6. Verify successful login into CustomerDashboard
    await expect(page.locator('h2:has-text("Hola, Test Automático")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3:has-text("Billetera de Fidelidad Global")')).toBeVisible();
    await expect(page.locator('text=PTS')).toBeVisible();
  });
});
