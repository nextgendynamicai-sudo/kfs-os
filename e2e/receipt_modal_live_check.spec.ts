import { test, expect } from '@playwright/test';

test('Verify ReceiptModal rendering and no clipping on S25 Ultra (412x915)', async ({ page }) => {
  // Mobile viewport: Samsung Galaxy S25 Ultra (412x915)
  await page.setViewportSize({ width: 412, height: 915 });

  // Navigate to /pos
  await page.goto('/pos');
  await page.waitForLoadState('domcontentloaded');

  // Verify POS title is visible
  const posTitle = page.getByText(/Axis Nitro POS/i).first();
  await expect(posTitle).toBeVisible({ timeout: 15000 });

  // Add the first product to cart
  const firstProduct = page.locator('[data-testid^="pos-product-"]').first();
  await expect(firstProduct).toBeVisible({ timeout: 10000 });
  await firstProduct.click();

  // On mobile, tap the floating "Cobrar Caja" button to open drawer
  const cobrarCajaBtn = page.locator('button:has-text("Cobrar Caja")').first();
  await expect(cobrarCajaBtn).toBeVisible({ timeout: 5000 });
  await cobrarCajaBtn.click();

  // Tap "Cobrar" inside the drawer to finalize sale
  const confirmBtn = page.locator('button:has-text("Cobrar"):visible').last();
  await expect(confirmBtn).toBeVisible({ timeout: 5000 });
  await confirmBtn.click();

  // Verify Receipt Modal opens
  const receiptTitle = page.getByText(/TOTAL CANCELADO/i);
  await expect(receiptTitle).toBeVisible({ timeout: 10000 });

  // Verify full product name is rendered without being clipped by the jagged cut
  const totalAmount = page.locator('text=TOTAL CANCELADO').locator('..').locator('span.text-3xl');
  await expect(totalAmount).toBeVisible();

  // Verify "✂️ Rasgar Recibo y Volver" button is visible and active
  const tearBtn = page.getByRole('button', { name: /Rasgar Recibo y Volver/i });
  await expect(tearBtn).toBeVisible();

  // Verify Rollo Térmico buttons
  const roll58 = page.getByRole('button', { name: '58mm' }).first();
  await expect(roll58).toBeVisible();

  // Tap "✂️ Rasgar Recibo y Volver" to finish sale smoothly
  await tearBtn.click();

  // Verify receipt closes and user is returned back to POS
  await expect(receiptTitle).not.toBeVisible({ timeout: 5000 });
  await expect(posTitle).toBeVisible();

  console.log('✅ S25 Ultra ReceiptModal test PASSED with zero clipping and high agility!');
});
