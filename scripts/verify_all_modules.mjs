import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACTS_DIR = "C:/Users/USER/.gemini/antigravity-ide/brain/d27c4817-229e-4b7f-94b6-a9e2c0189b6f";

async function run() {
  console.log("Starting full verification audit with Playwright...");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const auditResults = [];
  const log = (msg) => {
    console.log(msg);
    auditResults.push(msg);
  };

  try {
    // 1. Home Dashboard - Recorded
    log("1. Visiting Home Dashboard (Recorded)...");
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);

    const bannerText = await page.locator('[role="banner"]').innerText().catch(() => "");
    log(`Top Banner text: "${bannerText.trim()}"`);

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "step3_home_recorded.png"),
      fullPage: false,
    });
    log("Captured step3_home_recorded.png");

    // 2. Home Dashboard - Forecast Mode
    log("2. Switching to Forecast Mode on Home...");
    const forecastRadio = page.getByRole("radio", { name: /Forecast/i });
    if (await forecastRadio.isVisible()) {
      await forecastRadio.click();
      await page.waitForTimeout(2500);

      // Verify no Disbursed / Approved / Pending progress bars in Forecast mode
      const compCard = page.locator(".bhumidorpon-card", { hasText: "Projected Compensation" });
      const compText = await compCard.innerText().catch(() => "");
      const hasDisbursed = compText.includes("Disbursed");
      const hasPaid = compText.includes("Paid (৳)");
      const hasApproved = compText.includes("Approved");
      log(`Home Forecast Card check - Has 'Disbursed': ${hasDisbursed}, Has 'Approved': ${hasApproved}, Has 'Paid (৳)': ${hasPaid}`);

      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, "step3_home_forecast.png"),
        fullPage: false,
      });
      log("Captured step3_home_forecast.png");
    }

    // 3. River Erosion - Recorded Mode
    log("3. Visiting River Erosion Recorded...");
    await page.goto("http://localhost:3000/river-erosion/recorded", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    // Verify RiverErosionMap exists
    const hasRiverMap = (await page.locator("svg[aria-label='River Erosion Cadastral Map']").count()) > 0;
    log(`River Erosion Map present: ${hasRiverMap}`);

    // Verify table headers have Dag No. and Khatian No.
    const riverHeaders = await page.locator("table thead th").allInnerTexts();
    log(`River Erosion Table Headers: ${JSON.stringify(riverHeaders)}`);

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "step3_river_recorded.png"),
      fullPage: false,
    });
    log("Captured step3_river_recorded.png");

    // 4. River Erosion - Forecast Mode
    log("4. Visiting River Erosion Forecast...");
    await page.goto("http://localhost:3000/river-erosion/forecast", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    const riverForecastHeaders = await page.locator("table thead th").allInnerTexts();
    log(`River Erosion Forecast Table Headers: ${JSON.stringify(riverForecastHeaders)}`);
    const forecastHasStatus = riverForecastHeaders.some((h) => h.toUpperCase().includes("STATUS"));
    const forecastHasPaid = riverForecastHeaders.some((h) => h.toUpperCase().includes("PAID"));
    log(`River Erosion Forecast check - Has 'Status' col: ${forecastHasStatus}, Has 'Paid' col: ${forecastHasPaid}`);

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "step3_river_forecast.png"),
      fullPage: false,
    });
    log("Captured step3_river_forecast.png");

    // 5. Flood Monitoring
    log("5. Visiting Flood Monitoring...");
    await page.goto("http://localhost:3000/flood/recorded", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    const hasFloodMap = (await page.locator("svg[aria-label='Flood Inundation Cadastral Map']").count()) > 0;
    log(`Flood Inundation Map present: ${hasFloodMap}`);

    const floodHeaders = await page.locator("table thead th").allInnerTexts();
    log(`Flood Table Headers: ${JSON.stringify(floodHeaders)}`);

    // Test Owner Search in Flood
    const searchInput = page.locator("input[placeholder*='Type owner name']");
    if (await searchInput.isVisible()) {
      await searchInput.fill("Rahima");
      await page.waitForTimeout(800);
      const suggestions = await page.locator("div.absolute button").allInnerTexts();
      log(`Flood Owner Search suggestions for 'Rahima': ${JSON.stringify(suggestions.slice(0, 3))}`);
    }

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "step3_flood_recorded.png"),
      fullPage: false,
    });
    log("Captured step3_flood_recorded.png");

    // 6. Landslide Hazards
    log("6. Visiting Landslide Hazards...");
    await page.goto("http://localhost:3000/landslide/recorded", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    const hasLandslideMap = (await page.locator("svg[aria-label='Landslide Topographic Hazard Map']").count()) > 0;
    log(`Landslide Hazard Map present: ${hasLandslideMap}`);

    const landslideHeaders = await page.locator("table thead th").allInnerTexts();
    log(`Landslide Table Headers: ${JSON.stringify(landslideHeaders)}`);

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "step3_landslide_recorded.png"),
      fullPage: false,
    });
    log("Captured step3_landslide_recorded.png");

    // 7. Char Islands
    log("7. Visiting Char Islands...");
    await page.goto("http://localhost:3000/char/recorded", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    const hasCharMap = (await page.locator("svg[aria-label='Char Island Dynamics Map']").count()) > 0;
    log(`Char Island Dynamics Map present: ${hasCharMap}`);

    const charHeaders = await page.locator("table thead th").allInnerTexts();
    log(`Char Table Headers: ${JSON.stringify(charHeaders)}`);

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "step3_char_recorded.png"),
      fullPage: false,
    });
    log("Captured step3_char_recorded.png");

    // 8. Coastal Shoreline
    log("8. Visiting Coastal Shoreline...");
    await page.goto("http://localhost:3000/coastal/recorded", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    const hasCoastalMap = (await page.locator("svg[aria-label='Coastal Shoreline Dynamics Map']").count()) > 0;
    log(`Coastal Shoreline Map present: ${hasCoastalMap}`);

    const coastalHeaders = await page.locator("table thead th").allInnerTexts();
    log(`Coastal Table Headers: ${JSON.stringify(coastalHeaders)}`);

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "step3_coastal_recorded.png"),
      fullPage: false,
    });
    log("Captured step3_coastal_recorded.png");

    log("\nAll 8 module verification checkpoints completed successfully!");
  } catch (err) {
    log(`Verification error: ${err.message}`);
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(ARTIFACTS_DIR, "verification_summary.txt"), auditResults.join("\n"));
  }
}

run();
