import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Launching system Chrome via Playwright...");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  console.log("Navigating to http://localhost:3000/river-erosion/recorded...");
  await page.goto("http://localhost:3000/river-erosion/recorded", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(3500);

  // Take screenshot of default Light GIS side-by-side maps
  await page.screenshot({ path: "screenshot_side_by_side_light_gis.png", fullPage: false });
  console.log("Captured screenshot_side_by_side_light_gis.png");

  // Click Satellite basemap button
  const satelliteBtn = page.getByRole("button", { name: "Satellite" });
  if (await satelliteBtn.isVisible()) {
    console.log("Clicking Satellite button...");
    await satelliteBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshot_side_by_side_satellite.png", fullPage: false });
    console.log("Captured screenshot_side_by_side_satellite.png");
  }

  // Click zoom in button on Before map
  const zoomInBefore = page.getByRole("button", { name: "Zoom in Before map" });
  if (await zoomInBefore.isVisible()) {
    console.log("Clicking Zoom in Before map...");
    await zoomInBefore.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshot_zoomed_sync.png", fullPage: false });
    console.log("Captured screenshot_zoomed_sync.png");
  }

  // Test mobile viewport (width 390)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "screenshot_mobile_stacked.png", fullPage: false });
  console.log("Captured screenshot_mobile_stacked.png");

  await browser.close();
  console.log("Verification finished successfully!");
}

main().catch((err) => {
  console.error("Browser verification error:", err);
  process.exit(1);
});
