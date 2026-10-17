"use client";

import React, { useEffect, useRef } from "react";

export function DashboardMapPreview({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    import("leaflet").then((LModule) => {
      if (!isMounted || !containerRef.current) return;
      const L = LModule.default || LModule;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Meghai Mouza Jamuna riverbank coordinates [lat, lon]
      const center: [number, number] = [24.582, 89.652];

      const map = L.map(containerRef.current, {
        center,
        zoom: 15,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        zoomControl: false,
        attributionControl: false,
        keyboard: false,
      });

      mapInstanceRef.current = map;

      // River Channel (Water in Light GIS theme #CFE3F0)
      const riverWaterCoords: [number, number][] = [
        [24.595, 89.642],
        [24.592, 89.658],
        [24.575, 89.663],
        [24.568, 89.654],
        [24.571, 89.638],
        [24.585, 89.641],
      ];
      L.polygon(riverWaterCoords, {
        color: "#9DC1DA",
        weight: 1.5,
        fillColor: "#CFE3F0",
        fillOpacity: 0.95,
        interactive: false,
      }).addTo(map);

      // Eroded Bank Strip (Coral Loss #E4604A)
      const erosionCoords: [number, number][] = [
        [24.587, 89.652],
        [24.582, 89.654],
        [24.577, 89.655],
        [24.578, 89.651],
        [24.583, 89.649],
      ];
      L.polygon(erosionCoords, {
        color: "#E4604A",
        weight: 1.5,
        fillColor: "#E4604A",
        fillOpacity: 0.65,
        interactive: false,
      }).addTo(map);

      // Accreted Sandbar (Green Gain #2F9E62)
      const accretionCoords: [number, number][] = [
        [24.576, 89.658],
        [24.572, 89.661],
        [24.571, 89.655],
        [24.574, 89.654],
      ];
      L.polygon(accretionCoords, {
        color: "#166534",
        weight: 1,
        fillColor: "#2F9E62",
        fillOpacity: 0.75,
        interactive: false,
      }).addTo(map);

      // Cadastral Mouza Parcels
      const plot1: [number, number][] = [
        [24.588, 89.648],
        [24.589, 89.651],
        [24.586, 89.652],
        [24.585, 89.649],
      ];
      const plot2: [number, number][] = [
        [24.585, 89.649],
        [24.586, 89.652],
        [24.583, 89.653],
        [24.582, 89.650],
      ];
      L.polygon(plot1, {
        color: "#A7ABA0",
        weight: 1,
        fillColor: "#ECF0E2",
        fillOpacity: 0.6,
        interactive: false,
      }).addTo(map);
      L.polygon(plot2, {
        color: "#A7ABA0",
        weight: 1,
        fillColor: "#ECF0E2",
        fillOpacity: 0.6,
        interactive: false,
      }).addTo(map);

      // Mouza Boundary Line (Highlighted Mouza Outline #2E342A)
      const mouzaLine: [number, number][] = [
        [24.593, 89.645],
        [24.591, 89.655],
        [24.581, 89.657],
        [24.572, 89.652],
      ];
      L.polyline(mouzaLine, {
        color: "#2E342A",
        weight: 2,
        dashArray: "5, 3",
        interactive: false,
      }).addTo(map);

      // Mouza Label Marker (Highlighted Mouza Name with white halo)
      const isBn = true;
      const labelIcon = L.divIcon({
        className: "bg-transparent border-0",
        html: `
          <div class="flex flex-col items-center pointer-events-none select-none">
            <div class="px-2 py-0.5 rounded-md bg-white/95 text-slate-900 font-extrabold text-[11px] shadow-sm border border-slate-300 filter drop-shadow">
              মেঘাই <span class="text-[9px] font-normal text-slate-600">জেএল ৪২</span>
            </div>
            <div class="mt-0.5 px-1.5 py-0.2 rounded-pill bg-[#E4604A] text-white text-[9px] font-bold shadow-2xs">
              -৮৪২ শতাংশ
            </div>
          </div>
        `,
        iconSize: [110, 38],
        iconAnchor: [55, 19],
      });
      L.marker([24.5835, 89.651], { icon: labelIcon, interactive: false }).addTo(map);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full bg-[#F4F3EE] overflow-hidden select-none ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-2 right-2 z-10 pointer-events-none px-2 py-0.5 rounded bg-surface/85 backdrop-blur-xs text-[9px] font-semibold text-muted border border-border/60">
        জিআইএস মানচিত্র প্রিভিউ
      </div>
    </div>
  );
}
