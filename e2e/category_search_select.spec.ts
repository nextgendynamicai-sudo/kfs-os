import { test, expect } from '@playwright/test';

test.describe('KFS OS - Selector de Rubros Comerciales con Búsqueda Predictiva', () => {
  test('Búsqueda predictiva y adaptación de catálogo en caliente', async ({ page }) => {
    // 1. Navegar directamente a la consola del Arquitecto
    await page.goto('/core');
    await page.waitForLoadState('domcontentloaded');

    // 2. Abrir el modal de Pitch Demo en Vivo
    const pitchBtn = page.locator('button[title*="Modo Demostración en Vivo"]').or(page.getByText('Demostración en Vivo')).first();
    await expect(pitchBtn).toBeVisible({ timeout: 15000 });
    await pitchBtn.click();

    // 3. Verificar que el selector de categoría muestre el rubro inicial
    const catSelector = page.locator('button[aria-haspopup="listbox"]').first();
    await expect(catSelector).toBeVisible({ timeout: 10000 });
    await expect(catSelector).toContainText('Bodegón');

    // 4. Abrir el dropdown de categorías
    await catSelector.click();
    const searchInput = page.locator('input[placeholder*="Buscar rubro o producto"]');
    await expect(searchInput).toBeVisible();

    // 5. Verificar que muestra el contador de rubros (19) y los atajos populares
    await expect(page.locator('text=19 rubros disponibles')).toBeVisible();
    await expect(page.locator('button:has-text("Repuestos Automotriz")').first()).toBeVisible();

    // 6. Probar la búsqueda predictiva con "repuestos"
    await searchInput.fill('repuestos');
    await expect(page.locator('text=1 rubro coincidente')).toBeVisible();
    const repuestosOption = page.locator('[data-category-item]:has-text("Repuestos")').first();
    await expect(repuestosOption).toBeVisible();

    // 7. Seleccionar Repuestos y verificar que se adapta el catálogo
    await repuestosOption.click();
    await expect(catSelector).toContainText('Repuestos');
    await expect(page.locator('text=Aceite Motor Semi-Sintético 20W50').first()).toBeVisible();

    // 8. Probar búsqueda de mascotas con término "perro"
    await catSelector.click();
    await searchInput.fill('perro');
    const mascotasOption = page.locator('[data-category-item]:has-text("Mascotas")').first();
    await expect(mascotasOption).toBeVisible();
    await mascotasOption.click();

    // 9. Verificar adaptación automática a productos de mascotas
    await expect(catSelector).toContainText('Mascotas');
    await expect(page.locator('text=Alimento Premium para Perro').first()).toBeVisible();
  });
});
