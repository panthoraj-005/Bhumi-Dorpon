const { chromium } = require('@playwright/test');

async function test() {
  console.log('Launching bundled chromium...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE CONSOLE:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  const urls = [
    'http://localhost:3000/flood/mouza_kazipur_1/flood_mouza_kazipur_1_2025/owner/owner_10',
    'http://localhost:3000/flood/mouza_kazipur_1/flood_mouza_kazipur_1_2025/owner/owner_4',
  ];

  for (const url of urls) {
    console.log('Navigating to', url);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[id^="plot-card-"]', { timeout: 15000 });
    const cards = await page.$$('[id^="plot-card-"]');
    console.log('Cards found at', url, ':', cards.length);
  }

  await browser.close();
  console.log('All passed successfully!');
}

test().catch(console.error);
