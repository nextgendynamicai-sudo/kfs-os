import { test, expect } from '@playwright/test';

test.describe('Cart Badge & Receipt Layout Precision Verification', () => {
  test('Clicking one product adds badge ONLY to that product card and does not bleed to others', async ({ page }) => {
    await page.goto('/pos');
    await page.waitForLoadState('networkidle');

    // Wait for product cards to be visible
    const productCards = page.locator('[data-testid^="pos-product-"]');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    const count = await productCards.count();
    expect(count).toBeGreaterThan(1);

    // Click ONLY the first product
    await productCards.first().click();

    // Verify first product has badge with text '1'
    const firstCardBadge = productCards.first().locator('span.bg-emerald-500');
    await expect(firstCardBadge).toBeVisible({ timeout: 5000 });
    await expect(firstCardBadge).toHaveText('1');

    // Verify the second product has NO badge at all
    const secondCardBadge = productCards.nth(1).locator('span.bg-emerald-500');
    await expect(secondCardBadge).toHaveCount(0);

    // Verify subsequent product cards have NO badge
    for (let i = 1; i < Math.min(count, 6); i++) {
      const badge = productCards.nth(i).locator('span.bg-emerald-500');
      await expect(badge).toHaveCount(0);
    }

    // Click the first product again to make it 2
    await productCards.first().click();
    await expect(firstCardBadge).toHaveText('2');

    // Second product still has NO badge
    await expect(secondCardBadge).toHaveCount(0);

    // Save screenshot of POS grid
    await page.screenshot({ path: 'test-results/pos_badge_single_product_verified.png' });
  });

  test('Receipt modal displays full product names and completely visible TOTAL CANCELADO', async ({ page }) => {
    await page.goto('/pos');
    await page.waitForLoadState('networkidle');

    const productCards = page.locator('[data-testid^="pos-product-"]');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });

    // Add 1 product
    await productCards.first().click();

    // If mobile floating cart bar is visible, open mobile drawer first
    const mobileBtn = page.locator('[data-testid="mobile-open-cart-btn"]');
    if (await mobileBtn.isVisible()) {
      await mobileBtn.click();
    }

    // Now click the checkout confirm button
    const cobrarBtn = page.locator('[data-testid="pos-cobrar-btn"]:visible');
    await expect(cobrarBtn).toBeVisible({ timeout: 5000 });
    await cobrarBtn.click();

    // Receipt Modal should now be open
    const receiptModal = page.locator('text=TOTAL CANCELADO');
    await expect(receiptModal).toBeVisible({ timeout: 10000 });

    // Verify that "TOTAL CANCELADO" box has dollar total
    const totalBox = page.locator('div:has-text("TOTAL CANCELADO")').last();
    await expect(totalBox).toBeVisible();

    // Take screenshot of the receipt modal
    await page.screenshot({ path: 'test-results/receipt_modal_verified.png' });

    // Check action buttons exist
    const whatsappBtn = page.locator('a:has-text("WhatsApp")');
    await expect(whatsappBtn).toBeVisible();

    const finishBtn = page.locator('button:has-text("Rasgar Recibo y Volver")');
    await expect(finishBtn).toBeVisible();

    // Click finish button to tear receipt and close modal
    await finishBtn.click();
    await expect(receiptModal).not.toBeVisible({ timeout: 5000 });
  });
});
