"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Basemap } from "@/lib/types";
import { useAppStore } from "@/stores/appStore";

interface LocatorInsetProps {
  mapInstance: any;
  basemap: Basemap;
  areaBounds: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
}

export function LocatorInset({ mapInstance, basemap, areaBounds }: LocatorInsetProps) {
  const { language } = useAppStore();
  const [viewBounds, setViewBounds] = useState<[number, number, number, number] | null>(null);

  useEffect(() => {
    if (!mapInstance) return;

    const updateView = () => {
      const b = mapInstance.getBounds();
      setViewBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
    };

    updateView();
    mapInstance.on("moveend", updateView);
    mapInstance.on("zoomend", updateView);

    return () => {
      mapInstance.off("moveend", updateView);
      mapInstance.off("zoomend", updateView);
    };
  }, [mapInstance]);

  // Compute bounding box of upazila polygon to fit the mini inset SVG
  const { upazilaPath, upazilaBox, project } = useMemo(() => {
    const ring = basemap.upazila?.[0] || [];
    let minLon = areaBounds[0];
    let minLat = areaBounds[1];
    let maxLon = areaBounds[2];
    let maxLat = areaBounds[3];

    for (const [lon, lat] of ring) {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }

    const padLon = (maxLon - minLon) * 0.1 || 0.005;
    const padLat = (maxLat - minLat) * 0.1 || 0.005;
    const bMinLon = minLon - padLon;
    const bMaxLon = maxLon + padLon;
    const bMinLat = minLat - padLat;
    const bMaxLat = maxLat + padLat;

    const width = 136;
    const height = 96;

    const proj = (lon: number, lat: number): [number, number] => {
      const x = ((lon - bMinLon) / (bMaxLon - bMinLon)) * width;
      const y = height - ((lat - bMinLat) / (bMaxLat - bMinLat)) * height;
      return [Number(x.toFixed(1)), Number(y.toFixed(1))];
    };

    let path = "";
    if (ring.length > 0) {
      const pts = ring.map(([lon, lat]: [number, number]) => proj(lon, lat));
      path = pts.map((p: [number, number], idx: number) => `${idx === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") + " Z";
    }

    return {
      upazilaPath: path,
      upazilaBox: [bMinLon, bMinLat, bMaxLon, bMaxLat],
      project: proj,
    };
  }, [basemap.upazila, areaBounds]);

  // Project area box
  const areaRect = useMemo(() => {
    const [p1X, p1Y] = project(areaBounds[0], areaBounds[3]);
    const [p2X, p2Y] = project(areaBounds[2], areaBounds[1]);
    return {
      x: Math.min(p1X, p2X),
      y: Math.min(p1Y, p2Y),
      width: Math.max(2, Math.abs(p2X - p1X)),
      height: Math.max(2, Math.abs(p2Y - p1Y)),
    };
  }, [areaBounds, project]);

  // Project current viewport box
  const viewRect = useMemo(() => {
    if (!viewBounds) return null;
    const [p1X, p1Y] = project(viewBounds[0], viewBounds[3]);
    const [p2X, p2Y] = project(viewBounds[2], viewBounds[1]);
    return {
      x: Math.min(p1X, p2X),
      y: Math.min(p1Y, p2Y),
      width: Math.max(3, Math.abs(p2X - p1X)),
      height: Math.max(3, Math.abs(p2Y - p1Y)),
    };
  }, [viewBounds, project]);

  return (
    <div
      className="bg-surface/90 backdrop-blur-md rounded-lg border border-border/80 shadow-md p-1.5 w-[140px] pointer-events-none select-none"
      title={language === "bn" ? "আঞ্চলিক অবস্থান নির্দেশক" : "Regional Locator Inset"}
    >
      <div className="flex items-center justify-between pb-1 border-b border-border/40 text-[9px] font-bold text-muted uppercase tracking-wider">
        <span>{language === "bn" ? "অবস্থান মানচিত্র" : "Locator"}</span>
        <span className="text-[8px] font-normal text-secondary lowercase">
          {language === "bn" ? "আঞ্চলিক প্রসঙ্গ" : "regional context"}
        </span>
      </div>
      <div className="relative w-[136px] h-[92px] mt-1 bg-[#EEF2F6]/60 rounded overflow-hidden">
        <svg width="136" height="92" viewBox="0 0 136 96" className="w-full h-full">
          {/* Upazila boundary outline */}
          {upazilaPath && (
            <path
              d={upazilaPath}
              fill="#E2E8F0"
              fillOpacity="0.6"
              stroke="#94A3B8"
              strokeWidth="1"
              strokeDasharray="3 2"
            />
          )}

          {/* Entire hazard reach area bounding box */}
          <rect
            x={areaRect.x}
            y={areaRect.y}
            width={areaRect.width}
            height={areaRect.height}
            fill="none"
            stroke="#64748B"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Current viewport live rectangle */}
          {viewRect && (
            <rect
              x={viewRect.x}
              y={viewRect.y}
              width={viewRect.width}
              height={viewRect.height}
              fill="#2563EB"
              fillOpacity="0.18"
              stroke="#2563EB"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
