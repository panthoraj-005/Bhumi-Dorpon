export type HazardType =
  | "river_erosion"
  | "flood"
  | "landslide"
  | "char"
  | "coastal";

export type DataMode = "recorded" | "forecast";

export type AreaUnit = "decimal" | "acre" | "hectare";

export type TimePeriod = "1y" | "3y" | "5y" | "all";

export type CompensationStatus =
  | "paid"
  | "approved"
  | "pending"
  | "not_applied"
  | "not_applicable";

export type ConfidenceLevel = "High" | "Medium" | "Low";

export type LandClass =
  | "agri"
  | "homestead"
  | "pond"
  | "commercial"
  | "khas"
  | "char_accretion";

export type MouzaKind = "registered" | "unassigned";

export interface District {
  id: string;
  name: string;
  division: string;
  isCoastal: boolean;
  isHilly: boolean;
  hasChars: boolean;
  primaryHazards: HazardType[];
}

export interface Upazila {
  id: string;
  districtId: string;
  name: string;
  rivers: string[];
  hasChars: boolean;
  hasHills: boolean;
  centerCoordinates?: [number, number]; // [lon, lat]
}

export interface River {
  id: string;
  name: string;
  upazilaIds: string[];
  erosionTendency: string;
  averageLossRateDecPerYear: number;
}

export interface Hill {
  id: string;
  name: string;
  upazilaId: string;
  slopeAngleDeg: number;
  soilType: string;
  riskLevel: "High" | "Extreme" | "Moderate" | "Low";
}

export interface CharIsland {
  id: string;
  name: string;
  riverId: string;
  upazilaId: string;
  firstSeenYear: number;
  vegetationStatus: string;
  stabilityIndex: number;
  totalAreaDecimal: number;
}

export interface Mouza {
  id: string;
  name: string;
  jlNo: string;
  upazilaId: string;
  districtId: string;
  riverId?: string;
  hillId?: string;
  kind: MouzaKind;
  isVirtual: boolean;
  totalPlots: number;
  centroid?: [number, number]; // [lon, lat]
  boundary?: [number, number][]; // coordinates
}

export interface Owner {
  id: string;
  name: string;
  phone?: string;
  nid?: string;
  colorIndex?: number;
}

export type CornerLabel = "NW" | "NE" | "SE" | "SW";

export interface Corner {
  label: CornerLabel;
  lat: number;
  lon: number;
}

export interface Plot {
  id: string;
  mouzaId: string;
  dagNo: string;
  khatianNo: string;
  landClass: LandClass;
  areaDecimal: number;
  ownerId: string;
  polygon: [number, number][][]; // GeoJSON polygon coordinates
  corners: [Corner, Corner, Corner, Corner];
}

export interface PlotImpact {
  plotId: string;
  kind: "loss" | "gain";
  areaDecimal: number;
  estCompensationBdt: number;
  status?: CompensationStatus; // ONLY on recorded results
  paidBdt?: number; // ONLY on recorded results
}

export interface OwnerRecord {
  id: string;
  name: string;
  dagNo: string; // Required by Rule 4
  khatianNo: string; // Required by Rule 4
  plotNo: string; // Backward compatibility alias for dagNo
  mouzaId: string;
  upazilaId: string;
  districtId: string;
  hazard: HazardType;
  landClass: LandClass;
  changeKind: "loss" | "gain";
  lossDecimal: number;
  gainDecimal: number;
  estimatedCompensationBDT: number;
  compensationStatus?: CompensationStatus; // Omitted or undefined on forecast results
  paidAmountBDT?: number; // Omitted or undefined on forecast results
  isUnownedOrKhas: boolean;
  depthClass?: "shallow" | "moderate" | "deep" | "none";
  coordinates: [number, number]; // [lon, lat]
  colorIndex?: number;
}

export interface FloodPlotStatus {
  plotId: string;
  dagNo: string;
  khatianNo: string;
  ownerId: string;
  ownerName: string;
  landClass: LandClass;
  totalAreaDecimal: number;
  floodedAreaDecimal: number;
  depthClass: "shallow" | "moderate" | "deep" | "none";
  status: string;
  centroid?: [number, number]; // [lat, lon]
  boundary?: [number, number][];
  corners: [Corner, Corner, Corner, Corner];
  estCompensationBdt: number;
  paidBdt?: number;
  colorIndex?: number;
}

export interface FloodEvent {
  id: string;
  mouzaId: string;
  mouzaName?: string;
  upazilaId?: string;
  districtId?: string;
  date: string;
  year: number;
  severity: "Moderate" | "Severe" | "Extreme" | "Catastrophic";
  floodedAreaDecimal: number;
  maxDepthM: number;
  durationDays: number;
  affectedOwnersCount?: number;
  geometry: {
    mouzaBoundary: [number, number][][];
    channels: [number, number][][];
    beels: [number, number][][][];
    shallowZone: [number, number][][];
    moderateZone: [number, number][][];
    deepZone: [number, number][][];
  };
  plotStatus: FloodPlotStatus[];
}

export interface OwnerProfile {
  id: string;
  name: string;
  fatherName: string;
  phone?: string;
  nid?: string;
}

export interface RiverTransect {
  id: string;
  label: string;
  start: [number, number];
  end: [number, number];
  retreatDistanceM: number;
}

export interface RiverErosionGeometry {
  mouzaBoundary: [number, number][][];
  riverBefore: [number, number][];
  riverAfter: [number, number][];
  lossStrip: [number, number][][];
  transects: RiverTransect[];
  forecastRetreatLine?: [number, number][];
  uncertaintyBand?: [number, number][][];
}

export interface LandslideGeometry {
  mouzaBoundary: [number, number][][];
  contours: { elevation: number; line: [number, number][] }[];
  scar: [number, number][][];
  debrisRunout: [number, number][][];
  stream: [number, number][];
  road: [number, number][];
  hillshadePng?: string; // base64 data URL
  susceptibilityZones?: {
    level: "Moderate" | "High" | "Very high";
    polygon: [number, number][][];
  }[];
  predictedScar?: [number, number][][];
}

export interface CharGeometry {
  riverChannel: [number, number][][];
  islandsBaseline: [number, number][][][];
  islandsCurrent: [number, number][][][];
  accretionTips: [number, number][][][];
  erosionFlanks: [number, number][][][];
  unownedKhasLand: [number, number][][][];
  forecastIslands?: [number, number][][][];
}

export interface CoastalGeometry {
  coastlineBefore: [number, number][];
  coastlineAfter: [number, number][];
  accretionMudflats: [number, number][][][];
  erosionZone: [number, number][][][];
  tidalFlats: [number, number][][][];
  embankment: [number, number][];
  mangrovePatch: [number, number][][][];
  bathymetryBands: { depthLabel: string; polygon: [number, number][][] }[];
  unassignedBlocks?: { id: string; label: string; polygon: [number, number][][] }[];
}

export interface TrendDataPoint {
  year: string;
  loss: number;
  gain: number;
  forecastLoss?: number;
  forecastGain?: number;
}

export interface HazardBreakdownItem {
  hazard: string;
  label: string;
  lossDecimal: number;
  gainDecimal: number;
  color: string;
}

export interface RankedDistrictItem {
  rank: number;
  districtId: string;
  name: string;
  lossDecimal: number;
  gainDecimal: number;
  percentOfTotal: number;
  changeRate: number; // e.g. +14.2%
  isIncrease: boolean;
}

export interface DashboardSummary {
  mode: DataMode;
  totalLossDecimal: number;
  totalGainDecimal: number;
  netChangeDecimal: number;
  affectedOwnersCount: number;
  totalCompensationBDT: number;
  paidCompensationBDT?: number; // Only for recorded mode
  approvedCompensationBDT?: number; // Only for recorded mode
  pendingCompensationBDT?: number; // Only for recorded mode
  trendSeries: TrendDataPoint[];
  hazardBreakdown: HazardBreakdownItem[];
  topDistricts: RankedDistrictItem[];
  nowLiveStats: {
    activeErosionPoints: number;
    sensorLiveMouzas: number;
    highestRiskDistrict: string;
    criticalAlertsCount: number;
  };
}

export interface HazardResult {
  id: string;
  hazard: HazardType;
  mode: DataMode;
  entityId: string;
  title: string;
  locationLabel: string;
  periodLabel: string;
  totalLossDecimal: number;
  totalGainDecimal: number;
  netChangeDecimal: number;
  trendDirection: "increasing" | "decreasing" | "stable";
  annualRateDecimal: number;
  confidence?: {
    level: ConfidenceLevel;
    scorePercent: number;
  };
  metrics: {
    label: string;
    value: string;
    sublabel?: string;
  }[];
  beforeYear: number;
  afterYear: number;
  owners: OwnerRecord[];
  trendSeries: TrendDataPoint[];
  geometry?: any;
}

export interface SelectorOption {
  id: string;
  label: string;
  sublabel?: string;
  badge?: string;
  hasRecords?: boolean;
}

// ==========================================
// LIGHT-THEMED GIS BASEMAP TYPES (Change 3)
// ==========================================

export interface BasemapLanduseItem {
  type: "farmland" | "vegetation" | "settlement";
  polygon: [number, number][][];
}

export interface BasemapWaterItem {
  type: "river" | "sea" | "beel" | "tidal_flat";
  polygon: [number, number][][];
}

export interface BasemapWaterlineItem {
  type: "canal" | "river";
  line: [number, number][];
}

export interface BasemapRoadItem {
  type: "major" | "minor";
  line: [number, number][];
}

export interface BasemapEmbankmentItem {
  line: [number, number][];
}

export interface BasemapBuildingItem {
  polygon: [number, number][][];
}

export interface BasemapPoiItem {
  name: string;
  type: "school" | "mosque" | "market" | "health_center";
  coordinates: [number, number];
}

export interface BasemapMouzaItem {
  id: string;
  name: string;
  jlNo: string;
  labelAnchor: [number, number];
  areaDecimal: number;
  polygon: [number, number][][];
}

export interface BasemapLabelItem {
  text: string;
  type: "river" | "sea";
  bearing: number;
  coordinates: [number, number];
}

export interface Basemap {
  land: [number, number][][]; // Polygon outer ring
  landuse: BasemapLanduseItem[];
  water: BasemapWaterItem[];
  waterlines: BasemapWaterlineItem[];
  roads: BasemapRoadItem[];
  embankments: BasemapEmbankmentItem[];
  buildings: BasemapBuildingItem[];
  pois: BasemapPoiItem[];
  upazila: [number, number][][];
  mouzas: BasemapMouzaItem[];
  labels: BasemapLabelItem[];
}

export interface MouzaSummary {
  id: string;
  name: string;
  jlNo: string;
  areaDecimal: number;
  lossDecimal: number;
  gainDecimal: number;
  percent: number;
  labelAnchor: [number, number];
  affectedOwnersCount?: number;
  polygon?: [number, number][][];
}

export interface RiverErosionContextCard {
  type: "river_erosion";
  transects: Array<{
    label: string;
    widthM: number;
    changeM: number;
  }>;
  thalwegShiftM: number;
  meanMigrationRateMYr: number;
  isProjected?: boolean;
}

export interface CharContextCard {
  type: "char";
  activeChannelWidthM: number;
  charAreaCurrentDec: number;
  charAreaPreviousDec: number;
  netChangeDec: number;
  isProjected?: boolean;
}

export interface CoastalContextCard {
  type: "coastal";
  shorelineChangeMYr: number;
  tidalFlatAreaDec: number;
  tidalRangeM: number;
  netLandChangeDec: number;
  isProjected?: boolean;
}

export interface FloodContextCard {
  type: "flood";
  peakWaterLevelDiffM: number; // in meters vs danger level
  durationDays: number;
  percentFlooded: number;
}

export interface LandslideContextCard {
  type: "landslide";
  minElevationM: number;
  maxElevationM: number;
  meanSlopeDeg: number;
  scarMeanSlopeDeg: number;
  soilVolumeM3: number;
  triggerRainfallMm: number;
}

export type ContextCard =
  | RiverErosionContextCard
  | CharContextCard
  | CoastalContextCard
  | FloodContextCard
  | LandslideContextCard;

export interface TerrainAssets {
  rasterBounds: [[number, number], [number, number]]; // [[south, west], [north, east]]
  elevationBeforeUrl: string;
  elevationAfterUrl: string;
  hillshadeBeforeUrl: string;
  hillshadeAfterUrl: string;
  slopeBeforeUrl: string;
  elevationChangeUrl: string;
  contoursGeoJson: any;
  spotHeightsGeoJson: any;
  legendMetadata: {
    minElevation: number;
    maxElevation: number;
    colorStops: Array<{ percent: number; color: string; elevationM: number }>;
    slopeClasses: Array<{ label: string; range: string; color: string }>;
    elevationChangeStops: Array<{ label: string; color: string }>;
  };
  cutVolumeM3: number;
  fillVolumeM3: number;
  soilVolumeM3: number;
}

export interface MapArea {
  areaId: string;
  hazard: HazardType;
  mode: DataMode;
  bounds: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  basemap: Basemap;
  mouzas: MouzaSummary[];
  hazardLayers: any;
  context: ContextCard;
  terrain?: TerrainAssets;
  owners?: Array<OwnerRecord & { colorIndex: number }>;
  historyLines?: Array<{ year: number; line: [number, number][] }>;
}

