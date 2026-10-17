import {
  CharIsland,
  DashboardSummary,
  DataMode,
  District,
  FloodEvent,
  FloodPlotStatus,
  HazardResult,
  HazardType,
  Hill,
  Mouza,
  OwnerRecord,
  River,
  Upazila,
  SelectorOption,
  OwnerProfile,
  Plot,
  Corner,
  MapArea,
  Basemap,
  MouzaSummary,
  ContextCard,
  TerrainAssets,
} from "./types";

export type { OwnerProfile, Corner, MapArea, Basemap, MouzaSummary, ContextCard, TerrainAssets } from "./types";
import { getEventsForMountain } from "./landslideEvents";

// Artificial delay of 200-350ms to demonstrate realistic loading skeletons
const delay = (ms: number = 240) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Lazy-loaded cache holders
let commonDataCache: any = null;
let riverErosionCache: any = null;
let floodCache: any = null;
let landslideCache: any = null;
let charCache: any = null;
let coastalCache: any = null;
let ownersCache: any = null;
let plotsCache: any = null;
let mouzasCache: Mouza[] | null = null;

async function loadMockJson<T>(filename: string): Promise<T> {
  if (typeof window !== "undefined") {
    const res = await fetch(`/mocks/${filename}`);
    if (!res.ok) {
      throw new Error(`Failed to load mock data: /mocks/${filename}`);
    }
    return (await res.json()) as T;
  } else {
    const req = typeof (globalThis as any).__non_webpack_require__ !== "undefined"
      ? (globalThis as any).__non_webpack_require__
      : eval("require");
    const fs = req("fs");
    const path = req("path");
    const p = path.join(process.cwd(), "mocks", filename);
    const content = fs.readFileSync(p, "utf-8");
    return JSON.parse(content) as T;
  }
}

async function getCommonData() {
  if (!commonDataCache) {
    commonDataCache = await loadMockJson<any>("common.json");
  }
  return commonDataCache;
}

async function getRiverErosionData() {
  if (!riverErosionCache) {
    riverErosionCache = await loadMockJson<any>("river_erosion.json");
  }
  return riverErosionCache;
}

async function getFloodData() {
  if (!floodCache) {
    floodCache = await loadMockJson<any>("flood.json");
  }
  return floodCache;
}

async function getLandslideData() {
  if (!landslideCache) {
    landslideCache = await loadMockJson<any>("landslide.json");
  }
  return landslideCache;
}

async function getCharData() {
  if (!charCache) {
    charCache = await loadMockJson<any>("char.json");
  }
  return charCache;
}

async function getCoastalData() {
  if (!coastalCache) {
    coastalCache = await loadMockJson<any>("coastal.json");
  }
  return coastalCache;
}

async function getOwnersData() {
  if (!ownersCache) {
    ownersCache = await loadMockJson<any>("owners.json");
  }
  return ownersCache;
}

async function getPlotsData() {
  if (!plotsCache) {
    plotsCache = await loadMockJson<any>("plots.json");
  }
  return plotsCache;
}

async function getMouzasData(): Promise<Mouza[]> {
  if (!mouzasCache) {
    mouzasCache = await loadMockJson<Mouza[]>("mouzas.json");
  }
  return mouzasCache;
}

// ========================================================
// 1. DASHBOARD SUMMARY
// ========================================================
export async function getDashboardSummary(
  mode: DataMode = "recorded"
): Promise<DashboardSummary> {
  await delay(220);
  const common = await getCommonData();
  const summary = common.summary[mode] ?? common.summary.recorded;

  // Enforce Rule 5: Forecast shows ONLY projected compensation, no paid/status info
  if (mode === "forecast") {
    const { paidCompensationBDT, approvedCompensationBDT, pendingCompensationBDT, ...cleanForecast } = summary;
    return cleanForecast as DashboardSummary;
  }

  return summary;
}

// ========================================================
// 2. CORE GEOGRAPHIC LOOKUPS
// ========================================================
export async function getDistricts(hazard?: HazardType): Promise<District[]> {
  await delay(180);
  const common = await getCommonData();
  return common.districts as District[];
}

export async function getUpazilas(districtId?: string): Promise<Upazila[]> {
  await delay(180);
  const common = await getCommonData();
  const all: Upazila[] = common.upazilas;
  if (!districtId) return all;
  return all.filter((u) => u.districtId === districtId);
}

export async function getRivers(upazilaId?: string): Promise<River[]> {
  await delay(180);
  const common = await getCommonData();
  const all: River[] = common.rivers;
  if (!upazilaId) return all;
  return all.filter((r) => r.upazilaIds.includes(upazilaId));
}

export async function getHills(upazilaId?: string): Promise<Hill[]> {
  await delay(180);
  const common = await getCommonData();
  const all: Hill[] = common.hills;
  if (!upazilaId) return all;
  return all.filter((h) => h.upazilaId === upazilaId);
}

export async function getChars(
  upazilaId?: string,
  riverId?: string
): Promise<CharIsland[]> {
  await delay(200);
  const charMock = await getCharData();
  const all: CharIsland[] = charMock.chars;
  return all.filter((c) => {
    if (upazilaId && c.upazilaId !== upazilaId) return false;
    if (riverId && c.riverId !== riverId) return false;
    return true;
  });
}

export async function getMouzas(
  upazilaId?: string,
  riverId?: string
): Promise<Mouza[]> {
  await delay(200);
  const mouzas = await getMouzasData();
  return mouzas.filter((m) => {
    if (upazilaId && m.upazilaId !== upazilaId) return false;
    if (riverId && m.riverId && m.riverId !== riverId) return false;
    return true;
  });
}

// ========================================================
// 3. DYNAMIC OPTIONS FOR SELECTORS
// ========================================================
export type { SelectorOption } from "./types";

export async function getOptions(
  hazard: HazardType,
  mode: DataMode,
  step: string,
  selectionSoFar: Record<string, string>
): Promise<SelectorOption[]> {
  await delay(160);

  const districtId = selectionSoFar?.d || selectionSoFar?.districtId || selectionSoFar?.district;
  const upazilaId = selectionSoFar?.u || selectionSoFar?.upazilaId || selectionSoFar?.upazila;
  const riverId = selectionSoFar?.r || selectionSoFar?.riverId || selectionSoFar?.river;
  const hillId = selectionSoFar?.h || selectionSoFar?.hillId || selectionSoFar?.hill;
  const mouzaId = selectionSoFar?.m || selectionSoFar?.mouzaId || selectionSoFar?.mouza || selectionSoFar?.charId;

  // Retrieve caches
  const common = await getCommonData();
  const allMouzas = await getMouzasData();

  if (step === "district") {
    const districts = (common.districts as District[]);

    let riverResults: Record<string, any> = {};
    let floodEvs: FloodEvent[] = [];
    let floodRes: Record<string, any> = {};
    let landslideRes: Record<string, any> = {};
    let charRes: Record<string, any> = {};
    let coastalRes: Record<string, any> = {};

    if (hazard === "river_erosion") riverResults = (await getRiverErosionData()).results || {};
    else if (hazard === "flood") {
      const f = await getFloodData();
      floodEvs = f.events || [];
      floodRes = f.results || {};
    } else if (hazard === "landslide") landslideRes = (await getLandslideData()).results || {};
    else if (hazard === "char") charRes = (await getCharData()).results || {};
    else if (hazard === "coastal") coastalRes = (await getCoastalData()).results || {};

    return districts.map((d) => {
      let hasRecords = false;
      if (hazard === "river_erosion") {
        hasRecords = allMouzas.some((m) => m.districtId === d.id && riverResults[`river_erosion_${mode}_${m.id}`]);
      } else if (hazard === "flood") {
        hasRecords = floodEvs.some((ev) => ev.districtId === d.id) || allMouzas.some((m) => m.districtId === d.id && floodRes[`flood_${mode}_${m.id}`]);
      } else if (hazard === "landslide") {
        const distUpazilas = new Set((common.upazilas as Upazila[]).filter((u) => u.districtId === d.id).map((u) => u.id));
        hasRecords = (common.hills as Hill[]).some((h) => distUpazilas.has(h.upazilaId) && landslideRes[`landslide_${mode}_${h.id}`]);
      } else if (hazard === "char") {
        const distUpazilas = new Set((common.upazilas as Upazila[]).filter((u) => u.districtId === d.id).map((u) => u.id));
        hasRecords = Object.keys(charRes).some((k) => k.startsWith(`char_${mode}_`) && (common.upazilas as Upazila[]).some((u) => distUpazilas.has(u.id) && k.includes(u.id)));
      } else if (hazard === "coastal") {
        hasRecords = allMouzas.some((m) => m.districtId === d.id && coastalRes[`coastal_${mode}_${m.id}`]);
      }

      return {
        id: d.id,
        label: d.name,
        sublabel: `${d.division} Division`,
        badge: d.isCoastal
          ? "Coastal Zone"
          : d.isHilly
          ? "Hill Tracts"
          : d.hasChars
          ? "Char Active"
          : undefined,
        hasRecords,
      };
    });
  }

  if (step === "upazila") {
    const allUpazilas: Upazila[] = common.upazilas;
    const upazilas = districtId ? allUpazilas.filter((u) => u.districtId === districtId) : allUpazilas;

    let riverResults: Record<string, any> = {};
    let floodEvs: FloodEvent[] = [];
    let floodRes: Record<string, any> = {};
    let landslideRes: Record<string, any> = {};
    let charRes: Record<string, any> = {};
    let coastalRes: Record<string, any> = {};

    if (hazard === "river_erosion") riverResults = (await getRiverErosionData()).results || {};
    else if (hazard === "flood") {
      const f = await getFloodData();
      floodEvs = f.events || [];
      floodRes = f.results || {};
    } else if (hazard === "landslide") landslideRes = (await getLandslideData()).results || {};
    else if (hazard === "char") charRes = (await getCharData()).results || {};
    else if (hazard === "coastal") coastalRes = (await getCoastalData()).results || {};

    return upazilas.map((u) => {
      let hasRecords = false;
      if (hazard === "river_erosion") {
        hasRecords = allMouzas.some((m) => m.upazilaId === u.id && riverResults[`river_erosion_${mode}_${m.id}`]);
      } else if (hazard === "flood") {
        hasRecords = floodEvs.some((ev) => ev.upazilaId === u.id) || allMouzas.some((m) => m.upazilaId === u.id && floodRes[`flood_${mode}_${m.id}`]);
      } else if (hazard === "landslide") {
        hasRecords = (common.hills as Hill[]).some((h) => h.upazilaId === u.id && landslideRes[`landslide_${mode}_${h.id}`]);
      } else if (hazard === "char") {
        hasRecords = Object.keys(charRes).some((k) => k.startsWith(`char_${mode}_`) && k.includes(u.id));
      } else if (hazard === "coastal") {
        hasRecords = allMouzas.some((m) => m.upazilaId === u.id && coastalRes[`coastal_${mode}_${m.id}`]);
      }

      return {
        id: u.id,
        label: u.name,
        sublabel: u.rivers.length > 0 ? `${u.rivers.length} Rivers` : undefined,
        badge: u.hasChars ? "Chars" : u.hasHills ? "Hills" : undefined,
        hasRecords,
      };
    });
  }

  if (step === "river") {
    const allRivers: River[] = common.rivers;
    const rivers = upazilaId ? allRivers.filter((r) => r.upazilaIds.includes(upazilaId)) : allRivers;

    let riverResults: Record<string, any> = {};
    let charRes: Record<string, any> = {};
    if (hazard === "river_erosion") riverResults = (await getRiverErosionData()).results || {};
    else if (hazard === "char") charRes = (await getCharData()).results || {};

    return rivers.map((r) => {
      let hasRecords = false;
      if (hazard === "river_erosion") {
        hasRecords = allMouzas.some((m) => (!upazilaId || m.upazilaId === upazilaId) && (!m.riverId || m.riverId === r.id) && riverResults[`river_erosion_${mode}_${m.id}`]);
      } else if (hazard === "char") {
        hasRecords = Object.keys(charRes).some((k) => k.startsWith(`char_${mode}_`) && (!upazilaId || k.includes(upazilaId)));
      }

      return {
        id: r.id,
        label: r.name,
        sublabel: `${r.averageLossRateDecPerYear} dec/yr avg`,
        badge: r.erosionTendency.includes("Severe") ? "High Erosion" : undefined,
        hasRecords,
      };
    });
  }

  if (step === "hill") {
    const allHills: Hill[] = common.hills;
    const hills = upazilaId ? allHills.filter((h) => h.upazilaId === upazilaId) : allHills;
    const landslideRes = (await getLandslideData()).results || {};

    return hills.map((h) => ({
      id: h.id,
      label: h.name,
      sublabel: `${h.slopeAngleDeg}° slope angle`,
      badge: h.riskLevel,
      hasRecords: Boolean(landslideRes[`landslide_${mode}_${h.id}`]),
    }));
  }

  if (step === "char") {
    const chars = await getChars(upazilaId, riverId);
    const charRes = (await getCharData()).results || {};

    return chars.map((c) => ({
      id: c.id,
      label: c.name,
      sublabel: `${c.totalAreaDecimal} decimals area`,
      badge: c.vegetationStatus,
      hasRecords: Boolean(charRes[`char_${mode}_${c.id}`]),
    }));
  }

  if (step === "mouza") {
    const mouzas = await getMouzas(upazilaId, riverId);

    let riverResults: Record<string, any> = {};
    let floodEvs: FloodEvent[] = [];
    let floodRes: Record<string, any> = {};
    let coastalRes: Record<string, any> = {};

    if (hazard === "river_erosion") riverResults = (await getRiverErosionData()).results || {};
    else if (hazard === "flood") {
      const f = await getFloodData();
      floodEvs = f.events || [];
      floodRes = f.results || {};
    } else if (hazard === "coastal") coastalRes = (await getCoastalData()).results || {};

    return mouzas.map((m) => {
      let hasRecords = false;
      if (hazard === "river_erosion") {
        hasRecords = Boolean(riverResults[`river_erosion_${mode}_${m.id}`]);
      } else if (hazard === "flood") {
        hasRecords = floodEvs.some((ev) => ev.mouzaId === m.id) || Boolean(floodRes[`flood_${mode}_${m.id}`]);
      } else if (hazard === "coastal") {
        hasRecords = Boolean(coastalRes[`coastal_${mode}_${m.id}`]);
      }

      return {
        id: m.id,
        label: m.name,
        sublabel: `${m.jlNo} • ${m.totalPlots} Plots`,
        badge: m.kind === "unassigned" ? "Unassigned" : undefined,
        hasRecords,
      };
    });
  }

  if (step === "year" && hazard === "flood") {
    const floodData = await getFloodData();
    const events: FloodEvent[] = floodData.events || [];
    const mouzaEvents = mouzaId ? events.filter((e) => e.mouzaId === mouzaId) : events;
    const years = Array.from(new Set(mouzaEvents.map((f) => f.year))).sort((a, b) => b - a);

    return years.map((y) => ({
      id: String(y),
      label: `${y} Monsoon Flood`,
      sublabel: `Event record for ${y}`,
      hasRecords: true,
    }));
  }

  if (step === "event" && hazard === "landslide") {
    if (!hillId) return [];
    const events = getEventsForMountain(hillId, mode);
    const sorted = [...events].sort((a, b) => b.year - a.year);

    return sorted.map((ev) => ({
      id: ev.id,
      label: ev.eventNameEn,
      sublabel: ev.eventDate,
      hasRecords: true,
    }));
  }

  return [];
}

// ========================================================
// 4. HAZARD RESULTS LOOKUP (LAZY-LOADED)
// ========================================================
export async function getHazardResult(
  hazard: HazardType,
  mode: DataMode,
  entityId: string
): Promise<HazardResult | null> {
  await delay(250);

  const key = `${hazard}_${mode}_${entityId}`;
  let pool: Record<string, HazardResult> = {};

  if (hazard === "river_erosion") {
    pool = (await getRiverErosionData()).results;
  } else if (hazard === "flood") {
    pool = (await getFloodData()).results;
  } else if (hazard === "landslide") {
    pool = (await getLandslideData()).results;
  } else if (hazard === "char") {
    pool = (await getCharData()).results;
  } else if (hazard === "coastal") {
    pool = (await getCoastalData()).results;
  }

  let result =
    pool[key] ||
    pool[entityId] ||
    Object.values(pool).find((r) => r.id === entityId || r.entityId === entityId) ||
    null;

  if (!result) return null;

  // RULE 5 ENFORCEMENT: If mode is forecast, clean all status & paid fields
  if (mode === "forecast" && result.owners) {
    const cleanOwners = result.owners.map((o) => {
      const { compensationStatus, paidAmountBDT, ...rest } = o;
      return rest as OwnerRecord;
    });
    return {
      ...result,
      owners: cleanOwners,
    };
  }

  return result;
}

export const getResult = getHazardResult;

export async function listResults(
  hazard: HazardType,
  mode: DataMode,
  selection?: Record<string, string>
): Promise<HazardResult[]> {
  await delay(220);

  let pool: Record<string, HazardResult> = {};
  if (hazard === "river_erosion") {
    pool = (await getRiverErosionData()).results;
  } else if (hazard === "flood") {
    pool = (await getFloodData()).results;
  } else if (hazard === "landslide") {
    pool = (await getLandslideData()).results;
  } else if (hazard === "char") {
    pool = (await getCharData()).results;
  } else if (hazard === "coastal") {
    pool = (await getCoastalData()).results;
  }

  let results = Object.values(pool).filter((r) => r.mode === mode);

  if (selection && Object.keys(selection).length > 0) {
    const mouzaId = selection.mouzaId || selection.mouza;
    const upazilaId = selection.upazilaId || selection.upazila;
    const districtId = selection.districtId || selection.district;
    const hillId = selection.hillId || selection.hill;
    const charId = selection.charId || selection.char;

    if (mouzaId) {
      results = results.filter((r) => r.entityId === mouzaId);
    } else if (charId) {
      results = results.filter((r) => r.entityId === charId);
    } else if (hillId) {
      results = results.filter((r) => r.entityId === hillId);
    } else if (upazilaId) {
      const common = await getCommonData();
      const mouzas = await getMouzasData();
      const validEntityIds = new Set<string>();
      mouzas.filter((m) => m.upazilaId === upazilaId).forEach((m) => validEntityIds.add(m.id));
      (common.hills as Hill[]).filter((h) => h.upazilaId === upazilaId).forEach((h) => validEntityIds.add(h.id));
      const charMock = await getCharData();
      (charMock.chars as CharIsland[]).filter((c) => c.upazilaId === upazilaId).forEach((c) => validEntityIds.add(c.id));
      results = results.filter((r) => validEntityIds.has(r.entityId));
    } else if (districtId) {
      const common = await getCommonData();
      const upazilasInDistrict = new Set(
        (common.upazilas as Upazila[]).filter((u) => u.districtId === districtId).map((u) => u.id)
      );
      const mouzas = await getMouzasData();
      const validEntityIds = new Set<string>();
      mouzas.filter((m) => upazilasInDistrict.has(m.upazilaId)).forEach((m) => validEntityIds.add(m.id));
      (common.hills as Hill[]).filter((h) => upazilasInDistrict.has(h.upazilaId)).forEach((h) => validEntityIds.add(h.id));
      const charMock = await getCharData();
      (charMock.chars as CharIsland[]).filter((c) => upazilasInDistrict.has(c.upazilaId)).forEach((c) => validEntityIds.add(c.id));
      results = results.filter((r) => validEntityIds.has(r.entityId));
    }
  }

  // RULE 5 ENFORCEMENT: If mode is forecast, clean all status & paid fields
  if (mode === "forecast") {
    results = results.map((result) => {
      if (!result.owners) return result;
      return {
        ...result,
        owners: result.owners.map((o) => {
          const { compensationStatus, paidAmountBDT, ...rest } = o;
          return rest as OwnerRecord;
        }),
      };
    });
  }

  return results;
}

// ========================================================
// ========================================================
// 5. FLOOD-SPECIFIC RELATIONAL DATA METHODS
// ========================================================
export async function listFloods(
  selection: Record<string, string> = {}
): Promise<FloodEvent[]> {
  await delay(200);
  const floodMock = await getFloodData();
  const events: FloodEvent[] = floodMock.events || [];
  const mouzas = await getMouzasData();
  const mouzaMap = new Map(mouzas.map((m) => [m.id, m]));

  const targetMouzaId = selection.m || selection.mouzaId || selection.mouza;
  const targetUpazilaId = selection.u || selection.upazilaId || selection.upazila;
  const targetDistrictId = selection.d || selection.districtId || selection.district;
  const targetYear = selection.year;

  return events
    .filter((ev) => {
      const mouza = mouzaMap.get(ev.mouzaId);
      if (targetMouzaId && ev.mouzaId !== targetMouzaId) return false;
      if (targetUpazilaId && mouza?.upazilaId !== targetUpazilaId) return false;
      if (targetDistrictId && mouza?.districtId !== targetDistrictId) return false;
      if (targetYear && targetYear !== "all" && String(ev.year) !== targetYear) return false;
      return true;
    })
    .map((ev) => {
      const mouza = mouzaMap.get(ev.mouzaId);
      const uniqueOwners = new Set((ev.plotStatus || []).map((ps) => ps.ownerId || ps.ownerName));
      return {
        ...ev,
        mouzaName: mouza ? `${mouza.name} (${mouza.jlNo})` : ev.mouzaId,
        upazilaId: mouza?.upazilaId,
        districtId: mouza?.districtId,
        affectedOwnersCount: uniqueOwners.size,
      };
    });
}

export async function getFlood(id: string): Promise<FloodEvent | null> {
  await delay(180);
  const floodMock = await getFloodData();
  const events: FloodEvent[] = floodMock.events || [];
  const ev = events.find((e) => e.id === id);
  if (!ev) return null;

  const mouzas = await getMouzasData();
  const mouza = mouzas.find((m) => m.id === ev.mouzaId);
  const uniqueOwners = new Set((ev.plotStatus || []).map((ps) => ps.ownerId || ps.ownerName));

  return {
    ...ev,
    mouzaName: mouza ? `${mouza.name} (${mouza.jlNo})` : ev.mouzaId,
    upazilaId: mouza?.upazilaId,
    districtId: mouza?.districtId,
    affectedOwnersCount: uniqueOwners.size,
  };
}

export async function getFloodOwners(
  floodId: string,
  query?: string
): Promise<FloodPlotStatus[]> {
  await delay(160);
  const flood = await getFlood(floodId);
  if (!flood) return [];

  let list = flood.plotStatus || [];
  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(
      (ps) =>
        ps.ownerName.toLowerCase().includes(q) ||
        ps.dagNo.toLowerCase().includes(q) ||
        ps.khatianNo.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function getOwnerProfile(ownerId: string): Promise<OwnerProfile | null> {
  await delay(120);
  const owners = await getOwnersData();
  const owner = owners.find(
    (o: any) => o.id === ownerId || o.name.toLowerCase() === ownerId.toLowerCase()
  );

  const name =
    owner?.name ||
    (ownerId.startsWith("owner_")
      ? `Landowner ${ownerId.replace("owner_", "")}`
      : ownerId.replace(/_/g, " "));

  const fatherPrefixes = [
    "Late Abdul Gafur",
    "Late Nurul Islam",
    "Late Mokbul Hossain",
    "Late Fazlur Rahman",
    "Late Sirajul Islam",
    "Late Abdus Sattar",
  ];
  const lastName = name.split(" ").slice(-1)[0] || "Chowdhury";
  const charCode = (ownerId.charCodeAt(ownerId.length - 1) || 0) % fatherPrefixes.length;
  const fatherName = `${fatherPrefixes[charCode]} ${lastName}`;

  return {
    id: owner?.id || ownerId,
    name,
    fatherName,
    phone: owner?.phone || "+880 1715 000000",
    nid: owner?.nid || "19855859500000",
  };
}

export function deriveCorners(points: [number, number][]): [Corner, Corner, Corner, Corner] {
  const pts: { lon: number; lat: number }[] = [];
  for (const [lon, lat] of points) {
    if (!pts.some((p) => Math.abs(p.lon - lon) < 1e-7 && Math.abs(p.lat - lat) < 1e-7)) {
      pts.push({ lon: Number(lon.toFixed(6)), lat: Number(lat.toFixed(6)) });
    }
  }
  if (pts.length < 4) {
    while (pts.length < 4) {
      pts.push({ lon: pts[0]?.lon || 89.627, lat: pts[0]?.lat || 24.555 });
    }
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

export interface OwnerPlotDetail {
  plotId: string;
  dagNo: string;
  khatianNo: string;
  landClass: string;
  areaDecimal: number;
  floodedAreaDecimal: number;
  depthClass: "shallow" | "moderate" | "deep" | "none";
  floodStatus: string;
  corners: [Corner, Corner, Corner, Corner];
  boundaryCoordinates?: [number, number][];
  estCompensationBdt: number;
  colorIndex?: number;
}

export async function getOwnerPlots(
  floodId: string,
  ownerId: string
): Promise<OwnerPlotDetail[]> {
  await delay(180);
  const flood = await getFlood(floodId);
  if (!flood) return [];

  const allPlots: Plot[] = await getPlotsData();
  const mouzaPlots = allPlots.filter(
    (p) =>
      p.mouzaId === flood.mouzaId &&
      (p.ownerId === ownerId ||
        p.ownerId.toLowerCase() === ownerId.toLowerCase())
  );

  // Map of flooded plot statuses by dagNo or plotId
  const floodStatusMap = new Map<string, FloodPlotStatus>();
  for (const ps of flood.plotStatus || []) {
    if (
      ps.ownerId === ownerId ||
      ps.ownerName.toLowerCase() === ownerId.toLowerCase()
    ) {
      floodStatusMap.set(ps.plotId, ps);
      floodStatusMap.set(ps.dagNo, ps);
    }
  }

  // If mouzaPlots from plots.json contains plots for this owner
  if (mouzaPlots.length > 0) {
    return mouzaPlots.map((plot) => {
      const ps = floodStatusMap.get(plot.id) || floodStatusMap.get(plot.dagNo);
      const ring = (plot.polygon?.[0] as [number, number][]) || [];
      const corners = plot.corners || deriveCorners(ring);

      return {
        plotId: plot.id,
        dagNo: plot.dagNo,
        khatianNo: plot.khatianNo,
        landClass: plot.landClass || "Agricultural (Nal)",
        areaDecimal: plot.areaDecimal,
        floodedAreaDecimal: ps ? ps.floodedAreaDecimal : 0,
        depthClass: ps ? ps.depthClass : "none",
        floodStatus: ps ? (ps.status || "Submerged") : "Not Flooded",
        corners,
        boundaryCoordinates: ring.map(([lng, lt]) => [Number(lt.toFixed(6)), Number(lng.toFixed(6))]),
        estCompensationBdt: ps ? ps.estCompensationBdt : 0,
        colorIndex: ps?.colorIndex ?? 0,
      };
    });
  }

  // Fallback: plots from flood.plotStatus directly
  const matchedPs = (flood.plotStatus || []).filter(
    (ps) =>
      ps.ownerId === ownerId || ps.ownerName.toLowerCase() === ownerId.toLowerCase()
  );

  return matchedPs.map((ps) => {
    const bnd = (ps.boundary || []).map((pt: [number, number]) => [
      Number(pt[0].toFixed(6)),
      Number(pt[1].toFixed(6)),
    ]) as [number, number][];
    const corners = ps.corners || deriveCorners(bnd);

    return {
      plotId: ps.plotId,
      dagNo: ps.dagNo,
      khatianNo: ps.khatianNo,
      landClass: ps.landClass || "Agricultural (Nal)",
      areaDecimal: ps.totalAreaDecimal,
      floodedAreaDecimal: ps.floodedAreaDecimal,
      depthClass: ps.depthClass,
      floodStatus: ps.status || "Submerged",
      corners,
      boundaryCoordinates: bnd.map(([lng, lt]) => [Number(lt.toFixed(6)), Number(lng.toFixed(6))]),
      estCompensationBdt: ps.estCompensationBdt,
      colorIndex: ps.colorIndex ?? 0,
    };
  });
}

// ========================================================
// 6. OWNER SEARCH & COMPATIBILITY HELPERS
// ========================================================
export async function getOwners(
  mouzaId?: string,
  hazard?: HazardType
): Promise<OwnerRecord[]> {
  await delay(180);
  const allMouzas = await getMouzasData();
  const targetMouza = mouzaId ? allMouzas.find((m) => m.id === mouzaId) : null;

  if (hazard) {
    const res = await getHazardResult(hazard, "recorded", mouzaId || "mouza_kazipur_1");
    if (res && res.owners) return res.owners;
  }

  const allOwners = await getOwnersData();
  return allOwners.slice(0, 15).map((o: any, idx: number) => ({
    id: `own_rec_${idx + 1}`,
    name: o.name,
    dagNo: `${101 + idx}`,
    khatianNo: `RS-${200 + idx}`,
    plotNo: `${101 + idx}`,
    mouzaId: mouzaId || "mouza_kazipur_1",
    upazilaId: targetMouza?.upazilaId || "kazipur",
    districtId: targetMouza?.districtId || "sirajganj",
    hazard: hazard || "river_erosion",
    landClass: "agri",
    changeKind: "loss",
    lossDecimal: 24.5,
    gainDecimal: 0,
    estimatedCompensationBDT: 294000,
    compensationStatus: "approved",
    paidAmountBDT: 0,
    isUnownedOrKhas: false,
    coordinates: [89.65, 24.57],
  }));
}

export async function searchOwnersByName(
  query: string,
  mouzaId?: string
): Promise<OwnerRecord[]> {
  await delay(120);
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Search through all generated hazard results
  const riverData = await getRiverErosionData();
  const floodData = await getFloodData();

  const candidates: OwnerRecord[] = [];
  const seenIds = new Set<string>();

  for (const res of Object.values(riverData.results as Record<string, HazardResult>)) {
    if (mouzaId && res.entityId !== mouzaId) continue;
    for (const o of res.owners) {
      if (
        (o.name.toLowerCase().includes(q) ||
          o.dagNo.toLowerCase().includes(q) ||
          o.khatianNo.toLowerCase().includes(q)) &&
        !seenIds.has(o.name + o.dagNo)
      ) {
        seenIds.add(o.name + o.dagNo);
        candidates.push(o);
      }
    }
  }

  for (const ev of floodData.events as FloodEvent[]) {
    if (mouzaId && ev.mouzaId !== mouzaId) continue;
    for (const ps of ev.plotStatus) {
      if (
        (ps.ownerName.toLowerCase().includes(q) ||
          ps.dagNo.toLowerCase().includes(q) ||
          ps.khatianNo.toLowerCase().includes(q)) &&
        !seenIds.has(ps.ownerName + ps.dagNo)
      ) {
        seenIds.add(ps.ownerName + ps.dagNo);
        candidates.push({
          id: `flood_sug_${ps.plotId}`,
          name: ps.ownerName,
          dagNo: ps.dagNo,
          khatianNo: ps.khatianNo,
          plotNo: ps.dagNo,
          mouzaId: ev.mouzaId,
          upazilaId: "flood_upz",
          districtId: "flood_dist",
          hazard: "flood",
          landClass: ps.landClass,
          changeKind: "loss",
          lossDecimal: ps.floodedAreaDecimal,
          gainDecimal: 0,
          estimatedCompensationBDT: ps.estCompensationBdt,
          compensationStatus: "approved",
          paidAmountBDT: 0,
          isUnownedOrKhas: false,
          coordinates: ps.corners
            ? [ps.corners[0].lon, ps.corners[0].lat]
            : ps.centroid
            ? [ps.centroid[1], ps.centroid[0]]
            : [89.65, 24.57],
        });
      }
    }
  }

  return candidates.slice(0, 10);
}

// ========================================================
// 7. LIGHT-THEMED GIS BASEMAP / MAP AREA LOADER (Change 3)
// ========================================================
let areasIndexCache: Record<string, string> | null = null;
const mapAreaCache = new Map<string, MapArea>();

export async function getMapArea(
  hazard: HazardType,
  mode: DataMode,
  resultId: string
): Promise<MapArea | null> {
  await delay(120);
  try {
    if (!areasIndexCache) {
      try {
        areasIndexCache = await loadMockJson<Record<string, string>>("areas_index.json");
      } catch (e) {
        areasIndexCache = {};
      }
    }

    // Try hazard and mode specific keys first, then fallback to fuzzy/token match
    let areaId =
      areasIndexCache[`${hazard}_${mode}_${resultId}`] ||
      areasIndexCache[`${hazard}_${resultId}`] ||
      areasIndexCache[resultId];

    if (!areaId) {
      const hazardPrefix = hazard === "river_erosion" ? "river" : hazard;
      const cleanId = resultId
        .replace(/^(mouza_|char_|river_erosion_|flood_|landslide_|coastal_)/, "")
        .replace(/_\d+$/, "");
      const matched = Object.entries(areasIndexCache).find(
        ([k, v]) =>
          (k.startsWith(`${hazard}_`) || v.includes(`area_${hazardPrefix}`)) &&
          (k.includes(resultId) ||
            resultId.includes(k) ||
            (cleanId && (k.includes(cleanId) || v.includes(cleanId))))
      );
      if (matched) {
        areaId = matched[1];
      }
    }

    if (!areaId) {
      const hazardPrefix = hazard === "river_erosion" ? "river" : hazard;
      const validHazardAreas = Array.from(new Set(Object.values(areasIndexCache))).filter((v) =>
        v.includes(`area_${hazardPrefix}`)
      );
      areaId = validHazardAreas[0] || resultId;
    }

    const getFolder = (id: string, h: HazardType): string => {
      if (id.startsWith("area_river_")) return "river_erosion";
      if (id.startsWith("area_char_")) return "char";
      if (id.startsWith("area_landslide_")) return "landslide";
      if (id.startsWith("area_coastal_")) return "coastal";
      if (id.startsWith("area_flood_")) return "flood";
      return h;
    };

    const cacheKey = `${hazard}_${mode}_${areaId}`;
    if (mapAreaCache.has(cacheKey)) {
      return mapAreaCache.get(cacheKey)!;
    }

    let rawArea: any = null;
    const folder = getFolder(areaId, hazard);
    try {
      rawArea = await loadMockJson<any>(`areas/${folder}/${areaId}.json`);
    } catch (e) {
      // If direct file load failed, search manifest entries matching hazard
      const hazardPrefix = hazard === "river_erosion" ? "river" : hazard;
      const matched = Object.entries(areasIndexCache).find(
        ([k, v]) =>
          (k.startsWith(`${hazard}_`) || v.includes(`area_${hazardPrefix}`)) &&
          (k.includes(resultId) || resultId.includes(k))
      );
      if (matched) {
        areaId = matched[1];
        const matchedFolder = getFolder(areaId, hazard);
        try {
          rawArea = await loadMockJson<any>(`areas/${matchedFolder}/${areaId}.json`);
        } catch (e2) {}
      }
    }

    if (!rawArea) {
      // Final attempt: try first area for that hazard
      const hazardPrefix = hazard === "river_erosion" ? "river" : hazard;
      const validHazardAreas = Array.from(new Set(Object.values(areasIndexCache))).filter((v) =>
        v.includes(`area_${hazardPrefix}`)
      );
      if (validHazardAreas.length > 0 && validHazardAreas[0] !== areaId) {
        try {
          const fallbackAreaId = validHazardAreas[0];
          const fallbackFolder = getFolder(fallbackAreaId, hazard);
          rawArea = await loadMockJson<any>(`areas/${fallbackFolder}/${fallbackAreaId}.json`);
          areaId = fallbackAreaId;
        } catch (e3) {}
      }
    }

    if (!rawArea) return null;

    const mouzas: MouzaSummary[] =
      mode === "forecast" && rawArea.mouzasForecast
        ? rawArea.mouzasForecast
        : rawArea.mouzas || rawArea.mouzasRecorded || [];

    const hazardLayers =
      mode === "forecast" && rawArea.hazardLayersForecast
        ? rawArea.hazardLayersForecast
        : rawArea.hazardLayers || rawArea.hazardLayersRecorded || {};

    const context: ContextCard =
      mode === "forecast" && rawArea.contextForecast
        ? rawArea.contextForecast
        : rawArea.context || rawArea.contextRecorded || {};

    const area: MapArea = {
      areaId: rawArea.areaId || areaId,
      hazard: rawArea.hazard || hazard,
      mode,
      bounds: rawArea.bounds,
      basemap: rawArea.basemap,
      mouzas,
      hazardLayers,
      context,
      terrain: rawArea.terrain,
      owners:
        mode === "forecast" && rawArea.ownersForecast
          ? rawArea.ownersForecast
          : rawArea.owners,
      historyLines: rawArea.historyLines,
    };

    mapAreaCache.set(cacheKey, area);
    return area;
  } catch (err) {
    console.error(`Failed to load MapArea for ${hazard}/${mode}/${resultId}:`, err);
    return null;
  }
}
