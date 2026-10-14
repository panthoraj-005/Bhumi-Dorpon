import fs from "fs";
import path from "path";
import zlib from "zlib";
import * as turf from "@turf/turf";
import { generateAllMapAreas } from "./generate-map-areas";
import {
  District,
  Upazila,
  River,
  Hill,
  CharIsland,
  Mouza,
  Owner,
  Plot,
  HazardResult,
  FloodEvent,
  FloodPlotStatus,
  DataMode,
  HazardType,
  DashboardSummary,
  HazardBreakdownItem,
  RiverErosionGeometry,
  CharGeometry,
  CoastalGeometry,
  LandslideGeometry,
  OwnerRecord,
  Corner,
} from "../lib/types";

// ==========================================
// 1. DETERMINISTIC PSEUDO-RANDOM GENERATOR
// ==========================================
function createRng(seed = 0x20261011) {
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
function randSample<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, n);
}

function deriveCorners(points: [number, number][]): [Corner, Corner, Corner, Corner] {
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

// ==========================================
// 2. PNG HILLSHADE GENERATOR (Pure Node)
// ==========================================
function createPngDataUrl(width: number, height: number, rgbaBuffer: Buffer): string {
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
  const pngBuffer = Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}

function generateHillshadePng(): string {
  const size = 64;
  const buffer = Buffer.alloc(size * size * 4);
  const dem: number[][] = [];
  for (let y = 0; y < size; y++) {
    dem[y] = [];
    for (let x = 0; x < size; x++) {
      const dx1 = (x - 28) / 14;
      const dy1 = (y - 24) / 12;
      const dx2 = (x - 42) / 18;
      const dy2 = (y - 38) / 16;
      const z =
        240 * Math.exp(-(dx1 * dx1 + dy1 * dy1)) +
        160 * Math.exp(-(dx2 * dx2 + dy2 * dy2));
      dem[y][x] = z;
    }
  }

  const sunAzimuthRad = (315 * Math.PI) / 180;
  const sunAltitudeRad = (45 * Math.PI) / 180;

  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const dzdx = (dem[y][x + 1] - dem[y][x - 1]) / 2;
      const dzdy = (dem[y + 1][x] - dem[y - 1][x]) / 2;
      const slope = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy) * 0.05);
      const aspect = Math.atan2(dzdy, -dzdx);

      const shade = Math.max(
        0,
        Math.sin(sunAltitudeRad) * Math.cos(slope) +
          Math.cos(sunAltitudeRad) * Math.sin(slope) * Math.cos(sunAzimuthRad - aspect)
      );

      const val = Math.min(255, Math.max(30, Math.floor(shade * 255)));
      const idx = (y * size + x) * 4;
      buffer[idx] = val; // R
      buffer[idx + 1] = Math.floor(val * 0.95); // G
      buffer[idx + 2] = Math.floor(val * 0.85); // B
      buffer[idx + 3] = 230; // Alpha
    }
  }

  return createPngDataUrl(size, size, buffer);
}

// ==========================================
// 3. SEED DATA CONSTANTS & NAMES
// ==========================================
const LAND_CLASS_RATES: Record<string, number> = {
  homestead: 25000,
  commercial: 45000,
  pond: 15000,
  agri: 12000,
  khas: 0,
  char_accretion: 0,
};

const OWNER_NAMES_POOL = [
  "Rahim Chowdhury",
  "Fatema Begum",
  "Kabir Hossain Dewan",
  "Ayesha Siddiqua",
  "Nurul Huda Mia",
  "Shamsul Alam Sarker",
  "Begum Rokeya Khatun",
  "Anwar Parvez",
  "Nasreen Jahan",
  "Kamal Uddin Ahmed",
  "Shahana Akter",
  "Mizanur Rahman",
  "Taslima Nasrin",
  "Abdul Matin",
  "Laila Arjumand",
  "Faridul Islam",
  "Zubair Ahmed",
  "Hosne Ara Begum",
  "Monirul Huq",
  "Sultana Razia",
  "Jalal Uddin Rumi",
  "Bilkis Banu",
  "Sirajul Islam",
  "Parveen Sultana",
  "Mahbubur Rahman",
  "Afroza Khanam",
  "Shahidul Alam",
  "Rehana Parveen",
  "Zakir Hossain",
  "Hasina Mumtaz",
  "Golam Mostafa",
  "Salma Khatun",
  "Rafiqul Bari",
  "Ferdousi Begum",
  "Kazi Nazmul Huda",
  "Rowshan Ara",
  "Enamul Haque",
  "Momtaz Mahal",
  "Tariqul Islam",
  "Shirin Akter",
];

const DISTRICT_SPECS: District[] = [
  { id: "sirajganj", name: "Sirajganj", division: "Rajshahi", isCoastal: false, isHilly: false, hasChars: true, primaryHazards: ["river_erosion", "char", "flood"] },
  { id: "kurigram", name: "Kurigram", division: "Rangpur", isCoastal: false, isHilly: false, hasChars: true, primaryHazards: ["river_erosion", "char", "flood"] },
  { id: "shariatpur", name: "Shariatpur", division: "Dhaka", isCoastal: false, isHilly: false, hasChars: true, primaryHazards: ["river_erosion", "char"] },
  { id: "chandpur", name: "Chandpur", division: "Chattogram", isCoastal: false, isHilly: false, hasChars: true, primaryHazards: ["river_erosion", "char"] },
  { id: "bhola", name: "Bhola", division: "Barishal", isCoastal: true, isHilly: false, hasChars: true, primaryHazards: ["coastal", "char", "river_erosion"] },
  { id: "sunamganj", name: "Sunamganj", division: "Sylhet", isCoastal: false, isHilly: false, hasChars: false, primaryHazards: ["flood"] },
  { id: "sylhet", name: "Sylhet", division: "Sylhet", isCoastal: false, isHilly: true, hasChars: false, primaryHazards: ["flood", "landslide"] },
  { id: "rangamati", name: "Rangamati", division: "Chattogram", isCoastal: false, isHilly: true, hasChars: false, primaryHazards: ["landslide"] },
  { id: "bandarban", name: "Bandarban", division: "Chattogram", isCoastal: false, isHilly: true, hasChars: false, primaryHazards: ["landslide"] },
  { id: "coxs_bazar", name: "Cox's Bazar", division: "Chattogram", isCoastal: true, isHilly: true, hasChars: false, primaryHazards: ["coastal", "landslide"] },
  { id: "noakhali", name: "Noakhali", division: "Chattogram", isCoastal: true, isHilly: false, hasChars: true, primaryHazards: ["coastal", "char"] },
  { id: "khulna", name: "Khulna", division: "Khulna", isCoastal: true, isHilly: false, hasChars: false, primaryHazards: ["coastal"] },
];

interface UpazilaDef {
  id: string;
  districtId: string;
  name: string;
  centerCoordinates: [number, number];
  rivers: string[];
  hills?: string[];
  hasChars: boolean;
  hasHills: boolean;
  emptyHazards?: Partial<Record<HazardType, DataMode[]>>;
}

const UPAZILA_SPECS: UpazilaDef[] = [
  // Sirajganj
  { id: "kazipur", districtId: "sirajganj", name: "Kazipur", centerCoordinates: [89.65, 24.57], rivers: ["jamuna", "karatoa"], hasChars: true, hasHills: false },
  { id: "sirajganj_sadar", districtId: "sirajganj", name: "Sirajganj Sadar", centerCoordinates: [89.7, 24.45], rivers: ["jamuna", "hurasagar"], hasChars: true, hasHills: false },
  { id: "belkuchi", districtId: "sirajganj", name: "Belkuchi", centerCoordinates: [89.7, 24.29], rivers: ["jamuna", "phuljhor"], hasChars: true, hasHills: false, emptyHazards: { river_erosion: ["recorded", "forecast"], flood: ["recorded", "forecast"], char: ["recorded", "forecast"] } },

  // Kurigram
  { id: "chilmari", districtId: "kurigram", name: "Chilmari", centerCoordinates: [89.67, 25.56], rivers: ["brahmaputra", "teesta"], hasChars: true, hasHills: false },
  { id: "rowmari", districtId: "kurigram", name: "Rowmari", centerCoordinates: [89.85, 25.56], rivers: ["brahmaputra", "jinjiram"], hasChars: true, hasHills: false, emptyHazards: { river_erosion: ["recorded", "forecast"], char: ["recorded", "forecast"] } },
  { id: "ulipur", districtId: "kurigram", name: "Ulipur", centerCoordinates: [89.62, 25.66], rivers: ["brahmaputra", "dharla"], hasChars: true, hasHills: false },

  // Shariatpur
  { id: "naria", districtId: "shariatpur", name: "Naria", centerCoordinates: [90.39, 23.3], rivers: ["padma", "kirtinasha"], hasChars: true, hasHills: false },
  { id: "zajira", districtId: "shariatpur", name: "Zajira", centerCoordinates: [90.22, 23.35], rivers: ["padma", "arial_khan"], hasChars: true, hasHills: false },
  { id: "bhedarganj", districtId: "shariatpur", name: "Bhedarganj", centerCoordinates: [90.5, 23.2], rivers: ["padma", "meghna"], hasChars: true, hasHills: false, emptyHazards: { river_erosion: ["recorded", "forecast"] } },

  // Chandpur
  { id: "haimchar", districtId: "chandpur", name: "Haimchar", centerCoordinates: [90.64, 23.07], rivers: ["meghna", "dakatia"], hasChars: true, hasHills: false },
  { id: "chandpur_sadar", districtId: "chandpur", name: "Chandpur Sadar", centerCoordinates: [90.65, 23.23], rivers: ["meghna", "dakatia"], hasChars: true, hasHills: false },
  { id: "matlab_dakshin", districtId: "chandpur", name: "Matlab Dakshin", centerCoordinates: [90.71, 23.35], rivers: ["meghna", "dhonagoda"], hasChars: true, hasHills: false, emptyHazards: { char: ["recorded", "forecast"] } },

  // Bhola
  { id: "char_fasson", districtId: "bhola", name: "Char Fasson", centerCoordinates: [90.71, 22.19], rivers: ["meghna", "tentulia"], hasChars: true, hasHills: false },
  { id: "bhola_sadar", districtId: "bhola", name: "Bhola Sadar", centerCoordinates: [90.65, 22.69], rivers: ["meghna", "tentulia"], hasChars: true, hasHills: false },
  { id: "monpura", districtId: "bhola", name: "Monpura", centerCoordinates: [90.97, 22.3], rivers: ["meghna", "tentulia"], hasChars: true, hasHills: false },

  // Sunamganj
  { id: "sunamganj_sadar", districtId: "sunamganj", name: "Sunamganj Sadar", centerCoordinates: [91.4, 25.07], rivers: ["surma", "dhamalia"], hasChars: false, hasHills: false },
  { id: "derai", districtId: "sunamganj", name: "Derai", centerCoordinates: [91.35, 24.78], rivers: ["surma", "piyain"], hasChars: false, hasHills: false },
  { id: "tahirpur", districtId: "sunamganj", name: "Tahirpur", centerCoordinates: [91.18, 25.1], rivers: ["jadukata", "baulai"], hasChars: false, hasHills: false },
  { id: "jamalganj", districtId: "sunamganj", name: "Jamalganj", centerCoordinates: [91.23, 24.97], rivers: ["surma", "baulai"], hasChars: false, hasHills: false, emptyHazards: { flood: ["recorded", "forecast"] } },

  // Sylhet
  { id: "gowainghat", districtId: "sylhet", name: "Gowainghat", centerCoordinates: [92.0, 25.13], rivers: ["sari_goyain", "piyain"], hills: ["jaflong_hill", "tamabil_ridge"], hasChars: false, hasHills: true },
  { id: "companiganj", districtId: "sylhet", name: "Companiganj", centerCoordinates: [91.75, 25.08], rivers: ["dholai", "piyain"], hills: ["bholaganj_spur"], hasChars: false, hasHills: true },
  { id: "beanibazar", districtId: "sylhet", name: "Beanibazar", centerCoordinates: [92.16, 24.83], rivers: ["kushiyara", "sonai"], hasChars: false, hasHills: false, emptyHazards: { flood: ["recorded", "forecast"] } },

  // Rangamati
  { id: "kawkhali", districtId: "rangamati", name: "Kawkhali", centerCoordinates: [92.03, 22.56], rivers: ["ichamati", "karnafuli"], hills: ["ghagra", "betbunia_hill"], hasChars: false, hasHills: true },
  { id: "rangamati_sadar", districtId: "rangamati", name: "Rangamati Sadar", centerCoordinates: [92.18, 22.65], rivers: ["karnafuli", "chengi"], hills: ["furamon", "vedvedi"], hasChars: false, hasHills: true },
  { id: "baghaichhari", districtId: "rangamati", name: "Baghaichhari", centerCoordinates: [92.2, 23.16], rivers: ["kachalong", "maini"], hills: ["sajek_ridge", "marishya_hill"], hasChars: false, hasHills: true, emptyHazards: { landslide: ["recorded", "forecast"] } },

  // Bandarban
  { id: "bandarban_sadar", districtId: "bandarban", name: "Bandarban Sadar", centerCoordinates: [92.22, 22.2], rivers: ["sangu", "bakkhali"], hills: ["chimbuk", "nilgiri"], hasChars: false, hasHills: true },
  { id: "lama", districtId: "bandarban", name: "Lama", centerCoordinates: [92.2, 21.78], rivers: ["matamuhuri", "sangu"], hills: ["mirinja", "ali_kadam_range"], hasChars: false, hasHills: true },
  { id: "rowangchhari", districtId: "bandarban", name: "Rowangchhari", centerCoordinates: [92.34, 22.17], rivers: ["sangu", "taraisa"], hills: ["keokradong", "bogakine"], hasChars: false, hasHills: true, emptyHazards: { landslide: ["recorded", "forecast"] } },

  // Cox's Bazar
  { id: "coxs_bazar_sadar", districtId: "coxs_bazar", name: "Cox's Bazar Sadar", centerCoordinates: [91.98, 21.43], rivers: ["bakkhali"], hills: ["himchari", "ramu_ridge"], hasChars: false, hasHills: true },
  { id: "teknaf", districtId: "coxs_bazar", name: "Teknaf", centerCoordinates: [92.3, 20.87], rivers: ["naf"], hills: ["teknaf_ridge", "dumdumia_hill"], hasChars: false, hasHills: true, emptyHazards: { coastal: ["recorded", "forecast"] } },
  { id: "ukhia", districtId: "coxs_bazar", name: "Ukhia", centerCoordinates: [92.14, 21.24], rivers: ["naf", "reju"], hills: ["inani_range", "palongkhali_hill"], hasChars: false, hasHills: true, emptyHazards: { landslide: ["recorded", "forecast"] } },
  { id: "maheshkhali", districtId: "coxs_bazar", name: "Maheshkhali", centerCoordinates: [91.95, 21.52], rivers: ["kohelia", "maheshkhali_channel"], hills: ["adinath_hill"], hasChars: false, hasHills: true },

  // Noakhali
  { id: "hatiya", districtId: "noakhali", name: "Hatiya", centerCoordinates: [91.1, 22.37], rivers: ["meghna_channel", "shahbazpur"], hasChars: true, hasHills: false },
  { id: "subarnachar", districtId: "noakhali", name: "Subarnachar", centerCoordinates: [91.13, 22.68], rivers: ["little_feni", "meghna"], hasChars: true, hasHills: false },

  // Khulna
  { id: "koyra", districtId: "khulna", name: "Koyra", centerCoordinates: [89.3, 22.34], rivers: ["shibsa", "kobadak"], hasChars: false, hasHills: false },
  { id: "dacope", districtId: "khulna", name: "Dacope", centerCoordinates: [89.51, 22.57], rivers: ["pasur", "shibsa"], hasChars: false, hasHills: false, emptyHazards: { coastal: ["recorded", "forecast"] } },
];

const RIVERS_CATALOG: River[] = [
  { id: "jamuna", name: "Jamuna River", upazilaIds: ["kazipur", "sirajganj_sadar", "belkuchi"], erosionTendency: "Severe braided bank retreat", averageLossRateDecPerYear: 98.4 },
  { id: "brahmaputra", name: "Brahmaputra River", upazilaIds: ["chilmari", "rowmari", "ulipur"], erosionTendency: "Intense monsoonal bank scour", averageLossRateDecPerYear: 86.2 },
  { id: "padma", name: "Padma River", upazilaIds: ["naria", "zajira", "bhedarganj"], erosionTendency: "Active meander bend migration", averageLossRateDecPerYear: 112.5 },
  { id: "meghna", name: "Meghna River", upazilaIds: ["haimchar", "chandpur_sadar", "matlab_dakshin", "char_fasson", "bhola_sadar", "monpura"], erosionTendency: "Estuarine scouring and high hydraulic shear", averageLossRateDecPerYear: 91.0 },
  { id: "surma", name: "Surma River", upazilaIds: ["sunamganj_sadar", "derai", "gowainghat"], erosionTendency: "Monsoon flash-flood bank spill", averageLossRateDecPerYear: 42.1 },
  { id: "sari_goyain", name: "Sari-Goyain River", upazilaIds: ["gowainghat"], erosionTendency: "Rapid piedmont sedimentation", averageLossRateDecPerYear: 38.0 },
  { id: "dholai", name: "Dholai River", upazilaIds: ["companiganj"], erosionTendency: "Transboundary flash flow with gravel wash", averageLossRateDecPerYear: 34.5 },
  { id: "karnafuli", name: "Karnafuli River", upazilaIds: ["kawkhali", "rangamati_sadar"], erosionTendency: "Hilly channel downcutting", averageLossRateDecPerYear: 28.0 },
  { id: "sangu", name: "Sangu River", upazilaIds: ["bandarban_sadar", "rowangchhari"], erosionTendency: "High-gradient mountain torrent", averageLossRateDecPerYear: 22.5 },
  { id: "naf", name: "Naf River", upazilaIds: ["teknaf", "ukhia"], erosionTendency: "Tidal border channel migration", averageLossRateDecPerYear: 31.0 },
  { id: "tentulia", name: "Tentulia River", upazilaIds: ["bhola_sadar", "char_fasson", "monpura"], erosionTendency: "High tidal estuarine flow", averageLossRateDecPerYear: 52.0 },
  { id: "dakatia", name: "Dakatia River", upazilaIds: ["chandpur_sadar", "haimchar"], erosionTendency: "Moderate tributary meander", averageLossRateDecPerYear: 26.0 },
];

const HILLS_CATALOG: Hill[] = [
  { id: "ghagra", name: "Ghagra Hill Corridor", upazilaId: "kawkhali", slopeAngleDeg: 42, soilType: "Colluvial sandy clay loam", riskLevel: "Extreme" },
  { id: "furamon", name: "Furamon Peak Ridge", upazilaId: "rangamati_sadar", slopeAngleDeg: 38, soilType: "Tertiary sandstone weathered shale", riskLevel: "High" },
  { id: "vedvedi", name: "Vedvedi Urban Hill Slope", upazilaId: "rangamati_sadar", slopeAngleDeg: 35, soilType: "Residual silt loam", riskLevel: "Moderate" },
  { id: "sajek_ridge", name: "Sajek Valley Escarpment", upazilaId: "baghaichhari", slopeAngleDeg: 46, soilType: "Steep shale terrace", riskLevel: "High" },
  { id: "chimbuk", name: "Chimbuk Hill Crest", upazilaId: "bandarban_sadar", slopeAngleDeg: 44, soilType: "Weathered metamorphic clay", riskLevel: "Extreme" },
  { id: "nilgiri", name: "Nilgiri Plateau Descent", upazilaId: "bandarban_sadar", slopeAngleDeg: 40, soilType: "Compact laterite sandy loam", riskLevel: "High" },
  { id: "mirinja", name: "Mirinja Ridge", upazilaId: "lama", slopeAngleDeg: 39, soilType: "Silty sandstone colluvium", riskLevel: "High" },
  { id: "keokradong", name: "Keokradong Foot Range", upazilaId: "rowangchhari", slopeAngleDeg: 48, soilType: "Friable shale slope", riskLevel: "Extreme" },
  { id: "himchari", name: "Himchari Coastal Hill Slopes", upazilaId: "coxs_bazar_sadar", slopeAngleDeg: 41, soilType: "Marine sandstone terrace", riskLevel: "High" },
  { id: "teknaf_ridge", name: "Teknaf Peninsula Ridge", upazilaId: "teknaf", slopeAngleDeg: 43, soilType: "Unconsolidated sandy sediment", riskLevel: "Extreme" },
  { id: "inani_range", name: "Inani Protected Hill Range", upazilaId: "ukhia", slopeAngleDeg: 37, soilType: "Lateritic red soil", riskLevel: "Moderate" },
  { id: "jaflong_hill", name: "Jaflong Border Escarpment", upazilaId: "gowainghat", slopeAngleDeg: 36, soilType: "Piedmont boulder clay", riskLevel: "Moderate" },
];

console.log("Generating deterministic BhumiDorpon relational mock data...");

// A. Build Owners
const allOwners: Owner[] = [];
for (let i = 0; i < OWNER_NAMES_POOL.length; i++) {
  allOwners.push({
    id: `owner_${i + 1}`,
    name: OWNER_NAMES_POOL[i],
    phone: `+880 171${randInt(1000000, 9999999)}`,
    nid: `1985${randInt(1000000000, 9999999999)}`,
    colorIndex: i % 12,
  });
}

// B. Build Upazilas & Mouzas
const allUpazilas: Upazila[] = UPAZILA_SPECS.map((u) => ({
  id: u.id,
  districtId: u.districtId,
  name: u.name,
  centerCoordinates: u.centerCoordinates,
  rivers: u.rivers,
  hasChars: u.hasChars,
  hasHills: u.hasHills,
}));

const allMouzas: Mouza[] = [];
const allPlots: Plot[] = [];

const MOUZA_NAME_SEEDS = [
  "Meghai",
  "Natuarpara",
  "Gandhail",
  "Shubhagachha",
  "Tengrakhali",
  "Girishpur",
  "Balia",
  "Durgapur",
  "Bhairabnagar",
  "Kalyanpur",
  "Ilisha",
  "Monpura South",
  "Jaflong",
  "Rustampur",
  "Bholaganj",
  "Ghagra",
  "Vedvedi",
  "Kutubdia Para",
  "Chilmari Ghat",
  "Ramna",
  "Naria Bazar",
  "Panchapalli",
  "Haimchar Coastal",
  "Derai Sadar",
  "Tahirpur Haor",
];

let mouzaCounter = 1;
let plotCounter = 100;

const riverDistricts = ["sirajganj", "kurigram", "shariatpur", "chandpur", "bhola"];
const coastalDistricts = ["bhola", "noakhali", "khulna", "coxs_bazar"];

for (const upz of UPAZILA_SPECS) {
  const numMouzas = 3;
  for (let m = 0; m < numMouzas; m++) {
    const isUnassigned = upz.districtId === "bhola" || upz.districtId === "noakhali" || upz.districtId === "khulna"
      ? m === 2 && rand() > 0.4
      : false;

    const baseName = MOUZA_NAME_SEEDS[(mouzaCounter + m * 3) % MOUZA_NAME_SEEDS.length];
    const mouzaName = isUnassigned
      ? `Unassigned new land (${baseName} Sector-${m + 1})`
      : `${baseName} Mouza`;

    const mouzaId = `mouza_${upz.id}_${m + 1}`;
    const [cLon, cLat] = upz.centerCoordinates;
    const mLon = Number((cLon + (m - 1) * 0.015 + randFloat(-0.005, 0.005)).toFixed(5));
    const mLat = Number((cLat + (m - 1) * 0.01 + randFloat(-0.004, 0.004)).toFixed(5));

    const halfW = 0.008;
    const halfH = 0.005;
    const mouzaBoundary: [number, number][] = [
      [Number((mLon - halfW).toFixed(5)), Number((mLat - halfH).toFixed(5))],
      [Number((mLon + halfW).toFixed(5)), Number((mLat - halfH).toFixed(5))],
      [Number((mLon + halfW).toFixed(5)), Number((mLat + halfH).toFixed(5))],
      [Number((mLon - halfW).toFixed(5)), Number((mLat + halfH).toFixed(5))],
      [Number((mLon - halfW).toFixed(5)), Number((mLat - halfH).toFixed(5))],
    ];

    const numPlots = randInt(28, 38);
    const primaryRiver = upz.rivers[0];
    const primaryHill = upz.hills?.[0];

    const mouzaObj: Mouza = {
      id: mouzaId,
      name: mouzaName,
      jlNo: isUnassigned ? `V-0${m + 1}` : `JL-${randInt(12, 94)}`,
      upazilaId: upz.id,
      districtId: upz.districtId,
      riverId: primaryRiver,
      hillId: primaryHill,
      kind: isUnassigned ? "unassigned" : "registered",
      isVirtual: isUnassigned,
      totalPlots: numPlots,
      centroid: [mLon, mLat],
      boundary: mouzaBoundary,
    };
    allMouzas.push(mouzaObj);

    const mouzaOwners = randSample(allOwners, randInt(18, 32));

    const isRiverMouza = Boolean(primaryRiver && riverDistricts.includes(upz.districtId));
    const isCoastalMouza = Boolean(coastalDistricts.includes(upz.districtId));

    let waterPoly: any = null;
    if (isRiverMouza) {
      const riverBeforeCoords: [number, number][] = [];
      const steps = 10;
      for (let s = 0; s <= steps; s++) {
        const lat = Number((mLat - 0.005 + (s / steps) * 0.01).toFixed(5));
        const sineOffset = Math.sin(s * 0.8) * 0.002;
        const lonBefore = Number((mLon + 0.002 + sineOffset).toFixed(5));
        riverBeforeCoords.push([lonBefore, lat]);
      }
      try {
        waterPoly = turf.polygon([[
          ...riverBeforeCoords,
          [Number((mLon + halfW).toFixed(6)), riverBeforeCoords[riverBeforeCoords.length - 1][1]],
          [Number((mLon + halfW).toFixed(6)), riverBeforeCoords[0][1]],
          riverBeforeCoords[0],
        ]]);
      } catch (e) {}
    }

    const lonMin = Number((mLon - halfW + 0.0004).toFixed(6));
    const lonMax = Number((mLon + halfW - 0.0004).toFixed(6));
    const latMin = Number(
      (isCoastalMouza
        ? Math.max(mLat - halfH + 0.0004, mLat - 0.0015)
        : mLat - halfH + 0.0004
      ).toFixed(6)
    );
    const latMax = Number((mLat + halfH - 0.0004).toFixed(6));

    const cols = 9;
    const rows = Math.ceil((numPlots * 2.2) / cols);
    const dLon = (lonMax - lonMin) / cols;
    const dLat = (latMax - latMin) / rows;

    const gridNodes: [number, number][][] = [];
    for (let r = 0; r <= rows; r++) {
      const rowNodes: [number, number][] = [];
      for (let c = 0; c <= cols; c++) {
        const baseLon = lonMin + c * dLon;
        const baseLat = latMin + r * dLat;
        let jLon = 0;
        let jLat = 0;

        if (c > 0 && c < cols && r > 0 && r < rows) {
          jLon = randFloat(-0.20 * dLon, 0.20 * dLon, 6);
          jLat = randFloat(-0.20 * dLat, 0.20 * dLat, 6);
        } else if ((c === 0 || c === cols) && r > 0 && r < rows) {
          jLat = randFloat(-0.15 * dLat, 0.15 * dLat, 6);
        } else if ((r === 0 || r === rows) && c > 0 && c < cols) {
          jLon = randFloat(-0.15 * dLon, 0.15 * dLon, 6);
        }

        const nLon = Number((baseLon + jLon).toFixed(6));
        const nLat = Number((baseLat + jLat).toFixed(6));
        rowNodes.push([nLon, nLat]);
      }
      gridNodes.push(rowNodes);
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (allPlots.filter((p) => p.mouzaId === mouzaId).length >= numPlots) break;

        const pSW = gridNodes[r][c];
        const pSE = gridNodes[r][c + 1];
        const pNE = gridNodes[r + 1][c + 1];
        const pNW = gridNodes[r + 1][c];

        const corners = deriveCorners([pSW, pSE, pNE, pNW]);

        let inWater = false;
        for (const cn of corners) {
          const pt = turf.point([cn.lon, cn.lat]);
          if (waterPoly && turf.booleanPointInPolygon(pt, waterPoly)) {
            inWater = true;
            break;
          }
          if (
            cn.lon < mLon - halfW + 0.0001 ||
            cn.lon > mLon + halfW - 0.0001 ||
            cn.lat < mLat - halfH + 0.0001 ||
            cn.lat > mLat + halfH - 0.0001
          ) {
            inWater = true;
            break;
          }
        }
        if (inWater) continue;

        plotCounter++;
        const pId = `plot_${plotCounter}`;

        const plotPolygon: [number, number][][] = [
          [
            [corners[0].lon, corners[0].lat],
            [corners[1].lon, corners[1].lat],
            [corners[2].lon, corners[2].lat],
            [corners[3].lon, corners[3].lat],
            [corners[0].lon, corners[0].lat],
          ],
        ];

        const owner = isUnassigned
          ? { id: "owner_khas", name: "Government Khas Land" }
          : randChoice(mouzaOwners);

        const landClass = isUnassigned
          ? "khas"
          : randChoice(["agri", "agri", "agri", "homestead", "pond", "commercial"]);

        const geoAreaSqM = turf.area(turf.polygon(plotPolygon));
        const areaDec = Number((geoAreaSqM / 40.4686).toFixed(1));

        allPlots.push({
          id: pId,
          mouzaId,
          dagNo: `${plotCounter}`,
          khatianNo: `RS-${randInt(110, 890)}`,
          landClass: landClass as any,
          areaDecimal: areaDec,
          ownerId: owner.id,
          polygon: plotPolygon,
          corners,
        });
      }
    }

    mouzaCounter++;
  }
}

// C. MODULE 1: RIVER EROSION
interface RiverErosionMockData {
  results: Record<string, HazardResult>;
  geometries: Record<string, RiverErosionGeometry>;
}

const riverErosionData: RiverErosionMockData = {
  results: {},
  geometries: {},
};

const riverMouzas = allMouzas.filter((m) => riverDistricts.includes(m.districtId) && m.riverId);

for (const mouza of riverMouzas) {
  const upzDef = UPAZILA_SPECS.find((u) => u.id === mouza.upazilaId);
  const isEmptyRecorded = upzDef?.emptyHazards?.river_erosion?.includes("recorded");
  const isEmptyForecast = upzDef?.emptyHazards?.river_erosion?.includes("forecast");

  const plots = allPlots.filter((p) => p.mouzaId === mouza.id);
  const [mLon, mLat] = mouza.centroid || [89.65, 24.57];

  const riverBeforeCoords: [number, number][] = [];
  const riverAfterCoords: [number, number][] = [];
  const riverForecastCoords: [number, number][] = [];

  const steps = 10;
  for (let s = 0; s <= steps; s++) {
    const lat = Number((mLat - 0.005 + (s / steps) * 0.01).toFixed(5));
    const sineOffset = Math.sin(s * 0.8) * 0.002;
    const lonBefore = Number((mLon + 0.002 + sineOffset).toFixed(5));
    const retreatLon = Number((0.0012 + Math.abs(Math.sin(s * 0.6)) * 0.002).toFixed(5));
    const lonAfter = Number((lonBefore - retreatLon).toFixed(5));
    const lonForecast = Number((lonAfter - retreatLon * 0.7).toFixed(5));

    riverBeforeCoords.push([lonBefore, lat]);
    riverAfterCoords.push([lonAfter, lat]);
    riverForecastCoords.push([lonForecast, lat]);
  }

  const lossStripCoords: [number, number][] = [
    ...riverBeforeCoords,
    ...riverAfterCoords.slice().reverse(),
    riverBeforeCoords[0],
  ];

  const uncertaintyBandCoords: [number, number][] = [
    ...riverAfterCoords,
    ...riverForecastCoords.slice().reverse(),
    riverAfterCoords[0],
  ];

  const transects = [0.25, 0.5, 0.75].map((pct, idx) => {
    const sIdx = Math.floor(steps * pct);
    return {
      id: `transect_${idx + 1}`,
      label: `Transect T-${idx + 1}`,
      start: riverBeforeCoords[sIdx],
      end: riverAfterCoords[sIdx],
      retreatDistanceM: randInt(45, 115),
    };
  });

  const geometry: RiverErosionGeometry = {
    mouzaBoundary: [mouza.boundary || []],
    riverBefore: riverBeforeCoords,
    riverAfter: riverAfterCoords,
    lossStrip: [lossStripCoords],
    transects,
    forecastRetreatLine: riverForecastCoords,
    uncertaintyBand: [uncertaintyBandCoords],
  };

  const lossPolygonFeature = turf.polygon([lossStripCoords]);
  const forecastLossPolygonFeature = turf.polygon([uncertaintyBandCoords]);

  // RECORDED RESULT
  if (!isEmptyRecorded) {
    const recordedKey = `river_erosion_recorded_${mouza.id}`;
    riverErosionData.geometries[recordedKey] = geometry;

    const impactedOwners: OwnerRecord[] = [];
    let totalLoss = 0;

    for (const plot of plots) {
      try {
        const plotFeature = turf.polygon(plot.polygon);
        const intersection = turf.intersect(
          turf.featureCollection([plotFeature, lossPolygonFeature])
        );

        if (intersection) {
          const areaSqM = turf.area(intersection);
          const areaDec = Number((areaSqM / 40.4686).toFixed(1));
          if (areaDec > 0.5) {
            const ownerObj = allOwners.find((o) => o.id === plot.ownerId);
            const rate = LAND_CLASS_RATES[plot.landClass] || 12000;
            const estComp = Math.round(areaDec * rate);
            const status = randChoice([
              "paid",
              "paid",
              "approved",
              "pending",
              "not_applied",
            ]) as any;
            const paidBdt = status === "paid" ? estComp : 0;

            totalLoss += areaDec;

            impactedOwners.push({
              id: `rec_rec_${plot.id}`,
              name: ownerObj?.name || "Local Resident",
              dagNo: plot.dagNo,
              khatianNo: plot.khatianNo,
              plotNo: plot.dagNo,
              mouzaId: mouza.id,
              upazilaId: mouza.upazilaId,
              districtId: mouza.districtId,
              hazard: "river_erosion",
              landClass: plot.landClass,
              changeKind: "loss",
              lossDecimal: areaDec,
              gainDecimal: 0,
              estimatedCompensationBDT: estComp,
              compensationStatus: status,
              paidAmountBDT: paidBdt,
              isUnownedOrKhas: plot.landClass === "khas",
              coordinates: plot.polygon[0][0] as [number, number],
            });
          }
        }
      } catch (e) {}
    }

    const hazardAreaSqM = turf.area(lossPolygonFeature);
    const hazardAreaDec = Number((hazardAreaSqM / 40.4686).toFixed(1));
    const plotLossSum = impactedOwners.reduce((s, o) => s + o.lossDecimal, 0);
    const unownedLoss = Number((hazardAreaDec - plotLossSum).toFixed(1));
    if (unownedLoss > 0.5) {
      impactedOwners.push({
        id: `rec_rec_khas_${mouza.id}`,
        name: "Unowned Land (State Khas Riverbank)",
        dagNo: "KH-00",
        khatianNo: "1/1 (Govt)",
        plotNo: "KH-00",
        mouzaId: mouza.id,
        upazilaId: mouza.upazilaId,
        districtId: mouza.districtId,
        hazard: "river_erosion",
        landClass: "khas",
        changeKind: "loss",
        lossDecimal: unownedLoss,
        gainDecimal: 0,
        estimatedCompensationBDT: Math.round(unownedLoss * 12000),
        compensationStatus: "approved",
        paidAmountBDT: 0,
        isUnownedOrKhas: true,
        coordinates: [mLon, mLat],
      });
      totalLoss = hazardAreaDec;
    }

    const distName = DISTRICT_SPECS.find((d) => d.id === mouza.districtId)?.name;
    const upzName = UPAZILA_SPECS.find((u) => u.id === mouza.upazilaId)?.name;
    const rivName = RIVERS_CATALOG.find((r) => r.id === mouza.riverId)?.name;

    riverErosionData.results[recordedKey] = {
      id: recordedKey,
      hazard: "river_erosion",
      mode: "recorded",
      entityId: mouza.id,
      title: `${mouza.name} Riverside Bank Erosion Assessment`,
      locationLabel: `${mouza.name} (${mouza.jlNo}), ${upzName}, ${distName} | ${rivName}`,
      periodLabel: "2019 – 2024 (5 Years)",
      totalLossDecimal: Number(totalLoss.toFixed(1)),
      totalGainDecimal: randFloat(15.0, 45.0),
      netChangeDecimal: Number((-totalLoss + 20).toFixed(1)),
      trendDirection: "increasing",
      annualRateDecimal: Number((totalLoss / 5).toFixed(1)),
      metrics: [
        { label: "Bank Retreat Rate", value: `${randInt(14, 28)} m/yr`, sublabel: "Active right channel" },
        { label: "Eroded Homesteads", value: `${randInt(18, 45)} Units`, sublabel: "Relocated to polder" },
        { label: "Embankment Status", value: `Breached ${randInt(120, 340)}m`, sublabel: "Geo-bag deployment" },
      ],
      beforeYear: 2019,
      afterYear: 2024,
      owners: impactedOwners,
      trendSeries: [
        { year: "2019", loss: Math.round(totalLoss * 0.12), gain: 10 },
        { year: "2020", loss: Math.round(totalLoss * 0.16), gain: 12 },
        { year: "2021", loss: Math.round(totalLoss * 0.18), gain: 15 },
        { year: "2022", loss: Math.round(totalLoss * 0.22), gain: 14 },
        { year: "2023", loss: Math.round(totalLoss * 0.2), gain: 16 },
        { year: "2024", loss: Math.round(totalLoss * 0.25), gain: 18 },
      ],
      geometry,
    };
  }

  // FORECAST RESULT
  if (!isEmptyForecast) {
    const forecastKey = `river_erosion_forecast_${mouza.id}`;
    riverErosionData.geometries[forecastKey] = geometry;

    const forecastOwners: OwnerRecord[] = [];
    let fLoss = 0;

    for (const plot of plots) {
      try {
        const plotFeature = turf.polygon(plot.polygon);
        const intersection = turf.intersect(
          turf.featureCollection([plotFeature, forecastLossPolygonFeature])
        );
        if (intersection) {
          const areaSqM = turf.area(intersection);
          const areaDec = Number((areaSqM / 40.4686).toFixed(1));
          if (areaDec > 0.5) {
            const ownerObj = allOwners.find((o) => o.id === plot.ownerId);
            const rate = LAND_CLASS_RATES[plot.landClass] || 12000;
            const estComp = Math.round(areaDec * rate);

            fLoss += areaDec;

            forecastOwners.push({
              id: `fc_rec_${plot.id}`,
              name: ownerObj?.name || "Local Resident",
              dagNo: plot.dagNo,
              khatianNo: plot.khatianNo,
              plotNo: plot.dagNo,
              mouzaId: mouza.id,
              upazilaId: mouza.upazilaId,
              districtId: mouza.districtId,
              hazard: "river_erosion",
              landClass: plot.landClass,
              changeKind: "loss",
              lossDecimal: areaDec,
              gainDecimal: 0,
              estimatedCompensationBDT: estComp,
              isUnownedOrKhas: plot.landClass === "khas",
              coordinates: plot.polygon[0][0] as [number, number],
            });
          }
        }
      } catch (e) {}
    }

    const fHazardAreaSqM = turf.area(forecastLossPolygonFeature);
    const fHazardAreaDec = Number((fHazardAreaSqM / 40.4686).toFixed(1));
    const fPlotLossSum = forecastOwners.reduce((s, o) => s + o.lossDecimal, 0);
    const fUnownedLoss = Number((fHazardAreaDec - fPlotLossSum).toFixed(1));
    if (fUnownedLoss > 0.5) {
      forecastOwners.push({
        id: `fc_rec_khas_${mouza.id}`,
        name: "Unowned Land (State Khas Projected Retreat)",
        dagNo: "KH-00",
        khatianNo: "1/1 (Govt)",
        plotNo: "KH-00",
        mouzaId: mouza.id,
        upazilaId: mouza.upazilaId,
        districtId: mouza.districtId,
        hazard: "river_erosion",
        landClass: "khas",
        changeKind: "loss",
        lossDecimal: fUnownedLoss,
        gainDecimal: 0,
        estimatedCompensationBDT: Math.round(fUnownedLoss * 12000),
        isUnownedOrKhas: true,
        coordinates: [mLon, mLat],
      });
      fLoss = fHazardAreaDec;
    }

    const distName = DISTRICT_SPECS.find((d) => d.id === mouza.districtId)?.name;
    const upzName = UPAZILA_SPECS.find((u) => u.id === mouza.upazilaId)?.name;
    const rivName = RIVERS_CATALOG.find((r) => r.id === mouza.riverId)?.name;

    riverErosionData.results[forecastKey] = {
      id: forecastKey,
      hazard: "river_erosion",
      mode: "forecast",
      entityId: mouza.id,
      title: `${mouza.name} Riverside Bank Erosion Risk Projection`,
      locationLabel: `${mouza.name} (${mouza.jlNo}), ${upzName}, ${distName} | ${rivName}`,
      periodLabel: "2025 – 2026 (Model Projection)",
      totalLossDecimal: Number(fLoss.toFixed(1)),
      totalGainDecimal: randFloat(20.0, 60.0),
      netChangeDecimal: Number((-fLoss + 25).toFixed(1)),
      trendDirection: "increasing",
      annualRateDecimal: Number((fLoss * 0.9).toFixed(1)),
      confidence: {
        level: "High",
        scorePercent: randInt(82, 94),
      },
      metrics: [
        { label: "Projected Bank Retreat", value: `${randInt(20, 34)} m/yr`, sublabel: "Hydrodynamic shear estimate" },
        { label: "Plots at Imminent Risk", value: `${forecastOwners.length} Plots`, sublabel: "High vulnerability buffer" },
        { label: "Model Certainty", value: `${randInt(84, 92)}% Confident`, sublabel: "Multi-temporal ConvLSTM" },
      ],
      beforeYear: 2024,
      afterYear: 2025,
      owners: forecastOwners,
      trendSeries: [
        { year: "2022", loss: 120, gain: 20 },
        { year: "2023", loss: 110, gain: 24 },
        { year: "2024", loss: 135, gain: 18 },
        { year: "2025 (F)", loss: Math.round(fLoss * 0.9), gain: 15, forecastLoss: Math.round(fLoss * 0.9), forecastGain: 15 },
        { year: "2026 (F)", loss: Math.round(fLoss * 1.1), gain: 12, forecastLoss: Math.round(fLoss * 1.1), forecastGain: 12 },
      ],
      geometry,
    };
  }
}

// D. MODULE 2: FLOOD EVENTS
const floodDistricts = ["sunamganj", "sylhet", "kurigram", "sirajganj"];
const floodMouzas = allMouzas.filter((m) => floodDistricts.includes(m.districtId));

interface FloodMockData {
  events: FloodEvent[];
  results: Record<string, HazardResult>;
}

const floodData: FloodMockData = {
  events: [],
  results: {},
};

for (const mouza of floodMouzas) {
  const upzDef = UPAZILA_SPECS.find((u) => u.id === mouza.upazilaId);
  const isEmptyFlood = upzDef?.emptyHazards?.flood?.includes("recorded");
  if (isEmptyFlood) continue;

  const plots = allPlots.filter((p) => p.mouzaId === mouza.id);
  const [mLon, mLat] = mouza.centroid || [91.4, 25.07];

  const mouzaBoundaryCoords: [number, number][] = mouza.boundary || [
    [mLon - 0.008, mLat - 0.005],
    [mLon + 0.008, mLat - 0.005],
    [mLon + 0.008, mLat + 0.005],
    [mLon - 0.008, mLat + 0.005],
    [mLon - 0.008, mLat - 0.005],
  ];

  const shallowBox: [number, number][] = [
    [Number((mLon - 0.007).toFixed(5)), Number((mLat - 0.004).toFixed(5))],
    [Number((mLon + 0.006).toFixed(5)), Number((mLat - 0.004).toFixed(5))],
    [Number((mLon + 0.006).toFixed(5)), Number((mLat + 0.004).toFixed(5))],
    [Number((mLon - 0.007).toFixed(5)), Number((mLat + 0.004).toFixed(5))],
    [Number((mLon - 0.007).toFixed(5)), Number((mLat - 0.004).toFixed(5))],
  ];

  const moderateBox: [number, number][] = [
    [Number((mLon - 0.005).toFixed(5)), Number((mLat - 0.003).toFixed(5))],
    [Number((mLon + 0.004).toFixed(5)), Number((mLat - 0.003).toFixed(5))],
    [Number((mLon + 0.004).toFixed(5)), Number((mLat + 0.003).toFixed(5))],
    [Number((mLon - 0.005).toFixed(5)), Number((mLat + 0.003).toFixed(5))],
    [Number((mLon - 0.005).toFixed(5)), Number((mLat - 0.003).toFixed(5))],
  ];

  const deepBox: [number, number][] = [
    [Number((mLon - 0.003).toFixed(5)), Number((mLat - 0.002).toFixed(5))],
    [Number((mLon + 0.002).toFixed(5)), Number((mLat - 0.002).toFixed(5))],
    [Number((mLon + 0.002).toFixed(5)), Number((mLat + 0.002).toFixed(5))],
    [Number((mLon - 0.003).toFixed(5)), Number((mLat + 0.002).toFixed(5))],
    [Number((mLon - 0.003).toFixed(5)), Number((mLat - 0.002).toFixed(5))],
  ];

  const shallowFeature = turf.polygon([shallowBox]);
  const moderateFeature = turf.polygon([moderateBox]);
  const deepFeature = turf.polygon([deepBox]);

  const eventYears = randSample([2022, 2023, 2024, 2025], randInt(1, 3)).sort((a, b) => b - a);

  for (const year of eventYears) {
    const fId = `flood_${mouza.id}_${year}`;
    const dateStr = `${year}-07-${randInt(10, 26)}`;

    const plotStatuses: FloodPlotStatus[] = [];
    let floodedAreaTotal = 0;

    for (const plot of plots) {
      let depthClass: "shallow" | "moderate" | "deep" | "none" = "none";
      let isFlooded = false;

      try {
        const plotFeature = turf.polygon(plot.polygon);
        if (turf.intersect(turf.featureCollection([plotFeature, deepFeature]))) {
          depthClass = "deep";
          isFlooded = true;
        } else if (turf.intersect(turf.featureCollection([plotFeature, moderateFeature]))) {
          depthClass = "moderate";
          isFlooded = true;
        } else if (turf.intersect(turf.featureCollection([plotFeature, shallowFeature]))) {
          depthClass = "shallow";
          isFlooded = true;
        }
      } catch (e) {
        if (rand() > 0.4) {
          depthClass = randChoice(["shallow", "moderate"]);
          isFlooded = true;
        }
      }

      if (isFlooded) {
        const fArea = randFloat(plot.areaDecimal * 0.4, plot.areaDecimal, 1);
        floodedAreaTotal += fArea;
        const ownerObj = allOwners.find((o) => o.id === plot.ownerId);

        plotStatuses.push({
          plotId: plot.id,
          dagNo: plot.dagNo,
          khatianNo: plot.khatianNo,
          ownerId: plot.ownerId,
          ownerName: ownerObj?.name || "Local Farmer",
          landClass: plot.landClass,
          totalAreaDecimal: plot.areaDecimal,
          floodedAreaDecimal: fArea,
          depthClass,
          status: "Submerged",
          centroid: [plot.corners[0].lat, plot.corners[0].lon],
          boundary: plot.polygon[0],
          corners: plot.corners,
          estCompensationBdt: Math.round(fArea * (LAND_CLASS_RATES[plot.landClass] || 12000)),
          colorIndex: ownerObj?.colorIndex ?? 0,
        });
      }
    }

    const floodHazardAreaSqM = turf.area(shallowFeature);
    const floodHazardAreaDec = Number((floodHazardAreaSqM / 40.4686).toFixed(1));
    const plotFloodedSum = plotStatuses.reduce((s, p) => s + p.floodedAreaDecimal, 0);
    const unownedFlooded = Number((floodHazardAreaDec - plotFloodedSum).toFixed(1));
    if (unownedFlooded > 0.5) {
      const khasCorners = deriveCorners(mouzaBoundaryCoords);
      plotStatuses.push({
        plotId: `fl_plot_khas_${mouza.id}_${year}`,
        dagNo: "KH-00",
        khatianNo: "1/1 (Govt)",
        ownerId: "owner_khas",
        ownerName: "Unowned Land (Government Khas Floodplain)",
        landClass: "khas",
        totalAreaDecimal: unownedFlooded,
        floodedAreaDecimal: unownedFlooded,
        depthClass: "moderate",
        status: "Submerged",
        centroid: [mLat, mLon],
        boundary: mouzaBoundaryCoords,
        corners: khasCorners,
        estCompensationBdt: 0,
        colorIndex: 0,
      });
      floodedAreaTotal = floodHazardAreaDec;
    }

    const eventObj: FloodEvent = {
      id: fId,
      mouzaId: mouza.id,
      date: dateStr,
      year,
      severity: year === 2022 || year === 2024 ? "Catastrophic" : "Severe",
      floodedAreaDecimal: Number(floodedAreaTotal.toFixed(1)),
      maxDepthM: randFloat(1.8, 3.4),
      durationDays: randInt(8, 22),
      geometry: {
        mouzaBoundary: [mouzaBoundaryCoords],
        channels: [
          [
            [mLon - 0.007, mLat - 0.001],
            [mLon + 0.006, mLat + 0.001],
          ],
        ],
        beels: [[deepBox]],
        shallowZone: [shallowBox],
        moderateZone: [moderateBox],
        deepZone: [deepBox],
      },
      plotStatus: plotStatuses,
    };

    floodData.events.push(eventObj);

    const distName = DISTRICT_SPECS.find((d) => d.id === mouza.districtId)?.name;
    const upzName = UPAZILA_SPECS.find((u) => u.id === mouza.upazilaId)?.name;
    const rivName = RIVERS_CATALOG.find((r) => r.id === mouza.riverId)?.name || "Flood Channel";

    const ownerRecords: OwnerRecord[] = plotStatuses.map((ps) => ({
      id: `fl_owner_${ps.plotId}`,
      name: ps.ownerName,
      dagNo: ps.dagNo,
      khatianNo: ps.khatianNo,
      plotNo: ps.dagNo,
      mouzaId: mouza.id,
      upazilaId: mouza.upazilaId,
      districtId: mouza.districtId,
      hazard: "flood",
      landClass: ps.landClass,
      changeKind: "loss",
      lossDecimal: ps.floodedAreaDecimal,
      gainDecimal: 0,
      estimatedCompensationBDT: ps.estCompensationBdt,
      compensationStatus: randChoice(["approved", "pending", "paid"]) as any,
      paidAmountBDT: 0,
      isUnownedOrKhas: false,
      coordinates: [ps.centroid[1], ps.centroid[0]],
      colorIndex: ps.colorIndex,
    }));

    const hazardResultKey = `flood_recorded_${mouza.id}`;
    if (!floodData.results[hazardResultKey]) {
      floodData.results[hazardResultKey] = {
        id: hazardResultKey,
        hazard: "flood",
        mode: "recorded",
        entityId: mouza.id,
        title: `${mouza.name} Flood Inundation & Siltation Assessment`,
        locationLabel: `${mouza.name} (${mouza.jlNo}), ${upzName}, ${distName} | ${rivName}`,
        periodLabel: `Monsoon ${year} Inundation Event`,
        totalLossDecimal: Number(floodedAreaTotal.toFixed(1)),
        totalGainDecimal: randFloat(12.0, 48.0),
        netChangeDecimal: Number((-floodedAreaTotal + 20).toFixed(1)),
        trendDirection: "increasing",
        annualRateDecimal: Number((floodedAreaTotal / 2.5).toFixed(1)),
        metrics: [
          { label: "Peak Water Level", value: `${randFloat(12.4, 15.2)} m PWD`, sublabel: "+1.6m above danger level" },
          { label: "Submersion Duration", value: `${eventObj.durationDays} Days`, sublabel: "Standing water in depression" },
          { label: "Topsoil Silt Thickness", value: `${randInt(15, 40)} cm`, sublabel: "Sand deposition on paddy" },
        ],
        beforeYear: year - 1,
        afterYear: year,
        owners: ownerRecords,
        trendSeries: [
          { year: "2020", loss: 140, gain: 10 },
          { year: "2021", loss: 95, gain: 12 },
          { year: "2022", loss: 280, gain: 20 },
          { year: "2023", loss: 160, gain: 15 },
          { year: "2024", loss: 240, gain: 18 },
        ],
        geometry: eventObj.geometry,
      };
    }
  }
}

// E. MODULE 3: LANDSLIDE
const hillshadeBase64 = generateHillshadePng();
interface LandslideMockData {
  results: Record<string, HazardResult>;
  geometries: Record<string, LandslideGeometry>;
}

const landslideData: LandslideMockData = {
  results: {},
  geometries: {},
};

for (const hill of HILLS_CATALOG) {
  const upzDef = UPAZILA_SPECS.find((u) => u.id === hill.upazilaId);
  const isEmptyRecorded = upzDef?.emptyHazards?.landslide?.includes("recorded");
  const isEmptyForecast = upzDef?.emptyHazards?.landslide?.includes("forecast");

  const [cLon, cLat] = upzDef?.centerCoordinates || [92.18, 22.65];
  const mouza = allMouzas.find((m) => m.upazilaId === hill.upazilaId) || allMouzas[0];
  const plots = allPlots.filter((p) => p.mouzaId === mouza.id);

  const contours = [50, 100, 150, 200, 250].map((elev) => {
    const radius = (300 - elev) * 0.00003;
    const pts: [number, number][] = [];
    for (let a = 0; a <= 12; a++) {
      const ang = (a / 12) * Math.PI * 2;
      pts.push([
        Number((cLon + Math.cos(ang) * radius).toFixed(5)),
        Number((cLat + Math.sin(ang) * radius * 0.8).toFixed(5)),
      ]);
    }
    return { elevation: elev, line: pts };
  });

  const scarCoords: [number, number][] = [
    [cLon - 0.001, cLat + 0.003],
    [cLon + 0.001, cLat + 0.003],
    [cLon + 0.002, cLat],
    [cLon, cLat - 0.002],
    [cLon - 0.002, cLat],
    [cLon - 0.001, cLat + 0.003],
  ];

  const runoutCoords: [number, number][] = [
    [cLon, cLat - 0.002],
    [cLon + 0.003, cLat - 0.005],
    [cLon - 0.003, cLat - 0.005],
    [cLon, cLat - 0.002],
  ];

  const streamCoords: [number, number][] = [
    [cLon - 0.006, cLat - 0.006],
    [cLon, cLat - 0.005],
    [cLon + 0.006, cLat - 0.004],
  ];

  const roadCoords: [number, number][] = [
    [cLon - 0.005, cLat + 0.001],
    [cLon, cLat + 0.002],
    [cLon + 0.005, cLat + 0.003],
  ];

  const landslideGeo: LandslideGeometry = {
    mouzaBoundary: [mouza.boundary || []],
    contours,
    scar: [scarCoords],
    debrisRunout: [runoutCoords],
    stream: streamCoords,
    road: roadCoords,
    hillshadePng: hillshadeBase64,
    susceptibilityZones: [
      { level: "Very high", polygon: [scarCoords] },
      { level: "High", polygon: [runoutCoords] },
      {
        level: "Moderate",
        polygon: [
          [
            [cLon - 0.004, cLat - 0.003],
            [cLon + 0.004, cLat - 0.003],
            [cLon + 0.004, cLat + 0.004],
            [cLon - 0.004, cLat + 0.004],
            [cLon - 0.004, cLat - 0.003],
          ],
        ],
      },
    ],
    predictedScar: [scarCoords],
  };

  const distName = DISTRICT_SPECS.find((d) => d.id === upzDef?.districtId)?.name;

  if (!isEmptyRecorded) {
    const recKey = `landslide_recorded_${hill.id}`;
    landslideData.geometries[recKey] = landslideGeo;

    const owners: OwnerRecord[] = plots.slice(0, 6).map((plot) => {
      const areaDec = randFloat(8.0, 32.0);
      const estComp = Math.round(areaDec * 22000);
      return {
        id: `ls_rec_${plot.id}`,
        name: allOwners.find((o) => o.id === plot.ownerId)?.name || "Hilltop Resident",
        dagNo: plot.dagNo,
        khatianNo: plot.khatianNo,
        plotNo: plot.dagNo,
        mouzaId: mouza.id,
        upazilaId: hill.upazilaId,
        districtId: mouza.districtId,
        hazard: "landslide",
        landClass: plot.landClass,
        changeKind: "loss",
        lossDecimal: areaDec,
        gainDecimal: 0,
        estimatedCompensationBDT: estComp,
        compensationStatus: randChoice(["approved", "pending", "paid"]) as any,
        paidAmountBDT: 0,
        isUnownedOrKhas: false,
        coordinates: plot.polygon[0][0] as [number, number],
      };
    });

    const totLoss = owners.reduce((s, o) => s + o.lossDecimal, 0);

    landslideData.results[recKey] = {
      id: recKey,
      hazard: "landslide",
      mode: "recorded",
      entityId: hill.id,
      title: `${hill.name} Slope Failure & Mass Wasting`,
      locationLabel: `${hill.name}, ${upzDef?.name}, ${distName} | Hill Tracts Corridor`,
      periodLabel: "June 2024 Monsoonal Slope Rupture",
      totalLossDecimal: Number(totLoss.toFixed(1)),
      totalGainDecimal: 0,
      netChangeDecimal: Number((-totLoss).toFixed(1)),
      trendDirection: "increasing",
      annualRateDecimal: Number((totLoss / 3).toFixed(1)),
      metrics: [
        { label: "Debris Volume", value: `${randInt(35000, 65000)} m³`, sublabel: "Colluvial soil collapse" },
        { label: "Slope Gradient", value: `${hill.slopeAngleDeg}° Angle`, sublabel: "Unvegetated terrace" },
        { label: "Casualties Avoided", value: `${randInt(12, 35)} Families`, sublabel: "Early warning protocol" },
      ],
      beforeYear: 2023,
      afterYear: 2024,
      owners,
      trendSeries: [
        { year: "2020", loss: 18, gain: 0 },
        { year: "2021", loss: 24, gain: 0 },
        { year: "2022", loss: 45, gain: 0 },
        { year: "2023", loss: 30, gain: 0 },
        { year: "2024", loss: 68, gain: 0 },
      ],
      geometry: landslideGeo,
    };
  }

  if (!isEmptyForecast) {
    const fcKey = `landslide_forecast_${hill.id}`;
    landslideData.geometries[fcKey] = landslideGeo;

    const fcOwners: OwnerRecord[] = plots.slice(0, 5).map((plot) => {
      const areaDec = randFloat(12.0, 42.0);
      const estComp = Math.round(areaDec * 22000);
      return {
        id: `ls_fc_${plot.id}`,
        name: allOwners.find((o) => o.id === plot.ownerId)?.name || "Hilltop Resident",
        dagNo: plot.dagNo,
        khatianNo: plot.khatianNo,
        plotNo: plot.dagNo,
        mouzaId: mouza.id,
        upazilaId: hill.upazilaId,
        districtId: mouza.districtId,
        hazard: "landslide",
        landClass: plot.landClass,
        changeKind: "loss",
        lossDecimal: areaDec,
        gainDecimal: 0,
        estimatedCompensationBDT: estComp,
        isUnownedOrKhas: false,
        coordinates: plot.polygon[0][0] as [number, number],
      };
    });

    const totLoss = fcOwners.reduce((s, o) => s + o.lossDecimal, 0);

    landslideData.results[fcKey] = {
      id: fcKey,
      hazard: "landslide",
      mode: "forecast",
      entityId: hill.id,
      title: `${hill.name} Mass-Movement Susceptibility Forecast`,
      locationLabel: `${hill.name}, ${upzDef?.name}, ${distName} | High Risk Slope Zone`,
      periodLabel: "2025 – 2026 Monsoon Deep Learning Model",
      totalLossDecimal: Number(totLoss.toFixed(1)),
      totalGainDecimal: 0,
      netChangeDecimal: Number((-totLoss).toFixed(1)),
      trendDirection: "increasing",
      annualRateDecimal: Number((totLoss / 2).toFixed(1)),
      confidence: {
        level: "High",
        scorePercent: randInt(80, 92),
      },
      metrics: [
        { label: "Projected Debris Volume", value: `${randInt(50000, 85000)} m³`, sublabel: "Saturated slope shear" },
        { label: "Critical Slope Angle", value: `${hill.slopeAngleDeg + 2}° Unreinforced`, sublabel: "Deforested crest warning" },
        { label: "Vulnerable Settlements", value: `${randInt(22, 45)} Homesteads`, sublabel: "Immediate downslope buffer" },
      ],
      beforeYear: 2024,
      afterYear: 2025,
      owners: fcOwners,
      trendSeries: [
        { year: "2022", loss: 45, gain: 0 },
        { year: "2023", loss: 30, gain: 0 },
        { year: "2024", loss: 68, gain: 0 },
        { year: "2025 (F)", loss: Math.round(totLoss * 0.9), gain: 0, forecastLoss: Math.round(totLoss * 0.9), forecastGain: 0 },
        { year: "2026 (F)", loss: Math.round(totLoss * 1.15), gain: 0, forecastLoss: Math.round(totLoss * 1.15), forecastGain: 0 },
      ],
      geometry: landslideGeo,
    };
  }
}

// F. MODULE 4: CHAR ISLANDS
interface CharMockData {
  chars: CharIsland[];
  results: Record<string, HazardResult>;
  geometries: Record<string, CharGeometry>;
}

const charData: CharMockData = {
  chars: [],
  results: {},
  geometries: {},
};

const charUpazilas = UPAZILA_SPECS.filter((u) => u.hasChars);

for (const upz of charUpazilas) {
  const isEmptyChar = upz.emptyHazards?.char?.includes("recorded");
  if (isEmptyChar) continue;

  const [cLon, cLat] = upz.centerCoordinates;
  const rivId = upz.rivers[0] || "jamuna";
  const numChars = randInt(1, 2);

  for (let c = 1; c <= numChars; c++) {
    const charId = `char_${upz.id}_${c}`;
    const charName = `Char ${upz.name} Island ${c === 1 ? "North" : "South"}`;
    const totArea = randFloat(1800, 4200, 0);

    const charItem: CharIsland = {
      id: charId,
      name: charName,
      riverId: rivId,
      upazilaId: upz.id,
      firstSeenYear: randInt(2008, 2018),
      vegetationStatus: randChoice(["Dense pioneer grass", "Partially vegetated", "Consolidated agriculture"]),
      stabilityIndex: randFloat(0.62, 0.84, 2),
      totalAreaDecimal: totArea,
    };
    charData.chars.push(charItem);

    const islandPoly: [number, number][] = [
      [cLon - 0.005, cLat - 0.003],
      [cLon + 0.005, cLat - 0.003],
      [cLon + 0.007, cLat],
      [cLon + 0.003, cLat + 0.004],
      [cLon - 0.004, cLat + 0.003],
      [cLon - 0.006, cLat],
      [cLon - 0.005, cLat - 0.003],
    ];

    const accretionTip: [number, number][] = [
      [cLon + 0.005, cLat - 0.003],
      [cLon + 0.009, cLat - 0.005],
      [cLon + 0.007, cLat],
      [cLon + 0.005, cLat - 0.003],
    ];

    const erosionFlank: [number, number][] = [
      [cLon - 0.006, cLat],
      [cLon - 0.004, cLat + 0.003],
      [cLon - 0.007, cLat + 0.002],
      [cLon - 0.006, cLat],
    ];

    const charGeo: CharGeometry = {
      riverChannel: [
        [
          [cLon - 0.012, cLat - 0.008],
          [cLon + 0.012, cLat - 0.008],
          [cLon + 0.012, cLat + 0.008],
          [cLon - 0.012, cLat + 0.008],
          [cLon - 0.012, cLat - 0.008],
        ],
      ],
      islandsBaseline: [[islandPoly]],
      islandsCurrent: [[islandPoly]],
      accretionTips: [[accretionTip]],
      erosionFlanks: [[erosionFlank]],
      unownedKhasLand: [[accretionTip]],
      forecastIslands: [[islandPoly]],
    };

    const distName = DISTRICT_SPECS.find((d) => d.id === upz.districtId)?.name;
    const rivName = RIVERS_CATALOG.find((r) => r.id === rivId)?.name;

    const recKey = `char_recorded_${charId}`;
    charData.geometries[recKey] = charGeo;

    const owners: OwnerRecord[] = [
      {
        id: `char_own_1_${charId}`,
        name: "Unowned Land (State Khas Alluvial Accretion)",
        dagNo: "KH-01",
        khatianNo: "1/1 (Govt)",
        plotNo: "KH-01",
        mouzaId: `mouza_${upz.id}_1`,
        upazilaId: upz.id,
        districtId: upz.districtId,
        hazard: "char",
        landClass: "khas",
        changeKind: "gain",
        lossDecimal: 0,
        gainDecimal: 240.0,
        estimatedCompensationBDT: 0,
        compensationStatus: "not_applicable",
        paidAmountBDT: 0,
        isUnownedOrKhas: true,
        coordinates: [cLon + 0.006, cLat - 0.004],
      },
      {
        id: `char_own_2_${charId}`,
        name: "Abul Kashem Mollah",
        dagNo: "CG-12",
        khatianNo: "CS-128",
        plotNo: "CG-12",
        mouzaId: `mouza_${upz.id}_1`,
        upazilaId: upz.id,
        districtId: upz.districtId,
        hazard: "char",
        landClass: "agri",
        changeKind: "gain",
        lossDecimal: 0,
        gainDecimal: 48.5,
        estimatedCompensationBDT: 0,
        compensationStatus: "approved",
        paidAmountBDT: 0,
        isUnownedOrKhas: false,
        coordinates: [cLon, cLat],
      },
      {
        id: `char_own_3_${charId}`,
        name: "Nurul Huda Mia",
        dagNo: "CG-18",
        khatianNo: "RS-480",
        plotNo: "CG-18",
        mouzaId: `mouza_${upz.id}_1`,
        upazilaId: upz.id,
        districtId: upz.districtId,
        hazard: "char",
        landClass: "agri",
        changeKind: "loss",
        lossDecimal: 32.0,
        gainDecimal: 0,
        estimatedCompensationBDT: 384000,
        compensationStatus: "pending",
        paidAmountBDT: 0,
        isUnownedOrKhas: false,
        coordinates: [cLon - 0.005, cLat + 0.001],
      },
    ];

    charData.results[recKey] = {
      id: recKey,
      hazard: "char",
      mode: "recorded",
      entityId: charId,
      title: `${charName} Accretion & Consolidation`,
      locationLabel: `${charName}, ${upz.name}, ${distName} | ${rivName}`,
      periodLabel: "2018 – 2024 Cadastral Evolution",
      totalLossDecimal: 180.0,
      totalGainDecimal: 420.0,
      netChangeDecimal: 240.0,
      trendDirection: "increasing",
      annualRateDecimal: 35.0,
      metrics: [
        { label: "Consolidated Area", value: `${totArea} dec`, sublabel: "Vegetated sandbar body" },
        { label: "Accretion Velocity", value: "+42 dec/yr", sublabel: "Upstream sediment trapping" },
        { label: "Stability Score", value: `${charItem.stabilityIndex} / 1.0`, sublabel: "Alluvial consolidation" },
      ],
      beforeYear: 2018,
      afterYear: 2024,
      owners,
      trendSeries: [
        { year: "2019", loss: 35, gain: 60 },
        { year: "2020", loss: 28, gain: 75 },
        { year: "2021", loss: 42, gain: 65 },
        { year: "2022", loss: 30, gain: 90 },
        { year: "2023", loss: 25, gain: 80 },
        { year: "2024", loss: 20, gain: 95 },
      ],
      geometry: charGeo,
    };

    const fcKey = `char_forecast_${charId}`;
    charData.geometries[fcKey] = charGeo;

    const fcOwners: OwnerRecord[] = [
      {
        id: `char_fc_1_${charId}`,
        name: "Unowned Land (State Khas Alluvial Accretion)",
        dagNo: "KH-01",
        khatianNo: "1/1 (Govt)",
        plotNo: "KH-01",
        mouzaId: `mouza_${upz.id}_1`,
        upazilaId: upz.id,
        districtId: upz.districtId,
        hazard: "char",
        landClass: "khas",
        changeKind: "gain",
        lossDecimal: 0,
        gainDecimal: 310.0,
        estimatedCompensationBDT: 0,
        isUnownedOrKhas: true,
        coordinates: [cLon + 0.006, cLat - 0.004],
      },
      {
        id: `char_fc_2_${charId}`,
        name: "Abul Kashem Mollah",
        dagNo: "CG-12",
        khatianNo: "CS-128",
        plotNo: "CG-12",
        mouzaId: `mouza_${upz.id}_1`,
        upazilaId: upz.id,
        districtId: upz.districtId,
        hazard: "char",
        landClass: "agri",
        changeKind: "gain",
        lossDecimal: 0,
        gainDecimal: 65.0,
        estimatedCompensationBDT: 0,
        isUnownedOrKhas: false,
        coordinates: [cLon, cLat],
      },
      {
        id: `char_fc_3_${charId}`,
        name: "Nurul Huda Mia",
        dagNo: "CG-18",
        khatianNo: "RS-480",
        plotNo: "CG-18",
        mouzaId: `mouza_${upz.id}_1`,
        upazilaId: upz.id,
        districtId: upz.districtId,
        hazard: "char",
        landClass: "agri",
        changeKind: "loss",
        lossDecimal: 28.0,
        gainDecimal: 0,
        estimatedCompensationBDT: 336000,
        isUnownedOrKhas: false,
        coordinates: [cLon - 0.005, cLat + 0.001],
      },
    ];

    charData.results[fcKey] = {
      id: fcKey,
      hazard: "char",
      mode: "forecast",
      entityId: charId,
      title: `${charName} Morphological Evolution & Stability Projection`,
      locationLabel: `${charName}, ${upz.name}, ${distName} | Active Channel`,
      periodLabel: "2025 – 2026 Multi-Temporal Satellite Model",
      totalLossDecimal: 140.0,
      totalGainDecimal: 510.0,
      netChangeDecimal: 370.0,
      trendDirection: "increasing",
      annualRateDecimal: 48.0,
      confidence: {
        level: "High",
        scorePercent: randInt(82, 91),
      },
      metrics: [
        { label: "Projected Area", value: `${Math.round(totArea * 1.08)} dec`, sublabel: "Vegetated sandbar expansion" },
        { label: "Accretion Velocity", value: "+58 dec/yr", sublabel: "Active sandbar attachment" },
        { label: "Stability Score", value: "0.78 / 1.0", sublabel: "Increasing consolidation" },
      ],
      beforeYear: 2024,
      afterYear: 2025,
      owners: fcOwners,
      trendSeries: [
        { year: "2022", loss: 30, gain: 90 },
        { year: "2023", loss: 25, gain: 80 },
        { year: "2024", loss: 20, gain: 95 },
        { year: "2025 (F)", loss: 18, gain: 115, forecastLoss: 18, forecastGain: 115 },
        { year: "2026 (F)", loss: 15, gain: 130, forecastLoss: 15, forecastGain: 130 },
      ],
      geometry: charGeo,
    };
  }
}

// G. MODULE 5: COASTAL SHIFTS
interface CoastalMockData {
  results: Record<string, HazardResult>;
  geometries: Record<string, CoastalGeometry>;
}

const coastalData: CoastalMockData = {
  results: {},
  geometries: {},
};

const coastalMouzas = allMouzas.filter((m) => coastalDistricts.includes(m.districtId));

for (const mouza of coastalMouzas) {
  const upzDef = UPAZILA_SPECS.find((u) => u.id === mouza.upazilaId);
  const isEmptyCoastal = upzDef?.emptyHazards?.coastal?.includes("recorded");
  if (isEmptyCoastal) continue;

  const [cLon, cLat] = mouza.centroid || [90.71, 22.19];
  const plots = allPlots.filter((p) => p.mouzaId === mouza.id);

  const shorelineBefore: [number, number][] = [
    [cLon - 0.008, cLat + 0.004],
    [cLon - 0.002, cLat + 0.002],
    [cLon + 0.004, cLat - 0.001],
    [cLon + 0.008, cLat - 0.004],
  ];

  const shorelineAfter: [number, number][] = [
    [cLon - 0.008, cLat + 0.002],
    [cLon - 0.002, cLat],
    [cLon + 0.004, cLat - 0.003],
    [cLon + 0.008, cLat - 0.006],
  ];

  const mudflatsPolygon: [number, number][] = [
    [cLon + 0.002, cLat - 0.002],
    [cLon + 0.007, cLat - 0.002],
    [cLon + 0.009, cLat - 0.006],
    [cLon + 0.004, cLat - 0.006],
    [cLon + 0.002, cLat - 0.002],
  ];

  const coastalGeo: CoastalGeometry = {
    coastlineBefore: shorelineBefore,
    coastlineAfter: shorelineAfter,
    accretionMudflats: [[mudflatsPolygon]],
    erosionZone: [
      [
        [
          ...shorelineBefore,
          ...shorelineAfter.slice().reverse(),
          shorelineBefore[0],
        ],
      ],
    ],
    tidalFlats: [
      [
        [
          [cLon - 0.008, cLat - 0.007],
          [cLon + 0.008, cLat - 0.007],
          [cLon + 0.008, cLat - 0.004],
          [cLon - 0.008, cLat - 0.004],
          [cLon - 0.008, cLat - 0.007],
        ],
      ],
    ],
    embankment: [
      [cLon - 0.008, cLat + 0.005],
      [cLon + 0.008, cLat - 0.002],
    ],
    mangrovePatch: [
      [
        [
          [cLon - 0.006, cLat + 0.001],
          [cLon - 0.002, cLat + 0.001],
          [cLon - 0.002, cLat + 0.003],
          [cLon - 0.006, cLat + 0.003],
          [cLon - 0.006, cLat + 0.001],
        ],
      ],
    ],
    bathymetryBands: [
      {
        depthLabel: "0 - 2m Intertidal Mudflat",
        polygon: [mudflatsPolygon],
      },
      {
        depthLabel: "2 - 5m Shallow Subtidal",
        polygon: [
          [
            [cLon - 0.008, cLat - 0.008],
            [cLon + 0.008, cLat - 0.008],
            [cLon + 0.008, cLat - 0.005],
            [cLon - 0.008, cLat - 0.005],
            [cLon - 0.008, cLat - 0.008],
          ],
        ],
      },
    ],
  };

  const distName = DISTRICT_SPECS.find((d) => d.id === mouza.districtId)?.name;
  const upzName = UPAZILA_SPECS.find((u) => u.id === mouza.upazilaId)?.name;

  const recKey = `coastal_recorded_${mouza.id}`;
  coastalData.geometries[recKey] = coastalGeo;

  const owners: OwnerRecord[] = [
    {
      id: `cst_own_1_${mouza.id}`,
      name: "Unassigned New Land (Intertidal Mudflats Block-A)",
      dagNo: "V-01",
      khatianNo: "1/1 (Govt)",
      plotNo: "V-01",
      mouzaId: mouza.id,
      upazilaId: mouza.upazilaId,
      districtId: mouza.districtId,
      hazard: "coastal",
      landClass: "khas",
      changeKind: "gain",
      lossDecimal: 0,
      gainDecimal: 240.0,
      estimatedCompensationBDT: 0,
      compensationStatus: "not_applicable",
      paidAmountBDT: 0,
      isUnownedOrKhas: true,
      coordinates: [cLon + 0.005, cLat - 0.004],
    },
    ...plots.slice(0, 5).map((plot) => {
      const areaDec = randFloat(15.0, 45.0);
      const estComp = Math.round(areaDec * 14000);
      return {
        id: `cst_own_plot_${plot.id}`,
        name: allOwners.find((o) => o.id === plot.ownerId)?.name || "Coastal Landowner",
        dagNo: plot.dagNo,
        khatianNo: plot.khatianNo,
        plotNo: plot.dagNo,
        mouzaId: mouza.id,
        upazilaId: mouza.upazilaId,
        districtId: mouza.districtId,
        hazard: "coastal" as const,
        landClass: plot.landClass,
        changeKind: "loss" as const,
        lossDecimal: areaDec,
        gainDecimal: 0,
        estimatedCompensationBDT: estComp,
        compensationStatus: "approved" as const,
        paidAmountBDT: 0,
        isUnownedOrKhas: false,
        coordinates: plot.polygon[0][0] as [number, number],
      };
    }),
  ];

  coastalData.results[recKey] = {
    id: recKey,
    hazard: "coastal",
    mode: "recorded",
    entityId: mouza.id,
    title: `${mouza.name} Estuarine Shoreline Migration`,
    locationLabel: `${mouza.name} (${mouza.jlNo}), ${upzName}, ${distName} | Bay of Bengal Estuary`,
    periodLabel: "2018 – 2024 Multi-Year Analysis",
    totalLossDecimal: 512.0,
    totalGainDecimal: 380.0,
    netChangeDecimal: -132.0,
    trendDirection: "decreasing",
    annualRateDecimal: 85.3,
    metrics: [
      { label: "Seaward Accretion", value: "+240 dec", sublabel: "Mudflat expansion" },
      { label: "Western Bank Erosion", value: "-310 dec", sublabel: "Tidal bore impact" },
      { label: "Salinity Index", value: "12.4 dS/m", sublabel: "High tidal influence" },
    ],
    beforeYear: 2018,
    afterYear: 2024,
    owners,
    trendSeries: [
      { year: "2019", loss: 95, gain: 50 },
      { year: "2020", loss: 88, gain: 65 },
      { year: "2021", loss: 105, gain: 70 },
      { year: "2022", loss: 110, gain: 85 },
      { year: "2023", loss: 92, gain: 80 },
      { year: "2024", loss: 82, gain: 90 },
    ],
    geometry: coastalGeo,
  };

  const fcKey = `coastal_forecast_${mouza.id}`;
  coastalData.geometries[fcKey] = coastalGeo;

  const fcOwners: OwnerRecord[] = [
    {
      id: `cst_fc_1_${mouza.id}`,
      name: "Unassigned New Land (Intertidal Mudflats Block-A)",
      dagNo: "V-01",
      khatianNo: "1/1 (Govt)",
      plotNo: "V-01",
      mouzaId: mouza.id,
      upazilaId: mouza.upazilaId,
      districtId: mouza.districtId,
      hazard: "coastal",
      landClass: "khas",
      changeKind: "gain",
      lossDecimal: 0,
      gainDecimal: 340.0,
      estimatedCompensationBDT: 0,
      isUnownedOrKhas: true,
      coordinates: [cLon + 0.005, cLat - 0.004],
    },
    ...plots.slice(0, 5).map((plot) => {
      const areaDec = randFloat(18.0, 50.0);
      const estComp = Math.round(areaDec * 14000);
      return {
        id: `cst_fc_plot_${plot.id}`,
        name: allOwners.find((o) => o.id === plot.ownerId)?.name || "Coastal Landowner",
        dagNo: plot.dagNo,
        khatianNo: plot.khatianNo,
        plotNo: plot.dagNo,
        mouzaId: mouza.id,
        upazilaId: mouza.upazilaId,
        districtId: mouza.districtId,
        hazard: "coastal" as const,
        landClass: plot.landClass,
        changeKind: "loss" as const,
        lossDecimal: areaDec,
        gainDecimal: 0,
        estimatedCompensationBDT: estComp,
        isUnownedOrKhas: false,
        coordinates: plot.polygon[0][0] as [number, number],
      };
    }),
  ];

  coastalData.results[fcKey] = {
    id: fcKey,
    hazard: "coastal",
    mode: "forecast",
    entityId: mouza.id,
    title: `${mouza.name} Coastal Shoreline Shift & Accretion Projection`,
    locationLabel: `${mouza.name} (${mouza.jlNo}), ${upzName}, ${distName} | Estuary Projection`,
    periodLabel: "2025 – 2026 Estuarine Dynamics Projection",
    totalLossDecimal: 480.0,
    totalGainDecimal: 520.0,
    netChangeDecimal: 40.0,
    trendDirection: "increasing",
    annualRateDecimal: 92.0,
    confidence: {
      level: "Medium",
      scorePercent: randInt(76, 85),
    },
    metrics: [
      { label: "Projected Accretion", value: "+340 dec", sublabel: "Estuarine intertidal mudflats" },
      { label: "Projected Bank Erosion", value: "-290 dec", sublabel: "Outer channel scour" },
      { label: "Salinity Trend", value: "13.8 dS/m", sublabel: "Dry season projection" },
    ],
    beforeYear: 2024,
    afterYear: 2025,
    owners: fcOwners,
    trendSeries: [
      { year: "2022", loss: 110, gain: 85 },
      { year: "2023", loss: 92, gain: 80 },
      { year: "2024", loss: 82, gain: 90 },
      { year: "2025 (F)", loss: 95, gain: 120, forecastLoss: 95, forecastGain: 120 },
      { year: "2026 (F)", loss: 105, gain: 140, forecastLoss: 105, forecastGain: 140 },
    ],
    geometry: coastalGeo,
  };
}

// ==========================================
// 5. UNIFIED DASHBOARD SUMMARY AGGREGATION
// ==========================================
let recLossSum = 0;
let recGainSum = 0;
let recCompBdtSum = 0;
let recPaidBdtSum = 0;
let recApprovedBdtSum = 0;
let recPendingBdtSum = 0;
const recOwnersSet = new Set<string>();

const districtLossMap: Record<string, number> = {};
const hazardLossMap: Record<string, { loss: number; gain: number }> = {
  river_erosion: { loss: 0, gain: 0 },
  flood: { loss: 0, gain: 0 },
  landslide: { loss: 0, gain: 0 },
  char: { loss: 0, gain: 0 },
  coastal: { loss: 0, gain: 0 },
};

// Aggregate River Erosion
for (const res of Object.values(riverErosionData.results)) {
  if (res.mode === "recorded") {
    recLossSum += res.totalLossDecimal;
    recGainSum += res.totalGainDecimal;
    hazardLossMap.river_erosion.loss += res.totalLossDecimal;
    hazardLossMap.river_erosion.gain += res.totalGainDecimal;
    const dist = allMouzas.find((m) => m.id === res.entityId)?.districtId || "sirajganj";
    districtLossMap[dist] = (districtLossMap[dist] || 0) + res.totalLossDecimal;

    for (const o of res.owners) {
      recOwnersSet.add(o.name);
      recCompBdtSum += o.estimatedCompensationBDT;
      if (o.compensationStatus === "paid") recPaidBdtSum += o.paidAmountBDT || o.estimatedCompensationBDT;
      else if (o.compensationStatus === "approved") recApprovedBdtSum += o.estimatedCompensationBDT;
      else if (o.compensationStatus === "pending") recPendingBdtSum += o.estimatedCompensationBDT;
    }
  }
}

// Aggregate Flood
for (const ev of floodData.events) {
  recLossSum += ev.floodedAreaDecimal;
  hazardLossMap.flood.loss += ev.floodedAreaDecimal;
  const dist = allMouzas.find((m) => m.id === ev.mouzaId)?.districtId || "sylhet";
  districtLossMap[dist] = (districtLossMap[dist] || 0) + ev.floodedAreaDecimal;

  for (const ps of ev.plotStatus) {
    recOwnersSet.add(ps.ownerName);
    recCompBdtSum += ps.estCompensationBdt;
    recApprovedBdtSum += ps.estCompensationBdt;
  }
}

// Aggregate Landslide
for (const res of Object.values(landslideData.results)) {
  if (res.mode === "recorded") {
    recLossSum += res.totalLossDecimal;
    hazardLossMap.landslide.loss += res.totalLossDecimal;
    const hill = HILLS_CATALOG.find((h) => h.id === res.entityId);
    const upz = UPAZILA_SPECS.find((u) => u.id === hill?.upazilaId);
    const dist = upz?.districtId || "rangamati";
    districtLossMap[dist] = (districtLossMap[dist] || 0) + res.totalLossDecimal;

    for (const o of res.owners) {
      recOwnersSet.add(o.name);
      recCompBdtSum += o.estimatedCompensationBDT;
      if (o.compensationStatus === "paid") recPaidBdtSum += o.paidAmountBDT || o.estimatedCompensationBDT;
      else if (o.compensationStatus === "approved") recApprovedBdtSum += o.estimatedCompensationBDT;
      else if (o.compensationStatus === "pending") recPendingBdtSum += o.estimatedCompensationBDT;
    }
  }
}

// Aggregate Char
for (const res of Object.values(charData.results)) {
  if (res.mode === "recorded") {
    recLossSum += res.totalLossDecimal;
    recGainSum += res.totalGainDecimal;
    hazardLossMap.char.loss += res.totalLossDecimal;
    hazardLossMap.char.gain += res.totalGainDecimal;
    const charItem = charData.chars.find((c) => c.id === res.entityId);
    const dist = UPAZILA_SPECS.find((u) => u.id === charItem?.upazilaId)?.districtId || "sirajganj";
    districtLossMap[dist] = (districtLossMap[dist] || 0) + res.totalLossDecimal;
  }
}

// Aggregate Coastal
for (const res of Object.values(coastalData.results)) {
  if (res.mode === "recorded") {
    recLossSum += res.totalLossDecimal;
    recGainSum += res.totalGainDecimal;
    hazardLossMap.coastal.loss += res.totalLossDecimal;
    hazardLossMap.coastal.gain += res.totalGainDecimal;
    const dist = allMouzas.find((m) => m.id === res.entityId)?.districtId || "bhola";
    districtLossMap[dist] = (districtLossMap[dist] || 0) + res.totalLossDecimal;
  }
}

const sortedDistricts = Object.entries(districtLossMap)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([dId, loss], idx) => {
    const dName = DISTRICT_SPECS.find((d) => d.id === dId)?.name || dId;
    return {
      rank: idx + 1,
      districtId: dId,
      name: dName,
      lossDecimal: Math.round(loss),
      gainDecimal: Math.round(loss * 0.35),
      percentOfTotal: Number(((loss / (recLossSum || 1)) * 100).toFixed(1)),
      changeRate: Number((12.5 - idx * 2.1).toFixed(1)),
      isIncrease: true,
    };
  });

const hazardBreakdownItems: HazardBreakdownItem[] = [
  { hazard: "river_erosion", label: "River Erosion", lossDecimal: Math.round(hazardLossMap.river_erosion.loss), gainDecimal: Math.round(hazardLossMap.river_erosion.gain), color: "#E4604A" },
  { hazard: "flood", label: "Monsoon Flood", lossDecimal: Math.round(hazardLossMap.flood.loss), gainDecimal: Math.round(hazardLossMap.flood.gain), color: "#3B82F6" },
  { hazard: "coastal", label: "Coastal Shift", lossDecimal: Math.round(hazardLossMap.coastal.loss), gainDecimal: Math.round(hazardLossMap.coastal.gain), color: "#2F9E62" },
  { hazard: "landslide", label: "Hilly Landslide", lossDecimal: Math.round(hazardLossMap.landslide.loss), gainDecimal: 0, color: "#D97706" },
  { hazard: "char", label: "Char Formation/Loss", lossDecimal: Math.round(hazardLossMap.char.loss), gainDecimal: Math.round(hazardLossMap.char.gain), color: "#8B5CF6" },
];

const recordedSummary: DashboardSummary = {
  mode: "recorded",
  totalLossDecimal: Math.round(recLossSum),
  totalGainDecimal: Math.round(recGainSum),
  netChangeDecimal: Math.round(recGainSum - recLossSum),
  affectedOwnersCount: recOwnersSet.size,
  totalCompensationBDT: Math.round(recCompBdtSum),
  paidCompensationBDT: Math.round(recPaidBdtSum),
  approvedCompensationBDT: Math.round(recApprovedBdtSum),
  pendingCompensationBDT: Math.round(recPendingBdtSum),
  trendSeries: [
    { year: "2019", loss: Math.round(recLossSum * 0.14), gain: Math.round(recGainSum * 0.12) },
    { year: "2020", loss: Math.round(recLossSum * 0.17), gain: Math.round(recGainSum * 0.15) },
    { year: "2021", loss: Math.round(recLossSum * 0.16), gain: Math.round(recGainSum * 0.18) },
    { year: "2022", loss: Math.round(recLossSum * 0.22), gain: Math.round(recGainSum * 0.19) },
    { year: "2023", loss: Math.round(recLossSum * 0.19), gain: Math.round(recGainSum * 0.21) },
    { year: "2024", loss: Math.round(recLossSum * 0.24), gain: Math.round(recGainSum * 0.23) },
  ],
  hazardBreakdown: hazardBreakdownItems,
  topDistricts: sortedDistricts,
  nowLiveStats: {
    activeErosionPoints: 24,
    sensorLiveMouzas: 114,
    highestRiskDistrict: "Sirajganj (Jamuna Basin)",
    criticalAlertsCount: 6,
  },
};

const fcLossSum = Math.round(recLossSum * 1.25);
const fcGainSum = Math.round(recGainSum * 1.15);
const fcCompBdtSum = Math.round(recCompBdtSum * 1.28);

const forecastSummary: DashboardSummary = {
  mode: "forecast",
  totalLossDecimal: fcLossSum,
  totalGainDecimal: fcGainSum,
  netChangeDecimal: fcGainSum - fcLossSum,
  affectedOwnersCount: Math.round(recOwnersSet.size * 1.22),
  totalCompensationBDT: fcCompBdtSum,
  trendSeries: [
    { year: "2022", loss: Math.round(recLossSum * 0.22), gain: Math.round(recGainSum * 0.19) },
    { year: "2023", loss: Math.round(recLossSum * 0.19), gain: Math.round(recGainSum * 0.21) },
    { year: "2024", loss: Math.round(recLossSum * 0.24), gain: Math.round(recGainSum * 0.23) },
    { year: "2025 (F)", loss: Math.round(fcLossSum * 0.48), gain: Math.round(fcGainSum * 0.45), forecastLoss: Math.round(fcLossSum * 0.48), forecastGain: Math.round(fcGainSum * 0.45) },
    { year: "2026 (F)", loss: Math.round(fcLossSum * 0.52), gain: Math.round(fcGainSum * 0.55), forecastLoss: Math.round(fcLossSum * 0.52), forecastGain: Math.round(fcGainSum * 0.55) },
  ],
  hazardBreakdown: hazardBreakdownItems.map((h) => ({
    ...h,
    lossDecimal: Math.round(h.lossDecimal * 1.25),
    gainDecimal: Math.round(h.gainDecimal * 1.15),
  })),
  topDistricts: sortedDistricts.map((d) => ({
    ...d,
    lossDecimal: Math.round(d.lossDecimal * 1.25),
    gainDecimal: Math.round(d.gainDecimal * 1.15),
  })),
  nowLiveStats: {
    activeErosionPoints: 31,
    sensorLiveMouzas: 142,
    highestRiskDistrict: "Kurigram & Sirajganj",
    criticalAlertsCount: 9,
  },
};

// ==========================================
// 6. WRITE ARTIFACTS TO /mocks/ and /public/mocks/
// ==========================================
const mocksDir = path.resolve(__dirname, "../mocks");
const publicMocksDir = path.resolve(__dirname, "../public/mocks");

for (const dir of [mocksDir, publicMocksDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const writeToBoth = (filename: string, content: string) => {
  fs.writeFileSync(path.join(mocksDir, filename), content);
  fs.writeFileSync(path.join(publicMocksDir, filename), content);
};

const commonJson = JSON.stringify(
  {
    districts: DISTRICT_SPECS,
    upazilas: allUpazilas,
    rivers: RIVERS_CATALOG,
    hills: HILLS_CATALOG,
    summary: {
      recorded: recordedSummary,
      forecast: forecastSummary,
    },
  },
  null,
  2
);
writeToBoth("common.json", commonJson);

writeToBoth("river_erosion.json", JSON.stringify(riverErosionData, null, 2));
writeToBoth("flood.json", JSON.stringify(floodData, null, 2));
writeToBoth("landslide.json", JSON.stringify(landslideData, null, 2));
writeToBoth("char.json", JSON.stringify(charData, null, 2));
writeToBoth("coastal.json", JSON.stringify(coastalData, null, 2));
writeToBoth("owners.json", JSON.stringify(allOwners, null, 2));
writeToBoth("mouzas.json", JSON.stringify(allMouzas, null, 2));
writeToBoth("plots.json", JSON.stringify(allPlots, null, 2));

writeToBoth("districts.json", JSON.stringify(DISTRICT_SPECS, null, 2));
writeToBoth("upazilas.json", JSON.stringify(allUpazilas, null, 2));
writeToBoth("rivers.json", JSON.stringify(RIVERS_CATALOG, null, 2));
writeToBoth("hills.json", JSON.stringify(HILLS_CATALOG, null, 2));
writeToBoth("chars.json", JSON.stringify(charData.chars, null, 2));
writeToBoth(
  "summary.json",
  JSON.stringify(
    {
      recorded: recordedSummary,
      forecast: forecastSummary,
    },
    null,
    2
  )
);

// Minimal stub for backward compatibility
writeToBoth("hazardResults.json", JSON.stringify({}, null, 2));

console.log("Generating Light-Themed GIS Basemap Areas and Rasters (MAP_SPEC)...");
const mapAreaResult = generateAllMapAreas(publicMocksDir, mocksDir, allOwners);
console.log(`- Generated ${Object.keys(mapAreaResult.areas).length} GIS Map Areas with 11 basemap layers.`);
console.log(`- Generated ${mapAreaResult.mouzas.length} shared-border adjacent mouzas.`);
console.log(`- Generated ${mapAreaResult.plots.length} 4-corner plots across map areas.`);

console.log(`Generation complete!`);
console.log(`- Districts: ${DISTRICT_SPECS.length}`);
console.log(`- Upazilas: ${allUpazilas.length}`);
console.log(`- Mouzas: ${allMouzas.length}`);
console.log(`- Plots: ${allPlots.length}`);
console.log(`- Owners: ${allOwners.length}`);
console.log(`- River Erosion results: ${Object.keys(riverErosionData.results).length}`);
console.log(`- Flood events: ${floodData.events.length}`);
console.log(`- Landslide results: ${Object.keys(landslideData.results).length}`);
console.log(`- Char results: ${Object.keys(charData.results).length}`);
console.log(`- Coastal results: ${Object.keys(coastalData.results).length}`);
console.log(
  `- Total Hazard Results: ${
    Object.keys(riverErosionData.results).length +
    Object.keys(floodData.results).length +
    Object.keys(landslideData.results).length +
    Object.keys(charData.results).length +
    Object.keys(coastalData.results).length
  }`
);
