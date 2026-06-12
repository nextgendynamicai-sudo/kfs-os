const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));
  page.on('requestfailed', request => console.log('BROWSER_REQUEST_FAILED:', request.url(), request.failure()?.errorText));

  console.log('Navigating to http://localhost:3000/');
  try {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded successfully. Waiting 5 seconds...');
    await page.waitForTimeout(5000);
    const content = await page.content();
    console.log("HTML length:", content.length);
  } catch (err) {
    console.error('Error navigating:', err);
  }

  await browser.close();
  console.log('Test finished.');
})();
