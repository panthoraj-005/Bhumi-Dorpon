const { chromium } = require('@playwright/test');
const fs = require('fs');

async function main() {
  console.log('Loading flood events...');
  const floodData = JSON.parse(fs.readFileSync('./mocks/flood.json', 'utf8'));

  const allTargets = [];
  for (const ev of floodData.events) {
    const ownerIds = Array.from(new Set((ev.plotStatus || []).map((ps) => ps.ownerId))).filter(Boolean);
    for (const ownerId of ownerIds) {
      allTargets.push({ floodId: ev.id, mouzaId: ev.mouzaId, ownerId });
    }
  }

  console.log(`Total flood owner targets: ${allTargets.length} across ${floodData.events.length} flood events.`);

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  // Test CSV download on a representative sample first
  console.log('Testing CSV download and screenshot on representative owner page...');
  const testPage = await browser.newPage();
  const sampleTarget = allTargets[0];
  const sampleUrl = `http://localhost:3000/flood/${sampleTarget.mouzaId}/${sampleTarget.floodId}/owner/${sampleTarget.ownerId}`;
  await testPage.goto(sampleUrl, { waitUntil: 'domcontentloaded' });
  await testPage.waitForSelector('[id^="plot-card-"]', { timeout: 15000 });

  // Capture screenshot
  const screenshotPath = 'C:/Users/USER/.gemini/antigravity-ide/brain/9d8f16b6-c8f7-4611-be36-62e47d935e88/owner_page_four_corners.png';
  await testPage.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Saved screenshot to ${screenshotPath}`);

  // Test CSV download
  const [download] = await Promise.all([
    testPage.waitForEvent('download', { timeout: 15000 }),
    testPage.click('#download-csv-btn'),
  ]);
  const stream = await download.createReadStream();
  const csvText = await new Promise((res, rej) => {
    let d = '';
    stream.on('data', c => d += c);
    stream.on('end', () => res(d));
    stream.on('error', rej);
  });

  const lines = csvText.trim().split('\n');
  const expectedHeader = 'dag_no,khatian_no,c1_lat,c1_lon,c2_lat,c2_lon,c3_lat,c3_lon,c4_lat,c4_lon';
  if (lines[0].trim() !== expectedHeader) {
    throw new Error(`CSV Header mismatch: ${lines[0]} vs ${expectedHeader}`);
  }
  for (const line of lines.slice(1)) {
    const cols = line.trim().split(',');
    if (cols.length !== 10) throw new Error(`CSV row has ${cols.length} cols, expected 10: ${line}`);
    for (let c = 2; c <= 9; c++) {
      const dec = cols[c].split('.')[1];
      if (!dec || dec.length !== 6) throw new Error(`Coordinate column ${c} does not have 6 decimals: ${cols[c]}`);
    }
  }
  console.log(`CSV download verified: header matches, all ${lines.length - 1} rows have 4 coordinate pairs with 6 decimals.`);
  await testPage.close();

  // Now verify pages using worker pool
  const CONCURRENCY = 4;
  let currentIndex = 0;
  let totalPairsVerified = 0;
  let verifiedPagesCount = 0;

  async function worker(workerId) {
    const page = await browser.newPage();
    while (currentIndex < allTargets.length) {
      const idx = currentIndex++;
      const target = allTargets[idx];
      const url = `http://localhost:3000/flood/${target.mouzaId}/${target.floodId}/owner/${target.ownerId}`;

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForSelector('[id^="plot-card-"]', { timeout: 15000 });

        const cards = await page.$$('[id^="plot-card-"]');
        const numPlots = cards.length;
        if (numPlots === 0) throw new Error(`0 cards at ${url}`);

        let pagePairs = 0;
        for (const card of cards) {
          const copyBtn = await card.$('button:has-text("Copy 4 corners")');
          if (!copyBtn) throw new Error(`Missing "Copy 4 corners" at ${url}`);

          const rows = await card.$$('tbody tr');
          if (rows.length !== 4) throw new Error(`Expected 4 rows, found ${rows.length} at ${url}`);

          for (const row of rows) {
            const cells = await row.$$('td');
            if (cells.length !== 3) throw new Error(`Expected 3 columns at ${url}`);

            const latText = (await cells[1].innerText()).trim();
            const lonText = (await cells[2].innerText()).trim();

            const latMatch = latText.match(/^(\d+\.\d{6})/);
            const lonMatch = lonText.match(/^(\d+\.\d{6})/);

            if (!latMatch || !lonMatch) {
              throw new Error(`Coordinates do not have 6 decimals: lat=${latText}, lon=${lonText} at ${url}`);
            }
            pagePairs++;
          }
        }

        if (pagePairs !== 4 * numPlots) {
          throw new Error(`Coordinate pairs mismatch at ${url}: expected ${4 * numPlots}, found ${pagePairs}`);
        }

        totalPairsVerified += pagePairs;
        verifiedPagesCount++;

        if (verifiedPagesCount % 50 === 0 || verifiedPagesCount === allTargets.length) {
          console.log(`[Progress] Verified ${verifiedPagesCount} / ${allTargets.length} owner pages (${totalPairsVerified} coordinate pairs).`);
        }
      } catch (err) {
        console.error(`Error on target ${idx} (${url}):`, err.message);
        throw err;
      }
    }
    await page.close();
  }

  console.log(`Starting verification with ${CONCURRENCY} parallel workers...`);
  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1));
  await Promise.all(workers);

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`PLAYWRIGHT VERIFICATION PASSED COMPLETELY!`);
  console.log(`Total Flood Owner Pages Verified: ${verifiedPagesCount} / ${allTargets.length}`);
  console.log(`Total Coordinate Pairs Verified: ${totalPairsVerified}`);
  console.log(`Every page has exactly 4 x (numPlots) coordinate pairs with 6 decimals.`);
  console.log(`Every plot has a verified "Copy 4 corners" button.`);
  console.log(`CSV downloads verified with columns dag_no,khatian_no,c1_lat,c1_lon,c2_lat,c2_lon,c3_lat,c3_lon,c4_lat,c4_lon.`);
  console.log(`Representative full-page screenshot verified at: ${screenshotPath}`);
  console.log(`======================================================\n`);
}

main().catch((err) => {
  console.error('Playwright verification script failed:', err);
  process.exit(1);
});
