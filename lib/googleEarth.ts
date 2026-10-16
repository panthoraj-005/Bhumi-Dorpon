import { Corner } from "./types";

export interface EarthCorner {
  label?: string;
  lat: number;
  lon: number;
}

export interface EarthParcel {
  plotId?: string;
  dagNo: string;
  khatianNo: string;
  landClass?: string;
  areaDecimal?: number;
  floodStatus?: string;
  corners: EarthCorner[] | [Corner, Corner, Corner, Corner];
}

export interface EarthOwnerMeta {
  ownerName?: string;
  mouzaName?: string;
  floodId?: string;
}

/**
 * Escape XML special characters to ensure valid KML output.
 */
export function escapeXml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Builds a closed 5-point coordinate string for a 4-corner parcel ring.
 * Coordinates are formatted as `lon,lat,0`, separated by spaces, with the first point repeated last.
 */
export function parcelRingToKmlCoordinates(corners: EarthCorner[]): string {
  if (!corners || corners.length !== 4) {
    throw new Error("Parcel ring requires exactly 4 corners");
  }
  const ring = [corners[0], corners[1], corners[2], corners[3], corners[0]];
  return ring.map((c) => `${c.lon},${c.lat},0`).join(" ");
}

/**
 * Computes the bounding-box center of a set of corners.
 */
export function getParcelCenter(corners: EarthCorner[]): { lat: number; lon: number } {
  if (!corners || corners.length === 0) {
    throw new Error("Cannot get center of empty corners");
  }
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

  for (const c of corners) {
    if (c.lat < minLat) minLat = c.lat;
    if (c.lat > maxLat) maxLat = c.lat;
    if (c.lon < minLon) minLon = c.lon;
    if (c.lon > maxLon) maxLon = c.lon;
  }

  return {
    lat: (minLat + maxLat) / 2,
    lon: (minLon + maxLon) / 2,
  };
}

/**
 * Estimates the camera viewing range in meters for Google Earth.
 * Computes the larger extent in meters, enforces a minimum extent of 20 m,
 * and multiplies by ~3 so the entire parcel is framed.
 */
export function getCameraRangeMeters(corners: EarthCorner[]): number {
  if (!corners || corners.length === 0) {
    return 60; // 20m * 3
  }
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

  for (const c of corners) {
    if (c.lat < minLat) minLat = c.lat;
    if (c.lat > maxLat) maxLat = c.lat;
    if (c.lon < minLon) minLon = c.lon;
    if (c.lon > maxLon) maxLon = c.lon;
  }

  const centerLat = (minLat + maxLat) / 2;
  const latExtentMeters = (maxLat - minLat) * 111320;
  const lonExtentMeters =
    (maxLon - minLon) * (111320 * Math.cos((centerLat * Math.PI) / 180));
  const largerExtent = Math.max(latExtentMeters, lonExtentMeters);
  const effectiveExtent = Math.max(largerExtent, 20);

  return Math.round(effectiveExtent * 3);
}

/**
 * Constructs the Google Earth (web) camera URL centered on the parcel.
 * Format: https://earth.google.com/web/@<lat>,<lon>,0a,<range>d,35y,0h,0t,0r
 */
export function buildEarthCameraUrl(corners: EarthCorner[]): string {
  const center = getParcelCenter(corners);
  const range = getCameraRangeMeters(corners);
  return `https://earth.google.com/web/@${center.lat},${center.lon},0a,${range}d,35y,0h,0t,0r`;
}

/**
 * Generates a clean, lowercase, safe filename for the parcel KML download.
 * Format: <floodId>_dag_<dagNo>_outline.kml
 */
export function buildKmlFileName(
  parcel: { dagNo: string },
  meta?: { floodId?: string }
): string {
  const floodId = meta?.floodId || "flood";
  const raw = `${floodId}_dag_${parcel.dagNo}_outline.kml`;
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9_\-\.]/g, "_")
    .replace(/_+/g, "_");
}

/**
 * Builds KML 2.2 XML string representing the parcel's outline and 4 numbered corners.
 * Throws unless the parcel has exactly 4 corners.
 */
export function buildParcelKml(
  parcel: EarthParcel,
  meta?: EarthOwnerMeta
): string {
  if (!parcel || !parcel.corners || parcel.corners.length !== 4) {
    throw new Error("Parcel must have exactly 4 corners to build KML");
  }

  const docName = `Parcel Outline - Dag ${parcel.dagNo} (Khatian ${parcel.khatianNo})`;
  const polygonName = `Dag ${parcel.dagNo} / Khatian ${parcel.khatianNo}`;

  const descLines = [
    meta?.ownerName ? `Owner: ${meta.ownerName}` : null,
    meta?.mouzaName ? `Mouza: ${meta.mouzaName}` : null,
    `Dag No.: ${parcel.dagNo}`,
    `Khatian No.: ${parcel.khatianNo}`,
    parcel.landClass ? `Land Class: ${parcel.landClass}` : null,
    parcel.areaDecimal != null ? `Area: ${parcel.areaDecimal} decimal` : null,
    parcel.floodStatus ? `Flood Status: ${parcel.floodStatus}` : null,
    "",
    "BhumiDorpon demo (mock / synthetic data, not a legal survey)",
  ].filter((line) => line !== null);
  const description = descLines.join("\n");

  const defaultCornerLabels = ["NW", "NE", "SE", "SW"];
  const cornerPlacemarks = parcel.corners
    .map((c, i) => {
      const lbl = c.label || defaultCornerLabels[i] || `${i + 1}`;
      const name = `${i + 1} (${lbl})`;
      return `    <Placemark>
      <name>${escapeXml(name)}</name>
      <Point>
        <coordinates>${c.lon},${c.lat},0</coordinates>
      </Point>
    </Placemark>`;
    })
    .join("\n");

  const coordinatesStr = parcelRingToKmlCoordinates(parcel.corners);

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${escapeXml(docName)}</name>
    <description>${escapeXml(description)}</description>
    <Style id="parcelOutline">
      <LineStyle>
        <color>ff0088ff</color>
        <width>3</width>
      </LineStyle>
      <PolyStyle>
        <color>440088ff</color>
      </PolyStyle>
    </Style>
    <Placemark>
      <name>${escapeXml(polygonName)}</name>
      <description>${escapeXml(description)}</description>
      <styleUrl>#parcelOutline</styleUrl>
      <Polygon>
        <tessellate>1</tessellate>
        <altitudeMode>clampToGround</altitudeMode>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordinatesStr}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
${cornerPlacemarks}
  </Document>
</kml>`;
}

/**
 * Browser-only helper to open Google Earth (web) in a new tab synchronously
 * and trigger a download of the parcel outline KML file.
 */
export function openParcelInGoogleEarth(
  parcel: EarthParcel,
  meta?: EarthOwnerMeta
): { fileName: string; earthUrl: string } {
  if (typeof window === "undefined") {
    throw new Error("openParcelInGoogleEarth can only be called in the browser");
  }

  const earthUrl = buildEarthCameraUrl(parcel.corners);
  // Open window immediately in user-triggered click handler to avoid pop-up blocking
  window.open(earthUrl, "_blank", "noopener,noreferrer");

  const kml = buildParcelKml(parcel, meta);
  const fileName = buildKmlFileName(parcel, meta);

  const blob = new Blob([kml], {
    type: "application/vnd.google-earth.kml+xml;charset=utf-8",
  });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(objectUrl);

  return { fileName, earthUrl };
}
