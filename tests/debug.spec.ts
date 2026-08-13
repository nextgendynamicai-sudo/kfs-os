import { test } from '@playwright/test';
test('Debug', async ({ page }) => {
  page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('[BROWSER ERROR]', err.message));
  await page.goto('/');
  await page.waitForTimeout(5000);
});