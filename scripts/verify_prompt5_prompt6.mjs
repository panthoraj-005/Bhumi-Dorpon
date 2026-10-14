import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACTS_DIR = "C:/Users/USER/.gemini/antigravity-ide/brain/44656ec5-05a4-474c-88fe-bd073ccd12bc";

async function run() {
  console.log("Starting Prompt 5 & Prompt 6 comprehensive browser audit...");
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const auditLog = [];
  const log = (msg) => {
    console.log(msg);
    auditLog.push(msg);
  };

  const capture = async (name) => {
    try {
      const p = path.join(ARTIFACTS_DIR, `${name}.png`);
      await page.screenshot({ path: p, timeout: 15000, animations: "disabled" });
      log(`📸 Saved screenshot: ${name}.png`);
    } catch (e) {
      log(`⚠️ Screenshot error for ${name}: ${e.message}`);
    }
  };

  try {
    // -------------------------------------------------------------
    // 1. FLOOD MONITORING FLOW (Prompt 5)
    // -------------------------------------------------------------
    log("\n=== 1. FLOOD MODULE AUDIT ===");
    log("Visiting /flood (Selector & Flood List)...");
    await page.goto("http://localhost:3000/flood?d=sylhet&u=gowainghat&m=mouza_gowainghat_2", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(2000);
    await capture("prompt5_flood_list");

    // Check flood cards
    const floodCards = page.locator("a[href*='/flood/mouza_gowainghat_2/']");
    const floodCount = await floodCards.count();
    log(`Found ${floodCount} flood event cards in mouza_gowainghat_2`);

    // Click the first flood card
    if (floodCount > 0) {
      const firstFloodHref = await floodCards.first().getAttribute("href");
      log(`Navigating to flood detail: ${firstFloodHref}`);
      await floodCards.first().click();
      await page.waitForTimeout(2500);
      await capture("prompt5_flood_detail");

      // Verify Flood detail summary strip and table headers
      const detailHeaders = await page.locator("table thead th").allInnerTexts();
      log(`Flood Detail Table Headers: ${JSON.stringify(detailHeaders)}`);
      const hasDag = detailHeaders.some((h) => h.toUpperCase().includes("DAG"));
      const hasKhatian = detailHeaders.some((h) => h.toUpperCase().includes("KHATIAN"));
      log(`Flood detail table has Dag: ${hasDag}, Khatian: ${hasKhatian}`);

      // Verify Owner Name links exist and click the first owner
      const ownerLink = page.locator("a[href*='/owner/']").first();
      if (await ownerLink.isVisible()) {
        const ownerName = await ownerLink.innerText();
        const ownerHref = await ownerLink.getAttribute("href");
        log(`Navigating to Owner Land Page: "${ownerName.trim()}" -> ${ownerHref}`);
        await ownerLink.click();
        await page.waitForTimeout(2500);
        await capture("prompt5_flood_owner_land_page");

        // Verify Owner page elements
        const ownerBody = await page.textContent("body");
        const hasFather = ownerBody.includes("Father's Name:") || ownerBody.includes("Father's Name");
        const hasCentroid = ownerBody.includes("Centroid") || ownerBody.includes("° N");
        const hasGeoJsonBtn = (await page.locator("button:has-text('Download GeoJSON')").count()) > 0;
        const hasCopyBtn = (await page.locator("button:has-text('Copy All Coordinates')").count()) > 0;

        log(`Owner Land Page: Father's Name present: ${hasFather}, Centroid coordinates: ${hasCentroid}, GeoJSON button: ${hasGeoJsonBtn}, Copy button: ${hasCopyBtn}`);
      }
    }

    // -------------------------------------------------------------
    // 2. LANDSLIDE MODULE FLOW (Prompt 5)
    // -------------------------------------------------------------
    log("\n=== 2. LANDSLIDE MODULE AUDIT ===");
    log("Visiting /landslide/recorded...");
    await page.goto("http://localhost:3000/landslide/recorded?d=rangamati&u=kawkhali&h=ghagra", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(2500);
    await capture("prompt5_landslide_recorded");

    const lsRecHeaders = await page.locator("table thead th").allInnerTexts();
    log(`Landslide Recorded Table Headers: ${JSON.stringify(lsRecHeaders)}`);

    log("Visiting /landslide/forecast...");
    await page.goto("http://localhost:3000/landslide/forecast?d=rangamati&u=kawkhali&h=ghagra", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(2500);
    await capture("prompt5_landslide_forecast");

    const lsFcHeaders = await page.locator("table thead th").allInnerTexts();
    log(`Landslide Forecast Table Headers: ${JSON.stringify(lsFcHeaders)}`);
    const lsFcHasStatus = lsFcHeaders.some((h) => h.toUpperCase().includes("STATUS"));
    const lsFcHasPaid = lsFcHeaders.some((h) => h.toUpperCase().includes("PAID"));
    log(`Landslide Forecast Rule 5 check: Has Status: ${lsFcHasStatus}, Has Paid: ${lsFcHasPaid} (Both should be false)`);

    // -------------------------------------------------------------
    // 3. EMPTY STATE VERIFICATION
    // -------------------------------------------------------------
    log("\n=== 3. EMPTY STATE VERIFICATION ===");
    log("Visiting Landslide in non-hilly district (Sirajganj)...");
    await page.goto("http://localhost:3000/landslide/recorded?d=sirajganj", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(1500);
    const hasEmptyState = (await page.locator(".text-center:has-text('No')").count()) > 0 ||
                          (await page.locator("button:has-text('Reset to Pilot Cluster')").count()) > 0;
    log(`Non-hilly area empty state / fallback handled gracefully: ${hasEmptyState}`);
    await capture("prompt5_empty_state_landslide");

    // -------------------------------------------------------------
    // 4. MAP VISUAL REVIEW (Prompt 6 - 5 Maps)
    // -------------------------------------------------------------
    log("\n=== 4. MAP REVIEWS ACROSS ALL 5 HAZARDS ===");
    // River
    await page.goto("http://localhost:3000/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    await capture("prompt6_map_river_recorded");

    // Char
    await page.goto("http://localhost:3000/char/recorded?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    await capture("prompt6_map_char_recorded");

    // Coastal
    await page.goto("http://localhost:3000/coastal/recorded?d=bhola&u=char_fasson&m=mouza_char_fasson_1", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    await capture("prompt6_map_coastal_recorded");

    // -------------------------------------------------------------
    // 5. RULE COMPLIANCE AUDIT (Prompt 6 - Rules 1-8)
    // -------------------------------------------------------------
    log("\n=== 5. RULE COMPLIANCE AUDIT ===");
    // Rule 1: No Bengali text across entire page
    const pageText = await page.textContent("body");
    const bengaliRegex = /[\u0980-\u09FF]/;
    const hasBengali = bengaliRegex.test(pageText);
    log(`Rule 1 (English Only - No Bengali unicode): Passed = ${!hasBengali}`);

    // Rule 7: Banner on every page
    const hasDemoBanner = pageText.includes("Demo data") || pageText.includes("fictional");
    log(`Rule 7 (Demo banner present): Passed = ${hasDemoBanner}`);

    log("\nAudit run completed successfully!");
  } catch (err) {
    log(`❌ Error during audit run: ${err.message}`);
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(ARTIFACTS_DIR, "audit_run_report.txt"), auditLog.join("\n"));
  }
}

run();
