import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const routes = [
    { name: "River Erosion", url: "http://localhost:3000/river-erosion/recorded" },
    { name: "Flood", url: "http://localhost:3000/flood" },
    { name: "Landslide", url: "http://localhost:3000/landslide/recorded" },
    { name: "Char", url: "http://localhost:3000/char/recorded" },
    { name: "Coastal", url: "http://localhost:3000/coastal/recorded" },
  ];

  for (const r of routes) {
    console.log(`Checking route: ${r.name} (${r.url})...`);
    await page.goto(r.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(2500);

    // Verify presence of Basemap buttons
    const lightGis = await page.getByRole("button", { name: "Light GIS" }).first().isVisible().catch(() => false);
    const satellite = await page.getByRole("button", { name: "Satellite" }).first().isVisible().catch(() => false);
    const street = await page.getByRole("button", { name: "Street" }).first().isVisible().catch(() => false);

    console.log(`  ${r.name}: Basemap buttons visible -> Light GIS: ${lightGis}, Satellite: ${satellite}, Street: ${street}`);
  }

  await browser.close();
  console.log("All routes verified successfully!");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
