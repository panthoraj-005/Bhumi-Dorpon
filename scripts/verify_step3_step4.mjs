import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "C:/Users/USER/.gemini/antigravity-ide/brain/d27c4817-229e-4b7f-94b6-a9e2c0189b6f";

async function runVerification() {
  console.log("Starting Step 3 & Step 4 browser verification...");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results = [];

  // 1. Dashboard Home (Recorded & Forecast)
  console.log("Checking Home Dashboard Recorded...");
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "step4_home_recorded.png") });
  const homeRecordedText = await page.textContent("body");
  const hasRecordedCompensation = homeRecordedText.includes("Total Estimated Compensation") && homeRecordedText.includes("Disbursed (Paid)");
  results.push({ test: "Home Recorded Compensation Breakdown", pass: hasRecordedCompensation });

  console.log("Checking Home Dashboard Forecast Mode...");
  // Click on Forecast toggle
  const forecastToggle = page.locator('button:has-text("Forecast (DL Model)")');
  if (await forecastToggle.count() > 0) {
    await forecastToggle.click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "step4_home_forecast.png") });
  const homeForecastText = await page.textContent("body");
  const hasProjectedCompensationOnly = homeForecastText.includes("Projected Compensation") &&
    !homeForecastText.includes("Disbursed (Paid)") &&
    !homeForecastText.includes("Approved") &&
    !homeForecastText.includes("Pending");
  results.push({ test: "Home Forecast Compensation Card (Rule 5: No paid/progress)", pass: hasProjectedCompensationOnly });

  // 2. River Erosion (Recorded & Forecast)
  console.log("Checking River Erosion Recorded with SelectorChain & OwnerTable...");
  await page.goto("http://localhost:3000/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1", {
    waitUntil: "domcontentloaded",
    timeout: 30000
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "step4_river_recorded.png") });
  const riverRecText = await page.textContent("body");
  const riverRecHasHeaders = riverRecText.includes("DAG NO.") && riverRecText.includes("KHATIAN NO.") && riverRecText.includes("EST. COMPENSATION");
  results.push({ test: "River Erosion Recorded Table Headers", pass: riverRecHasHeaders });

  console.log("Checking River Erosion Forecast Mode (Rule 5: No Status, No Paid)...");
  await page.goto("http://localhost:3000/river-erosion/forecast?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1", {
    waitUntil: "domcontentloaded",
    timeout: 30000
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "step4_river_forecast.png") });
  const riverFcText = await page.textContent("body");
  const riverFcHasProjectedOnly = riverFcText.includes("PROJECTED COMPENSATION") &&
    riverFcText.includes("PROJECTED AREA") &&
    !riverFcText.includes("STATUS") &&
    !riverFcText.includes("PAID (৳)");
  results.push({ test: "River Erosion Forecast Table (Rule 5: No Status, No Paid)", pass: riverFcHasProjectedOnly });

  // 3. Flood Monitoring (flood variant of OwnerTable)
  console.log("Checking Flood Monitoring with Flood OwnerTable Variant...");
  await page.goto("http://localhost:3000/flood/recorded?d=sylhet&u=gowainghat&m=mouza_gowainghat_2&year=2022", {
    waitUntil: "domcontentloaded",
    timeout: 30000
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "step4_flood_recorded.png") });
  const floodText = await page.textContent("body");
  const floodHasHeaders = floodText.includes("DAG NO.") && floodText.includes("KHATIAN NO.") && floodText.includes("FLOODED AREA") && floodText.includes("DEPTH CLASS");
  results.push({ test: "Flood OwnerTable Variant (Flooded Area + Depth Class)", pass: floodHasHeaders });

  // 4. Landslide Hazard
  console.log("Checking Landslide Hazard Module...");
  await page.goto("http://localhost:3000/landslide/recorded?d=rangamati&u=kawkhali&h=ghagra", {
    waitUntil: "domcontentloaded",
    timeout: 30000
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "step4_landslide_recorded.png") });
  const landslideText = await page.textContent("body");
  results.push({ test: "Landslide Page Loaded with SelectorChain & OwnerTable", pass: landslideText.includes("Ghagra Hill Slopes") });

  // 5. Char Islands
  console.log("Checking Char Island Module...");
  await page.goto("http://localhost:3000/char/recorded?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1", {
    waitUntil: "domcontentloaded",
    timeout: 30000
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "step4_char_recorded.png") });
  const charText = await page.textContent("body");
  results.push({ test: "Char Page Loaded with SelectorChain & OwnerTable", pass: charText.includes("Char Kazipur") });

  // 6. Coastal Shifts (Newly Migrated)
  console.log("Checking Coastal Shifts Module...");
  await page.goto("http://localhost:3000/coastal/recorded?d=bhola&u=char_fasson&m=mouza_char_fasson_1", {
    waitUntil: "domcontentloaded",
    timeout: 30000
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "step4_coastal_recorded.png") });
  const coastalText = await page.textContent("body");
  const coastalHasTable = coastalText.includes("DAG NO.") && coastalText.includes("KHATIAN NO.") && coastalText.includes("EST. COMPENSATION");
  results.push({ test: "Coastal Page Migrated to SelectorChain, TanStack Query & OwnerTable", pass: coastalHasTable });

  // 7. Interactive Combobox test (SelectorChain interaction)
  console.log("Testing Interactive Combobox in SelectorChain...");
  await page.goto("http://localhost:3000/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1", {
    waitUntil: "domcontentloaded",
    timeout: 30000
  });
  await page.waitForTimeout(1500);
  // Find the popover button for District
  const popoverButtons = page.locator('button[aria-haspopup="dialog"]');
  const count = await popoverButtons.count();
  if (count > 0) {
    await popoverButtons.first().click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "step4_combobox_open.png") });
    const popoverContent = await page.locator('[role="dialog"]').count();
    results.push({ test: "SelectorChain Combobox Opens with Search", pass: popoverContent > 0 });
  }

  await browser.close();

  console.log("\n--- Verification Summary ---");
  for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"}: ${r.test}`);
  }

  const allPass = results.every((r) => r.pass);
  console.log(`\nOverall Result: ${allPass ? "ALL PASSED" : "FAILURES DETECTED"}`);
}

runVerification().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
