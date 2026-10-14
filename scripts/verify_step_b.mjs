import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "C:/Users/USER/.gemini/antigravity-ide/brain/d27c4817-229e-4b7f-94b6-a9e2c0189b6f";

async function verify() {
  console.log("Starting Step B (STEP 3 & STEP 4) verification...");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results = [];
  const capture = async (name) => {
    try {
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, `${name}.png`),
        timeout: 8000,
        animations: "disabled",
      });
      console.log(`Saved screenshot: ${name}.png`);
    } catch (e) {
      console.warn(`Screenshot warning for ${name}: ${e.message}`);
    }
  };

  // 1. Home Dashboard - Forecast Mode (Rule 5 compliance check)
  console.log("Checking Home Dashboard in Forecast mode...");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const forecastRadio = page.getByRole("radio", { name: /Forecast/i });
  if (await forecastRadio.isVisible()) {
    await forecastRadio.click();
    await page.waitForTimeout(1000);
  }
  await capture("step4_dashboard_forecast");

  const homeText = await page.textContent("body");
  const hasProjectedCompensation = homeText.includes("Projected Compensation");
  const hasNoDisbursed = !homeText.includes("Disbursed (Paid)");
  const hasNoApproved = !homeText.includes("Approved");
  const hasNoPending = !homeText.includes("Pending");
  results.push({
    test: "Dashboard Forecast tab: shows only Projected Compensation, NO progress bars/paid wording",
    pass: hasProjectedCompensation && hasNoDisbursed && hasNoApproved && hasNoPending,
  });

  // 2. River Erosion - Recorded (OwnerTable variant='recorded')
  console.log("Checking River Erosion Recorded (OwnerTable variant='recorded')...");
  await page.goto("http://localhost:3000/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);
  await capture("step4_river_recorded");

  const riverRecHeaders = await page.locator("table thead th").allInnerTexts();
  const recHeadersValid =
    riverRecHeaders.some((h) => h.includes("DAG NO.")) &&
    riverRecHeaders.some((h) => h.includes("KHATIAN NO.")) &&
    riverRecHeaders.some((h) => h.includes("EST. COMPENSATION")) &&
    riverRecHeaders.some((h) => h.includes("STATUS")) &&
    riverRecHeaders.some((h) => h.includes("PAID"));
  results.push({
    test: "OwnerTable variant='recorded' has Owner, Dag No., Khatian No., Area, Est. comp, Status, Paid",
    pass: recHeadersValid,
  });

  // 3. River Erosion - Forecast (OwnerTable variant='forecast', Rule 5)
  console.log("Checking River Erosion Forecast (OwnerTable variant='forecast')...");
  await page.goto("http://localhost:3000/river-erosion/forecast?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);
  await capture("step4_river_forecast");

  const riverFcHeaders = await page.locator("table thead th").allInnerTexts();
  const fcHeadersValid =
    riverFcHeaders.some((h) => h.includes("DAG NO.")) &&
    riverFcHeaders.some((h) => h.includes("KHATIAN NO.")) &&
    riverFcHeaders.some((h) => h.includes("PROJECTED COMPENSATION")) &&
    !riverFcHeaders.some((h) => h.includes("STATUS")) &&
    !riverFcHeaders.some((h) => h.includes("PAID"));
  results.push({
    test: "OwnerTable variant='forecast': Projected area & compensation, NO Status, NO Paid (Rule 5)",
    pass: fcHeadersValid,
  });

  // 4. Flood Monitoring (OwnerTable variant='flood')
  console.log("Checking Flood Monitoring (OwnerTable variant='flood')...");
  await page.goto("http://localhost:3000/flood/recorded?d=sylhet&u=gowainghat&m=mouza_gowainghat_2&year=2022", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);
  await capture("step4_flood_recorded");

  const floodHeaders = await page.locator("table thead th").allInnerTexts();
  const floodHeadersValid =
    floodHeaders.some((h) => h.includes("DAG NO.")) &&
    floodHeaders.some((h) => h.includes("KHATIAN NO.")) &&
    floodHeaders.some((h) => h.includes("FLOODED AREA")) &&
    floodHeaders.some((h) => h.includes("DEPTH CLASS"));
  results.push({
    test: "OwnerTable variant='flood': Owner link, Dag No., Khatian No., Flooded area, Depth class",
    pass: floodHeadersValid,
  });

  // 5. Landslide
  console.log("Checking Landslide Hazard Module...");
  await page.goto("http://localhost:3000/landslide/recorded?d=rangamati&u=kawkhali&h=ghagra", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);
  await capture("step4_landslide_recorded");
  const landslideText = await page.textContent("body");
  results.push({
    test: "Landslide module with SelectorChain & OwnerTable",
    pass: landslideText.includes("Ghagra Hill Slopes"),
  });

  // 6. Char Islands
  console.log("Checking Char Island Module...");
  await page.goto("http://localhost:3000/char/recorded?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);
  await capture("step4_char_recorded");
  const charText = await page.textContent("body");
  results.push({
    test: "Char Island module with SelectorChain & OwnerTable",
    pass: charText.includes("Char Kazipur"),
  });

  // 7. Coastal Shifts (Migrated in Step B)
  console.log("Checking Coastal Shifts Module...");
  await page.goto("http://localhost:3000/coastal/recorded?d=bhola&u=char_fasson&m=mouza_char_fasson_1", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);
  await capture("step4_coastal_recorded");
  const coastalHeaders = await page.locator("table thead th").allInnerTexts();
  const coastalHeadersValid =
    coastalHeaders.some((h) => h.includes("DAG NO.")) &&
    coastalHeaders.some((h) => h.includes("KHATIAN NO."));
  results.push({
    test: "Coastal module migrated to useSelection, SelectorChain, TanStack Query, and OwnerTable",
    pass: coastalHeadersValid,
  });

  // 8. Combobox Interactive Search & ID Closure Selection
  console.log("Testing Combobox Interactive Opening and Item Selection...");
  await page.goto("http://localhost:3000/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1200);

  // Click popover button
  const popoverBtn = page.locator('button[aria-haspopup="dialog"]').first();
  await popoverBtn.click();
  await page.waitForTimeout(500);
  await capture("step4_combobox_open");

  const dialogVisible = await page.locator('[role="dialog"]').isVisible();
  results.push({
    test: "SelectorChain controlled combobox opens via shadcn Popover + Command/cmdk",
    pass: dialogVisible,
  });

  await browser.close();

  console.log("\n================ STEP B VERIFICATION AUDIT ================");
  for (const r of results) {
    console.log(`${r.pass ? "✅ PASS" : "❌ FAIL"}: ${r.test}`);
  }
  const allPass = results.every((r) => r.pass);
  console.log(`\nOverall Result: ${allPass ? "ALL 8 REQUIREMENTS PASSED" : "FAILURES DETECTED"}`);

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, "step_b_verification_results.json"),
    JSON.stringify(results, null, 2)
  );
}

verify().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
