"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import { formatNumberLocalized } from "@/lib/translations";

interface CoordinateReadoutProps {
  mapInstance: any;
}

export function CoordinateReadout({ mapInstance }: CoordinateReadoutProps) {
  const { language } = useAppStore();
  const [coords, setCoords] = useState<{ lat: number; lon: number; zoom: number } | null>(null);

  useEffect(() => {
    if (!mapInstance) return;

    // Initial center & zoom
    const center = mapInstance.getCenter();
    setCoords({
      lat: center.lat,
      lon: center.lng,
      zoom: mapInstance.getZoom(),
    });

    const onMouseMove = (e: any) => {
      setCoords({
        lat: e.latlng.lat,
        lon: e.latlng.lng,
        zoom: mapInstance.getZoom(),
      });
    };

    const onMoveEnd = () => {
      const c = mapInstance.getCenter();
      setCoords({
        lat: c.lat,
        lon: c.lng,
        zoom: mapInstance.getZoom(),
      });
    };

    mapInstance.on("mousemove", onMouseMove);
    mapInstance.on("moveend", onMoveEnd);
    mapInstance.on("zoomend", onMoveEnd);

    return () => {
      mapInstance.off("mousemove", onMouseMove);
      mapInstance.off("moveend", onMoveEnd);
      mapInstance.off("zoomend", onMoveEnd);
    };
  }, [mapInstance]);

  if (!coords) return null;

  return (
    <div className="bg-surface/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-border/70 shadow-xs text-[10px] font-mono font-medium text-ink/80 select-none pointer-events-none tabular-nums flex items-center gap-1.5">
      <span>
        {language === "bn"
          ? `অক্ষাংশ ${formatNumberLocalized(coords.lat.toFixed(5), language)}`
          : `Lat ${coords.lat.toFixed(6)}`}
      </span>
      <span className="text-muted/60">·</span>
      <span>
        {language === "bn"
          ? `দ্রাঘিমাংশ ${formatNumberLocalized(coords.lon.toFixed(5), language)}`
          : `Lon ${coords.lon.toFixed(6)}`}
      </span>
      <span className="text-muted/60">·</span>
      <span className="font-semibold text-secondary">
        {language === "bn"
          ? `জুম ${formatNumberLocalized(coords.zoom, language)}`
          : `z${coords.zoom}`}
      </span>
    </div>
  );
}
