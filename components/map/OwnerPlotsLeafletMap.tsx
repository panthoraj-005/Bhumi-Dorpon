"use client";

import React, { useEffect, useRef } from "react";
import { OwnerPlotDetail } from "@/lib/data";
import { Corner } from "@/lib/types";
import { Maximize2 } from "lucide-react";
import { FLOOD_OWNER_COLORS } from "./panels/OwnerLegendPanel";

interface OwnerPlotsLeafletMapProps {
  plots: OwnerPlotDetail[];
  selectedPlotId: string | null;
  onSelectPlot: (plotId: string | null) => void;
  mouzaName?: string;
  className?: string;
}

export function OwnerPlotsLeafletMap({
  plots,
  selectedPlotId,
  onSelectPlot,
  mouzaName,
  className = "",
}: OwnerPlotsLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const layersGroupRef = useRef<any>(null);

  // Initialize Leaflet map
  useEffect(() => {
    let isMounted = true;

    import("leaflet").then((LModule) => {
      if (!isMounted || !containerRef.current) return;
      const L = LModule.default || LModule;
      LRef.current = L;

      // Ensure container doesn't already have a Leaflet instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initial center fallback
      const defaultCenter: [number, number] = [24.58, 89.65];

      const map = L.map(containerRef.current, {
        center: defaultCenter,
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Custom Panes for strict z-index ordering
      if (!map.getPane("dimmedPane")) {
        const dimmedPane = map.createPane("dimmedPane");
        dimmedPane.style.zIndex = "280";
      }
      if (!map.getPane("plotsPane")) {
        const plotsPane = map.createPane("plotsPane");
        plotsPane.style.zIndex = "350";
      }
      if (!map.getPane("labelsPane")) {
        const labelsPane = map.createPane("labelsPane");
        labelsPane.style.zIndex = "450";
      }
      if (!map.getPane("markersPane")) {
        const markersPane = map.createPane("markersPane");
        markersPane.style.zIndex = "500";
      }

      // Metric scale control
      L.control.scale({ imperial: false, metric: true, position: "bottomleft" }).addTo(map);

      // Zoom control top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Layer group for dynamic items
      const layerGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layerGroup;

      renderLayers();
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update layers when plots or selectedPlotId change
  useEffect(() => {
    renderLayers();
  }, [plots, selectedPlotId]);

  const renderLayers = () => {
    const map = mapInstanceRef.current;
    const L = LRef.current;
    const layerGroup = layersGroupRef.current;
    if (!map || !L || !layerGroup || !plots || plots.length === 0) return;

    layerGroup.clearLayers();

    // 1. Calculate bounding box of all owner plots
    let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
    plots.forEach((p) => {
      p.corners.forEach((c: Corner) => {
        if (c.lat < minLat) minLat = c.lat;
        if (c.lat > maxLat) maxLat = c.lat;
        if (c.lon < minLon) minLon = c.lon;
        if (c.lon > maxLon) maxLon = c.lon;
      });
    });

    const padLat = Math.max((maxLat - minLat) * 0.4, 0.001);
    const padLon = Math.max((maxLon - minLon) * 0.4, 0.001);

    // 2. Surrounding dimmed mouza context
    const mouzaBoundaryLatLngs: [number, number][] = [
      [minLat - padLat, minLon - padLon],
      [maxLat + padLat, minLon - padLon],
      [maxLat + padLat, maxLon + padLon],
      [minLat - padLat, maxLon + padLon],
    ];

    L.polygon(mouzaBoundaryLatLngs, {
      color: "#94A3B8",
      weight: 1.5,
      dashArray: "6, 4",
      fillColor: "#E2E8F0",
      fillOpacity: 0.25,
      pane: "dimmedPane",
      interactive: false,
    }).addTo(layerGroup);

    // Mouza Name Marker
    if (mouzaName) {
      const mouzaLabelIcon = L.divIcon({
        className: "bg-transparent border-0",
        html: `
          <div class="px-2.5 py-1 rounded bg-white/95 text-slate-900 font-extrabold text-xs shadow-md border border-slate-300 filter drop-shadow">
            ${mouzaName} Mouza
          </div>
        `,
        iconSize: [120, 28],
        iconAnchor: [60, 14],
      });
      L.marker([maxLat + padLat * 0.7, (minLon + maxLon) / 2], {
        icon: mouzaLabelIcon,
        pane: "labelsPane",
        interactive: false,
      }).addTo(layerGroup);
    }

    // 3. Render Owner Plots
    let selectedBounds: any = null;

    plots.forEach((plot, plotIdx) => {
      const isSelected = selectedPlotId === plot.plotId;
      const isSubmerged = (plot.floodedAreaDecimal || 0) > 0;
      const latLngs: [number, number][] = plot.corners.map((c: Corner) => [c.lat, c.lon]);

      if (isSelected) {
        selectedBounds = L.latLngBounds(latLngs);
      }

      const colorIdx = plot.colorIndex ?? 0;
      const ownerColor = FLOOD_OWNER_COLORS[colorIdx % FLOOD_OWNER_COLORS.length];

      // Plot Polygon styled in owner's color
      const polygon = L.polygon(latLngs, {
        color: ownerColor,
        weight: isSelected ? 3.5 : 2,
        fillColor: ownerColor,
        fillOpacity: isSelected ? 0.75 : 0.45,
        pane: "plotsPane",
        className: "cursor-pointer transition-all",
      });

      polygon.bindTooltip(
        `<div class="p-1 text-xs">
          <div class="font-bold text-slate-900">Dag ${plot.dagNo} • Khatian ${plot.khatianNo}</div>
          <div class="text-[11px] text-slate-600">Land Class: ${plot.landClass}</div>
          <div class="text-[11px] text-slate-600">Area: ${plot.areaDecimal} dec (${isSubmerged ? "Submerged" : "Dry"})</div>
        </div>`,
        { sticky: true }
      );

      polygon.on("click", () => {
        onSelectPlot(isSelected ? null : plot.plotId);
      });

      polygon.addTo(layerGroup);

      // Central Numbered Marker Badge for Plot (#1, #2...)
      const centerLat =
        (plot.corners[0].lat + plot.corners[1].lat + plot.corners[2].lat + plot.corners[3].lat) / 4;
      const centerLon =
        (plot.corners[0].lon + plot.corners[1].lon + plot.corners[2].lon + plot.corners[3].lon) / 4;

      const centerIcon = L.divIcon({
        className: "bg-transparent border-0",
        html: `
          <div class="flex flex-col items-center select-none cursor-pointer">
            <div class="w-7 h-7 rounded-full ${
              isSelected ? "bg-slate-900 ring-2 ring-white" : isSubmerged ? "bg-[#0284C7]" : "bg-[#16A34A]"
            } text-white font-bold text-xs flex items-center justify-center shadow-md">
              ${plotIdx + 1}
            </div>
            <span class="text-[10px] font-bold text-slate-800 bg-white/95 px-1.5 py-0.2 rounded shadow-2xs mt-0.5 border border-slate-200">
              Dag ${plot.dagNo}
            </span>
          </div>
        `,
        iconSize: [52, 46],
        iconAnchor: [26, 23],
      });

      const centerMarker = L.marker([centerLat, centerLon], {
        icon: centerIcon,
        pane: "labelsPane",
      });
      centerMarker.on("click", () => {
        onSelectPlot(isSelected ? null : plot.plotId);
      });
      centerMarker.addTo(layerGroup);

      // FOUR CORNER MARKERS: 1=NW, 2=NE, 3=SE, 4=SW
      plot.corners.forEach((c: Corner, cIdx: number) => {
        const cornerNum = cIdx + 1;
        const cornerIcon = L.divIcon({
          className: "bg-transparent border-0",
          html: `
            <div id="corner-marker-${plot.dagNo}-${cornerNum}" class="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-md select-none">
              ${cornerNum}
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        L.marker([c.lat, c.lon], {
          icon: cornerIcon,
          pane: "markersPane",
          interactive: false,
        }).addTo(layerGroup);
      });
    });

    // Zoom handling
    if (selectedBounds) {
      map.fitBounds(selectedBounds, { padding: [50, 50], maxZoom: 18 });
    } else {
      const allBounds = L.latLngBounds([
        [minLat, minLon],
        [maxLat, maxLon],
      ]);
      map.fitBounds(allBounds, { padding: [40, 40] });
    }
  };

  const handleFitAll = () => {
    onSelectPlot(null);
    if (!mapInstanceRef.current || !LRef.current || !plots.length) return;
    let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
    plots.forEach((p) => {
      p.corners.forEach((c: Corner) => {
        if (c.lat < minLat) minLat = c.lat;
        if (c.lat > maxLat) maxLat = c.lat;
        if (c.lon < minLon) minLon = c.lon;
        if (c.lon > maxLon) maxLon = c.lon;
      });
    });
    const allBounds = LRef.current.latLngBounds([
      [minLat, minLon],
      [maxLat, maxLon],
    ]);
    mapInstanceRef.current.fitBounds(allBounds, { padding: [40, 40] });
  };

  return (
    <div className={`relative w-full h-[480px] bg-[#F4F3EE] rounded-xl border border-border overflow-hidden select-none ${className}`}>
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating fit to all control */}
      <button
        type="button"
        onClick={handleFitAll}
        className="absolute top-3 left-3 z-1000 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface/95 backdrop-blur-sm border border-border text-xs font-semibold text-ink hover:bg-surface-alt shadow-xs transition-colors"
        title="Fit all owner plots"
      >
        <Maximize2 className="w-3.5 h-3.5 text-secondary" />
        <span>Fit All Plots</span>
      </button>

      {/* Synthetic demo geometry note */}
      <div className="absolute bottom-2 right-3 z-1000 px-2 py-0.5 rounded bg-surface/85 backdrop-blur-xs border border-border/80 text-[10px] text-muted shadow-2xs pointer-events-none">
        Synthetic cadastral geometry • Metric survey
      </div>
    </div>
  );
}
