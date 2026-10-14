import { chromium } from "playwright";
import path from "path";

async function takeScreenshot() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  const url = "http://localhost:3000/flood/mouza_kazipur_1/flood_mouza_kazipur_1_2025/owner/owner_35";
  console.log("Navigating to", url);
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector("[id^='plot-card-']", { timeout: 10000 });

  const localPath = path.resolve(process.cwd(), "owner_page_four_corners.png");
  await page.screenshot({ path: localPath, fullPage: true });
  console.log("Screenshot saved to", localPath);

  const artifactPath = "C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\299a763c-b2fd-4a48-b21b-e93f7ef531dc\\owner_page_four_corners.png";
  try {
    await page.screenshot({ path: artifactPath, fullPage: true });
    console.log("Screenshot also saved to artifact dir:", artifactPath);
  } catch (e) {
    console.log("Could not save to artifact dir directly:", e);
  }

  await browser.close();
}

takeScreenshot().catch(console.error);
