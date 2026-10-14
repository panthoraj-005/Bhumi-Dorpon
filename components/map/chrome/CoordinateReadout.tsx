"use client";

import React, { useState, useEffect } from "react";

interface CoordinateReadoutProps {
  mapInstance: any;
}

export function CoordinateReadout({ mapInstance }: CoordinateReadoutProps) {
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
      <span>Lat {coords.lat.toFixed(6)}</span>
      <span className="text-muted/60">·</span>
      <span>Lon {coords.lon.toFixed(6)}</span>
      <span className="text-muted/60">·</span>
      <span className="font-semibold text-secondary">z{coords.zoom}</span>
    </div>
  );
}
