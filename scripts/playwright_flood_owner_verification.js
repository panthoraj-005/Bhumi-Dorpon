const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function run() {
  console.log('Loading flood events and owners...');
  const floodData = JSON.parse(fs.readFileSync('./mocks/flood.json', 'utf8'));

  const floodOwnerPairs = [];
  for (const ev of floodData.events) {
    const ownerIds = Array.from(new Set((ev.plotStatus || []).map((ps) => ps.ownerId))).filter(Boolean);
    for (const ownerId of ownerIds) {
      floodOwnerPairs.push({
        floodId: ev.id,
        mouzaId: ev.mouzaId,
        ownerId,
      });
    }
  }

  console.log(`Total flood owner targets: ${floodOwnerPairs.length} across ${floodData.events.length} flood events.`);

  console.log('Launching headless browser...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
  });
  const page = await context.newPage();

  let checkedCount = 0;
  let totalCoordinatePairsChecked = 0;
  const artifactScreenshotPath = 'C:/Users/USER/.gemini/antigravity-ide/brain/9d8f16b6-c8f7-4611-be36-62e47d935e88/owner_page_four_corners.png';

  for (let i = 0; i < floodOwnerPairs.length; i++) {
    const { floodId, mouzaId, ownerId } = floodOwnerPairs[i];
    const url = `http://localhost:3000/flood/${mouzaId}/${floodId}/owner/${ownerId}`;

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('[id^="plot-card-"]', { timeout: 15000 });

    const plotCards = await page.$$('[id^="plot-card-"]');
    const numPlots = plotCards.length;
    if (numPlots === 0) {
      throw new Error(`Owner ${ownerId} at ${url} has 0 plot cards!`);
    }

    // 1. Assert coordinate pairs shown equals 4 x (number of plots)
    let pageCoordinatePairs = 0;
    for (const card of plotCards) {
      // Find copy 4 corners button on this card
      const copyBtn = await card.$('button:has-text("Copy 4 corners")');
      if (!copyBtn) {
        throw new Error(`Missing "Copy 4 corners" button on card at ${url}`);
      }

      // Find table rows
      const rows = await card.$$('tbody tr');
      if (rows.length !== 4) {
        throw new Error(`Expected exactly 4 corner rows in nested table, found ${rows.length} at ${url}`);
      }

      for (const row of rows) {
        const cells = await row.$$('td');
        if (cells.length !== 3) {
          throw new Error(`Expected 3 columns in corner row, found ${cells.length} at ${url}`);
        }

        const cornerLabel = (await cells[0].innerText()).trim();
        const latText = (await cells[1].innerText()).trim();
        const lonText = (await cells[2].innerText()).trim();

        // Verify latitude and longitude have 6 decimals
        const latMatch = latText.match(/^(\d+\.\d{6})/);
        const lonMatch = lonText.match(/^(\d+\.\d{6})/);

        if (!latMatch) {
          throw new Error(`Latitude "${latText}" does not have 6 decimals at ${url}`);
        }
        if (!lonMatch) {
          throw new Error(`Longitude "${lonText}" does not have 6 decimals at ${url}`);
        }

        pageCoordinatePairs++;
      }
    }

    const expectedPairs = 4 * numPlots;
    if (pageCoordinatePairs !== expectedPairs) {
      throw new Error(`Coordinate pairs mismatch at ${url}: expected ${expectedPairs}, found ${pageCoordinatePairs}`);
    }
    totalCoordinatePairsChecked += pageCoordinatePairs;

    // 2. Assert CSV download has 4 coordinate pairs per row
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }),
      page.click('#download-csv-btn'),
    ]);

    const downloadStream = await download.createReadStream();
    const csvContent = await new Promise((resolve, reject) => {
      let data = '';
      downloadStream.on('data', chunk => data += chunk);
      downloadStream.on('end', () => resolve(data));
      downloadStream.on('error', reject);
    });

    const csvLines = csvContent.trim().split('\n');
    const expectedHeader = 'dag_no,khatian_no,c1_lat,c1_lon,c2_lat,c2_lon,c3_lat,c3_lon,c4_lat,c4_lon';
    if (csvLines[0].trim() !== expectedHeader) {
      throw new Error(`Invalid CSV header: "${csvLines[0].trim()}" vs expected "${expectedHeader}"`);
    }

    const dataRows = csvLines.slice(1);
    if (dataRows.length !== numPlots) {
      throw new Error(`CSV data rows count ${dataRows.length} does not match plots count ${numPlots}`);
    }

    for (const row of dataRows) {
      const cols = row.trim().split(',');
      if (cols.length !== 10) {
        throw new Error(`CSV row does not have 10 columns: "${row}"`);
      }
      // Columns: dag_no (0), khatian_no (1), c1_lat (2), c1_lon (3), c2_lat (4), c2_lon (5), c3_lat (6), c3_lon (7), c4_lat (8), c4_lon (9)
      for (let c = 2; c <= 9; c++) {
        const val = cols[c];
        const decimals = val.split('.')[1];
        if (!decimals || decimals.length !== 6) {
          throw new Error(`CSV coordinate column ${c} ("${val}") does not have 6 decimals in row "${row}"`);
        }
      }
    }

    // Capture screenshot on first tested owner page
    if (i === 0) {
      console.log(`Capturing representative screenshot on ${url}...`);
      await page.screenshot({ path: artifactScreenshotPath, fullPage: true });
      console.log(`Saved screenshot to ${artifactScreenshotPath}`);
    }

    checkedCount++;
    if (checkedCount % 20 === 0 || checkedCount === floodOwnerPairs.length) {
      console.log(`Verified ${checkedCount} / ${floodOwnerPairs.length} owner pages successfully.`);
    }
  }

  await browser.close();
  console.log(`\n========================================`);
  console.log(`PLAYWRIGHT AUDIT COMPLETE!`);
  console.log(`Total Flood Owner Pages Verified: ${checkedCount}`);
  console.log(`Total Coordinate Pairs Verified: ${totalCoordinatePairsChecked}`);
  console.log(`All lat/lon values confirmed with exactly 6 decimals.`);
  console.log(`All "Copy 4 corners" buttons confirmed.`);
  console.log(`All CSV downloads confirmed with 4 coordinate pairs per row.`);
  console.log(`========================================\n`);
}

run().catch((err) => {
  console.error('Playwright verification failed:', err);
  process.exit(1);
});
