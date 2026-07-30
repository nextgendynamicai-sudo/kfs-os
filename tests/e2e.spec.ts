import { test, expect } from '@playwright/test';

test.describe('KFS OS Security & Role Authentication Suite', () => {
  
  test('Escenario 1: Seguridad Base - La URL principal no debe saltarse el login', async ({ page }) => {
    await page.goto('/');
    
    // Verificamos que estamos en el Landing y no en un Dashboard interno
    await expect(page.locator('text=Centro de Innovación y Distribución')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Soy Comprador")')).toBeVisible();
    
    // Aseguramos que la seguridad no está rota (No debe verse el panel de arquitecto)
    await expect(page.locator('text=Terminal Táctico de Ventas')).not.toBeVisible();
    await expect(page.locator('text=Broadcast Center')).not.toBeVisible();
  });

  test('Escenario 2: Acceso Arquitecto Core', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Arquitecto")');
    await page.fill('input[type="password"]', 'kfs123'); // Contraseña genérica de prueba
    await page.click('button:has-text("Acceder")');
    
    // Verificar que carga el panel de Arquitecto
    await expect(page.locator('text=Broadcast Center')).toBeVisible({ timeout: 10000 });
  });

  test('Escenario 3: Acceso Vendedor Táctico', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Soy Vendedor")');
    
    await page.fill('input[placeholder="ID de Vendedor"]', 'demo-vendedor');
    await page.fill('input[type="password"]', 'kfs123');
    await page.click('button:has-text("Iniciar Turno")');
    
    // Verificar que carga la caja registradora
    await expect(page.locator('text=Terminal Táctico de Ventas')).toBeVisible({ timeout: 10000 });
  });

  test('Escenario 4: Acceso Dueño de Local', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Nitro Hubs")');
    
    await page.fill('input[placeholder="ID del Local"]', 'hub-demo');
    await page.fill('input[type="password"]', 'kfs123');
    await page.click('button:has-text("Abrir Consola")');
    
    // Verificar que carga el panel del Hub
    await expect(page.locator('text=Conciliador SMS')).toBeVisible({ timeout: 10000 });
  });

  test('Escenario 5: Acceso Promotora', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Fuerza KFS")');
    await page.click('button:has-text("Promotora Digital")');
    
    await page.fill('input[placeholder="ID de Promotora"]', 'promo-demo');
    await page.fill('input[type="password"]', 'kfs123');
    await page.click('button:has-text("Acceder")');
    
    // Verificar que carga el panel de promotora
    await expect(page.locator('text=Referidos Activos')).toBeVisible({ timeout: 10000 });
  });

  test('Escenario 6: Acceso Directo a la App PWA de Recompensas Axis Nitro', async ({ page }) => {
    await page.goto('/rewards');
    
    // Verificar que carga la App PWA de Recompensas
    await expect(page.locator('text=Axis Nitro Rewards')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Saldo Axis Nitro Points')).toBeVisible();
  });
});
