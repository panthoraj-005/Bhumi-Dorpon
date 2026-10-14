import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACTS_DIR = "C:/Users/USER/.gemini/antigravity-ide/brain/44656ec5-05a4-474c-88fe-bd073ccd12bc";

async function audit() {
  console.log("Starting Full Prompt 6 Audit across desktop (1440px) and mobile (390px)...");

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });

  const auditLog = [];
  const log = (msg) => {
    console.log(msg);
    auditLog.push(msg);
  };

  const capture = async (page, name) => {
    try {
      const p = path.join(ARTIFACTS_DIR, `${name}.png`);
      await page.screenshot({ path: p, timeout: 15000, animations: "disabled" });
      log(`📸 Saved screenshot: ${name}.png`);
    } catch (e) {
      log(`⚠️ Screenshot error for ${name}: ${e.message}`);
    }
  };

  // 1. DESKTOP AUDIT (1440px)
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dPage = await desktopCtx.newPage();

  // 2. MOBILE AUDIT (390px)
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mobileCtx.newPage();

  try {
    // --- HOME DASHBOARD (Recorded & Forecast) ---
    log("\n--- Home Dashboard ---");
    await dPage.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await dPage.waitForTimeout(1000);
    await capture(dPage, "desktop_home_recorded");

    await mPage.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await mPage.waitForTimeout(1000);
    await capture(mPage, "mobile_home_recorded");

    // Home Forecast Mode
    const forecastBtn = dPage.getByRole("radio", { name: /Forecast/i });
    if (await forecastBtn.isVisible()) {
      await forecastBtn.click();
      await dPage.waitForTimeout(1000);
      await capture(dPage, "desktop_home_forecast");
    }

    // --- RIVER EROSION (Recorded & Forecast) ---
    log("\n--- River Erosion ---");
    await dPage.goto("http://localhost:3000/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1", { waitUntil: "domcontentloaded" });
    await dPage.waitForTimeout(1200);
    await capture(dPage, "desktop_river_recorded");

    await dPage.goto("http://localhost:3000/river-erosion/forecast?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1", { waitUntil: "domcontentloaded" });
    await dPage.waitForTimeout(1200);
    await capture(dPage, "desktop_river_forecast");

    // --- FLOOD MONITORING & OWNER DRILL-DOWN ---
    log("\n--- Flood Monitoring & Owner Land Page ---");
    await dPage.goto("http://localhost:3000/flood?d=sylhet&u=gowainghat&m=mouza_gowainghat_2", { waitUntil: "domcontentloaded" });
    await dPage.waitForTimeout(1200);
    await capture(dPage, "desktop_flood_list");

    await dPage.goto("http://localhost:3000/flood/mouza_gowainghat_2/flood_mouza_gowainghat_2_2022", { waitUntil: "domcontentloaded" });
    await dPage.waitForTimeout(1500);
    await capture(dPage, "desktop_flood_detail");

    await dPage.goto("http://localhost:3000/flood/mouza_gowainghat_2/flood_mouza_gowainghat_2_2022/owner/owner_27", { waitUntil: "domcontentloaded" });
    await dPage.waitForTimeout(1500);
    await capture(dPage, "desktop_flood_owner_page");

    await mPage.goto("http://localhost:3000/flood/mouza_gowainghat_2/flood_mouza_gowainghat_2_2022/owner/owner_27", { waitUntil: "domcontentloaded" });
    await mPage.waitForTimeout(1500);
    await capture(mPage, "mobile_flood_owner_page");

    // --- LANDSLIDE (Recorded & Forecast) ---
    log("\n--- Landslide Hazards ---");
    await dPage.goto("http://localhost:3000/landslide/recorded?d=rangamati&u=kawkhali&h=ghagra", { waitUntil: "domcontentloaded" });
    await dPage.waitForTimeout(1200);
    await capture(dPage, "desktop_landslide_recorded");

    await dPage.goto("http://localhost:3000/landslide/forecast?d=rangamati&u=kawkhali&h=ghagra", { waitUntil: "domcontentloaded" });
    await dPage.waitForTimeout(1200);
    await capture(dPage, "desktop_landslide_forecast");

    // --- CHAR ISLANDS ---
    log("\n--- Char Islands ---");
    await dPage.goto("http://localhost:3000/char/recorded?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1", { waitUntil: "domcontentloaded" });
    await dPage.waitForTimeout(1200);
    await capture(dPage, "desktop_char_recorded");

    // --- COASTAL SHORELINE ---
    log("\n--- Coastal Shoreline ---");
    await dPage.goto("http://localhost:3000/coastal/recorded?d=bhola&u=char_fasson&m=mouza_char_fasson_1", { waitUntil: "domcontentloaded" });
    await dPage.waitForTimeout(1200);
    await capture(dPage, "desktop_coastal_recorded");

    await mPage.goto("http://localhost:3000/coastal/recorded?d=bhola&u=char_fasson&m=mouza_char_fasson_1", { waitUntil: "domcontentloaded" });
    await mPage.waitForTimeout(1200);
    await capture(mPage, "mobile_coastal_recorded");

    // --- RULES COMPLIANCE AUDIT ---
    log("\n--- Build Rules 1-8 Compliance Checks ---");
    const checkText = async (url, name) => {
      await dPage.goto(url, { waitUntil: "domcontentloaded" });
      const text = await dPage.textContent("body");
      // Rule 1: No Bengali script letters (excluding ৳ currency symbol U+09F3)
      const nonTakaBengali = /[\u0980-\u09F2\u09F4-\u09FF]/;
      const hasBengali = nonTakaBengali.test(text);

      // Rule 7: Demo banner
      const hasBanner = text.includes("Demo data") || text.includes("fictional");

      log(`[${name}] Rule 1 (English only, no Bengali letters): ${!hasBengali} | Rule 7 (Demo banner): ${hasBanner}`);
    };

    await checkText("http://localhost:3000", "Home");
    await checkText("http://localhost:3000/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1", "River Recorded");
    await checkText("http://localhost:3000/river-erosion/forecast?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1", "River Forecast");
    await checkText("http://localhost:3000/flood", "Flood Explorer");
    await checkText("http://localhost:3000/landslide/recorded?d=rangamati&u=kawkhali&h=ghagra", "Landslide Recorded");
    await checkText("http://localhost:3000/landslide/forecast?d=rangamati&u=kawkhali&h=ghagra", "Landslide Forecast");
    await checkText("http://localhost:3000/char/recorded?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1", "Char");
    await checkText("http://localhost:3000/coastal/recorded?d=bhola&u=char_fasson&m=mouza_char_fasson_1", "Coastal");

    log("\nAll Prompt 6 audit checks completed successfully!");
  } catch (err) {
    log(`❌ Error during audit: ${err.message}`);
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(ARTIFACTS_DIR, "prompt6_audit_summary.txt"), auditLog.join("\n"));
  }
}

audit();
