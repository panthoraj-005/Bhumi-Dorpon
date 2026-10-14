import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test.describe("Flood Owner Land Page Four-Corner Coordinates & Exports (Change 2)", () => {
  const floodData = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "mocks/flood.json"), "utf8")
  );

  test("Owner Land Page renders all 4 corner coordinates per plot with 6 decimals, no centroid, and functional exports", async ({
    page,
  }) => {
    // Test a multi-plot owner in Kazipur flood event
    const mouzaId = "mouza_kazipur_1";
    const floodId = "flood_mouza_kazipur_1_2025";
    const ownerId = "owner_35";

    await page.goto(`/flood/${mouzaId}/${floodId}/owner/${ownerId}`);

    // 1. Header validation
    await expect(page.locator("text=Registered Landowner")).toBeVisible();
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("text=Father's Name:")).toBeVisible();
    await expect(page.locator("text=Back to Flood").first()).toBeVisible();

    // 2. Wait for plot cards to load
    const firstPlotCard = page.locator("[id^='plot-card-']").first();
    await expect(firstPlotCard).toBeVisible();

    // Map corner markers validation: corners 1-4
    const cornerMarkers = page.locator("[id^='corner-marker-']");
    const cornerCount = await cornerMarkers.count();
    expect(cornerCount).toBeGreaterThan(0);

    // 3. Card-level validations
    const plotCards = page.locator("[id^='plot-card-']");
    const numCards = await plotCards.count();
    expect(numCards).toBeGreaterThanOrEqual(1);

    // Assert that the number of coordinate pairs shown in the tables equals 4 x (number of plots)
    const latCells = page.locator("td:nth-child(2).font-semibold.tabular-nums");
    const totalCoordPairs = await latCells.count();
    expect(totalCoordPairs).toBe(numCards * 4);

    // Assert that latitude and longitude all have 6 decimals
    for (let i = 0; i < totalCoordPairs; i++) {
      const latText = await latCells.nth(i).innerText();
      expect(latText).toMatch(/^\d+\.\d{6}$/);
    }

    const lonCells = page.locator("td:nth-child(3).font-medium.tabular-nums");
    expect(await lonCells.count()).toBe(numCards * 4);
    for (let i = 0; i < totalCoordPairs; i++) {
      const lonText = await lonCells.nth(i).innerText();
      expect(lonText).toMatch(/^\d+\.\d{6}$/);
    }

    // 4. Assert "Copy 4 corners" exists per plot
    const copyCornerButtons = page.locator("[id^='copy-corners-btn-']");
    expect(await copyCornerButtons.count()).toBe(numCards);
    await copyCornerButtons.first().click();
    await expect(page.locator("text=Copied!").first()).toBeVisible();

    // 5. Assert "Copy all coordinates" exists and works
    const copyAllBtn = page.locator("#copy-all-coordinates-btn");
    await expect(copyAllBtn).toBeVisible();
    await copyAllBtn.click();
    await expect(page.locator("text=Copied All GPS Coordinates!")).toBeVisible();

    // 6. Assert CSV download has 4 coordinate pairs per row
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator("#download-csv-btn").click(),
    ]);

    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream!) {
      chunks.push(Buffer.from(chunk));
    }
    const csvContent = Buffer.concat(chunks).toString("utf8");
    const lines = csvContent.trim().split("\n");

    // Assert CSV Header
    expect(lines[0]).toBe("dag_no,khatian_no,c1_lat,c1_lon,c2_lat,c2_lon,c3_lat,c3_lon,c4_lat,c4_lon");

    // Assert data rows
    expect(lines.length - 1).toBe(numCards);
    for (let rowIdx = 1; rowIdx < lines.length; rowIdx++) {
      const cols = lines[rowIdx].split(",");
      expect(cols.length).toBe(10);
      // Check that c1_lat, c1_lon ... c4_lat, c4_lon have 6 decimals
      for (let c = 2; c < 10; c++) {
        expect(cols[c]).toMatch(/^\d+\.\d{6}$/);
      }
    }

    // 7. Assert no centroid is displayed anywhere
    const centroidText = page.locator("text=/centroid/i");
    expect(await centroidText.count()).toBe(0);
  });

  test("Flood Detail Page affected-owners table keeps 1 row per owner-plot and links to owner page", async ({
    page,
  }) => {
    const mouzaId = "mouza_kazipur_1";
    const floodId = "flood_mouza_kazipur_1_2025";

    await page.goto(`/flood/${mouzaId}/${floodId}`);

    // Table headers check
    await expect(page.locator("th:has-text('Owner')")).toBeVisible();
    await expect(page.locator("th:has-text('Dag No.')")).toBeVisible();
    await expect(page.locator("th:has-text('Khatian No.')")).toBeVisible();
    await expect(page.locator("th:has-text('Flooded Area')")).toBeVisible();
    await expect(page.locator("th:has-text('Depth Class')")).toBeVisible();

    // Owner link check
    const ownerLink = page.locator("tbody tr td:first-child a").first();
    await expect(ownerLink).toBeVisible();
    const href = await ownerLink.getAttribute("href");
    expect(href).toContain(`/flood/${mouzaId}/${floodId}/owner/`);

    await ownerLink.click();
    await expect(page).toHaveURL(new RegExp(`/flood/${mouzaId}/${floodId}/owner/`));
    await expect(page.locator("text=Four Corner Coordinates").first()).toBeVisible();
  });

  test("Comprehensive multi-flood owner coordinate verification across distinct hazard zones", async ({
    page,
  }) => {
    test.setTimeout(90000);

    // Pick diverse flood events across Sylhet, Kurigram, Sirajganj, Sunamganj
    const sampledEvents = floodData.events.slice(0, 10);

    for (const flood of sampledEvents) {
      // Pick first registered owner
      const firstOwner = flood.plotStatus.find((p: any) => p.ownerId !== "owner_khas");
      if (!firstOwner) continue;

      const url = `/flood/${flood.mouzaId}/${flood.id}/owner/${firstOwner.ownerId}`;
      await page.goto(url);

      const firstCard = page.locator("[id^='plot-card-']").first();
      await expect(firstCard).toBeVisible({ timeout: 10000 });

      const plotCards = page.locator("[id^='plot-card-']");
      const cardCount = await plotCards.count();
      expect(cardCount).toBeGreaterThanOrEqual(1);

      // Total coordinate pairs must equal 4 x cardCount
      const coordCells = page.locator("td:nth-child(2).font-semibold.tabular-nums");
      expect(await coordCells.count()).toBe(cardCount * 4);

      // Verify "Copy 4 corners" exists per plot
      const copyBtns = page.locator("[id^='copy-corners-btn-']");
      expect(await copyBtns.count()).toBe(cardCount);

      // Verify no centroid
      expect(await page.locator("text=/centroid/i").count()).toBe(0);
    }
  });
});
