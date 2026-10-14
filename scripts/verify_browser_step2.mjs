import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Launching Chrome...");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox", "--js-flags=--max-old-space-size=512"],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const screenshotsDir = "C:/Users/USER/.gemini/antigravity-ide/brain/c6575727-233a-481d-bc73-2a5155642c2b";

  // 1. Home Dashboard Recorded
  console.log("1. Visiting Home Dashboard (Recorded)...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, "step2_home_recorded.png"), fullPage: true });

  // Switch to Forecast on Home Dashboard
  console.log("Switching to Forecast on Home...");
  const forecastToggle = page.getByRole("radio", { name: "Forecast" });
  if (await forecastToggle.isVisible()) {
    await forecastToggle.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, "step2_home_forecast.png"), fullPage: true });
  }

  // 2. River Erosion Recorded
  console.log("2. Visiting River Erosion (Recorded)...");
  await page.goto("http://localhost:3000/river-erosion", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotsDir, "step2_river_recorded.png"), fullPage: true });

  // 3. River Erosion Forecast
  console.log("3. Visiting River Erosion (Forecast)...");
  const riverForecastToggle = page.getByRole("radio", { name: "Forecast" });
  if (await riverForecastToggle.isVisible()) {
    await riverForecastToggle.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotsDir, "step2_river_forecast.png"), fullPage: true });
  }

  // 4. Flood page
  console.log("4. Visiting Flood...");
  await page.goto("http://localhost:3000/flood", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotsDir, "step2_flood.png"), fullPage: true });

  // 5. Landslide page
  console.log("5. Visiting Landslide...");
  await page.goto("http://localhost:3000/landslide", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotsDir, "step2_landslide.png"), fullPage: true });

  // 6. Coastal page
  console.log("6. Visiting Coastal...");
  await page.goto("http://localhost:3000/coastal", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotsDir, "step2_coastal.png"), fullPage: true });

  await browser.close();
  console.log("Screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
