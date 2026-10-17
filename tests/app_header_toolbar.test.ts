import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("AppHeader Toolbar Layout Contract (Change 4 Section B)", () => {
  const headerPath = path.resolve(process.cwd(), "components/AppHeader.tsx");
  const headerCode = fs.readFileSync(headerPath, "utf-8");

  it("has responsive right-alignment for toolbar on md and wider", () => {
    // Toolbar container must be flex flex-wrap with md:justify-end md:flex-1 md:ml-auto
    expect(headerCode).toContain("md:justify-end");
    expect(headerCode).toContain("md:flex-1");
    expect(headerCode).toContain("md:ml-auto");
    expect(headerCode).toContain("justify-start");
  });

  it("allows title block to shrink gracefully without clipping or pinning width", () => {
    // Title container has min-w-0 shrink
    expect(headerCode).toContain("min-w-0 shrink");
  });

  it("applies line-height preventing Bengali glyph clipping in headings", () => {
    // Bangla headings use leading-snug or leading-normal
    expect(headerCode).toContain("leading-snug");
  });

  it("preserves global Bengali / English toggle and currency badge in toolbar", () => {
    expect(headerCode).toContain("বাংলা");
    expect(headerCode).toContain("English");
    expect(headerCode).toContain("৳ (BDT)");
  });
});
