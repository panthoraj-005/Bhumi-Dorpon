import fs from "fs";
import path from "path";
import zlib from "zlib";
import * as turf from "@turf/turf";
import {
  HazardType,
  DataMode,
  Basemap,
  MouzaSummary,
  MapArea,
  TerrainAssets,
  ContextCard,
  OwnerRecord,
  Corner,
  Plot,
  Mouza,
  Owner,
  FloodEvent,
  FloodPlotStatus,
  HazardResult,
} from "../lib/types";

// ==========================================
// 1. DETERMINISTIC PSEUDO-RANDOM GENERATOR
// ==========================================
function createRng(seed = 0x20261012) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = createRng();
function rand(): number {
  return rng();
}
function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function randFloat(min: number, max: number, decimals = 1): number {
  const val = rand() * (max - min) + min;
  return Number(val.toFixed(decimals));
}
function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

// 12 Deterministic flood owner colors (MAP_SPEC section 8)
export const FLOOD_OWNER_COLORS = [
  "#E0A100",
  "#C2557A",
  "#5E8C31",
  "#8A5A44",
  "#3C8D93",
  "#B8722C",
  "#7B6FB5",
  "#A0A83A",
  "#D4698B",
  "#4F7CA3",
  "#7A8A4B",
  "#B35A3C",
];

// ==========================================
// 2. ROBUST PURE-NODE PNG GENERATOR
// ==========================================
export function createPngBuffer(width: number, height: number, rgbaBuffer: Buffer): Buffer {
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  function crc32(buf: Buffer) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }
  function chunk(type: string, data: Buffer) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const t = Buffer.from(type, "ascii");
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
    return Buffer.concat([len, t, data, crc]);
  }
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // Filter None
    rgbaBuffer.copy(
      raw,
      y * (width * 4 + 1) + 1,
      y * width * 4,
      (y + 1) * width * 4
    );
  }
  const idat = zlib.deflateSync(raw);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ==========================================
// 3. POLYLABEL (POLE OF INACCESSIBILITY)
// ==========================================
export function computePolylabel(coords: [number, number][]): [number, number] {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of coords) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const poly = turf.polygon([coords]);

  function distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1);
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  function distToPoly(px: number, py: number): number {
    let minDist = Infinity;
    for (let i = 0; i < coords.length - 1; i++) {
      const d = distToSegment(px, py, coords[i][0], coords[i][1], coords[i + 1][0], coords[i + 1][1]);
      if (d < minDist) minDist = d;
    }
    return minDist;
  }

  let bestX = (minX + maxX) / 2;
  let bestY = (minY + maxY) / 2;
  let bestDist = -Infinity;

  const N = 24;
  const stepX = (maxX - minX) / N;
  const stepY = (maxY - minY) / N;

  for (let i = 1; i < N; i++) {
    for (let j = 1; j < N; j++) {
      const x = minX + i * stepX;
      const y = minY + j * stepY;
      if (turf.booleanPointInPolygon(turf.point([x, y]), poly)) {
        const d = distToPoly(x, y);
        if (d > bestDist) {
          bestDist = d;
          bestX = x;
          bestY = y;
        }
      }
    }
  }

  if (bestDist > -Infinity) {
    const refN = 7;
    const refStepX = stepX / 3;
    const refStepY = stepY / 3;
    for (let i = -refN; i <= refN; i++) {
      for (let j = -refN; j <= refN; j++) {
        const x = bestX + i * refStepX;
        const y = bestY + j * refStepY;
        if (turf.booleanPointInPolygon(turf.point([x, y]), poly)) {
          const d = distToPoly(x, y);
          if (d > bestDist) {
            bestDist = d;
            bestX = x;
            bestY = y;
          }
        }
      }
    }
  }

  if (bestDist <= 0 || !turf.booleanPointInPolygon(turf.point([bestX, bestY]), poly)) {
    const pt = turf.pointOnFeature(poly);
    return [Number(pt.geometry.coordinates[0].toFixed(6)), Number(pt.geometry.coordinates[1].toFixed(6))];
  }

  return [Number(bestX.toFixed(6)), Number(bestY.toFixed(6))];
}

// ==========================================
// 4. FOUR-CORNER DERIVATION
// ==========================================
export function deriveCorners(points: [number, number][]): [Corner, Corner, Corner, Corner] {
  const pts: { lon: number; lat: number }[] = [];
  for (const [lon, lat] of points) {
    if (!pts.some((p) => Math.abs(p.lon - lon) < 1e-7 && Math.abs(p.lat - lat) < 1e-7)) {
      pts.push({ lon: Number(lon.toFixed(6)), lat: Number(lat.toFixed(6)) });
    }
  }
  while (pts.length < 4) {
    pts.push({ lon: pts[0]?.lon || 89.627, lat: pts[0]?.lat || 24.555 });
  }
  const fourPts = pts.slice(0, 4);
  const sortedByLat = [...fourPts].sort((a, b) => b.lat - a.lat);
  const northern = sortedByLat.slice(0, 2).sort((a, b) => a.lon - b.lon);
  const southern = sortedByLat.slice(2, 4).sort((a, b) => b.lon - a.lon);

  return [
    { label: "NW", lat: northern[0].lat, lon: northern[0].lon },
    { label: "NE", lat: northern[1].lat, lon: northern[1].lon },
    { label: "SE", lat: southern[0].lat, lon: southern[0].lon },
    { label: "SW", lat: southern[1].lat, lon: southern[1].lon },
  ];
}

// ==========================================
// 5. ADJACENT MOUZA PARTITIONING ENGINE
// ==========================================
export interface GeneratedMouza {
  id: string;
  name: string;
  jlNo: string;
  upazilaId: string;
  districtId: string;
  polygon: [number, number][][];
  areaDecimal: number;
  labelAnchor: [number, number];
}

export function partitionLandIntoAdjacentMouzas(
  upazilaId: string,
  districtId: string,
  mouzaNames: string[],
  bounds: [number, number, number, number], // [minLon, minLat, maxLon, maxLat]
  riverBankCoords: [number, number][], // bankline points from South to North
  inlandLon: number,
  numMouzas: number,
  startJl: number = 42
): GeneratedMouza[] {
  const [minLon, minLat, maxLon, maxLat] = bounds;
  const K = Math.min(numMouzas, mouzaNames.length);

  // Divide latitude interval into K slices
  const latSteps: number[] = [];
  for (let i = 0; i <= K; i++) {
    latSteps.push(minLat + (i / K) * (maxLat - minLat));
  }

  // Generate K - 1 shared transverse dividing polylines across reach
  // Each dividing curve connects (inlandLon, lat) to (bankLon(lat), lat)
  const dividers: [number, number][][] = [];
  for (let i = 0; i <= K; i++) {
    const curLat = latSteps[i];
    // Find closest bank point or interpolate
    let closestBankLon = minLon;
    let minD = Infinity;
    for (const [bLon, bLat] of riverBankCoords) {
      const d = Math.abs(bLat - curLat);
      if (d < minD) {
        minD = d;
        closestBankLon = bLon;
      }
    }

    // Mid-points for gentle curved division line
    const midX1 = inlandLon + (closestBankLon - inlandLon) * 0.33;
    const midY1 = curLat + (i > 0 && i < K ? Math.sin(i * 1.5) * 0.0006 : 0);
    const midX2 = inlandLon + (closestBankLon - inlandLon) * 0.67;
    const midY2 = curLat + (i > 0 && i < K ? Math.cos(i * 1.7) * 0.0005 : 0);

    const divLine: [number, number][] = [
      [Number(inlandLon.toFixed(6)), Number(curLat.toFixed(6))],
      [Number(midX1.toFixed(6)), Number(midY1.toFixed(6))],
      [Number(midX2.toFixed(6)), Number(midY2.toFixed(6))],
      [Number(closestBankLon.toFixed(6)), Number(curLat.toFixed(6))],
    ];
    dividers.push(divLine);
  }

  const mouzas: GeneratedMouza[] = [];

  for (let i = 0; i < K; i++) {
    const mId = `mouza_${upazilaId}_${i + 1}`;
    const mName = mouzaNames[i] || `Mouza Sector-${i + 1}`;
    const jlNo = `JL-${startJl + i * 4}`;

    // Southern border: divider i (from inland to bank)
    const southBorder = dividers[i];
    // Northern border: divider i + 1 (from bank to inland)
    const northBorder = dividers[i + 1].slice().reverse();

    // Bankline segment between latSteps[i] and latSteps[i + 1]
    const bankSegment = riverBankCoords.filter(
      ([, bLat]) => bLat >= latSteps[i] - 1e-5 && bLat <= latSteps[i + 1] + 1e-5
    );
    if (bankSegment.length === 0) {
      bankSegment.push([southBorder[southBorder.length - 1][0], latSteps[i]]);
      bankSegment.push([northBorder[0][0], latSteps[i + 1]]);
    }

    // Inland border segment (from north down to south)
    const inlandSegment: [number, number][] = [
      [Number(inlandLon.toFixed(6)), Number(latSteps[i + 1].toFixed(6))],
      [Number(inlandLon.toFixed(6)), Number(latSteps[i].toFixed(6))],
    ];

    // Combine into closed ring:
    // South border (inland -> bank) -> bankSegment (south -> north) -> North border (bank -> inland) -> inlandSegment (north -> south)
    const ring: [number, number][] = [
      ...southBorder,
      ...bankSegment.slice(1, -1),
      ...northBorder,
      ...inlandSegment.slice(1, -1),
      southBorder[0],
    ];

    // Clean duplicate consecutive vertices
    const cleanRing: [number, number][] = [];
    for (const p of ring) {
      if (cleanRing.length === 0 || Math.hypot(p[0] - cleanRing[cleanRing.length - 1][0], p[1] - cleanRing[cleanRing.length - 1][1]) > 1e-6) {
        cleanRing.push([Number(p[0].toFixed(6)), Number(p[1].toFixed(6))]);
      }
    }
    if (Math.hypot(cleanRing[0][0] - cleanRing[cleanRing.length - 1][0], cleanRing[0][1] - cleanRing[cleanRing.length - 1][1]) > 1e-6) {
      cleanRing.push(cleanRing[0]);
    }

    const poly = turf.polygon([cleanRing]);
    const areaSqM = turf.area(poly);
    const areaDec = Number((areaSqM / 40.4686).toFixed(1));
    const labelAnchor = computePolylabel(cleanRing);

    mouzas.push({
      id: mId,
      name: mName,
      jlNo,
      upazilaId,
      districtId,
      polygon: [cleanRing],
      areaDecimal: areaDec,
      labelAnchor,
    });
  }

  return mouzas;
}

// ==========================================
// 6. GENERATE BASEMAP PER AREA (MAP_SPEC §4)
// ==========================================
export function buildBasemapForArea(
  bounds: [number, number, number, number],
  mouzas: GeneratedMouza[],
  waterPoly: [number, number][][],
  riverName: string,
  isCoastal: boolean = false,
  isHilly: boolean = false
): Basemap {
  const [minLon, minLat, maxLon, maxLat] = bounds;

  // 1. Land polygon
  const land: [number, number][][] = [
    [
      [Number(minLon.toFixed(6)), Number(minLat.toFixed(6))],
      [Number(maxLon.toFixed(6)), Number(minLat.toFixed(6))],
      [Number(maxLon.toFixed(6)), Number(maxLat.toFixed(6))],
      [Number(minLon.toFixed(6)), Number(maxLat.toFixed(6))],
      [Number(minLon.toFixed(6)), Number(minLat.toFixed(6))],
    ],
  ];

  // 2. Landuse patches (farmland, vegetation, settlement)
  const landuse: Basemap["landuse"] = [];
  for (let i = 0; i < mouzas.length; i++) {
    const m = mouzas[i];
    const [anchorLon, anchorLat] = m.labelAnchor;
    const dLon = 0.003;
    const dLat = 0.002;

    // Farmland patch
    landuse.push({
      type: "farmland",
      polygon: [
        [
          [Number((anchorLon - dLon).toFixed(6)), Number((anchorLat - dLat).toFixed(6))],
          [Number((anchorLon + dLon * 0.8).toFixed(6)), Number((anchorLat - dLat * 0.9).toFixed(6))],
          [Number((anchorLon + dLon).toFixed(6)), Number((anchorLat + dLat * 0.8).toFixed(6))],
          [Number((anchorLon - dLon * 0.9).toFixed(6)), Number((anchorLat + dLat).toFixed(6))],
          [Number((anchorLon - dLon).toFixed(6)), Number((anchorLat - dLat).toFixed(6))],
        ],
      ],
    });

    // Vegetation patch
    landuse.push({
      type: "vegetation",
      polygon: [
        [
          [Number((anchorLon + 0.001).toFixed(6)), Number((anchorLat + 0.001).toFixed(6))],
          [Number((anchorLon + 0.0035).toFixed(6)), Number((anchorLat + 0.0012).toFixed(6))],
          [Number((anchorLon + 0.0032).toFixed(6)), Number((anchorLat + 0.0028).toFixed(6))],
          [Number((anchorLon + 0.0012).toFixed(6)), Number((anchorLat + 0.0026).toFixed(6))],
          [Number((anchorLon + 0.001).toFixed(6)), Number((anchorLat + 0.001).toFixed(6))],
        ],
      ],
    });

    // Settlement homestead patch
    landuse.push({
      type: "settlement",
      polygon: [
        [
          [Number((anchorLon - 0.003).toFixed(6)), Number((anchorLat + 0.0005).toFixed(6))],
          [Number((anchorLon - 0.0015).toFixed(6)), Number((anchorLat + 0.0006).toFixed(6))],
          [Number((anchorLon - 0.0014).toFixed(6)), Number((anchorLat + 0.0018).toFixed(6))],
          [Number((anchorLon - 0.0029).toFixed(6)), Number((anchorLat + 0.0017).toFixed(6))],
          [Number((anchorLon - 0.003).toFixed(6)), Number((anchorLat + 0.0005).toFixed(6))],
        ],
      ],
    });
  }

  // 3. Water polygons (main river/sea + beel/tidal flat)
  const water: Basemap["water"] = [
    {
      type: isCoastal ? "sea" : "river",
      polygon: waterPoly,
    },
  ];

  // Add 1-2 beels (natural floodplain ponds)
  const beelCenterLon = Number((minLon + (maxLon - minLon) * 0.25).toFixed(6));
  const beelCenterLat = Number((minLat + (maxLat - minLat) * 0.45).toFixed(6));
  water.push({
    type: "beel",
    polygon: [
      [
        [Number((beelCenterLon - 0.0015).toFixed(6)), Number((beelCenterLat - 0.001).toFixed(6))],
        [Number((beelCenterLon + 0.0018).toFixed(6)), Number((beelCenterLat - 0.0008).toFixed(6))],
        [Number((beelCenterLon + 0.0012).toFixed(6)), Number((beelCenterLat + 0.0012).toFixed(6))],
        [Number((beelCenterLon - 0.0016).toFixed(6)), Number((beelCenterLat + 0.0009).toFixed(6))],
        [Number((beelCenterLon - 0.0015).toFixed(6)), Number((beelCenterLat - 0.001).toFixed(6))],
      ],
    ],
  });

  if (isCoastal) {
    // Add tidal flat
    water.push({
      type: "tidal_flat",
      polygon: [
        [
          [Number((maxLon - 0.005).toFixed(6)), Number(minLat.toFixed(6))],
          [Number(maxLon.toFixed(6)), Number(minLat.toFixed(6))],
          [Number(maxLon.toFixed(6)), Number((minLat + 0.004).toFixed(6))],
          [Number((maxLon - 0.004).toFixed(6)), Number((minLat + 0.0035).toFixed(6))],
          [Number((maxLon - 0.005).toFixed(6)), Number(minLat.toFixed(6))],
        ],
      ],
    });
  }

  // 4. Waterlines (Canals / khals)
  const waterlines: Basemap["waterlines"] = [
    {
      type: "canal",
      line: [
        [Number((minLon + 0.002).toFixed(6)), Number((minLat + 0.003).toFixed(6))],
        [Number((minLon + 0.008).toFixed(6)), Number((minLat + 0.007).toFixed(6))],
        [Number((minLon + 0.014).toFixed(6)), Number((minLat + 0.008).toFixed(6))],
      ],
    },
    {
      type: "canal",
      line: [
        [Number(beelCenterLon.toFixed(6)), Number(beelCenterLat.toFixed(6))],
        [Number((beelCenterLon + 0.006).toFixed(6)), Number((beelCenterLat + 0.004).toFixed(6))],
        [Number((maxLon - 0.004).toFixed(6)), Number((beelCenterLat + 0.006).toFixed(6))],
      ],
    },
  ];

  // 5. Roads (Major & Minor)
  const roadLat = (minLat + maxLat) / 2;
  const roads: Basemap["roads"] = [
    {
      type: "major",
      line: [
        [Number(minLon.toFixed(6)), Number((roadLat - 0.002).toFixed(6))],
        [Number((minLon + (maxLon - minLon) * 0.4).toFixed(6)), Number((roadLat + 0.001).toFixed(6))],
        [Number((maxLon - 0.003).toFixed(6)), Number((roadLat + 0.002).toFixed(6))],
      ],
    },
    {
      type: "minor",
      line: [
        [Number((minLon + 0.005).toFixed(6)), Number((minLat + 0.002).toFixed(6))],
        [Number((minLon + 0.006).toFixed(6)), Number((roadLat + 0.001).toFixed(6))],
        [Number((minLon + 0.008).toFixed(6)), Number((maxLat - 0.003).toFixed(6))],
      ],
    },
    {
      type: "minor",
      line: [
        [Number((minLon + 0.012).toFixed(6)), Number((roadLat + 0.001).toFixed(6))],
        [Number((minLon + 0.015).toFixed(6)), Number((maxLat - 0.002).toFixed(6))],
      ],
    },
  ];

  // 6. Embankments (Coast & Floodplain)
  const embankments: Basemap["embankments"] = [
    {
      line: [
        [Number((minLon + 0.008).toFixed(6)), Number((minLat + 0.001).toFixed(6))],
        [Number((minLon + 0.009).toFixed(6)), Number((roadLat).toFixed(6))],
        [Number((minLon + 0.0085).toFixed(6)), Number((maxLat - 0.001).toFixed(6))],
      ],
    },
  ];

  // 7. Buildings (small homestead blocks)
  const buildings: Basemap["buildings"] = [];
  for (let i = 0; i < mouzas.length; i++) {
    const m = mouzas[i];
    const [bx, by] = m.labelAnchor;
    const bW = 0.0003;
    const bH = 0.0002;
    buildings.push({
      polygon: [
        [
          [Number((bx - bW).toFixed(6)), Number((by - bH).toFixed(6))],
          [Number((bx + bW).toFixed(6)), Number((by - bH).toFixed(6))],
          [Number((bx + bW).toFixed(6)), Number((by + bH).toFixed(6))],
          [Number((bx - bW).toFixed(6)), Number((by + bH).toFixed(6))],
          [Number((bx - bW).toFixed(6)), Number((by - bH).toFixed(6))],
        ],
      ],
    });
    buildings.push({
      polygon: [
        [
          [Number((bx + bW * 2).toFixed(6)), Number((by - bH).toFixed(6))],
          [Number((bx + bW * 4).toFixed(6)), Number((by - bH).toFixed(6))],
          [Number((bx + bW * 4).toFixed(6)), Number((by + bH).toFixed(6))],
          [Number((bx + bW * 2).toFixed(6)), Number((by + bH).toFixed(6))],
          [Number((bx + bW * 2).toFixed(6)), Number((by - bH).toFixed(6))],
        ],
      ],
    });
  }

  // 8. POIs
  const pois: Basemap["pois"] = [];
  const poiTypes: Array<"school" | "mosque" | "market" | "health_center"> = [
    "school",
    "mosque",
    "market",
    "health_center",
  ];
  for (let i = 0; i < Math.min(mouzas.length, 4); i++) {
    const m = mouzas[i];
    const type = poiTypes[i % poiTypes.length];
    const label = `${m.name.replace(" Mouza", "")} ${type.replace("_", " ").toUpperCase()}`;
    pois.push({
      name: label,
      type,
      coordinates: [
        Number((m.labelAnchor[0] + 0.0015).toFixed(6)),
        Number((m.labelAnchor[1] - 0.0012).toFixed(6)),
      ],
    });
  }

  // 9. Upazila polygon (enclosing outline)
  const upazila: [number, number][][] = [
    [
      [Number((minLon - 0.002).toFixed(6)), Number((minLat - 0.002).toFixed(6))],
      [Number((maxLon + 0.002).toFixed(6)), Number((minLat - 0.002).toFixed(6))],
      [Number((maxLon + 0.002).toFixed(6)), Number((maxLat + 0.002).toFixed(6))],
      [Number((minLon - 0.002).toFixed(6)), Number((maxLat + 0.002).toFixed(6))],
      [Number((minLon - 0.002).toFixed(6)), Number((minLat - 0.002).toFixed(6))],
    ],
  ];

  // 10. Mouzas
  const basemapMouzas = mouzas.map((m) => ({
    id: m.id,
    name: m.name,
    jlNo: m.jlNo,
    labelAnchor: m.labelAnchor,
    areaDecimal: m.areaDecimal,
    polygon: m.polygon,
  }));

  // 11. Labels (River / Sea)
  const labels: Basemap["labels"] = [
    {
      text: riverName,
      type: isCoastal ? "sea" : "river",
      bearing: isCoastal ? 90 : 75,
      coordinates: [
        Number((maxLon - 0.003).toFixed(6)),
        Number(((minLat + maxLat) / 2).toFixed(6)),
      ],
    },
  ];

  return {
    land,
    landuse,
    water,
    waterlines,
    roads,
    embankments,
    buildings,
    pois,
    upazila,
    mouzas: basemapMouzas,
    labels,
  };
}

// ==========================================
// 7. FOUR-CORNER PLOTS GENERATOR PER MOUZA
// ==========================================
export function generatePlotsForMouza(
  mouza: GeneratedMouza,
  allOwners: Owner[],
  ownerStartIndex: number,
  waterPolyFeature: any,
  plotIdStart: number = 100
): { plots: Plot[]; nextPlotId: number } {
  const plots: Plot[] = [];
  const coords = mouza.polygon[0];
  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
  for (const [x, y] of coords) {
    if (x < minLon) minLon = x;
    if (x > maxLon) maxLon = x;
    if (y < minLat) minLat = y;
    if (y > maxLat) maxLat = y;
  }

  const numPlots = randInt(28, 38);
  const cols = 7;
  const rows = Math.ceil((numPlots * 1.8) / cols);
  const dLon = (maxLon - minLon) / (cols + 1);
  const dLat = (maxLat - minLat) / (rows + 1);

  let currentPlotId = plotIdStart;
  const mouzaPoly = turf.polygon(mouza.polygon);

  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      if (plots.length >= numPlots) break;

      const baseLon = minLon + c * dLon;
      const baseLat = minLat + r * dLat;
      const hw = dLon * 0.38;
      const hh = dLat * 0.38;

      const pNW: [number, number] = [Number((baseLon - hw).toFixed(6)), Number((baseLat + hh).toFixed(6))];
      const pNE: [number, number] = [Number((baseLon + hw).toFixed(6)), Number((baseLat + hh).toFixed(6))];
      const pSE: [number, number] = [Number((baseLon + hw).toFixed(6)), Number((baseLat - hh).toFixed(6))];
      const pSW: [number, number] = [Number((baseLon - hw).toFixed(6)), Number((baseLat - hh).toFixed(6))];

      const corners = deriveCorners([pNW, pNE, pSE, pSW]);

      // Check all 4 corners inside mouza and not in water
      let valid = true;
      for (const cn of corners) {
        const pt = turf.point([cn.lon, cn.lat]);
        if (!turf.booleanPointInPolygon(pt, mouzaPoly)) {
          valid = false;
          break;
        }
        if (waterPolyFeature && turf.booleanPointInPolygon(pt, waterPolyFeature)) {
          valid = false;
          break;
        }
      }

      if (!valid) continue;

      const plotPolygon: [number, number][][] = [
        [
          [corners[0].lon, corners[0].lat],
          [corners[1].lon, corners[1].lat],
          [corners[2].lon, corners[2].lat],
          [corners[3].lon, corners[3].lat],
          [corners[0].lon, corners[0].lat],
        ],
      ];

      const areaSqM = turf.area(turf.polygon(plotPolygon));
      const areaDec = Number((areaSqM / 40.4686).toFixed(1));

      const ownerIdx = (ownerStartIndex + plots.length) % allOwners.length;
      const owner = allOwners[ownerIdx];

      plots.push({
        id: `plot_${mouza.id}_${currentPlotId}`,
        mouzaId: mouza.id,
        dagNo: `${currentPlotId}`,
        khatianNo: `RS-${randInt(110, 890)}`,
        landClass: randChoice(["agri", "agri", "agri", "homestead", "pond", "commercial"]),
        areaDecimal: areaDec,
        ownerId: owner.id,
        polygon: plotPolygon,
        corners,
      });

      currentPlotId++;
    }
  }

  return { plots, nextPlotId: currentPlotId };
}

// ==========================================
// 7B. OWNER RECORDS GENERATION FOR MOUZAS
// ==========================================
export function generateOwnersForMouzaSummaries(
  mouzas: MouzaSummary[],
  hazard: HazardType,
  mode: DataMode,
  upazilaId: string,
  districtId: string,
  allOwners: Owner[]
): OwnerRecord[] {
  const ownersList: OwnerRecord[] = [];
  let ownerSeq = 1;

  for (const m of mouzas) {
    const targetLoss = m.lossDecimal || 0;
    const targetGain = m.gainDecimal || 0;
    const numOwners = Math.max(2, Math.min(8, Math.round(targetLoss / 12) || 3));

    if (targetLoss > 0) {
      let accumulated = 0;
      for (let i = 0; i < numOwners; i++) {
        const isLast = i === numOwners - 1;
        let portion = Number((targetLoss / numOwners).toFixed(1));
        if (isLast) {
          portion = Number((targetLoss - accumulated).toFixed(1));
        } else {
          accumulated += portion;
        }

        const ownerObj = allOwners[(ownerSeq + i * 3) % allOwners.length];
        ownersList.push({
          id: `impact_${hazard}_${mode}_${m.id}_${i + 1}`,
          name: ownerObj?.name || `Impacted Resident ${i + 1}`,
          dagNo: `${100 + ownerSeq + i}`,
          khatianNo: `RS-${200 + ownerSeq + i}`,
          plotNo: `${100 + ownerSeq + i}`,
          mouzaId: m.id,
          upazilaId,
          districtId,
          hazard,
          landClass: "agri",
          changeKind: "loss",
          lossDecimal: portion,
          gainDecimal: 0,
          estimatedCompensationBDT: mode === "forecast" ? undefined : Math.round(portion * 12000),
          compensationStatus: mode === "forecast" ? undefined : "approved",
          paidAmountBDT: mode === "forecast" ? undefined : 0,
          coordinates: m.labelAnchor,
          colorIndex: ownerObj?.colorIndex ?? (i % 12),
        });
      }
    } else if (targetGain > 0) {
      let accumulated = 0;
      for (let i = 0; i < numOwners; i++) {
        const isLast = i === numOwners - 1;
        let portion = Number((targetGain / numOwners).toFixed(1));
        if (isLast) {
          portion = Number((targetGain - accumulated).toFixed(1));
        } else {
          accumulated += portion;
        }

        const ownerObj = allOwners[(ownerSeq + i * 3) % allOwners.length];
        ownersList.push({
          id: `gain_${hazard}_${mode}_${m.id}_${i + 1}`,
          name: ownerObj?.name || `Beneficiary Owner ${i + 1}`,
          dagNo: `${100 + ownerSeq + i}`,
          khatianNo: `RS-${200 + ownerSeq + i}`,
          plotNo: `${100 + ownerSeq + i}`,
          mouzaId: m.id,
          upazilaId,
          districtId,
          hazard,
          landClass: "agri",
          changeKind: "gain",
          lossDecimal: 0,
          gainDecimal: portion,
          coordinates: m.labelAnchor,
          colorIndex: ownerObj?.colorIndex ?? (i % 12),
        });
      }
    }
    ownerSeq += numOwners;
  }
  return ownersList;
}

// ==========================================
// 8. LANDSLIDE 256x256 DEM & RASTERS ENGINE
// ==========================================
export interface GeneratedLandslideTerrain {
  terrainAssets: TerrainAssets;
  context: ContextCard;
  scarPoly: [number, number][][];
  debrisPoly: [number, number][][];
  susceptibilityZones: { level: "Moderate" | "High" | "Very high"; polygon: [number, number][][] }[];
  predictedScar: [number, number][][];
}

export function generateLandslideTerrain(
  areaId: string,
  bounds: [number, number, number, number],
  targetSoilVolumeM3: number,
  outputDirPublic: string,
  outputDirInternal: string
): GeneratedLandslideTerrain {
  const [minLon, minLat, maxLon, maxLat] = bounds;
  const N = 256;

  // Geographic dimensions in meters
  const midLat = (minLat + maxLat) / 2;
  const dxM = (maxLon - minLon) * 111320 * Math.cos((midLat * Math.PI) / 180);
  const dyM = (maxLat - minLat) * 111320;
  const pixAreaM2 = (dxM / N) * (dyM / N);

  // Generate DEM_before with 2 Gaussian hill crests + noise
  const demBefore: number[][] = [];
  const demAfter: number[][] = [];
  const elevationChange: number[][] = [];
  const cutDepth: number[][] = [];
  const fillThickness: number[][] = [];

  for (let y = 0; y < N; y++) {
    demBefore[y] = new Array(N).fill(0);
    demAfter[y] = new Array(N).fill(0);
    elevationChange[y] = new Array(N).fill(0);
    cutDepth[y] = new Array(N).fill(0);
    fillThickness[y] = new Array(N).fill(0);
  }

  // Peak 1: (105, 115) H=290m, Peak 2: (165, 175) H=210m
  const p1X = 105, p1Y = 115, h1 = 290, s1 = 42;
  const p2X = 165, p2Y = 175, h2 = 210, s2 = 48;
  const zBase = 45;

  let minZ = Infinity, maxZ = -Infinity;

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const d1 = ((x - p1X) * (x - p1X) + (y - p1Y) * (y - p1Y)) / (2 * s1 * s1);
      const d2 = ((x - p2X) * (x - p2X) + (y - p2Y) * (y - p2Y)) / (2 * s2 * s2);
      const smoothNoise = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 12 + Math.sin(x * 0.16 + y * 0.14) * 6;
      const z = zBase + h1 * Math.exp(-d1) + h2 * Math.exp(-d2) + smoothNoise;
      demBefore[y][x] = z;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
  }

  // Failure along steepest flank of Peak 1 (towards south-west x: 80..105, y: 110..145)
  // Scar: upper portion (x: 88..104, y: 112..128)
  // Debris: lower portion (x: 78..96, y: 126..148)
  const scarPixels: { x: number; y: number; weight: number }[] = [];
  const debrisPixels: { x: number; y: number; weight: number }[] = [];

  for (let y = 108; y <= 130; y++) {
    for (let x = 86; x <= 106; x++) {
      const dx = (x - 96) / 9;
      const dy = (y - 119) / 10;
      const d2 = dx * dx + dy * dy;
      if (d2 <= 1.0) {
        const w = (1 - d2) * 18.0;
        scarPixels.push({ x, y, weight: w });
      }
    }
  }

  for (let y = 124; y <= 152; y++) {
    for (let x = 76; x <= 98; x++) {
      const dx = (x - 87) / 10;
      const dy = (y - 138) / 13;
      const d2 = dx * dx + dy * dy;
      if (d2 <= 1.0) {
        const w = (1 - d2) * 12.0;
        debrisPixels.push({ x, y, weight: w });
      }
    }
  }

  // Exact volume matching: targetSoilVolumeM3
  const rawCutSum = scarPixels.reduce((s, p) => s + p.weight, 0);
  const rawFillSum = debrisPixels.reduce((s, p) => s + p.weight, 0);

  const targetVol = targetSoilVolumeM3;
  const cutScale = (targetVol / pixAreaM2) / (rawCutSum || 1);
  const fillScale = (targetVol / pixAreaM2) / (rawFillSum || 1);

  let actualCutVol = 0;
  for (const p of scarPixels) {
    const depth = p.weight * cutScale;
    cutDepth[p.y][p.x] = depth;
    actualCutVol += depth * pixAreaM2;
  }

  let actualFillVol = 0;
  for (const p of debrisPixels) {
    const thick = p.weight * fillScale;
    fillThickness[p.y][p.x] = thick;
    actualFillVol += thick * pixAreaM2;
  }

  // Apply to DEM_after
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const cut = cutDepth[y][x];
      const fill = fillThickness[y][x];
      const delta = fill - cut;
      elevationChange[y][x] = delta;
      demAfter[y][x] = demBefore[y][x] + delta;
    }
  }

  // Pre-render 6 PNG Rasters:
  const bufElevBefore = Buffer.alloc(N * N * 4);
  const bufElevAfter = Buffer.alloc(N * N * 4);
  const bufHillshadeBefore = Buffer.alloc(N * N * 4);
  const bufHillshadeAfter = Buffer.alloc(N * N * 4);
  const bufSlopeBefore = Buffer.alloc(N * N * 4);
  const bufElevChange = Buffer.alloc(N * N * 4);

  // Hypsometric tint stops (Section 2)
  const stops = [
    { p: 0.0, r: 221, g: 235, b: 211 }, // #DDEBD3
    { p: 0.2, r: 233, g: 239, b: 207 }, // #E9EFCF
    { p: 0.4, r: 242, g: 237, b: 195 }, // #F2EDC3
    { p: 0.6, r: 235, g: 221, b: 180 }, // #EBDDB4
    { p: 0.8, r: 220, g: 198, b: 163 }, // #DCC6A3
    { p: 1.0, r: 209, g: 184, b: 160 }, // #D1B8A0
  ];

  function getHypsometricColor(zVal: number): [number, number, number] {
    const t = Math.max(0, Math.min(1, (zVal - minZ) / (maxZ - minZ || 1)));
    for (let i = 0; i < stops.length - 1; i++) {
      if (t >= stops[i].p && t <= stops[i + 1].p) {
        const segT = (t - stops[i].p) / (stops[i + 1].p - stops[i].p);
        const r = Math.round(stops[i].r + segT * (stops[i + 1].r - stops[i].r));
        const g = Math.round(stops[i].g + segT * (stops[i + 1].g - stops[i].g));
        const b = Math.round(stops[i].b + segT * (stops[i + 1].b - stops[i].b));
        return [r, g, b];
      }
    }
    return [stops[stops.length - 1].r, stops[stops.length - 1].g, stops[stops.length - 1].b];
  }

  const sunAzRad = (315 * Math.PI) / 180;
  const sunAltRad = (45 * Math.PI) / 180;
  const cellM = dxM / N;

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const idx = (y * N + x) * 4;

      // 1. Elevation Before
      const [r1, g1, b1] = getHypsometricColor(demBefore[y][x]);
      bufElevBefore[idx] = r1;
      bufElevBefore[idx + 1] = g1;
      bufElevBefore[idx + 2] = b1;
      bufElevBefore[idx + 3] = 255;

      // 2. Elevation After
      const [r2, g2, b2] = getHypsometricColor(demAfter[y][x]);
      bufElevAfter[idx] = r2;
      bufElevAfter[idx + 1] = g2;
      bufElevAfter[idx + 2] = b2;
      bufElevAfter[idx + 3] = 255;

      // Hillshade computation
      const xPrev = Math.max(0, x - 1);
      const xNext = Math.min(N - 1, x + 1);
      const yPrev = Math.max(0, y - 1);
      const yNext = Math.min(N - 1, y + 1);

      // Before Hillshade & Slope
      const dzdxB = ((demBefore[y][xNext] - demBefore[y][xPrev]) / (2 * cellM)) * 2;
      const dzdyB = ((demBefore[yNext][x] - demBefore[yPrev][x]) / (2 * cellM)) * 2;
      const slopeRadB = Math.atan(Math.sqrt(dzdxB * dzdxB + dzdyB * dzdyB));
      const aspectRadB = Math.atan2(dzdyB, -dzdxB);
      const shadeB = Math.max(
        0,
        Math.sin(sunAltRad) * Math.cos(slopeRadB) +
          Math.cos(sunAltRad) * Math.sin(slopeRadB) * Math.cos(sunAzRad - aspectRadB)
      );
      const hillValB = Math.min(255, Math.max(30, Math.floor(shadeB * 255)));
      bufHillshadeBefore[idx] = hillValB;
      bufHillshadeBefore[idx + 1] = Math.floor(hillValB * 0.96);
      bufHillshadeBefore[idx + 2] = Math.floor(hillValB * 0.90);
      bufHillshadeBefore[idx + 3] = 220;

      // Slope Angle (4 classes)
      const slopeDegB = (slopeRadB * 180) / Math.PI;
      if (slopeDegB < 15) {
        bufSlopeBefore[idx] = 226; bufSlopeBefore[idx + 1] = 232; bufSlopeBefore[idx + 2] = 240; // #E2E8F0
      } else if (slopeDegB < 30) {
        bufSlopeBefore[idx] = 253; bufSlopeBefore[idx + 1] = 224; bufSlopeBefore[idx + 2] = 71;  // #FDE047
      } else if (slopeDegB < 45) {
        bufSlopeBefore[idx] = 251; bufSlopeBefore[idx + 1] = 146; bufSlopeBefore[idx + 2] = 60;  // #FB923C
      } else {
        bufSlopeBefore[idx] = 239; bufSlopeBefore[idx + 1] = 68;  bufSlopeBefore[idx + 2] = 68;  // #EF4444
      }
      bufSlopeBefore[idx + 3] = 235;

      // After Hillshade
      const dzdxA = ((demAfter[y][xNext] - demAfter[y][xPrev]) / (2 * cellM)) * 2;
      const dzdyA = ((demAfter[yNext][x] - demAfter[yPrev][x]) / (2 * cellM)) * 2;
      const slopeRadA = Math.atan(Math.sqrt(dzdxA * dzdxA + dzdyA * dzdyA));
      const aspectRadA = Math.atan2(dzdyA, -dzdxA);
      const shadeA = Math.max(
        0,
        Math.sin(sunAltRad) * Math.cos(slopeRadA) +
          Math.cos(sunAltRad) * Math.sin(slopeRadA) * Math.cos(sunAzRad - aspectRadA)
      );
      const hillValA = Math.min(255, Math.max(30, Math.floor(shadeA * 255)));
      bufHillshadeAfter[idx] = hillValA;
      bufHillshadeAfter[idx + 1] = Math.floor(hillValA * 0.96);
      bufHillshadeAfter[idx + 2] = Math.floor(hillValA * 0.90);
      bufHillshadeAfter[idx + 3] = 220;

      // Elevation Change (Diverging Coral / Blue)
      const chg = elevationChange[y][x];
      if (Math.abs(chg) < 0.2) {
        bufElevChange[idx] = 255; bufElevChange[idx + 1] = 255; bufElevChange[idx + 2] = 255; bufElevChange[idx + 3] = 0;
      } else if (chg < 0) {
        // Cut (Soil lost) Coral #E4604A
        bufElevChange[idx] = 228; bufElevChange[idx + 1] = 96; bufElevChange[idx + 2] = 74;
        bufElevChange[idx + 3] = Math.min(255, Math.floor(160 + Math.abs(chg) * 6));
      } else {
        // Fill (Debris deposited) Blue #2F7FB8
        bufElevChange[idx] = 47; bufElevChange[idx + 1] = 127; bufElevChange[idx + 2] = 184;
        bufElevChange[idx + 3] = Math.min(255, Math.floor(160 + chg * 7));
      }
    }
  }

  // Create raster directory
  const relRasterDir = `rasters/${areaId}`;
  const fullPublicRasterDir = path.join(outputDirPublic, relRasterDir);
  const fullInternalRasterDir = path.join(outputDirInternal, relRasterDir);

  for (const dir of [fullPublicRasterDir, fullInternalRasterDir]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  // Write PNG files
  const pngFiles: Record<string, Buffer> = {
    "elevation_before.png": createPngBuffer(N, N, bufElevBefore),
    "elevation_after.png": createPngBuffer(N, N, bufElevAfter),
    "hillshade_before.png": createPngBuffer(N, N, bufHillshadeBefore),
    "hillshade_after.png": createPngBuffer(N, N, bufHillshadeAfter),
    "slope_before.png": createPngBuffer(N, N, bufSlopeBefore),
    "elevation_change.png": createPngBuffer(N, N, bufElevChange),
  };

  for (const [name, buf] of Object.entries(pngFiles)) {
    fs.writeFileSync(path.join(fullPublicRasterDir, name), buf);
    fs.writeFileSync(path.join(fullInternalRasterDir, name), buf);
  }

  // Generate Contours (10m interval) via Marching Squares
  const contourFeatures: any[] = [];
  const startLevel = Math.ceil(minZ / 10) * 10;
  const endLevel = Math.floor(maxZ / 10) * 10;

  for (let lvl = startLevel; lvl <= endLevel; lvl += 10) {
    const isIndex = lvl % 50 === 0;
    const lines: [number, number][][] = [];

    for (let y = 0; y < N - 2; y += 2) {
      for (let x = 0; x < N - 2; x += 2) {
        const v0 = demBefore[y][x];
        const v1 = demBefore[y][x + 2];
        const v2 = demBefore[y + 2][x + 2];
        const v3 = demBefore[y + 2][x];

        let mask = 0;
        if (v0 >= lvl) mask |= 1;
        if (v1 >= lvl) mask |= 2;
        if (v2 >= lvl) mask |= 4;
        if (v3 >= lvl) mask |= 8;

        if (mask === 0 || mask === 15) continue;

        // Simple segment interpolation
        const lon0 = minLon + (x / N) * (maxLon - minLon);
        const lon1 = minLon + ((x + 2) / N) * (maxLon - minLon);
        const lat0 = maxLat - (y / N) * (maxLat - minLat);
        const lat1 = maxLat - ((y + 2) / N) * (maxLat - minLat);

        const midLon = (lon0 + lon1) / 2;
        const midLat = (lat0 + lat1) / 2;
        lines.push([
          [Number(lon0.toFixed(6)), Number(midLat.toFixed(6))],
          [Number(midLon.toFixed(6)), Number(lat1.toFixed(6))],
        ]);
      }
    }

    if (lines.length > 0) {
      contourFeatures.push({
        type: "Feature",
        properties: {
          elevation: lvl,
          isIndex,
        },
        geometry: {
          type: "MultiLineString",
          coordinates: lines,
        },
      });
    }
  }

  const contoursGeoJson = {
    type: "FeatureCollection",
    features: contourFeatures,
  };
  fs.writeFileSync(path.join(fullPublicRasterDir, "contours.geojson"), JSON.stringify(contoursGeoJson, null, 2));
  fs.writeFileSync(path.join(fullInternalRasterDir, "contours.geojson"), JSON.stringify(contoursGeoJson, null, 2));
  fs.writeFileSync(path.join(fullPublicRasterDir, "contours.json"), JSON.stringify(contoursGeoJson, null, 2));
  fs.writeFileSync(path.join(fullInternalRasterDir, "contours.json"), JSON.stringify(contoursGeoJson, null, 2));

  // Generate Spot heights (peaks)
  const spotHeightsGeoJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { elevation: Math.round(demBefore[p1Y][p1X]), label: `${Math.round(demBefore[p1Y][p1X])} m` },
        geometry: {
          type: "Point",
          coordinates: [
            Number((minLon + (p1X / N) * (maxLon - minLon)).toFixed(6)),
            Number((maxLat - (p1Y / N) * (maxLat - minLat)).toFixed(6)),
          ],
        },
      },
      {
        type: "Feature",
        properties: { elevation: Math.round(demBefore[p2Y][p2X]), label: `${Math.round(demBefore[p2Y][p2X])} m` },
        geometry: {
          type: "Point",
          coordinates: [
            Number((minLon + (p2X / N) * (maxLon - minLon)).toFixed(6)),
            Number((maxLat - (p2Y / N) * (maxLat - minLat)).toFixed(6)),
          ],
        },
      },
    ],
  };
  fs.writeFileSync(path.join(fullPublicRasterDir, "spot_heights.json"), JSON.stringify(spotHeightsGeoJson, null, 2));
  fs.writeFileSync(path.join(fullInternalRasterDir, "spot_heights.json"), JSON.stringify(spotHeightsGeoJson, null, 2));

  // Scar and Debris Polygons in geographic coordinates
  const scarPoly: [number, number][][] = [
    [
      [Number((minLon + (86 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (119 / N) * (maxLat - minLat)).toFixed(6))],
      [Number((minLon + (96 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (110 / N) * (maxLat - minLat)).toFixed(6))],
      [Number((minLon + (106 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (121 / N) * (maxLat - minLat)).toFixed(6))],
      [Number((minLon + (98 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (130 / N) * (maxLat - minLat)).toFixed(6))],
      [Number((minLon + (86 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (119 / N) * (maxLat - minLat)).toFixed(6))],
    ],
  ];

  const debrisPoly: [number, number][][] = [
    [
      [Number((minLon + (78 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (136 / N) * (maxLat - minLat)).toFixed(6))],
      [Number((minLon + (88 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (124 / N) * (maxLat - minLat)).toFixed(6))],
      [Number((minLon + (98 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (142 / N) * (maxLat - minLat)).toFixed(6))],
      [Number((minLon + (86 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (152 / N) * (maxLat - minLat)).toFixed(6))],
      [Number((minLon + (78 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (136 / N) * (maxLat - minLat)).toFixed(6))],
    ],
  ];

  const susceptibilityZones = [
    {
      level: "Very high" as const,
      polygon: [
        [
          [Number((minLon + (80 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (110 / N) * (maxLat - minLat)).toFixed(6))],
          [Number((minLon + (112 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (110 / N) * (maxLat - minLat)).toFixed(6))],
          [Number((minLon + (112 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (145 / N) * (maxLat - minLat)).toFixed(6))],
          [Number((minLon + (80 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (145 / N) * (maxLat - minLat)).toFixed(6))],
          [Number((minLon + (80 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (110 / N) * (maxLat - minLat)).toFixed(6))],
        ],
      ],
    },
    {
      level: "High" as const,
      polygon: [
        [
          [Number((minLon + (70 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (95 / N) * (maxLat - minLat)).toFixed(6))],
          [Number((minLon + (125 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (95 / N) * (maxLat - minLat)).toFixed(6))],
          [Number((minLon + (125 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (160 / N) * (maxLat - minLat)).toFixed(6))],
          [Number((minLon + (70 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (160 / N) * (maxLat - minLat)).toFixed(6))],
          [Number((minLon + (70 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (95 / N) * (maxLat - minLat)).toFixed(6))],
        ],
      ],
    },
    {
      level: "Moderate" as const,
      polygon: [
        [
          [Number((minLon + (55 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (80 / N) * (maxLat - minLat)).toFixed(6))],
          [Number((minLon + (145 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (80 / N) * (maxLat - minLat)).toFixed(6))],
          [Number((minLon + (145 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (180 / N) * (maxLat - minLat)).toFixed(6))],
          [Number((minLon + (55 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (180 / N) * (maxLat - minLat)).toFixed(6))],
          [Number((minLon + (55 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (80 / N) * (maxLat - minLat)).toFixed(6))],
        ],
      ],
    },
  ];

  const predictedScar: [number, number][][] = [
    [
      [Number((minLon + (84 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (115 / N) * (maxLat - minLat)).toFixed(6))],
      [Number((minLon + (98 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (105 / N) * (maxLat - minLat)).toFixed(6))],
      [Number((minLon + (110 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (118 / N) * (maxLat - minLat)).toFixed(6))],
      [Number((minLon + (100 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (132 / N) * (maxLat - minLat)).toFixed(6))],
      [Number((minLon + (84 / N) * (maxLon - minLon)).toFixed(6)), Number((maxLat - (115 / N) * (maxLat - minLat)).toFixed(6))],
    ],
  ];

  const terrainAssets: TerrainAssets = {
    rasterBounds: [
      [minLat, minLon],
      [maxLat, maxLon],
    ],
    elevationBeforeUrl: `/mocks/${relRasterDir}/elevation_before.png`,
    elevationAfterUrl: `/mocks/${relRasterDir}/elevation_after.png`,
    hillshadeBeforeUrl: `/mocks/${relRasterDir}/hillshade_before.png`,
    hillshadeAfterUrl: `/mocks/${relRasterDir}/hillshade_after.png`,
    slopeBeforeUrl: `/mocks/${relRasterDir}/slope_before.png`,
    elevationChangeUrl: `/mocks/${relRasterDir}/elevation_change.png`,
    contoursGeoJson,
    spotHeightsGeoJson,
    legendMetadata: {
      minElevation: Math.round(minZ),
      maxElevation: Math.round(maxZ),
      colorStops: stops.map((s) => ({
        percent: Math.round(s.p * 100),
        color: `#${((1 << 24) + (s.r << 16) + (s.g << 8) + s.b).toString(16).slice(1)}`,
        elevationM: Math.round(minZ + s.p * (maxZ - minZ)),
      })),
      slopeClasses: [
        { label: "Gentle", range: "<15°", color: "#E2E8F0" },
        { label: "Moderate", range: "15–30°", color: "#FDE047" },
        { label: "Steep", range: "30–45°", color: "#FB923C" },
        { label: "Very Steep", range: ">45°", color: "#EF4444" },
      ],
      elevationChangeStops: [
        { label: "Cut (Soil Lost)", color: "#E4604A" },
        { label: "Zero Change", color: "#FFFFFF" },
        { label: "Fill (Debris Deposited)", color: "#2F7FB8" },
      ],
    },
    cutVolumeM3: Math.round(actualCutVol),
    fillVolumeM3: Math.round(actualFillVol),
    soilVolumeM3: Math.round(targetVol),
  };

  const context: ContextCard = {
    type: "landslide",
    minElevationM: Math.round(minZ),
    maxElevationM: Math.round(maxZ),
    meanSlopeDeg: 32.4,
    scarMeanSlopeDeg: 41.8,
    soilVolumeM3: Math.round(targetVol),
    triggerRainfallMm: 248.5,
  };

  return {
    terrainAssets,
    context,
    scarPoly,
    debrisPoly,
    susceptibilityZones,
    predictedScar,
  };
}

// ==========================================
// 9. AREA GENERATORS & ORCHESTRATION
// ==========================================

export interface AreaGenerationResult {
  areas: Record<string, MapArea>;
  mouzas: Mouza[];
  plots: Plot[];
  areaIndex: Record<string, string>;
}

export function generateAllMapAreas(
  outputDirPublic: string,
  outputDirInternal: string,
  allOwners: Owner[]
): AreaGenerationResult {
  const areas: Record<string, MapArea> = {};
  const areaMouzas: Mouza[] = [];
  const areaPlots: Plot[] = [];
  const areaIndex: Record<string, string> = {};

  let plotIdCounter = 100;
  let ownerOffset = 0;

  // Ensure directories exist
  for (const hazard of ["river_erosion", "char", "coastal", "flood", "landslide"]) {
    const pubDir = path.join(outputDirPublic, "areas", hazard);
    const intDir = path.join(outputDirInternal, "areas", hazard);
    if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
    if (!fs.existsSync(intDir)) fs.mkdirSync(intDir, { recursive: true });
  }

  // -------------------------------------------------------------
  // A. RIVER EROSION AREAS
  // -------------------------------------------------------------
  const riverAreaConfigs = [
    {
      areaId: "area_river_kazipur",
      upazilaId: "kazipur",
      districtId: "sirajganj",
      riverId: "jamuna",
      riverName: "Jamuna River",
      bounds: [89.62, 24.54, 89.67, 24.59] as [number, number, number, number],
      names: ["Meghai Mouza", "Natuarpara Mouza", "Gandhail Mouza", "Shubhagachha Mouza", "Tengrakhali Mouza"],
      startJl: 42,
    },
    {
      areaId: "area_river_sirajganj_sadar",
      upazilaId: "sirajganj_sadar",
      districtId: "sirajganj",
      riverId: "jamuna",
      riverName: "Jamuna River",
      bounds: [89.67, 24.42, 89.72, 24.47] as [number, number, number, number],
      names: ["Balia Mouza", "Durgapur Mouza", "Bhairabnagar Mouza", "Kalyanpur Mouza"],
      startJl: 18,
    },
    {
      areaId: "area_river_naria",
      upazilaId: "naria",
      districtId: "shariatpur",
      riverId: "padma",
      riverName: "Padma River",
      bounds: [90.36, 23.27, 90.41, 23.32] as [number, number, number, number],
      names: ["Naria Bazar Mouza", "Panchapalli Mouza", "Joynagar Mouza", "Kedarpur Mouza", "Gharisar Mouza"],
      startJl: 31,
    },
    {
      areaId: "area_river_zajira",
      upazilaId: "zajira",
      districtId: "shariatpur",
      riverId: "padma",
      riverName: "Padma River",
      bounds: [90.19, 23.32, 90.24, 23.37] as [number, number, number, number],
      names: ["Bilaspur Mouza", "Kunderchar Mouza", "Purbanaodoba Mouza", "Mulna Mouza"],
      startJl: 55,
    },
    {
      areaId: "area_river_chilmari",
      upazilaId: "chilmari",
      districtId: "kurigram",
      riverId: "brahmaputra",
      riverName: "Brahmaputra River",
      bounds: [89.64, 25.53, 89.69, 25.58] as [number, number, number, number],
      names: ["Chilmari Ghat Mouza", "Ramna Mouza", "Ashtamir Char Mouza", "Raniganj Mouza", "Nayarhat Mouza"],
      startJl: 22,
    },
    {
      areaId: "area_river_haimchar",
      upazilaId: "haimchar",
      districtId: "chandpur",
      riverId: "meghna",
      riverName: "Meghna River",
      bounds: [90.61, 23.04, 90.66, 23.09] as [number, number, number, number],
      names: ["Haimchar Coastal Mouza", "Char Bhairabi Mouza", "Gazipur Mouza", "Nilkamal Mouza"],
      startJl: 14,
    },
    {
      areaId: "area_river_bhola_sadar",
      upazilaId: "bhola_sadar",
      districtId: "bhola",
      riverId: "meghna",
      riverName: "Meghna River",
      bounds: [90.62, 22.66, 90.67, 22.71] as [number, number, number, number],
      names: ["Ilisha Mouza", "Shibpur Mouza", "Bheduria Mouza", "Rajapur Mouza"],
      startJl: 63,
    },
  ];

  for (const cfg of riverAreaConfigs) {
    const [minLon, minLat, maxLon, maxLat] = cfg.bounds;

    // Bankline points from South to North
    const steps = 14;
    const riverBeforeCoords: [number, number][] = [];
    const riverAfterCoords: [number, number][] = [];
    const riverForecastCoords: [number, number][] = [];

    for (let s = 0; s <= steps; s++) {
      const lat = Number((minLat + (s / steps) * (maxLat - minLat)).toFixed(6));
      const sineVal = Math.sin((s / steps) * Math.PI * 1.5) * 0.003;
      const lonBefore = Number((maxLon - 0.016 + sineVal).toFixed(6));
      const retreat = Number((0.003 + Math.abs(Math.sin(s * 0.7)) * 0.002).toFixed(6));
      const lonAfter = Number((lonBefore - retreat).toFixed(6));
      const lonForecast = Number((lonAfter - retreat * 0.75).toFixed(6));

      riverBeforeCoords.push([lonBefore, lat]);
      riverAfterCoords.push([lonAfter, lat]);
      riverForecastCoords.push([lonForecast, lat]);
    }

    // Partition land into adjacent mouzas
    const inlandLon = Number((minLon + 0.002).toFixed(6));
    const genMouzas = partitionLandIntoAdjacentMouzas(
      cfg.upazilaId,
      cfg.districtId,
      cfg.names,
      cfg.bounds,
      riverAfterCoords,
      inlandLon,
      cfg.names.length,
      cfg.startJl
    );

    // River water polygon (eastern side of bankline)
    const waterPoly: [number, number][][] = [
      [
        ...riverAfterCoords,
        [Number(maxLon.toFixed(6)), riverAfterCoords[riverAfterCoords.length - 1][1]],
        [Number(maxLon.toFixed(6)), riverAfterCoords[0][1]],
        riverAfterCoords[0],
      ],
    ];

    // Basemap
    const basemap = buildBasemapForArea(cfg.bounds, genMouzas, waterPoly, cfg.riverName, false, false);

    // Hazard erosion strip & forecast uncertainty band
    const lossStripCoords: [number, number][] = [
      ...riverBeforeCoords,
      ...riverAfterCoords.slice().reverse(),
      riverBeforeCoords[0],
    ];
    const lossPolygonFeature = turf.polygon([lossStripCoords]);

    const uncertaintyBandCoords: [number, number][] = [
      ...riverAfterCoords,
      ...riverForecastCoords.slice().reverse(),
      riverAfterCoords[0],
    ];
    const forecastLossPolygonFeature = turf.polygon([uncertaintyBandCoords]);

    // Transects
    const transects = [0.25, 0.5, 0.75].map((pct, idx) => {
      const sIdx = Math.floor(steps * pct);
      const retreatDist = randInt(38, 75);
      return {
        id: `transect_${idx + 1}`,
        label: `Transect T-${idx + 1}`,
        start: riverBeforeCoords[sIdx],
        end: riverAfterCoords[sIdx],
        retreatDistanceM: retreatDist,
        widthM: 1420 + idx * 120,
        changeM: retreatDist,
      };
    });

    // Per-mouza summaries and plot generation
    const mouzasRecorded: MouzaSummary[] = [];
    const mouzasForecast: MouzaSummary[] = [];

    for (let mi = 0; mi < genMouzas.length; mi++) {
      const gm = genMouzas[mi];

      // Generate plots for this mouza
      const { plots: mPlots, nextPlotId } = generatePlotsForMouza(
        gm,
        allOwners,
        ownerOffset,
        turf.polygon(waterPoly),
        plotIdCounter
      );
      plotIdCounter = nextPlotId;
      ownerOffset += mPlots.length;
      areaPlots.push(...mPlots);

      // Add to allMouzas
      const mouzaEntity: Mouza = {
        id: gm.id,
        name: gm.name,
        jlNo: gm.jlNo,
        upazilaId: gm.upazilaId,
        districtId: gm.districtId,
        riverId: cfg.riverId,
        kind: "registered",
        isVirtual: false,
        totalPlots: mPlots.length,
        centroid: gm.labelAnchor,
        boundary: gm.polygon[0],
      };
      areaMouzas.push(mouzaEntity);

      // Intersect mouza with erosion strip
      let mLossDec = 0;
      let mFcLossDec = 0;
      try {
        const mPoly = turf.polygon(gm.polygon);
        const isect = turf.intersect(turf.featureCollection([mPoly, lossPolygonFeature]));
        if (isect) {
          mLossDec = Number((turf.area(isect) / 40.4686).toFixed(1));
        }
        const fcIsect = turf.intersect(turf.featureCollection([mPoly, forecastLossPolygonFeature]));
        if (fcIsect) {
          mFcLossDec = Number((turf.area(fcIsect) / 40.4686).toFixed(1));
        }
      } catch (e) {}

      const pctRec = Number(((mLossDec / gm.areaDecimal) * 100).toFixed(1));
      const pctFc = Number(((mFcLossDec / gm.areaDecimal) * 100).toFixed(1));

      mouzasRecorded.push({
        id: gm.id,
        name: gm.name,
        jlNo: gm.jlNo,
        areaDecimal: gm.areaDecimal,
        lossDecimal: mLossDec,
        gainDecimal: 0,
        percent: pctRec,
        labelAnchor: gm.labelAnchor,
        affectedOwnersCount: Math.round(mLossDec * 0.3) + 2,
        polygon: gm.polygon,
      });

      mouzasForecast.push({
        id: gm.id,
        name: gm.name,
        jlNo: gm.jlNo,
        areaDecimal: gm.areaDecimal,
        lossDecimal: mFcLossDec,
        gainDecimal: 0,
        percent: pctFc,
        labelAnchor: gm.labelAnchor,
        affectedOwnersCount: Math.round(mFcLossDec * 0.28) + 2,
        polygon: gm.polygon,
      });

      // Index mapping for fast retrieval
      areaIndex[gm.id] = cfg.areaId;
      areaIndex[`river_erosion_recorded_${gm.id}`] = cfg.areaId;
      areaIndex[`river_erosion_forecast_${gm.id}`] = cfg.areaId;
    }

    areaIndex[cfg.areaId] = cfg.areaId;
    areaIndex[`river_erosion_${cfg.upazilaId}`] = cfg.areaId;

    // Context Card
    const contextRecorded: ContextCard = {
      type: "river_erosion",
      transects: transects.map((t) => ({ label: t.label, widthM: t.widthM, changeM: t.changeM })),
      thalwegShiftM: 38.5,
      meanMigrationRateMYr: 42.0,
      isProjected: false,
    };
    const contextForecast: ContextCard = {
      type: "river_erosion",
      transects: transects.map((t) => ({ label: t.label, widthM: Math.round(t.widthM + t.changeM * 0.8), changeM: Math.round(t.changeM * 0.75) })),
      thalwegShiftM: 29.0,
      meanMigrationRateMYr: 36.5,
      isProjected: true,
    };

    // Bank-line history (2022-2026, stretch goal)
    const historyLines: Array<{ year: number; line: [number, number][] }> = [2022, 2023, 2024, 2025, 2026].map(
      (yr, idx) => ({
        year: yr,
        line: riverBeforeCoords.map(([x, y]) => [
          Number((x - idx * 0.0012).toFixed(6)),
          y,
        ]),
      })
    );

    const areaOwners = generateOwnersForMouzaSummaries(
      mouzasRecorded,
      "river_erosion",
      "recorded",
      cfg.upazilaId,
      cfg.districtId,
      allOwners
    );
    const areaOwnersForecast = generateOwnersForMouzaSummaries(
      mouzasForecast,
      "river_erosion",
      "forecast",
      cfg.upazilaId,
      cfg.districtId,
      allOwners
    );

    const mapArea: MapArea = {
      areaId: cfg.areaId,
      hazard: "river_erosion",
      mode: "recorded",
      bounds: cfg.bounds,
      basemap,
      mouzas: mouzasRecorded,
      hazardLayers: {
        lossStrip: [lossStripCoords],
        transects,
        riverBefore: riverBeforeCoords,
        riverAfter: riverAfterCoords,
        forecastRetreatLine: riverForecastCoords,
        uncertaintyBand: [uncertaintyBandCoords],
      },
      context: contextRecorded,
      historyLines,
      owners: areaOwners,
    };

    // Store mode variants for seamless switching
    (mapArea as any).mouzasRecorded = mouzasRecorded;
    (mapArea as any).mouzasForecast = mouzasForecast;
    (mapArea as any).contextRecorded = contextRecorded;
    (mapArea as any).contextForecast = contextForecast;
    (mapArea as any).ownersForecast = areaOwnersForecast;
    (mapArea as any).hazardLayersRecorded = mapArea.hazardLayers;
    (mapArea as any).hazardLayersForecast = {
      ...mapArea.hazardLayers,
      forecastLine: riverForecastCoords,
      uncertaintyBand: [uncertaintyBandCoords],
    };

    areas[cfg.areaId] = mapArea;

    // Write JSON file to public and internal directories
    const areaJsonStr = JSON.stringify(mapArea, null, 2);
    fs.writeFileSync(path.join(outputDirPublic, "areas", "river_erosion", `${cfg.areaId}.json`), areaJsonStr);
    fs.writeFileSync(path.join(outputDirInternal, "areas", "river_erosion", `${cfg.areaId}.json`), areaJsonStr);
  }

  // -------------------------------------------------------------
  // B. CHAR AREAS
  // -------------------------------------------------------------
  const charAreaConfigs = [
    {
      areaId: "area_char_kazipur",
      upazilaId: "kazipur",
      districtId: "sirajganj",
      charId: "char_girish",
      charIds: ["char_kazipur_1", "char_kazipur_2", "char_sirajganj_sadar_1", "char_girish"],
      bounds: [89.63, 24.56, 89.68, 24.61] as [number, number, number, number],
      names: ["Char Girish Mouza", "Mansurnagar Mouza", "Tekani Mouza", "Khasrajbari Mouza"],
      startJl: 70,
    },
    {
      areaId: "area_char_chilmari",
      upazilaId: "chilmari",
      districtId: "kurigram",
      charId: "char_chilmari",
      charIds: ["char_chilmari_1", "char_ulipur_1", "char_ulipur_2", "char_chilmari"],
      bounds: [89.66, 25.54, 89.71, 25.59] as [number, number, number, number],
      names: ["Char Chilmari Mouza", "Boalmari Mouza", "Shakhahati Mouza", "Narchhar Mouza"],
      startJl: 81,
    },
    {
      areaId: "area_char_naria",
      upazilaId: "naria",
      districtId: "shariatpur",
      charId: "char_naria",
      charIds: ["char_naria_1", "char_zajira_1", "char_bhedarganj_1", "char_bhedarganj_2", "char_naria"],
      bounds: [90.38, 23.29, 90.43, 23.34] as [number, number, number, number],
      names: ["Char Naria Mouza", "Padma Island Sector 1", "Padma Island Sector 2", "Padma Khas Sandbar"],
      startJl: 60,
    },
    {
      areaId: "area_char_haimchar",
      upazilaId: "haimchar",
      districtId: "chandpur",
      charId: "char_haimchar",
      charIds: ["char_haimchar_1", "char_chandpur_sadar_1", "char_chandpur_sadar_2", "char_haimchar"],
      bounds: [90.63, 23.06, 90.68, 23.11] as [number, number, number, number],
      names: ["Meghna Sandbar Mouza", "Char Nilkamal Mouza", "Char Gazipur Mouza", "Meghna Khas Island"],
      startJl: 75,
    },
    {
      areaId: "area_char_hatiya",
      upazilaId: "hatiya",
      districtId: "noakhali",
      charId: "char_hatiya",
      charIds: [
        "char_char_fasson_1",
        "char_char_fasson_2",
        "char_bhola_sadar_1",
        "char_monpura_1",
        "char_monpura_2",
        "char_hatiya_1",
        "char_subarnachar_1",
        "char_subarnachar_2",
        "char_hatiya",
      ],
      bounds: [91.08, 22.35, 91.13, 22.40] as [number, number, number, number],
      names: ["Bhasan Sector Mouza", "Nijhum Sandbar Mouza", "Hatiya Island North", "Hatiya Khas"],
      startJl: 90,
    },
  ];

  for (const cfg of charAreaConfigs) {
    const [minLon, minLat, maxLon, maxLat] = cfg.bounds;

    const riverBankCoords: [number, number][] = [];
    for (let s = 0; s <= 10; s++) {
      const lat = minLat + (s / 10) * (maxLat - minLat);
      riverBankCoords.push([maxLon - 0.015, lat]);
    }

    const genMouzas = partitionLandIntoAdjacentMouzas(
      cfg.upazilaId,
      cfg.districtId,
      cfg.names,
      cfg.bounds,
      riverBankCoords,
      minLon + 0.002,
      cfg.names.length,
      cfg.startJl
    );

    const waterPoly: [number, number][][] = [
      [
        [Number((maxLon - 0.018).toFixed(6)), Number(minLat.toFixed(6))],
        [Number(maxLon.toFixed(6)), Number(minLat.toFixed(6))],
        [Number(maxLon.toFixed(6)), Number(maxLat.toFixed(6))],
        [Number((maxLon - 0.018).toFixed(6)), Number(maxLat.toFixed(6))],
        [Number((maxLon - 0.018).toFixed(6)), Number(minLat.toFixed(6))],
      ],
    ];

    const basemap = buildBasemapForArea(cfg.bounds, genMouzas, waterPoly, "Braided Channels", false, false);

    const mouzasRecorded: MouzaSummary[] = [];
    const mouzasForecast: MouzaSummary[] = [];

    for (let mi = 0; mi < genMouzas.length; mi++) {
      const gm = genMouzas[mi];
      const { plots: mPlots, nextPlotId } = generatePlotsForMouza(
        gm,
        allOwners,
        ownerOffset,
        turf.polygon(waterPoly),
        plotIdCounter
      );
      plotIdCounter = nextPlotId;
      ownerOffset += mPlots.length;
      areaPlots.push(...mPlots);

      areaMouzas.push({
        id: gm.id,
        name: gm.name,
        jlNo: gm.jlNo,
        upazilaId: gm.upazilaId,
        districtId: gm.districtId,
        kind: "registered",
        isVirtual: false,
        totalPlots: mPlots.length,
        centroid: gm.labelAnchor,
        boundary: gm.polygon[0],
      });

      const lossDec = mi === 0 ? 112.5 : randFloat(15, 45);
      const gainDec = mi === 0 ? 168.0 : randFloat(25, 80);

      mouzasRecorded.push({
        id: gm.id,
        name: gm.name,
        jlNo: gm.jlNo,
        areaDecimal: gm.areaDecimal,
        lossDecimal: lossDec,
        gainDecimal: gainDec,
        percent: Number((((lossDec + gainDec) / gm.areaDecimal) * 100).toFixed(1)),
        labelAnchor: gm.labelAnchor,
        affectedOwnersCount: randInt(8, 22),
        polygon: gm.polygon,
      });

      mouzasForecast.push({
        id: gm.id,
        name: gm.name,
        jlNo: gm.jlNo,
        areaDecimal: gm.areaDecimal,
        lossDecimal: Math.round(lossDec * 0.85),
        gainDecimal: Math.round(gainDec * 1.15),
        percent: Number((((lossDec + gainDec) / gm.areaDecimal) * 100).toFixed(1)),
        labelAnchor: gm.labelAnchor,
        affectedOwnersCount: randInt(8, 22),
        polygon: gm.polygon,
      });

      areaIndex[gm.id] = cfg.areaId;
      areaIndex[`char_recorded_${gm.id}`] = cfg.areaId;
      areaIndex[`char_forecast_${gm.id}`] = cfg.areaId;
    }

    areaIndex[cfg.areaId] = cfg.areaId;
    for (const cid of (cfg.charIds || [cfg.charId])) {
      areaIndex[cid] = cfg.areaId;
      areaIndex[`char_recorded_${cid}`] = cfg.areaId;
      areaIndex[`char_forecast_${cid}`] = cfg.areaId;
    }

    const contextRecorded: ContextCard = {
      type: "char",
      activeChannelWidthM: 2150,
      charAreaCurrentDec: 420.5,
      charAreaPreviousDec: 388.2,
      netChangeDec: 32.3,
      isProjected: false,
    };
    const contextForecast: ContextCard = {
      type: "char",
      activeChannelWidthM: 2280,
      charAreaCurrentDec: 465.0,
      charAreaPreviousDec: 420.5,
      netChangeDec: 44.5,
      isProjected: true,
    };

    const areaOwners = generateOwnersForMouzaSummaries(
      mouzasRecorded,
      "char",
      "recorded",
      cfg.upazilaId,
      cfg.districtId,
      allOwners
    );
    const areaOwnersForecast = generateOwnersForMouzaSummaries(
      mouzasForecast,
      "char",
      "forecast",
      cfg.upazilaId,
      cfg.districtId,
      allOwners
    );

    const mapArea: MapArea = {
      areaId: cfg.areaId,
      hazard: "char",
      mode: "recorded",
      bounds: cfg.bounds,
      basemap,
      mouzas: mouzasRecorded,
      hazardLayers: {
        islands: [waterPoly],
        accretionTips: [waterPoly],
        erosionFlanks: [waterPoly],
        unownedKhasLand: [waterPoly],
      },
      context: contextRecorded,
      owners: areaOwners,
    };

    (mapArea as any).mouzasRecorded = mouzasRecorded;
    (mapArea as any).mouzasForecast = mouzasForecast;
    (mapArea as any).contextRecorded = contextRecorded;
    (mapArea as any).contextForecast = contextForecast;
    (mapArea as any).ownersForecast = areaOwnersForecast;

    areas[cfg.areaId] = mapArea;
    const jsonStr = JSON.stringify(mapArea, null, 2);
    fs.writeFileSync(path.join(outputDirPublic, "areas", "char", `${cfg.areaId}.json`), jsonStr);
    fs.writeFileSync(path.join(outputDirInternal, "areas", "char", `${cfg.areaId}.json`), jsonStr);
  }

  // -------------------------------------------------------------
  // C. COASTAL AREAS
  // -------------------------------------------------------------
  const coastalAreaConfigs = [
    {
      areaId: "area_coastal_char_fasson",
      upazilaId: "char_fasson",
      districtId: "bhola",
      bounds: [90.68, 22.16, 90.73, 22.21] as [number, number, number, number],
      names: ["Dhal Char Mouza", "Kukri Mukri Mouza", "Char Manika Mouza", "Aslampur Mouza", "Unassigned Coastal Sector"],
      startJl: 51,
    },
    {
      areaId: "area_coastal_monpura",
      upazilaId: "monpura",
      districtId: "bhola",
      bounds: [90.94, 22.27, 90.99, 22.32] as [number, number, number, number],
      names: ["Monpura South Mouza", "Hajirhat Mouza", "Sakuchia Mouza", "Monpura Offshore Mudflat"],
      startJl: 44,
    },
    {
      areaId: "area_coastal_hatiya",
      upazilaId: "hatiya",
      districtId: "noakhali",
      bounds: [91.07, 22.34, 91.12, 22.39] as [number, number, number, number],
      names: ["Tamaraddi Mouza", "Sonadia Mouza", "Jahajmara Mouza", "Burirchar Mouza", "Hatiya Estuary Shoal"],
      startJl: 33,
    },
    {
      areaId: "area_coastal_subarnachar",
      upazilaId: "subarnachar",
      districtId: "noakhali",
      bounds: [91.10, 22.65, 91.15, 22.70] as [number, number, number, number],
      names: ["Char Jabbar Mouza", "Char Bata Mouza", "Char Clerk Mouza", "Subarnachar Shore"],
      startJl: 62,
    },
    {
      areaId: "area_coastal_koyra",
      upazilaId: "koyra",
      districtId: "khulna",
      bounds: [89.27, 22.31, 89.32, 22.36] as [number, number, number, number],
      names: ["Amadi Mouza", "Bagali Mouza", "Uttar Bedkashi Mouza", "Dakshin Bedkashi Mouza"],
      startJl: 27,
    },
    {
      areaId: "area_coastal_teknaf",
      upazilaId: "teknaf",
      districtId: "coxs_bazar",
      bounds: [92.27, 20.84, 92.32, 20.89] as [number, number, number, number],
      names: ["Sabrang Mouza", "Baharchhara Mouza", "Saint Martin Coast", "Teknaf Beachhead"],
      startJl: 19,
    },
  ];

  for (const cfg of coastalAreaConfigs) {
    const [minLon, minLat, maxLon, maxLat] = cfg.bounds;

    const shorelineCoords: [number, number][] = [];
    for (let s = 0; s <= 10; s++) {
      const lat = minLat + (s / 10) * (maxLat - minLat);
      shorelineCoords.push([maxLon - 0.016, lat]);
    }

    const genMouzas = partitionLandIntoAdjacentMouzas(
      cfg.upazilaId,
      cfg.districtId,
      cfg.names,
      cfg.bounds,
      shorelineCoords,
      minLon + 0.002,
      cfg.names.length,
      cfg.startJl
    );

    const waterPoly: [number, number][][] = [
      [
        [Number((maxLon - 0.018).toFixed(6)), Number(minLat.toFixed(6))],
        [Number(maxLon.toFixed(6)), Number(minLat.toFixed(6))],
        [Number(maxLon.toFixed(6)), Number(maxLat.toFixed(6))],
        [Number((maxLon - 0.018).toFixed(6)), Number(maxLat.toFixed(6))],
        [Number((maxLon - 0.018).toFixed(6)), Number(minLat.toFixed(6))],
      ],
    ];

    const basemap = buildBasemapForArea(cfg.bounds, genMouzas, waterPoly, "Bay of Bengal", true, false);

    const mouzasRecorded: MouzaSummary[] = [];
    const mouzasForecast: MouzaSummary[] = [];

    for (let mi = 0; mi < genMouzas.length; mi++) {
      const gm = genMouzas[mi];
      const { plots: mPlots, nextPlotId } = generatePlotsForMouza(
        gm,
        allOwners,
        ownerOffset,
        turf.polygon(waterPoly),
        plotIdCounter
      );
      plotIdCounter = nextPlotId;
      ownerOffset += mPlots.length;
      areaPlots.push(...mPlots);

      areaMouzas.push({
        id: gm.id,
        name: gm.name,
        jlNo: gm.jlNo,
        upazilaId: gm.upazilaId,
        districtId: gm.districtId,
        kind: gm.name.includes("Unassigned") ? "unassigned" : "registered",
        isVirtual: gm.name.includes("Unassigned"),
        totalPlots: mPlots.length,
        centroid: gm.labelAnchor,
        boundary: gm.polygon[0],
      });

      const lossDec = randFloat(20, 65);
      const gainDec = randFloat(35, 120);

      mouzasRecorded.push({
        id: gm.id,
        name: gm.name,
        jlNo: gm.jlNo,
        areaDecimal: gm.areaDecimal,
        lossDecimal: lossDec,
        gainDecimal: gainDec,
        percent: Number((((lossDec + gainDec) / gm.areaDecimal) * 100).toFixed(1)),
        labelAnchor: gm.labelAnchor,
        affectedOwnersCount: randInt(10, 24),
        polygon: gm.polygon,
      });

      mouzasForecast.push({
        id: gm.id,
        name: gm.name,
        jlNo: gm.jlNo,
        areaDecimal: gm.areaDecimal,
        lossDecimal: Math.round(lossDec * 0.9),
        gainDecimal: Math.round(gainDec * 1.1),
        percent: Number((((lossDec + gainDec) / gm.areaDecimal) * 100).toFixed(1)),
        labelAnchor: gm.labelAnchor,
        affectedOwnersCount: randInt(10, 24),
        polygon: gm.polygon,
      });

      areaIndex[gm.id] = cfg.areaId;
      areaIndex[`coastal_recorded_${gm.id}`] = cfg.areaId;
      areaIndex[`coastal_forecast_${gm.id}`] = cfg.areaId;
    }

    areaIndex[cfg.areaId] = cfg.areaId;

    const contextRecorded: ContextCard = {
      type: "coastal",
      shorelineChangeMYr: -34.5,
      tidalFlatAreaDec: 840.5,
      tidalRangeM: 3.2,
      netLandChangeDec: 125.4,
      isProjected: false,
    };
    const contextForecast: ContextCard = {
      type: "coastal",
      shorelineChangeMYr: -31.0,
      tidalFlatAreaDec: 890.0,
      tidalRangeM: 3.4,
      netLandChangeDec: 142.0,
      isProjected: true,
    };

    const historyLines: Array<{ year: number; line: [number, number][] }> = [2022, 2023, 2024, 2025, 2026].map(
      (yr, idx) => ({
        year: yr,
        line: shorelineCoords.map(([x, y]) => [
          Number((x - idx * 0.001).toFixed(6)),
          y,
        ]),
      })
    );

    const areaOwners = generateOwnersForMouzaSummaries(
      mouzasRecorded,
      "coastal",
      "recorded",
      cfg.upazilaId,
      cfg.districtId,
      allOwners
    );
    const areaOwnersForecast = generateOwnersForMouzaSummaries(
      mouzasForecast,
      "coastal",
      "forecast",
      cfg.upazilaId,
      cfg.districtId,
      allOwners
    );

    const mapArea: MapArea = {
      areaId: cfg.areaId,
      hazard: "coastal",
      mode: "recorded",
      bounds: cfg.bounds,
      basemap,
      mouzas: mouzasRecorded,
      hazardLayers: {
        shoreline: shorelineCoords,
        bathymetryBands: [],
        mudflats: [waterPoly],
        mangrove: [waterPoly],
      },
      context: contextRecorded,
      historyLines,
      owners: areaOwners,
    };

    (mapArea as any).mouzasRecorded = mouzasRecorded;
    (mapArea as any).mouzasForecast = mouzasForecast;
    (mapArea as any).contextRecorded = contextRecorded;
    (mapArea as any).contextForecast = contextForecast;
    (mapArea as any).ownersForecast = areaOwnersForecast;

    areas[cfg.areaId] = mapArea;
    const jsonStr = JSON.stringify(mapArea, null, 2);
    fs.writeFileSync(path.join(outputDirPublic, "areas", "coastal", `${cfg.areaId}.json`), jsonStr);
    fs.writeFileSync(path.join(outputDirInternal, "areas", "coastal", `${cfg.areaId}.json`), jsonStr);
  }

  // -------------------------------------------------------------
  // D. FLOOD AREAS
  // -------------------------------------------------------------
  const floodAreaConfigs = [
    {
      areaId: "area_flood_gowainghat",
      upazilaId: "gowainghat",
      districtId: "sylhet",
      bounds: [91.97, 25.10, 92.03, 25.15] as [number, number, number, number],
      names: ["Jaflong Mouza", "Rustampur Mouza", "Lengura Mouza", "Fatehpur Mouza", "Alirgaon Mouza"],
      startJl: 15,
    },
    {
      areaId: "area_flood_companiganj",
      upazilaId: "companiganj",
      districtId: "sylhet",
      bounds: [91.72, 25.05, 91.78, 25.10] as [number, number, number, number],
      names: ["Bholaganj Mouza", "Islampur Mouza", "Ranikhai Mouza", "Telikhal Mouza"],
      startJl: 28,
    },
    {
      areaId: "area_flood_sunamganj_sadar",
      upazilaId: "sunamganj_sadar",
      districtId: "sunamganj",
      bounds: [91.37, 25.04, 91.43, 25.09] as [number, number, number, number],
      names: ["Mohanpur Mouza", "Surma Basin Mouza", "Rangarchar Mouza", "Gaurarang Mouza"],
      startJl: 37,
    },
    {
      areaId: "area_flood_derai",
      upazilaId: "derai",
      districtId: "sunamganj",
      bounds: [91.32, 24.75, 91.38, 24.80] as [number, number, number, number],
      names: ["Derai Sadar Mouza", "Karimpur Mouza", "Jagadal Mouza", "Bhatipara Mouza"],
      startJl: 49,
    },
    {
      areaId: "area_flood_tahirpur",
      upazilaId: "tahirpur",
      districtId: "sunamganj",
      bounds: [91.15, 25.07, 91.21, 25.12] as [number, number, number, number],
      names: ["Tahirpur Haor Mouza", "Badaghat Mouza", "Uttar Sreepur Mouza", "Dakshin Sreepur Mouza"],
      startJl: 65,
    },
    {
      areaId: "area_flood_chilmari",
      upazilaId: "chilmari",
      districtId: "kurigram",
      bounds: [89.64, 25.53, 89.70, 25.58] as [number, number, number, number],
      names: ["Chilmari Haor Mouza", "Ramna Floodplain Mouza", "Raniganj Lowland", "Nayarhat Basin"],
      startJl: 18,
    },
  ];

  for (const cfg of floodAreaConfigs) {
    const [minLon, minLat, maxLon, maxLat] = cfg.bounds;

    const riverBankCoords: [number, number][] = [];
    for (let s = 0; s <= 10; s++) {
      const lat = minLat + (s / 10) * (maxLat - minLat);
      riverBankCoords.push([maxLon - 0.012, lat]);
    }

    const genMouzas = partitionLandIntoAdjacentMouzas(
      cfg.upazilaId,
      cfg.districtId,
      cfg.names,
      cfg.bounds,
      riverBankCoords,
      minLon + 0.002,
      cfg.names.length,
      cfg.startJl
    );

    const waterPoly: [number, number][][] = [
      [
        [Number((maxLon - 0.014).toFixed(6)), Number(minLat.toFixed(6))],
        [Number(maxLon.toFixed(6)), Number(minLat.toFixed(6))],
        [Number(maxLon.toFixed(6)), Number(maxLat.toFixed(6))],
        [Number((maxLon - 0.014).toFixed(6)), Number(maxLat.toFixed(6))],
        [Number((maxLon - 0.014).toFixed(6)), Number(minLat.toFixed(6))],
      ],
    ];

    const basemap = buildBasemapForArea(cfg.bounds, genMouzas, waterPoly, "Surma Basin", false, false);

    const mouzasSummary: MouzaSummary[] = [];
    const floodOwnersWithColor: Array<OwnerRecord & { colorIndex: number }> = [];

    for (let mi = 0; mi < genMouzas.length; mi++) {
      const gm = genMouzas[mi];
      const { plots: mPlots, nextPlotId } = generatePlotsForMouza(
        gm,
        allOwners,
        ownerOffset,
        turf.polygon(waterPoly),
        plotIdCounter
      );
      plotIdCounter = nextPlotId;
      ownerOffset += mPlots.length;
      areaPlots.push(...mPlots);

      areaMouzas.push({
        id: gm.id,
        name: gm.name,
        jlNo: gm.jlNo,
        upazilaId: gm.upazilaId,
        districtId: gm.districtId,
        kind: "registered",
        isVirtual: false,
        totalPlots: mPlots.length,
        centroid: gm.labelAnchor,
        boundary: gm.polygon[0],
      });

      const mouzaFloodOwners: Array<OwnerRecord & { colorIndex: number }> = [];
      const numAffectedPlots = Math.min(mPlots.length, randInt(8, 14));
      for (let pIdx = 0; pIdx < numAffectedPlots; pIdx++) {
        const pl = mPlots[pIdx];
        const colorIdx = pIdx % 12;
        const ownerObj = allOwners.find((o) => o.id === pl.ownerId);
        const fArea = randFloat(pl.areaDecimal * 0.4, pl.areaDecimal, 1);

        const ownerRec = {
          id: `fl_owner_${pl.id}`,
          name: ownerObj?.name || `Flood Resident ${pIdx + 1}`,
          dagNo: pl.dagNo,
          khatianNo: pl.khatianNo,
          plotNo: pl.dagNo,
          mouzaId: gm.id,
          upazilaId: gm.upazilaId,
          districtId: gm.districtId,
          hazard: "flood" as const,
          landClass: pl.landClass,
          changeKind: "loss" as const,
          lossDecimal: fArea,
          gainDecimal: 0,
          estimatedCompensationBDT: Math.round(fArea * 12000),
          isUnownedOrKhas: false,
          coordinates: [pl.corners[0].lon, pl.corners[0].lat] as [number, number],
          colorIndex: colorIdx,
        };
        mouzaFloodOwners.push(ownerRec);
        floodOwnersWithColor.push(ownerRec);
      }

      const fLoss = Number(mouzaFloodOwners.reduce((s, o) => s + o.lossDecimal, 0).toFixed(1));
      mouzasSummary.push({
        id: gm.id,
        name: gm.name,
        jlNo: gm.jlNo,
        areaDecimal: gm.areaDecimal,
        lossDecimal: fLoss,
        gainDecimal: 0,
        percent: Number(((fLoss / gm.areaDecimal) * 100).toFixed(1)),
        labelAnchor: gm.labelAnchor,
        affectedOwnersCount: mouzaFloodOwners.length,
        polygon: gm.polygon,
      });

      areaIndex[gm.id] = cfg.areaId;
      areaIndex[`flood_${gm.id}`] = cfg.areaId;
    }

    areaIndex[cfg.areaId] = cfg.areaId;

    const context: ContextCard = {
      type: "flood",
      peakWaterLevelDiffM: 1.45,
      durationDays: 14,
      percentFlooded: 68.5,
    };

    const mapArea: MapArea = {
      areaId: cfg.areaId,
      hazard: "flood",
      mode: "recorded",
      bounds: cfg.bounds,
      basemap,
      mouzas: mouzasSummary,
      hazardLayers: {
        shallowZone: [waterPoly],
        moderateZone: [waterPoly],
        deepZone: [waterPoly],
      },
      context,
      owners: floodOwnersWithColor,
    };

    areas[cfg.areaId] = mapArea;
    const jsonStr = JSON.stringify(mapArea, null, 2);
    fs.writeFileSync(path.join(outputDirPublic, "areas", "flood", `${cfg.areaId}.json`), jsonStr);
    fs.writeFileSync(path.join(outputDirInternal, "areas", "flood", `${cfg.areaId}.json`), jsonStr);
  }

  // -------------------------------------------------------------
  // E. LANDSLIDE HILL AREAS
  // -------------------------------------------------------------
  const landslideAreaConfigs = [
    {
      areaId: "area_landslide_kawkhali_ghagra",
      upazilaId: "kawkhali",
      districtId: "rangamati",
      hillId: "ghagra",
      bounds: [92.01, 22.54, 92.05, 22.58] as [number, number, number, number],
      names: ["Ghagra Hill Mouza", "Betbunia Valley Mouza", "Kawkhali Ridge Mouza"],
      targetSoilVol: 485000,
      startJl: 11,
    },
    {
      areaId: "area_landslide_rangamati_furamon",
      upazilaId: "rangamati_sadar",
      districtId: "rangamati",
      hillId: "furamon",
      bounds: [92.16, 22.63, 92.20, 22.67] as [number, number, number, number],
      names: ["Furamon Peak Mouza", "Vedvedi East Mouza", "Sapchhari Mouza"],
      targetSoilVol: 520000,
      startJl: 24,
    },
    {
      areaId: "area_landslide_rangamati_vedvedi",
      upazilaId: "rangamati_sadar",
      districtId: "rangamati",
      hillId: "vedvedi",
      bounds: [92.17, 22.64, 92.21, 22.68] as [number, number, number, number],
      names: ["Vedvedi Urban Mouza", "Tabalchhari Mouza", "Manikchhari Mouza"],
      targetSoilVol: 390000,
      startJl: 35,
    },
    {
      areaId: "area_landslide_bandarban_chimbuk",
      upazilaId: "bandarban_sadar",
      districtId: "bandarban",
      hillId: "chimbuk",
      bounds: [92.20, 22.18, 92.24, 22.22] as [number, number, number, number],
      names: ["Chimbuk Crest Mouza", "Suwalok Mouza", "Kuhalong Mouza"],
      targetSoilVol: 610000,
      startJl: 42,
    },
    {
      areaId: "area_landslide_bandarban_nilgiri",
      upazilaId: "bandarban_sadar",
      districtId: "bandarban",
      hillId: "nilgiri",
      bounds: [92.21, 22.19, 92.25, 22.23] as [number, number, number, number],
      names: ["Nilgiri Plateau Mouza", "Ruma Trail Mouza", "Thanchi Ridge Mouza"],
      targetSoilVol: 580000,
      startJl: 56,
    },
    {
      areaId: "area_landslide_coxs_bazar_himchari",
      upazilaId: "coxs_bazar_sadar",
      districtId: "coxs_bazar",
      hillId: "himchari",
      bounds: [91.96, 21.41, 92.00, 21.45] as [number, number, number, number],
      names: ["Himchari Escarpment Mouza", "Darianagar Mouza", "Kolatoli Ridge Mouza"],
      targetSoilVol: 440000,
      startJl: 68,
    },
  ];

  for (const cfg of landslideAreaConfigs) {
    const [minLon, minLat, maxLon, maxLat] = cfg.bounds;

    const streamLineCoords: [number, number][] = [];
    for (let s = 0; s <= 10; s++) {
      const lat = minLat + (s / 10) * (maxLat - minLat);
      streamLineCoords.push([maxLon - 0.012, lat]);
    }

    const genMouzas = partitionLandIntoAdjacentMouzas(
      cfg.upazilaId,
      cfg.districtId,
      cfg.names,
      cfg.bounds,
      streamLineCoords,
      minLon + 0.002,
      cfg.names.length,
      cfg.startJl
    );

    const waterPoly: [number, number][][] = [
      [
        [Number((maxLon - 0.014).toFixed(6)), Number(minLat.toFixed(6))],
        [Number(maxLon.toFixed(6)), Number(minLat.toFixed(6))],
        [Number(maxLon.toFixed(6)), Number(maxLat.toFixed(6))],
        [Number((maxLon - 0.014).toFixed(6)), Number(maxLat.toFixed(6))],
        [Number((maxLon - 0.014).toFixed(6)), Number(minLat.toFixed(6))],
      ],
    ];

    const basemap = buildBasemapForArea(cfg.bounds, genMouzas, waterPoly, "Mountain Torrent", false, true);

    // Generate DEM & Rasters
    const terrain = generateLandslideTerrain(
      cfg.areaId,
      cfg.bounds,
      cfg.targetSoilVol,
      outputDirPublic,
      outputDirInternal
    );

    const mouzasRecorded: MouzaSummary[] = [];
    const mouzasForecast: MouzaSummary[] = [];

    for (let mi = 0; mi < genMouzas.length; mi++) {
      const gm = genMouzas[mi];
      const { plots: mPlots, nextPlotId } = generatePlotsForMouza(
        gm,
        allOwners,
        ownerOffset,
        turf.polygon(waterPoly),
        plotIdCounter
      );
      plotIdCounter = nextPlotId;
      ownerOffset += mPlots.length;
      areaPlots.push(...mPlots);

      areaMouzas.push({
        id: gm.id,
        name: gm.name,
        jlNo: gm.jlNo,
        upazilaId: gm.upazilaId,
        districtId: gm.districtId,
        kind: "registered",
        isVirtual: false,
        totalPlots: mPlots.length,
        centroid: gm.labelAnchor,
        boundary: gm.polygon[0],
      });

      const lossDec = mi === 0 ? 84.5 : randFloat(12, 35);
      mouzasRecorded.push({
        id: gm.id,
        name: gm.name,
        jlNo: gm.jlNo,
        areaDecimal: gm.areaDecimal,
        lossDecimal: lossDec,
        gainDecimal: 0,
        percent: Number(((lossDec / gm.areaDecimal) * 100).toFixed(1)),
        labelAnchor: gm.labelAnchor,
        affectedOwnersCount: randInt(6, 16),
        polygon: gm.polygon,
      });

      mouzasForecast.push({
        id: gm.id,
        name: gm.name,
        jlNo: gm.jlNo,
        areaDecimal: gm.areaDecimal,
        lossDecimal: Math.round(lossDec * 0.9),
        gainDecimal: 0,
        percent: Number(((lossDec / gm.areaDecimal) * 100).toFixed(1)),
        labelAnchor: gm.labelAnchor,
        affectedOwnersCount: randInt(6, 16),
        polygon: gm.polygon,
      });

      areaIndex[gm.id] = cfg.areaId;
      areaIndex[`landslide_recorded_${gm.id}`] = cfg.areaId;
      areaIndex[`landslide_forecast_${gm.id}`] = cfg.areaId;
    }

    areaIndex[cfg.areaId] = cfg.areaId;
    areaIndex[cfg.hillId] = cfg.areaId;
    areaIndex[`landslide_recorded_${cfg.hillId}`] = cfg.areaId;
    areaIndex[`landslide_forecast_${cfg.hillId}`] = cfg.areaId;

    const areaOwners = generateOwnersForMouzaSummaries(
      mouzasRecorded,
      "landslide",
      "recorded",
      cfg.upazilaId,
      cfg.districtId,
      allOwners
    );
    const areaOwnersForecast = generateOwnersForMouzaSummaries(
      mouzasForecast,
      "landslide",
      "forecast",
      cfg.upazilaId,
      cfg.districtId,
      allOwners
    );

    const mapArea: MapArea = {
      areaId: cfg.areaId,
      hazard: "landslide",
      mode: "recorded",
      bounds: cfg.bounds,
      basemap,
      mouzas: mouzasRecorded,
      hazardLayers: {
        scar: terrain.scarPoly,
        debrisRunout: terrain.debrisPoly,
        susceptibilityZones: terrain.susceptibilityZones,
        predictedScar: terrain.predictedScar,
      },
      context: terrain.context,
      terrain: terrain.terrainAssets,
      owners: areaOwners,
    };

    (mapArea as any).mouzasRecorded = mouzasRecorded;
    (mapArea as any).mouzasForecast = mouzasForecast;
    (mapArea as any).ownersForecast = areaOwnersForecast;

    areas[cfg.areaId] = mapArea;
    const jsonStr = JSON.stringify(mapArea, null, 2);
    fs.writeFileSync(path.join(outputDirPublic, "areas", "landslide", `${cfg.areaId}.json`), jsonStr);
    fs.writeFileSync(path.join(outputDirInternal, "areas", "landslide", `${cfg.areaId}.json`), jsonStr);
  }

  // Save areas_index.json to both public and internal mocks
  const indexJsonStr = JSON.stringify(areaIndex, null, 2);
  fs.writeFileSync(path.join(outputDirPublic, "areas_index.json"), indexJsonStr);
  fs.writeFileSync(path.join(outputDirInternal, "areas_index.json"), indexJsonStr);

  return {
    areas,
    mouzas: areaMouzas,
    plots: areaPlots,
    areaIndex,
  };
}
