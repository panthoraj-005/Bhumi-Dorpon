export const GIS_COLORS = {
  // Base Land & Tints
  landBase: "#F4F3EE",
  farmland: "#ECF0E2",
  vegetation: "#E1EBD5",
  settlement: "#EBE7E0",

  // Hydrography
  waterFill: "#CFE3F0",
  waterOutline: "#9DC1DA",
  seaDeep: "#BCD6E8",
  seaShallow: "#DCEBF4",
  tidalFlat: "#E8E4D2",
  canal: "#9DC1DA",

  // Roads & Transport
  roadMajorFill: "#FFFFFF",
  roadMajorCasing: "#D5D3CC",
  roadMinorFill: "#FFFFFF",
  roadMinorCasing: "#E2E0D9",
  embankment: "#6B6F66",

  // Administrative
  upazilaBoundary: "#8C9086",
  mouzaBoundary: "#A7ABA0",
  mouzaBoundarySelected: "#2E342A",
  mouzaBoundaryHover: "#1E293B",

  // 6 Rotating Mouza Tints (MAP_SPEC section 2)
  mouzaTints: [
    "#F6F1E8",
    "#EEF3E8",
    "#EAF0F4",
    "#F4ECEF",
    "#F2F2E4",
    "#E9F1EE",
  ],

  // Typography & Labels
  mouzaLabelText: "#3E4339",
  waterLabelText: "#5B87A6",
  graticuleLine: "#D9DBD3",
  graticuleLabel: "#8A8F84",

  // Hazard Thematic
  lossCoral: "#E4604A",
  gainGreen: "#2F9E62",
  forecastPurple: "#6A5BD6",
  unownedGrey: "#9AA091",

  // Built Environment
  buildingFill: "#E5E0D8",
  buildingOutline: "#D0CBC2",
  poiMarker: "#78716C",
};

export const PANE_CONFIGS: { name: string; zIndex: number; pointerEvents?: string }[] = [
  { name: "basemap-tiles", zIndex: 195 },
  { name: "land", zIndex: 200 },
  { name: "landuse", zIndex: 205 },
  { name: "terrain", zIndex: 210 },
  { name: "water", zIndex: 220 },
  { name: "flood", zIndex: 225 },
  { name: "graticule", zIndex: 228, pointerEvents: "none" },
  { name: "roads", zIndex: 230, pointerEvents: "none" },
  { name: "buildings", zIndex: 235, pointerEvents: "none" },
  { name: "plots", zIndex: 240 },
  { name: "hazard", zIndex: 250 },
  { name: "admin", zIndex: 255 },
  { name: "water-labels", zIndex: 260, pointerEvents: "none" },
  { name: "mouza-labels", zIndex: 265, pointerEvents: "none" },
  { name: "markers", zIndex: 270 },
];
