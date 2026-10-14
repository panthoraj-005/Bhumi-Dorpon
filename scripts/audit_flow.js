const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/USER/.gemini/antigravity-ide/brain/7a087ad0-93f0-4169-bc7f-867423820703';

async function audit() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const auditLog = [];

  const log = (msg) => {
    console.log(msg);
    auditLog.push(msg);
  };

  try {
    // 1. Home Dashboard - Forecast Mode
    log('--- AUDITING HOME DASHBOARD (FORECAST) ---');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Click 'Forecast (DL Model)' toggle
    const forecastToggle = page.locator('button', { hasText: 'Forecast (DL Model)' });
    await forecastToggle.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'home_forecast.png') });
    log('Captured home_forecast.png');

    // Check if Paid / Status wording appears in forecast mode
    const compCardText = await page.locator('.bhumidorpon-card', { hasText: 'Projected Compensation' }).innerText().catch(() => '');
    log(`Home Forecast Compensation Card text excerpt: ${compCardText.replace(/\n+/g, ' ')}`);

    // 2. River Erosion
    log('\n--- AUDITING RIVER EROSION ---');
    await page.goto('http://localhost:3000/river-erosion/recorded', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'river_erosion_recorded.png') });

    // Try selecting different districts in River Erosion
    // Check available buttons/steps in SelectorChain
    const stepButtons = page.locator('.bhumidorpon-card button[type="button"]');
    const stepCount = await stepButtons.count();
    log(`Found ${stepCount} buttons in selector / card`);

    // Check step 1 (District)
    const districtStep = page.locator('.bhumidorpon-card .relative.flex-1').nth(0);
    await districtStep.locator('button').click();
    await page.waitForTimeout(500);

    // List district options
    const districtOptions = await page.locator('div.absolute button').allInnerTexts();
    log(`District options: ${JSON.stringify(districtOptions)}`);

    // Click 'Bhola'
    const bholaOpt = page.locator('div.absolute button', { hasText: 'Bhola' });
    if (await bholaOpt.count() > 0) {
      await bholaOpt.first().click();
      await page.waitForTimeout(1000);
      log('Selected Bhola in River Erosion Recorded.');

      // Check Upazila options now
      const upazilaStep = page.locator('.bhumidorpon-card .relative.flex-1').nth(1);
      await upazilaStep.locator('button').click();
      await page.waitForTimeout(500);
      const upazilaOptions = await page.locator('div.absolute button').allInnerTexts();
      log(`Upazila options for Bhola: ${JSON.stringify(upazilaOptions)}`);

      // Pick an upazila (e.g. Char Fasson)
      const upazilaOpt = page.locator('div.absolute button', { hasText: 'Char Fasson' });
      if (await upazilaOpt.count() > 0) {
        await upazilaOpt.first().click();
        await page.waitForTimeout(1000);
        log('Selected Char Fasson in Bhola.');

        // Check River options
        const riverStep = page.locator('.bhumidorpon-card .relative.flex-1').nth(2);
        await riverStep.locator('button').click();
        await page.waitForTimeout(500);
        const riverOptions = await page.locator('div.absolute button').allInnerTexts();
        log(`River options for Char Fasson: ${JSON.stringify(riverOptions)}`);

        // Check Mouza options
        const mouzaStep = page.locator('.bhumidorpon-card .relative.flex-1').nth(3);
        const mouzaDisabled = await mouzaStep.locator('button').isDisabled();
        log(`Mouza step disabled status: ${mouzaDisabled}`);
      }
    }
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'river_erosion_bhola_result.png') });

    // Switch to River Erosion Forecast
    await page.goto('http://localhost:3000/river-erosion/forecast', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'river_erosion_forecast.png') });

    // Check table headers in forecast mode
    const tableHeaders = await page.locator('table thead th').allInnerTexts();
    log(`River Erosion Forecast Table Headers: ${JSON.stringify(tableHeaders)}`);

    // 3. Flood Monitoring
    log('\n--- AUDITING FLOOD MONITORING ---');
    await page.goto('http://localhost:3000/flood/recorded', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'flood_recorded.png') });

    const floodTableHeaders = await page.locator('table thead th').allInnerTexts();
    log(`Flood Table Headers: ${JSON.stringify(floodTableHeaders)}`);

    // 4. Landslide
    log('\n--- AUDITING LANDSLIDE ---');
    await page.goto('http://localhost:3000/landslide/recorded', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'landslide_recorded.png') });
    const landslideTableHeaders = await page.locator('table thead th').allInnerTexts();
    log(`Landslide Table Headers: ${JSON.stringify(landslideTableHeaders)}`);

    // 5. Char
    log('\n--- AUDITING CHAR ---');
    await page.goto('http://localhost:3000/char/recorded', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'char_recorded.png') });
    const charTableHeaders = await page.locator('table thead th').allInnerTexts();
    log(`Char Table Headers: ${JSON.stringify(charTableHeaders)}`);

    // 6. Coastal
    log('\n--- AUDITING COASTAL ---');
    await page.goto('http://localhost:3000/coastal/recorded', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'coastal_recorded.png') });
    const coastalTableHeaders = await page.locator('table thead th').allInnerTexts();
    log(`Coastal Table Headers: ${JSON.stringify(coastalTableHeaders)}`);

  } catch (err) {
    log(`Error during audit: ${err.message}`);
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'audit_summary.txt'), auditLog.join('\n'));
    log('Audit finished.');
  }
}

audit();
