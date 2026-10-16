import { describe, it, expect } from "vitest";
import {
  buildParcelKml,
  parcelRingToKmlCoordinates,
  getParcelCenter,
  getCameraRangeMeters,
  buildEarthCameraUrl,
  buildKmlFileName,
  escapeXml,
  EarthCorner,
  EarthParcel,
  EarthOwnerMeta,
} from "@/lib/googleEarth";
import { listFloods, getOwnerPlots } from "@/lib/data";

describe("Google Earth KML Outline and Helpers (Topic A)", () => {
  const sampleCorners: EarthCorner[] = [
    { label: "NW", lat: 24.556, lon: 89.625 },
    { label: "NE", lat: 24.556, lon: 89.627 },
    { label: "SE", lat: 24.554, lon: 89.627 },
    { label: "SW", lat: 24.554, lon: 89.625 },
  ];

  const sampleParcel: EarthParcel = {
    plotId: "plot-101",
    dagNo: "1042",
    khatianNo: "550",
    landClass: "agri",
    areaDecimal: 45.5,
    floodStatus: "Partial (moderate)",
    corners: sampleCorners,
  };

  const sampleMeta: EarthOwnerMeta = {
    ownerName: "Abdul Karim",
    mouzaName: "Karatia",
    floodId: "flood-2024-tangail",
  };

  it("1. formats coordinate ring in lon,lat,0 order with a closed 5-point ring", () => {
    const coordsStr = parcelRingToKmlCoordinates(sampleCorners);
    const points = coordsStr.trim().split(/\s+/);
    expect(points.length).toBe(5);

    // Each point formatted as lon,lat,0
    points.forEach((pt) => {
      const parts = pt.split(",");
      expect(parts.length).toBe(3);
      expect(parts[2]).toBe("0");
      const lon = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);
      expect(lon).toBeGreaterThanOrEqual(89);
      expect(lon).toBeLessThanOrEqual(90);
      expect(lat).toBeGreaterThanOrEqual(24);
      expect(lat).toBeLessThanOrEqual(25);
    });

    // 5th point repeats the 1st
    expect(points[4]).toBe(points[0]);
    expect(points[0]).toBe("89.625,24.556,0");
    expect(points[1]).toBe("89.627,24.556,0");
    expect(points[2]).toBe("89.627,24.554,0");
    expect(points[3]).toBe("89.625,24.554,0");
  });

  it("2. creates KML 2.2 with one Polygon, four corner Points, owner details, and disclaimer", () => {
    const kml = buildParcelKml(sampleParcel, sampleMeta);

    // XML & KML namespace
    expect(kml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(kml).toContain('<kml xmlns="http://www.opengis.net/kml/2.2">');

    // Style with orange outline and translucent fill
    expect(kml).toContain('<Style id="parcelOutline">');
    expect(kml).toContain("<color>ff0088ff</color>");
    expect(kml).toContain("<color>440088ff</color>");

    // Exactly one Polygon
    const polygonMatches = kml.match(/<Polygon>/g);
    expect(polygonMatches).toHaveLength(1);
    expect(kml).toContain("<tessellate>1</tessellate>");
    expect(kml).toContain("<altitudeMode>clampToGround</altitudeMode>");

    // Exactly four corner Point Placemarks
    const pointMatches = kml.match(/<Point>/g);
    expect(pointMatches).toHaveLength(4);
    expect(kml).toContain("<name>1 (NW)</name>");
    expect(kml).toContain("<name>2 (NE)</name>");
    expect(kml).toContain("<name>3 (SE)</name>");
    expect(kml).toContain("<name>4 (SW)</name>");

    // Owner text and disclaimer
    expect(kml).toContain("Owner: Abdul Karim");
    expect(kml).toContain("Mouza: Karatia");
    expect(kml).toContain("Dag No.: 1042");
    expect(kml).toContain("Khatian No.: 550");
    expect(kml).toContain("Land Class: agri");
    expect(kml).toContain("Area: 45.5 decimal");
    expect(kml).toContain("Flood Status: Partial (moderate)");
    expect(kml).toContain(
      "BhumiDorpon demo (mock / synthetic data, not a legal survey)"
    );
  });

  it("3. escapes XML characters in all text fields", () => {
    expect(escapeXml("A & B <C> 'D' \"E\"")).toBe(
      "A &amp; B &lt;C&gt; &apos;D&apos; &quot;E&quot;"
    );

    const specialParcel: EarthParcel = {
      dagNo: "123 & 456",
      khatianNo: "789 <alpha>",
      landClass: 'commercial & "mixed"',
      corners: sampleCorners,
    };
    const specialMeta: EarthOwnerMeta = {
      ownerName: "Rahman & Sons <Pvt.>",
      mouzaName: "Char 'North'",
    };

    const kml = buildParcelKml(specialParcel, specialMeta);
    expect(kml).toContain("Rahman &amp; Sons &lt;Pvt.&gt;");
    expect(kml).toContain("Char &apos;North&apos;");
    expect(kml).toContain("Dag No.: 123 &amp; 456");
    expect(kml).toContain("Khatian No.: 789 &lt;alpha&gt;");
    expect(kml).not.toContain("<Pvt.>");
    expect(kml).not.toContain("<alpha>");
  });

  it("4. rejects parcels with non-four-corner configurations", () => {
    const threeCorners: EarthCorner[] = [
      { label: "NW", lat: 24.5, lon: 89.6 },
      { label: "NE", lat: 24.5, lon: 89.7 },
      { label: "SE", lat: 24.4, lon: 89.7 },
    ];

    expect(() =>
      parcelRingToKmlCoordinates(threeCorners)
    ).toThrowError(/requires exactly 4 corners/i);

    expect(() =>
      buildParcelKml({ ...sampleParcel, corners: threeCorners })
    ).toThrowError(/must have exactly 4 corners/i);

    expect(() =>
      buildParcelKml({ ...sampleParcel, corners: [] as any })
    ).toThrowError(/must have exactly 4 corners/i);
  });

  it("5. computes bounding-box center, range, and valid Google Earth camera URL", () => {
    const center = getParcelCenter(sampleCorners);
    expect(center.lat).toBeCloseTo(24.555, 3);
    expect(center.lon).toBeCloseTo(89.626, 3);

    const range = getCameraRangeMeters(sampleCorners);
    // Extent is ~220m, 3x extent is ~660m (well above 20m min)
    expect(range).toBeGreaterThan(100);
    expect(range).toBeLessThan(2000);

    const tinyCorners: EarthCorner[] = [
      { lat: 24.5, lon: 89.6 },
      { lat: 24.5, lon: 89.6 },
      { lat: 24.5, lon: 89.6 },
      { lat: 24.5, lon: 89.6 },
    ];
    // Enforces minimum extent of 20m, range about 3 * 20 = 60m
    expect(getCameraRangeMeters(tinyCorners)).toBe(60);

    const earthUrl = buildEarthCameraUrl(sampleCorners);
    expect(earthUrl).toMatch(
      /^https:\/\/earth\.google\.com\/web\/@-?\d+(\.\d+)?,-?\d+(\.\d+)?,0a,\d+d,35y,0h,0t,0r$/
    );
    expect(earthUrl).toContain(`${center.lat},${center.lon},0a,${range}d,35y,0h,0t,0r`);
  });

  it("6. builds clean, safe, lowercase KML filenames", () => {
    const fileName = buildKmlFileName(sampleParcel, sampleMeta);
    expect(fileName).toBe("flood-2024-tangail_dag_1042_outline.kml");

    // Without meta
    expect(buildKmlFileName({ dagNo: "999" })).toBe("flood_dag_999_outline.kml");

    // Safe sanitized characters
    const messyName = buildKmlFileName(
      { dagNo: "12/A #3" },
      { floodId: "Flood Evt #1!" }
    );
    expect(messyName).toBe("flood_evt_1_dag_12_a_3_outline.kml");
    expect(messyName).not.toMatch(/[#!\/ ]/);
  });

  it("7. generates valid KML and Earth URLs across real mock flood parcels", async () => {
    const floods = await listFloods();
    expect(floods.length).toBeGreaterThan(0);

    let evaluatedPlots = 0;

    for (const flood of floods.slice(0, 3)) {
      const ownerIds = Array.from(
        new Set(
          (flood.plotStatus || [])
            .map((ps) => ps.ownerId)
            .filter((id) => Boolean(id) && id !== "Unassigned")
        )
      );

      for (const ownerId of ownerIds.slice(0, 2)) {
        const plots = await getOwnerPlots(flood.id, ownerId);
        for (const plot of plots) {
          expect(plot.corners).toHaveLength(4);

          const kml = buildParcelKml(
            {
              plotId: plot.plotId,
              dagNo: plot.dagNo,
              khatianNo: plot.khatianNo,
              landClass: plot.landClass,
              areaDecimal: plot.areaDecimal,
              floodStatus: plot.floodStatus,
              corners: plot.corners,
            },
            {
              floodId: flood.id,
              mouzaName: flood.mouzaName,
            }
          );

          expect(kml).toContain('<kml xmlns="http://www.opengis.net/kml/2.2">');
          expect(kml).toContain("<Polygon>");
          expect(kml).toContain("<Point>");
          expect(kml).toContain(
            "BhumiDorpon demo (mock / synthetic data, not a legal survey)"
          );
          expect(kml).toContain(`Dag No.: ${plot.dagNo}`);

          const url = buildEarthCameraUrl(plot.corners);
          expect(url).toMatch(/^https:\/\/earth\.google\.com\/web\/@/);
          expect(url).toContain("35y,0h,0t,0r");

          const fileName = buildKmlFileName(plot, { floodId: flood.id });
          expect(fileName.endsWith(".kml")).toBe(true);

          evaluatedPlots++;
        }
      }
    }

    expect(evaluatedPlots).toBeGreaterThan(5);
  });
});
