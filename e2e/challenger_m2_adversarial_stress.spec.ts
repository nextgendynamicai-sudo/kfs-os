import { test, expect } from '@playwright/test';

test.describe('Challenger M2-3 Adversarial Stress Verification', () => {

  const viewports = [
    { name: 'Samsung Galaxy S25 Ultra', width: 412, height: 915 },
    { name: 'iPhone 14 / 15 Pro', width: 390, height: 844 },
    { name: 'Samsung Galaxy A-series', width: 360, height: 800 },
  ];

  for (const vp of viewports) {
    test(`/pos zero overflow stress on ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/pos');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(600);

      const metrics = await page.evaluate((vw) => {
        const docElem = document.documentElement;
        const body = document.body;

        const protruding: { tag: string; className: string; right: number; width: number }[] = [];
        document.querySelectorAll('*').forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.right > vw + 1 && el.clientWidth > 0 && rect.width > 0) {
            protruding.push({
              tag: el.tagName,
              className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 80) : '',
              right: rect.right,
              width: rect.width,
            });
          }
        });

        return {
          windowWidth: window.innerWidth,
          docScrollWidth: docElem.scrollWidth,
          docClientWidth: docElem.clientWidth,
          bodyScrollWidth: body ? body.scrollWidth : 0,
          bodyClientWidth: body ? body.clientWidth : 0,
          protrudingCount: protruding.length,
          protruding,
        };
      }, vp.width);

      console.log(`[Viewport: ${vp.name} ${vp.width}px] docScrollWidth=${metrics.docScrollWidth}, docClientWidth=${metrics.docClientWidth}, protrudingCount=${metrics.protrudingCount}`);

      expect(metrics.docScrollWidth).toBeLessThanOrEqual(vp.width + 1);
      expect(metrics.docClientWidth).toBe(vp.width);
      expect(metrics.docScrollWidth - metrics.docClientWidth).toBeLessThanOrEqual(1);
    });
  }

  test('/pos interactive cart drawer and payment options on 412x915 does not cause horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/pos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600);

    // 1. Initial measurement
    const initialOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    expect(initialOverflow).toBe(0);

    // 2. Add product to cart
    const productCard = page.locator('button, div').filter({ hasText: /harina|pan|queso|leche|aceite|arroz|combo|coca/i }).first();
    if (await productCard.isVisible()) {
      await productCard.click();
      await page.waitForTimeout(300);
    }

    // 3. Open mobile bottom drawer
    const mobileCartBar = page.locator('.lg\\:hidden.fixed.bottom-3');
    if (await mobileCartBar.isVisible()) {
      await mobileCartBar.click();
      await page.waitForTimeout(500);

      // Verify drawer is open and check overflow
      const drawerOverflow = await page.evaluate(() => {
        return {
          docScrollWidth: document.documentElement.scrollWidth,
          docClientWidth: document.documentElement.clientWidth,
          bodyScrollWidth: document.body ? document.body.scrollWidth : 0,
        };
      });

      console.log(`[POS Cart Drawer Open] docScrollWidth=${drawerOverflow.docScrollWidth}, docClientWidth=${drawerOverflow.docClientWidth}`);
      expect(drawerOverflow.docScrollWidth).toBeLessThanOrEqual(413);

      // 4. Test quantity manipulation
      const plusBtn = page.locator('button[title="Sumar unidad"]').first();
      if (await plusBtn.isVisible()) {
        await plusBtn.click();
        await page.waitForTimeout(200);
      }

      // Check overflow again after quantity change
      const afterPlusOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth - document.documentElement.clientWidth;
      });
      expect(afterPlusOverflow).toBeLessThanOrEqual(1);
    }
  });

  test('/pos header buttons bounds on 412x915: all inside viewport', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/pos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const headerMetrics = await page.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return null;

      const headerRect = header.getBoundingClientRect();
      const buttons = Array.from(header.querySelectorAll('button')).map((b) => {
        const r = b.getBoundingClientRect();
        return {
          title: b.getAttribute('title') || b.textContent?.trim().slice(0, 30) || '',
          className: b.className.slice(0, 50),
          left: r.left,
          right: r.right,
          width: r.width,
          height: r.height,
          withinViewport: r.right <= window.innerWidth + 1 && r.left >= -1,
        };
      });

      return {
        headerWidth: headerRect.width,
        headerRight: headerRect.right,
        buttons,
      };
    });

    console.log('[POS Header Buttons Bounding]:', JSON.stringify(headerMetrics, null, 2));

    expect(headerMetrics).not.toBeNull();
    expect(headerMetrics!.headerRight).toBeLessThanOrEqual(413);
    for (const b of headerMetrics!.buttons) {
      expect(b.withinViewport).toBe(true);
      expect(b.right).toBeLessThanOrEqual(413);
    }
  });

});
