import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACTS_DIR = "C:/Users/USER/.gemini/antigravity-ide/brain/98b63164-b876-4892-8d51-ac299f1b70b3";

const PART2_PAGES = [
  {
    hazard: "river_erosion",
    mode: "recorded",
    name: "River Erosion Recorded",
    url: "http://localhost:3000/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1",
    shotName: "river_erosion_recorded",
  },
  {
    hazard: "river_erosion",
    mode: "forecast",
    name: "River Erosion Forecast",
    url: "http://localhost:3000/river-erosion/forecast?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1",
    shotName: "river_erosion_forecast",
  },
  {
    hazard: "char",
    mode: "recorded",
    name: "Char Recorded",
    url: "http://localhost:3000/char/recorded?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1",
    shotName: "char_recorded",
  },
  {
    hazard: "char",
    mode: "forecast",
    name: "Char Forecast",
    url: "http://localhost:3000/char/forecast?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1",
    shotName: "char_forecast",
  },
  {
    hazard: "coastal",
    mode: "recorded",
    name: "Coastal Recorded",
    url: "http://localhost:3000/coastal/recorded?d=bhola&u=char_fasson&m=mouza_char_fasson_1",
    shotName: "coastal_recorded",
  },
  {
    hazard: "coastal",
    mode: "forecast",
    name: "Coastal Forecast",
    url: "http://localhost:3000/coastal/forecast?d=bhola&u=char_fasson&m=mouza_char_fasson_1",
    shotName: "coastal_forecast",
  },
];

async function runVerification() {
  console.log("=== Launching Chrome for Part 2 Verification ===");
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
  });

  const results = [];

  for (const p of PART2_PAGES) {
    console.log(`\nTesting ${p.name}...`);
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (!text.includes("favicon") && !text.includes("404")) {
          errors.push(text);
        }
      }
    });

    try {
      await page.goto(p.url, { timeout: 30000 });
      await page.waitForTimeout(2000);

      // 1. Dual Leaflet containers
      const containers = page.locator(".leaflet-container");
      await containers.first().waitFor({ state: "visible", timeout: 15000 });
      const containerCount = await containers.count();

      // 2. Mouza labels
      const labels = page.locator(".gis-mouza-label-marker");
      const labelCount = await labels.count();

      // 3. Mouza summary panel rows
      const summaryRows = page.locator("[data-mouza-id]");
      const rowCount = await summaryRows.count();
      const firstRowText = rowCount > 0 ? await summaryRows.first().textContent() : "";
      const isPinned = firstRowText.includes("PINNED");

      // 4. Water status card
      const waterCard = page.locator("text=Water Status");
      const waterCardVisible = (await waterCard.count()) > 0;

      // 5. Swipe slider
      const slider = page.locator('[role="slider"][aria-label="Swipe comparison slider"]');
      const sliderVisible = (await slider.count()) > 0;

      // Capture desktop screenshot
      const desktopShot = path.join(ARTIFACTS_DIR, `${p.shotName}_1440.png`);
      await page.screenshot({ path: desktopShot, fullPage: false });

      // Test mobile viewport (390px)
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(1000);
      const mobileShot = path.join(ARTIFACTS_DIR, `${p.shotName}_390.png`);
      await page.screenshot({ path: mobileShot, fullPage: false });

      const check = {
        name: p.name,
        containers: containerCount,
        labels: labelCount,
        summaryRows: rowCount,
        isPinned,
        waterCardVisible,
        sliderVisible,
        errors: errors.length,
        status:
          containerCount === 2 &&
          labelCount >= 1 &&
          rowCount >= 2 &&
          isPinned &&
          waterCardVisible &&
          sliderVisible &&
          errors.length === 0
            ? "PASS"
            : "FAIL",
      };

      console.log(`Result for ${p.name}:`, check);
      results.push(check);
    } catch (err) {
      console.error(`Error on ${p.name}:`, err.message);
      results.push({ name: p.name, status: "FAIL", error: err.message });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log("\n=== SUMMARY RESULTS ===");
  console.table(results);
  const allPassed = results.every((r) => r.status === "PASS");
  if (!allPassed) {
    console.error("Some tests failed!");
    process.exit(1);
  } else {
    console.log("ALL PART 2 VERIFICATION CHECKS PASSED!");
  }
}

runVerification().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
