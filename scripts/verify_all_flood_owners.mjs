import fs from "fs";
import path from "path";
import { chromium } from "playwright";

async function main() {
  const floodData = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "mocks/flood.json"), "utf8")
  );
  const plotsData = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "mocks/plots.json"), "utf8")
  );

  console.log(`Starting verification of flood owner pages across ${floodData.events.length} flood events...`);

  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext();
  const page = await context.newPage();

  let verifiedOwnersCount = 0;
  let verifiedCoordsCount = 0;
  let floodCount = 0;

  for (const flood of floodData.events) {
    floodCount++;
    const registeredOwners = Array.from(
      new Set(
        flood.plotStatus
          .map((p) => p.ownerId)
          .filter((id) => id && id !== "owner_khas")
      )
    );

    // Verify all registered owners in this flood event
    for (const ownerId of registeredOwners) {
      const url = `http://localhost:3000/flood/${flood.mouzaId}/${flood.id}/owner/${ownerId}`;
      console.log(`[${verifiedOwnersCount + 1}] Checking ${url}`);
      try {
        await page.goto(url, { waitUntil: "domcontentloaded" });
      } catch (err) {
        console.error(`Failed to navigate to ${url}:`, err);
        throw err;
      }

      await page.waitForSelector("[id^='plot-card-']", { timeout: 10000 });
      const cards = page.locator("[id^='plot-card-']");
      const cardCount = await cards.count();

      // Find expected plots for this owner in this mouza
      const expectedPlots = plotsData.filter(
        (p) => p.mouzaId === flood.mouzaId && p.ownerId === ownerId
      );
      const expectedCount = expectedPlots.length > 0 ? expectedPlots.length : flood.plotStatus.filter((p) => p.ownerId === ownerId).length;

      if (cardCount !== expectedCount) {
        throw new Error(`Mismatch on ${url}: got ${cardCount} cards, expected ${expectedCount}`);
      }

      // Assert number of coordinate pairs shown = 4 x cardCount
      const latCells = page.locator("td:nth-child(2).font-semibold.tabular-nums");
      const coordPairsCount = await latCells.count();
      if (coordPairsCount !== cardCount * 4) {
        throw new Error(`Coordinate pairs mismatch on ${url}: got ${coordPairsCount}, expected ${cardCount * 4}`);
      }

      // Assert "Copy 4 corners" exists per plot
      const copyBtns = page.locator("[id^='copy-corners-btn-']");
      const copyCount = await copyBtns.count();
      if (copyCount !== cardCount) {
        throw new Error(`Copy buttons mismatch on ${url}: got ${copyCount}, expected ${cardCount}`);
      }

      verifiedOwnersCount++;
      verifiedCoordsCount += coordPairsCount;
    }

    if (floodCount % 10 === 0 || floodCount === floodData.events.length) {
      console.log(`Verified ${floodCount}/${floodData.events.length} floods (${verifiedOwnersCount} owner pages, ${verifiedCoordsCount} coordinate pairs checked)`);
    }
  }

  await browser.close();
  console.log(`ALL ${floodData.events.length} floods and ${verifiedOwnersCount} owner pages VERIFIED successfully!`);
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
