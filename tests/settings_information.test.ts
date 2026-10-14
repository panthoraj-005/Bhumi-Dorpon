import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Settings Feature: About Project & Team Information", () => {
  const settingsPagePath = path.resolve(__dirname, "../app/settings/page.tsx");
  const aboutPagePath = path.resolve(__dirname, "../app/settings/about/page.tsx");
  const teamPagePath = path.resolve(__dirname, "../app/settings/team/page.tsx");
  const sidebarPath = path.resolve(__dirname, "../components/AppSidebar.tsx");

  it("AppSidebar links to /settings with active styling", () => {
    expect(fs.existsSync(sidebarPath)).toBe(true);
    const content = fs.readFileSync(sidebarPath, "utf-8");
    expect(content).toContain('href="/settings"');
    expect(content).toContain('pathname.startsWith("/settings")');
  });

  it("Settings hub page renders exactly the two requested options and no extras", () => {
    expect(fs.existsSync(settingsPagePath)).toBe(true);
    const content = fs.readFileSync(settingsPagePath, "utf-8");

    // Must link to About Project and Team Information
    expect(content).toContain('href="/settings/about"');
    expect(content).toContain('href="/settings/team"');
    expect(content).toContain("About Project");
    expect(content).toContain("Team Information");

    // Must not have unexpected settings links
    expect(content).not.toContain('href="/settings/general"');
    expect(content).not.toContain('href="/settings/profile"');
    expect(content).not.toContain('href="/settings/account"');
  });

  it("About Project covers all 8 required topics factually without promotional/unsupported claims", () => {
    expect(fs.existsSync(aboutPagePath)).toBe(true);
    const content = fs.readFileSync(aboutPagePath, "utf-8");

    // 1. Project Overview
    expect(content).toContain("Project Overview");
    expect(content).toContain("BhumiDorpon");

    // 2. All 5 Hazard Modules
    expect(content).toContain("River Erosion");
    expect(content).toContain("Flood");
    expect(content).toContain("Landslide");
    expect(content).toContain("Char Formation and Erosion");
    expect(content).toContain("Coastal Erosion and Land Formation");

    // 3. Map Comparison
    expect(content).toContain("Map Comparison");
    expect(content).toContain("Before and After");
    expect(content).toContain("side by side");

    // 4. Map Controls & Basemaps
    expect(content).toContain("Light GIS");
    expect(content).toContain("Satellite");
    expect(content).toContain("Synchronization");

    // 5. Map Layers and Information
    expect(content).toContain("Dag No.");
    expect(content).toContain("Khatian No.");

    // 6. Dashboard and Other Pages
    expect(content).toContain("Home Dashboard");
    expect(content).toContain("Owner");

    // 7. Recorded and Forecast
    expect(content).toContain("Recorded");
    expect(content).toContain("Forecast");

    // 8. Data Transparency
    expect(content).toContain("Data Transparency");
    expect(content).toContain("mock and synthetic demo datasets");
    expect(content).toContain("does not provide live monitoring");

    // Return to Settings navigation
    expect(content).toContain('href="/settings"');
    expect(content).toContain("Back to Settings");
  });

  it("Team Information contains exact team name, leadership, member, and copyright without deviations", () => {
    expect(fs.existsSync(teamPagePath)).toBe(true);
    const content = fs.readFileSync(teamPagePath, "utf-8");

    // Check exact strings
    expect(content).toContain("Team Name: GeoNeural");
    expect(content).toContain("Team Leader: Pantho Raj Biswas");
    expect(content).toContain("Team Member: Puja Paul");
    expect(content).toContain("© 2026 GeoNeural. All rights reserved.");

    // Return to Settings navigation
    expect(content).toContain('href="/settings"');
    expect(content).toContain("Back to Settings");
  });
});
