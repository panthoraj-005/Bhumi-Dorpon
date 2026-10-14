const { chromium } = require('@playwright/test');

async function debug() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));
  page.on('requestfailed', req => console.log('REQ FAILED:', req.url(), req.failure()?.errorText));
  page.on('response', res => {
    if (res.status() >= 400) console.log('BAD RESPONSE:', res.status(), res.url());
  });

  const url = 'http://localhost:3000/flood/mouza_kazipur_1/flood_mouza_kazipur_1_2025/owner/owner_4';
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const cardsCount = (await page.$$('[id^="plot-card-"]')).length;
  console.log('Cards count:', cardsCount);

  await page.screenshot({ path: './debug_owner_4.png', fullPage: true });
  console.log('Screenshot saved!');
  await browser.close();
}

debug().catch(console.error);
