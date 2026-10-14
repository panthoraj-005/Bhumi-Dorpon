/**
 * Central typed basemap configuration for BhumiDorpon.
 * Supports:
 * - Light GIS (Synthetic vector basemap following MAP_SPEC.md)
 * - Satellite (Genuine satellite imagery from Esri World Imagery or custom env provider)
 * - Street (OpenStreetMap cartographic tiles or custom env provider)
 */

export type BasemapType = "light-gis" | "satellite" | "street";

export interface BasemapProviderInfo {
  id: BasemapType;
  name: string;
  shortLabel: string;
  description: string;
  tileUrl?: string;
  attribution: string;
  maxZoom: number;
  minZoom: number;
  isSynthetic: boolean;
  envKey?: string;
}

export const BASEMAP_PROVIDERS: Record<BasemapType, BasemapProviderInfo> = {
  "light-gis": {
    id: "light-gis",
    name: "Light GIS",
    shortLabel: "Light GIS",
    description: "Authoritative light-themed synthetic vector cartography with mouza boundaries, roads, water, and graticule",
    attribution: "BhumiDorpon Light GIS Basemap &bull; Synthetic Demo Cartography",
    maxZoom: 19,
    minZoom: 10,
    isSynthetic: true,
  },
  satellite: {
    id: "satellite",
    name: "Satellite",
    shortLabel: "Satellite",
    description: "Genuine satellite imagery from Esri World Imagery (ArcGIS Online)",
    tileUrl:
      process.env.NEXT_PUBLIC_SATELLITE_TILE_URL ||
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    maxZoom: 19,
    minZoom: 1,
    isSynthetic: false,
    envKey: "NEXT_PUBLIC_SATELLITE_TILE_URL",
  },
  street: {
    id: "street",
    name: "Street",
    shortLabel: "Street",
    description: "OpenStreetMap standard cartographic street tiles",
    tileUrl:
      process.env.NEXT_PUBLIC_STREET_TILE_URL ||
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 19,
    minZoom: 1,
    isSynthetic: false,
    envKey: "NEXT_PUBLIC_STREET_TILE_URL",
  },
};

export const DEMO_GEOMETRY_DISCLAIMER = "Demo geometry — not survey-accurate";
