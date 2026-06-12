const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));
  page.on('requestfailed', request => console.log('BROWSER_REQUEST_FAILED:', request.url(), request.failure().errorText));

  console.log('Navigating to https://kfs-os.vercel.app/');
  try {
    await page.goto('https://kfs-os.vercel.app/', { waitUntil: 'networkidle', timeout: 15000 });
    console.log('Page loaded successfully. Waiting 5 seconds to see if anything crashes...');
    await page.waitForTimeout(5000);
  } catch (err) {
    console.error('Error navigating:', err);
  }

  await browser.close();
  console.log('Test finished.');
})();
