import { test, expect } from '@playwright/test';

// Samsung Galaxy S25 Ultra Mobile Viewport
const S25_VIEWPORT = { width: 412, height: 915 };

test.describe('Milestone 2 Empirical Challenger — Mobile Viewport (412x915) & UI/UX', () => {

  test.use({
    viewport: S25_VIEWPORT,
    userAgent: 'Mozilla/5.0 (Linux; Android 15; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
  });

  // =========================================================================
  // 1. NO HORIZONTAL OVERFLOW ON 412x915 VIEWPORT
  // =========================================================================
  test('Root & Core Pages: No horizontal overflow on 412x915 Samsung S25 Ultra', async ({ page }) => {
    const pagesToTest = ['/', '/rider', '/pos', '/promotora', '/comercio'];

    for (const path of pagesToTest) {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      // Small pause to allow animations & fonts to settle
      await page.waitForTimeout(500);

      const metrics = await page.evaluate(() => {
        const docElem = document.documentElement;
        const body = document.body;
        const windowWidth = window.innerWidth;

        // Check if any element protrudes past windowWidth
        const overflowingElements: { tag: string; id: string; className: string; right: number; width: number }[] = [];
        const allElements = document.querySelectorAll('*');
        allElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          // allow 1px rounding tolerance
          if (rect.right > windowWidth + 1 && el.clientWidth > 0 && rect.width > 0) {
            overflowingElements.push({
              tag: el.tagName,
              id: el.id,
              className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 80) : '',
              right: rect.right,
              width: rect.width,
            });
          }
        });

        return {
          windowWidth,
          docScrollWidth: docElem.scrollWidth,
          docClientWidth: docElem.clientWidth,
          bodyScrollWidth: body ? body.scrollWidth : 0,
          bodyClientWidth: body ? body.clientWidth : 0,
          overflowCount: overflowingElements.length,
          topOverflowElements: overflowingElements.slice(0, 5),
        };
      });

      console.log(`[Path: ${path}] Viewport: ${metrics.windowWidth}px, docScrollWidth: ${metrics.docScrollWidth}px, docClientWidth: ${metrics.docClientWidth}px`);

      if (metrics.overflowCount > 0) {
        console.log(`[Path: ${path}] Overflowing elements:`, JSON.stringify(metrics.topOverflowElements, null, 2));
      }

      // The document root and body must never exceed viewport width (no horizontal scrollbar)
      expect(metrics.docScrollWidth, `Path ${path} has document horizontal overflow: scrollWidth (${metrics.docScrollWidth}) > clientWidth (${metrics.docClientWidth})`).toBeLessThanOrEqual(metrics.windowWidth + 1);
      expect(metrics.bodyScrollWidth, `Path ${path} has body horizontal overflow: scrollWidth (${metrics.bodyScrollWidth}) > clientWidth (${metrics.bodyClientWidth})`).toBeLessThanOrEqual(metrics.windowWidth + 1);
    }
  });

  // =========================================================================
  // 2. RIDER DASHBOARD TAB NAVIGATION STATE CHANGES
  // =========================================================================
  test('RiderDashboard: Tab navigation state changes correctly (Overview, Deliveries, Pago, Docs)', async ({ page }) => {
    await page.goto('/rider');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Initial state: Overview tab should be active
    const overviewHeading = page.getByText(/Negocios Asociados/i).first();
    await expect(overviewHeading).toBeVisible({ timeout: 10000 });

    // Inspect the tab buttons available in DOM
    const tabButtonsInfo = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns
        .filter(b => b.textContent && (b.textContent.includes('Entregas') || b.textContent.includes('Resumen') || b.textContent.includes('Pago')))
        .map(b => ({
          text: b.textContent?.trim(),
          className: b.className,
          rect: b.getBoundingClientRect(),
          parentTag: b.parentElement?.tagName,
          parentClass: b.parentElement?.className,
        }));
    });
    console.log('[Rider Tab Buttons in DOM]:', JSON.stringify(tabButtonsInfo, null, 2));

    // Capture console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    // Check if Mobile Bottom Navigation Bar is visible
    const bottomNav = page.locator('.sm\\:hidden.fixed.bottom-0');
    const isMobileNav = await bottomNav.isVisible();

    if (isMobileNav) {
      // =========================================================================
      // Verify ALL 4 tabs via Mobile Bottom Navigation Bar (Thumb ergonomic bar)
      // =========================================================================
      
      // Tab 2: Entregas
      const bottomDeliveriesBtn = bottomNav.locator('button').filter({ hasText: /Entregas/ }).first();
      await bottomDeliveriesBtn.click();
      await page.waitForTimeout(400);
      await expect(page.getByText(/Mis Pedidos Asignados/i).first()).toBeVisible({ timeout: 5000 });

      // Tab 3: Pago Móvil
      const bottomPagoBtn = bottomNav.locator('button').filter({ hasText: /Pago Móvil/ }).first();
      await bottomPagoBtn.click();
      await page.waitForTimeout(400);
      await expect(page.getByText(/Datos de Pago Móvil/i).first()).toBeVisible({ timeout: 5000 });

      // Tab 4: Documentos
      const bottomDocsBtn = bottomNav.locator('button').filter({ hasText: /Documentos/ }).first();
      await bottomDocsBtn.click();
      await page.waitForTimeout(400);
      await expect(page.getByText(/Documentos Registrados/i).first()).toBeVisible({ timeout: 5000 });

      // Tab 1: Resumen (back to overview)
      const bottomOverviewBtn = bottomNav.locator('button').filter({ hasText: /Resumen/ }).first();
      await bottomOverviewBtn.click();
      await page.waitForTimeout(400);
      await expect(page.getByText(/Negocios Asociados/i).first()).toBeVisible({ timeout: 5000 });
    }

    // =========================================================================
    // Verify Upper Tab Bar (after scrolling into view)
    // =========================================================================
    const upperDeliveriesBtn = page.locator('div.overflow-x-auto button').filter({ hasText: /Entregas/ }).first();
    await upperDeliveriesBtn.scrollIntoViewIfNeeded();
    await upperDeliveriesBtn.click();
    await page.waitForTimeout(400);
    await expect(page.getByText(/Mis Pedidos Asignados/i).first()).toBeVisible({ timeout: 5000 });

    const upperPagoBtn = page.locator('div.overflow-x-auto button').filter({ hasText: /Pago Móvil/ }).first();
    await upperPagoBtn.scrollIntoViewIfNeeded();
    await upperPagoBtn.click();
    await page.waitForTimeout(400);
    await expect(page.getByText(/Datos de Pago Móvil/i).first()).toBeVisible({ timeout: 5000 });

    const upperOverviewBtn = page.locator('div.overflow-x-auto button').filter({ hasText: /Resumen/ }).first();
    await upperOverviewBtn.scrollIntoViewIfNeeded();
    await upperOverviewBtn.click();
    await page.waitForTimeout(400);
    await expect(page.getByText(/Negocios Asociados/i).first()).toBeVisible({ timeout: 5000 });

    // Both bottom nav and upper tab bar successfully verified
  });

  // =========================================================================
  // 3. AXIS NITRO POS TOUCH TARGET ACCESSIBILITY (>= 44x44px)
  // =========================================================================
  test('AxisNitroPOS: Touch targets meet WCAG 2.5.5 minimum 44x44px dimensions', async ({ page }) => {
    await page.goto('/pos');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(600);

    // 1. Verify Quick Cash Denomination buttons dimensions (Exacto, $1, $5, $10, $20, $50, $100)
    // First ensure we are viewing the cash payment options or open drawer if needed
    // In mobile view (412px), desktop cart panel might be hidden or in mobile drawer
    // Let's add a product to cart first by clicking the first product card
    const firstProduct = page.locator('button, div').filter({ hasText: /harina|pan|queso|leche|aceite|arroz|combo|coca/i }).first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      await page.waitForTimeout(300);
    }

    // Open mobile cart drawer if mobile floating bar is present
    const mobileCartBar = page.locator('.lg\\:hidden.fixed.bottom-3');
    if (await mobileCartBar.isVisible()) {
      await mobileCartBar.click();
      await page.waitForTimeout(500);
    }

    // Measure Cash buttons: Exacto and $1, $5, $10, $20, $50, $100
    const exactoBtn = page.locator('button').filter({ hasText: /^Exacto$/ }).first();
    if (await exactoBtn.isVisible()) {
      const box = await exactoBtn.boundingBox();
      expect(box, 'Exacto button boundingBox').not.toBeNull();
      console.log(`[POS Touch Target] Exacto button: ${box!.width}x${box!.height}px`);
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }

    const billDenoms = ['$1', '$5', '$10', '$20', '$50', '$100'];
    for (const bill of billDenoms) {
      const billBtn = page.locator('button').filter({ hasText: new RegExp(`^\\${bill}$`) }).first();
      if (await billBtn.isVisible()) {
        const box = await billBtn.boundingBox();
        expect(box, `${bill} button boundingBox`).not.toBeNull();
        console.log(`[POS Touch Target] ${bill} button: ${box!.width}x${box!.height}px`);
        expect(box!.width).toBeGreaterThanOrEqual(44);
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
    }

    // Measure Quantity controls: Minus (-), Plus (+), Trash buttons in cart
    const minusBtn = page.locator('button[title="Restar unidad"]').first();
    if (await minusBtn.isVisible()) {
      const boxMinus = await minusBtn.boundingBox();
      expect(boxMinus, 'Minus button boundingBox').not.toBeNull();
      console.log(`[POS Touch Target] Minus button: ${boxMinus!.width}x${boxMinus!.height}px`);
      expect(boxMinus!.width).toBeGreaterThanOrEqual(44);
      expect(boxMinus!.height).toBeGreaterThanOrEqual(44);
    }

    const plusBtn = page.locator('button[title="Sumar unidad"]').first();
    if (await plusBtn.isVisible()) {
      const boxPlus = await plusBtn.boundingBox();
      expect(boxPlus, 'Plus button boundingBox').not.toBeNull();
      console.log(`[POS Touch Target] Plus button: ${boxPlus!.width}x${boxPlus!.height}px`);
      expect(boxPlus!.width).toBeGreaterThanOrEqual(44);
      expect(boxPlus!.height).toBeGreaterThanOrEqual(44);
    }

    const trashBtn = page.locator('button[title="Eliminar producto"]').first();
    if (await trashBtn.isVisible()) {
      const boxTrash = await trashBtn.boundingBox();
      expect(boxTrash, 'Trash button boundingBox').not.toBeNull();
      console.log(`[POS Touch Target] Trash button: ${boxTrash!.width}x${boxTrash!.height}px`);
      expect(boxTrash!.width).toBeGreaterThanOrEqual(44);
      expect(boxTrash!.height).toBeGreaterThanOrEqual(44);
    }
  });

  // =========================================================================
  // 4. PROMOTORA DASHBOARD BOTTOM TAB ACCESSIBILITY
  // =========================================================================
  test('PromotoraDashboard: Bottom nav has justify-start and first tab is accessible', async ({ page }) => {
    await page.goto('/promotora');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Verify Promotora dashboard loaded
    const title = page.getByText(/Promotora/i).first();
    await expect(title).toBeVisible({ timeout: 10000 });

    // Check bottom navigation container classes and positioning
    const navMetrics = await page.evaluate(() => {
      // Find the bottom navigation container with overflow-x-auto
      const containers = Array.from(document.querySelectorAll('.overflow-x-auto'));
      for (const c of containers) {
        if (c.textContent && (c.textContent.includes('Panel') || c.textContent.includes('Afiliados'))) {
          const rect = c.getBoundingClientRect();
          const firstButton = c.querySelector('button');
          const firstButtonRect = firstButton ? firstButton.getBoundingClientRect() : null;
          return {
            className: c.className,
            scrollLeft: c.scrollLeft,
            rectLeft: rect.left,
            firstButtonLeft: firstButtonRect ? firstButtonRect.left : null,
            hasJustifyStart: c.className.includes('justify-start'),
            hasJustifyCenterWithoutStart: c.className.includes('justify-center') && !c.className.includes('justify-start'),
          };
        }
      }
      return null;
    });

    console.log('[Promotora Bottom Nav Metrics]:', navMetrics);
    if (navMetrics) {
      expect(navMetrics.hasJustifyCenterWithoutStart).toBe(false);
      if (navMetrics.firstButtonLeft !== null) {
        expect(navMetrics.firstButtonLeft).toBeGreaterThanOrEqual(0);
      }
    }
  });

  // =========================================================================
  // 5. NAVBAR MOBILE SECONDARY TOOLS DROPDOWN ON 412px
  // =========================================================================
  test('Navbar: Mobile tools dropdown opens and primary branding/logout remain visible', async ({ page }) => {
    await page.goto('/comercio');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Check that logo/branding is visible and not clipped
    const brand = page.locator('text=AXIS NITRO').first();
    await expect(brand).toBeVisible();

    // Check mobile secondary tools button (SlidersHorizontal icon)
    const mobileToolsBtn = page.locator('button[title="Herramientas y conexión"]').first();
    if (await mobileToolsBtn.isVisible()) {
      // Toggle dropdown open
      await mobileToolsBtn.click();
      await page.waitForTimeout(300);

      // Verify dropdown menu or popover appears
      const dropdownItem = page.getByText(/EN LÍNEA|DESCONECTADO|MODO LOCAL|Buscar|Modo/i).first();
      await expect(dropdownItem).toBeVisible();

      // Close dropdown
      await mobileToolsBtn.click();
    }
  });

});
