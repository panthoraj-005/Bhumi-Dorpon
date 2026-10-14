const { chromium } = require('@playwright/test');

async function main() {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  console.log('Browser launched!');
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));
  page.on('response', res => {
    if (res.status() >= 400) console.log('FAILED URL:', res.status(), res.url());
  });
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(4000);
  console.log('Page loaded!');
  await page.screenshot({ path: 'C:/Users/USER/.gemini/antigravity-ide/brain/7a087ad0-93f0-4169-bc7f-867423820703/initial_home.png', fullPage: true });
  console.log('Screenshot saved!');
  await browser.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
