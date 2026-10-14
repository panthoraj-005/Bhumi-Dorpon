const { chromium } = require('@playwright/test');
const fs = require('fs');

async function testBatch() {
  const floodData = JSON.parse(fs.readFileSync('./mocks/flood.json', 'utf8'));

  const targets = [];
  for (const ev of floodData.events) {
    const ownerIds = Array.from(new Set((ev.plotStatus || []).map((ps) => ps.ownerId))).filter(Boolean);
    for (const ownerId of ownerIds) {
      targets.push({ floodId: ev.id, mouzaId: ev.mouzaId, ownerId });
    }
  }

  console.log(`Total targets: ${targets.length}`);
  const sample = targets.slice(0, 10);

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();

  const start = Date.now();
  for (let i = 0; i < sample.length; i++) {
    const t = sample[i];
    const url = `http://localhost:3000/flood/${t.mouzaId}/${t.floodId}/owner/${t.ownerId}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[id^="plot-card-"]', { timeout: 10000 });
    const cards = await page.$$('[id^="plot-card-"]');
    console.log(`[${i + 1}/${sample.length}] ${t.ownerId} at ${t.floodId}: ${cards.length} plots`);
  }
  console.log(`10 pages took ${(Date.now() - start) / 1000}s`);

  await browser.close();
}

testBatch().catch(console.error);
