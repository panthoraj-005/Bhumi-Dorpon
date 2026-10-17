"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Copy,
  Check,
  Download,
  MapPin,
  FileSpreadsheet,
  Layers,
  ZoomIn,
  RotateCcw,
  Globe,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/AppHeader";
import { Skeleton } from "@/components/Skeleton";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";
import {
  openParcelInGoogleEarth,
  EarthOwnerMeta,
  EarthParcel,
} from "@/lib/googleEarth";

const OwnerPlotsLeafletMap = dynamic(
  () =>
    import("@/components/map/OwnerPlotsLeafletMap").then(
      (mod) => mod.OwnerPlotsLeafletMap
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[480px] rounded-xl" />,
  }
);
import {
  getFlood,
  getOwnerProfile,
  getOwnerPlots,
  OwnerPlotDetail,
} from "@/lib/data";
import { FloodEvent, OwnerProfile, Corner } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  getLocalizedOwnerName,
  getLocalizedFatherName,
  getLocalizedMouzaName,
  getLocalizedLandClass,
  formatNumberLocalized,
  Language,
} from "@/lib/translations";

export default function OwnerLandDetailPage() {
  const params = useParams();
  const mouzaId = (params?.mouzaId as string) || "";
  const floodId = (params?.floodId as string) || "";
  const ownerId = (params?.ownerId as string) || "";

  const { unit, language } = useAppStore();

  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [copiedAllCoords, setCopiedAllCoords] = useState(false);
  const [copiedPlotId, setCopiedPlotId] = useState<string | null>(null);
  const [earthHint, setEarthHint] = useState<{ plotId: string; fileName: string } | null>(null);

  // 1. Load Flood Event
  const { data: flood } = useQuery<FloodEvent | null>({
    queryKey: ["floodEventDetail", floodId],
    queryFn: async () => {
      if (!floodId) return null;
      return getFlood(floodId);
    },
    enabled: Boolean(floodId),
  });

  // 2. Load Owner Profile
  const { data: profile, isLoading: isProfileLoading } = useQuery<OwnerProfile | null>({
    queryKey: ["ownerProfile", ownerId],
    queryFn: async () => {
      if (!ownerId) return null;
      return getOwnerProfile(ownerId);
    },
    enabled: Boolean(ownerId),
  });

  // 3. Load all plots of this owner in this mouza
  const { data: plots = [], isLoading: isPlotsLoading } = useQuery<OwnerPlotDetail[]>({
    queryKey: ["ownerPlotsList", floodId, ownerId],
    queryFn: async () => {
      if (!floodId || !ownerId) return [];
      return getOwnerPlots(floodId, ownerId);
    },
    enabled: Boolean(floodId && ownerId),
  });

  // Totals
  const totalArea = useMemo(() => {
    return plots.reduce((acc, p) => acc + (p.areaDecimal || 0), 0);
  }, [plots]);

  const totalFlooded = useMemo(() => {
    return plots.reduce((acc, p) => acc + (p.floodedAreaDecimal || 0), 0);
  }, [plots]);

  // Copy All Coordinates
  const handleCopyAllCoordinates = () => {
    if (!plots.length) return;
    const lines = plots.map((p, idx) => {
      const header = `Plot #${idx + 1} (Dag ${p.dagNo}, Khatian ${p.khatianNo}):`;
      const cornersText = p.corners
        .map((c, i) => `  ${i + 1} (${c.label}): ${c.lat.toFixed(6)}, ${c.lon.toFixed(6)}`)
        .join("\n");
      return `${header}\n${cornersText}`;
    });

    navigator.clipboard.writeText(lines.join("\n\n")).then(() => {
      setCopiedAllCoords(true);
      setTimeout(() => setCopiedAllCoords(false), 2500);
    });
  };

  // Copy Single Plot 4 Corners (lat, lon format per corner)
  const handleCopyFourCorners = (plot: OwnerPlotDetail) => {
    const lines = plot.corners
      .map((c) => `${c.lat.toFixed(6)}, ${c.lon.toFixed(6)}`)
      .join("\n");

    navigator.clipboard.writeText(lines).then(() => {
      setCopiedPlotId(plot.plotId);
      setTimeout(() => setCopiedPlotId(null), 2000);
    });
  };

  // Download CSV: columns dag_no, khatian_no, c1_lat, c1_lon, c2_lat, c2_lon, c3_lat, c3_lon, c4_lat, c4_lon
  const handleDownloadCSV = () => {
    if (!plots.length) return;
    const header = "dag_no,khatian_no,c1_lat,c1_lon,c2_lat,c2_lon,c3_lat,c3_lon,c4_lat,c4_lon";
    const rows = plots.map((p) => {
      const [c1, c2, c3, c4] = p.corners;
      return [
        p.dagNo,
        p.khatianNo,
        c1.lat.toFixed(6),
        c1.lon.toFixed(6),
        c2.lat.toFixed(6),
        c2.lon.toFixed(6),
        c3.lat.toFixed(6),
        c3.lon.toFixed(6),
        c4.lat.toFixed(6),
        c4.lon.toFixed(6),
      ].join(",");
    });

    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${ownerId}_${mouzaId}_coordinates.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download GeoJSON
  const handleDownloadGeoJSON = () => {
    if (!plots.length) return;
    const geojson = {
      type: "FeatureCollection",
      mouzaId,
      floodId,
      owner: {
        id: profile?.id || ownerId,
        name: profile?.name || "Unknown",
        fatherName: profile?.fatherName,
      },
      features: plots.map((p, idx) => ({
        type: "Feature",
        properties: {
          index: idx + 1,
          plotId: p.plotId,
          dagNo: p.dagNo,
          khatianNo: p.khatianNo,
          landClass: p.landClass,
          areaDecimal: p.areaDecimal,
          floodedAreaDecimal: p.floodedAreaDecimal,
          depthClass: p.depthClass,
          floodStatus: getFloodStatusLabel(p),
          corners: p.corners.map((c, i) => ({
            cornerIndex: i + 1,
            label: c.label,
            lat: Number(c.lat.toFixed(6)),
            lon: Number(c.lon.toFixed(6)),
          })),
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [p.corners[0].lon, p.corners[0].lat],
              [p.corners[1].lon, p.corners[1].lat],
              [p.corners[2].lon, p.corners[2].lat],
              [p.corners[3].lon, p.corners[3].lat],
              [p.corners[0].lon, p.corners[0].lat],
            ],
          ],
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: "application/geo+json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${ownerId}_${mouzaId}_cadastral_plots.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Flood status text helper
  function getFloodStatusLabel(p: OwnerPlotDetail, lang?: Language): string {
    if (!p.floodedAreaDecimal || p.floodedAreaDecimal <= 0) {
      return lang === "bn" ? "অনাক্রান্ত (প্লাবিত নয়)" : "Not flooded";
    }
    const isFull = p.floodedAreaDecimal >= p.areaDecimal * 0.95;
    const depth = p.depthClass && p.depthClass !== "none"
      ? (lang === "bn"
          ? ` (${p.depthClass === "deep" ? "গভীর" : p.depthClass === "moderate" ? "মাঝারি" : "অগভীর"})`
          : ` (${p.depthClass})`)
      : "";
    if (lang === "bn") {
      return isFull ? `সম্পূর্ণ নিমজ্জিত${depth}` : `আংশিক নিমজ্জিত${depth}`;
    }
    return isFull ? `Full${depth}` : `Partial${depth}`;
  }

  // Open parcel outline in Google Earth
  const handleOpenInGoogleEarth = (plot: OwnerPlotDetail) => {
    const meta: EarthOwnerMeta = {
      ownerName: profile?.name,
      mouzaName: flood?.mouzaName,
      floodId,
    };
    const statusLabel = getFloodStatusLabel(plot);
    const earthParcel: EarthParcel = {
      plotId: plot.plotId,
      dagNo: plot.dagNo,
      khatianNo: plot.khatianNo,
      landClass: plot.landClass,
      areaDecimal: plot.areaDecimal,
      floodStatus: statusLabel,
      corners: plot.corners,
    };
    const { fileName } = openParcelInGoogleEarth(earthParcel, meta);
    setEarthHint({ plotId: plot.plotId, fileName });
    setTimeout(() => {
      setEarthHint((curr) => (curr?.plotId === plot.plotId ? null : curr));
    }, 12000);
  };

  // Map coordinate transformation & dynamic bounding box (zooms to selected plot or fits all)
  const mapGeometry = useMemo(() => {
    if (!plots.length) return null;

    let targetPlots = plots;
    if (selectedPlotId) {
      const focused = plots.find((p) => p.plotId === selectedPlotId);
      if (focused) targetPlots = [focused];
    }

    let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
    targetPlots.forEach((p) => {
      p.corners.forEach((c) => {
        if (c.lat < minLat) minLat = c.lat;
        if (c.lat > maxLat) maxLat = c.lat;
        if (c.lon < minLon) minLon = c.lon;
        if (c.lon > maxLon) maxLon = c.lon;
      });
    });

    const isSingle = targetPlots.length === 1;
    const padLat = isSingle ? 0.0006 : Math.max((maxLat - minLat) * 0.35, 0.001);
    const padLon = isSingle ? 0.0008 : Math.max((maxLon - minLon) * 0.35, 0.001);

    return {
      minLat: minLat - padLat,
      maxLat: maxLat + padLat,
      minLon: minLon - padLon,
      maxLon: maxLon + padLon,
    };
  }, [plots, selectedPlotId]);

  const projectPoint = (lat: number, lon: number): [number, number] => {
    if (!mapGeometry) return [50, 50];
    const x = ((lon - mapGeometry.minLon) / (mapGeometry.maxLon - mapGeometry.minLon)) * 800;
    const y = ((mapGeometry.maxLat - lat) / (mapGeometry.maxLat - mapGeometry.minLat)) * 500;
    return [Math.max(25, Math.min(775, x)), Math.max(25, Math.min(475, y))];
  };

  const isLoading = isProfileLoading || isPlotsLoading;

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader
        title={
          profile
            ? language === "bn"
              ? `${getLocalizedOwnerName(profile.name, language)} • ক্যাডাস্ট্রাল জমির পোর্টফোলিও`
              : `${profile.name} • Cadastral Land Portfolio`
            : language === "bn" ? "মালিকের জমির পাতা" : "Owner Land Page"
        }
        subtitle={
          language === "bn"
            ? `ক্যাডাস্ট্রাল পার্সেল রেজিস্টার ও চার-কোণা সীমানা জরিপ • ${getLocalizedMouzaName(mouzaId, flood?.mouzaName, language)}`
            : `Cadastral parcel register and four-corner boundary survey • ${flood?.mouzaName || mouzaId}`
        }
      >
        <Link
          href={`/flood/${mouzaId}/${floodId}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill bg-surface border border-border text-xs font-semibold text-ink hover:bg-surface-alt transition-colors shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === "bn" ? "বন্যা তথ্যে ফিরুন" : "Back to Flood"}</span>
        </Link>
      </AppHeader>

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-[1440px] mx-auto w-full">
        {/* Breadcrumb Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted pb-1">
          <nav className="flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:text-ink transition-colors">
              {language === "bn" ? "নীড়পাতা" : "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/flood" className="hover:text-ink transition-colors">
              {language === "bn" ? "বন্যা পর্যবেক্ষণ" : "Flood Monitoring"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/flood/${mouzaId}/${floodId}`}
              className="hover:text-ink transition-colors"
            >
              {getLocalizedMouzaName(mouzaId, flood?.mouzaName, language)}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-water font-semibold">
              {getLocalizedOwnerName(profile?.name || ownerId, language)}
            </span>
          </nav>

          <Link
            href={`/flood/${mouzaId}/${floodId}`}
            className="text-xs text-water hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "বন্যার ঘটনায় ফিরুন" : "Back to Flood Event"}</span>
          </Link>
        </div>

        {/* LOADING SKELETON */}
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-card" />
            <Skeleton className="h-[480px] w-full rounded-card" />
            <Skeleton className="h-64 w-full rounded-card" />
          </div>
        )}

        {!isLoading && profile && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* STEP 3.1: HEADER */}
            {/* Owner name, father's name, plots count, total area, total flooded, "Back to flood" */}
            <div className="bhumidorpon-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-surface to-[#F0FDF4]/30">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-pill bg-accent-soft text-accent-deep text-[11px] font-bold">
                    {language === "bn" ? "নিবন্ধিত ভূমির মালিক" : "Registered Landowner"}
                  </span>
                  <span className="text-xs text-muted font-mono">{profile.id}</span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink">
                    {getLocalizedOwnerName(profile.name, language)}
                  </h1>
                  <p className="text-xs sm:text-sm text-secondary font-medium mt-0.5">
                    {language === "bn" ? "পিতার নাম:" : "Father's Name:"}{" "}
                    <strong className="text-ink">{getLocalizedFatherName(profile.fatherName, language)}</strong>
                  </p>
                </div>

                <div className="text-xs text-muted flex flex-wrap items-center gap-3 pt-1">
                  <span>NID: {profile.nid || "Verified"}</span>
                  <span>•</span>
                  <span>{language === "bn" ? "যোগাযোগ:" : "Contact:"} {profile.phone || "+880 1715 000000"}</span>
                  <span>•</span>
                  <span>{language === "bn" ? "মৌজা:" : "Mouza:"} {getLocalizedMouzaName(mouzaId, flood?.mouzaName, language)}</span>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Stats strip */}
                <div className="flex items-center gap-4 border border-border/80 p-3.5 rounded-xl bg-surface">
                  <div>
                    <div className="text-[11px] text-muted">{language === "bn" ? "মোট দাগ" : "Plots Count"}</div>
                    <div className="text-xl font-bold text-ink tabular-nums">
                      {language === "bn" ? `${formatNumberLocalized(plots.length, language)} টি দাগ` : `${plots.length} Plots`}
                    </div>
                  </div>
                  <div className="border-l border-border pl-4">
                    <div className="text-[11px] text-muted">{language === "bn" ? "মোট জমি" : "Total Area"}</div>
                    <div className="text-xl font-bold text-ink tabular-nums">
                      {formatArea(totalArea, unit, language)}
                    </div>
                  </div>
                  <div className="border-l border-border pl-4">
                    <div className="text-[11px] text-muted">{language === "bn" ? "মোট প্লাবিত" : "Total Flooded"}</div>
                    <div className="text-xl font-bold text-water tabular-nums">
                      {formatArea(totalFlooded, unit, language)}
                    </div>
                  </div>
                </div>

                {/* Back to Flood button */}
                <Link
                  href={`/flood/${mouzaId}/${floodId}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface border border-border text-xs font-semibold text-ink hover:bg-surface-alt transition-colors shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "বন্যা তথ্যে ফিরুন" : "Back to Flood"}</span>
                </Link>
              </div>
            </div>

            {/* ACTION TOOLBAR: Copy all coordinates, Download CSV, Download GeoJSON */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface rounded-xl border border-border">
              <div className="flex items-center gap-2 text-xs text-muted font-medium">
                <Layers className="w-4 h-4 text-water" />
                <span>
                  {language === "bn"
                    ? `ক্যাডাস্ট্রাল জরিপ কার্যক্রম (${plots.length.toLocaleString("bn-BD")} টি চার-কোণা বিশিষ্ট দাগ)`
                    : `Cadastral Survey Operations (${plots.length} Four-Corner Parcels)`}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  id="copy-all-coordinates-btn"
                  onClick={handleCopyAllCoordinates}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface border border-border text-xs font-semibold text-ink hover:bg-surface-alt transition-colors shadow-2xs"
                >
                  {copiedAllCoords ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-gain" />
                      <span className="text-gain">
                        {language === "bn" ? "সকল জিপিএস স্থানাঙ্ক কপি করা হয়েছে!" : "Copied All GPS Coordinates!"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-muted" />
                      <span>{language === "bn" ? "সকল স্থানাঙ্ক কপি করুন" : "Copy all coordinates"}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  id="download-csv-btn"
                  onClick={handleDownloadCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface border border-border text-xs font-semibold text-ink hover:bg-surface-alt transition-colors shadow-2xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-gain" />
                  <span>{language === "bn" ? "সিএসভি ডাউনলোড" : "Download CSV"}</span>
                </button>

                <button
                  type="button"
                  id="download-geojson-btn"
                  onClick={handleDownloadGeoJSON}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "জিওজেসন (GeoJSON) ডাউনলোড" : "Download GeoJSON"}</span>
                </button>
              </div>
            </div>

            {/* STEP 3.2: MAP */}
            {/* Only this owner's plots highlighted and numbered, others dimmed, */}
            {/* and each plot's FOUR corners marked 1-4 on the map (small numbered markers). */}
            <div className="bhumidorpon-card p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-water" />
                    <span>
                      {language === "bn"
                        ? "ক্যাডাস্ট্রাল সীমানা মানচিত্র — মালিকের দাগ ও চার-কোণা জরিপ"
                        : "Cadastral Boundary Map — Owner Parcel Footprint & Four-Corner Survey"}
                    </span>
                  </h3>
                  <p className="text-xs text-muted">
                    {language === "bn"
                      ? `কেবলমাত্র ${getLocalizedOwnerName(profile.name, language)}-এর দাগগুলো হাইলাইট ও নম্বরযুক্ত; পার্শ্ববর্তী দাগগুলো অস্পষ্ট রাখা হয়েছে। কোণগুলো ১ (উত্তর-পশ্চিম), ২ (উত্তর-পূর্ব), ৩ (দক্ষিণ-পূর্ব), ৪ (দক্ষিণ-পশ্চিম) হিসেবে চিহ্নিত।`
                      : `Only ${profile.name}'s plots are highlighted and numbered; surrounding parcels are dimmed. Corners are marked 1 (NW), 2 (NE), 3 (SE), 4 (SW).`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {selectedPlotId && (
                    <button
                      type="button"
                      onClick={() => setSelectedPlotId(null)}
                      className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink font-semibold px-2.5 py-1 rounded-md border border-border bg-surface hover:bg-surface-alt transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{language === "bn" ? "জুম রিসেট" : "Reset Zoom"}</span>
                    </button>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-water border border-[#0284C7]" />
                      <span>{language === "bn" ? "নিমজ্জিত" : "Submerged"}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-gain/40 border border-gain" />
                      <span>{language === "bn" ? "শুকনো" : "Dry"}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-[#E5E7EB] border border-border" />
                      <span>{language === "bn" ? "অন্যান্য দাগ" : "Dimmed"}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Leaflet Cadastral Interactive Map */}
              <OwnerPlotsLeafletMap
                plots={plots}
                selectedPlotId={selectedPlotId}
                onSelectPlot={setSelectedPlotId}
                mouzaName={getLocalizedMouzaName(mouzaId, flood?.mouzaName, language)}
              />
            </div>

            {/* STEP 3.3: PLOT CARDS (Below the Map) */}
            {/* Card for EACH plot showing Dag No., Khatian No., Land class, Area, Flood status */}
            {/* AND ALL FOUR CORNER COORDINATES, always visible, not hidden behind an expander */}
            {/* Nested table "Corner | Latitude | Longitude" with rows 1 (NW), 2 (NE), 3 (SE), 4 (SW) */}
            {/* 6 decimals, latitude first. Do not show a centroid. */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-ink">
                    {language === "bn"
                      ? `ক্যাডাস্ট্রাল দাগ রেজিস্টার (${formatNumberLocalized(plots.length, language)} টি দাগ)`
                      : `Cadastral Parcel Register (${plots.length} Parcels)`}
                  </h3>
                  <p className="text-xs text-muted">
                    {language === "bn"
                      ? "প্রতিটি জমির সীমানা সম্পর্কিত চার-কোণা জিপিএস স্থানাঙ্ক। মানচিত্রে জুম করতে কার্ডে ক্লিক করুন।"
                      : "Complete four-corner cadastral boundary coordinates for each land parcel. Click a card to zoom the map."}
                  </p>
                </div>
                <div className="text-xs text-secondary font-medium">
                  {language === "bn"
                    ? `${formatNumberLocalized(plots.length, language)} টি দাগ • মোট ${formatArea(totalArea, unit, language)} • প্লাবিত ${formatArea(totalFlooded, unit, language)}`
                    : `${plots.length} Parcels • ${formatArea(totalArea, unit)} Total • ${formatArea(totalFlooded, unit)} Flooded`}
                </div>
              </div>

              {/* Grid of Plot Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {plots.map((plot, plotIdx) => {
                  const isSelected = selectedPlotId === plot.plotId;
                  const isSubmerged = plot.floodedAreaDecimal > 0;
                  const statusLabel = getFloodStatusLabel(plot, language);

                  const cornerRows = [
                    {
                      num: 1,
                      label: "NW",
                      rowLabel: language === "bn" ? "১ (উত্তর-পশ্চিম)" : "1 (NW)",
                      lat: plot.corners[0].lat,
                      lon: plot.corners[0].lon,
                    },
                    {
                      num: 2,
                      label: "NE",
                      rowLabel: language === "bn" ? "২ (উত্তর-পূর্ব)" : "2 (NE)",
                      lat: plot.corners[1].lat,
                      lon: plot.corners[1].lon,
                    },
                    {
                      num: 3,
                      label: "SE",
                      rowLabel: language === "bn" ? "৩ (দক্ষিণ-পূর্ব)" : "3 (SE)",
                      lat: plot.corners[2].lat,
                      lon: plot.corners[2].lon,
                    },
                    {
                      num: 4,
                      label: "SW",
                      rowLabel: language === "bn" ? "৪ (দক্ষিণ-পশ্চিম)" : "4 (SW)",
                      lat: plot.corners[3].lat,
                      lon: plot.corners[3].lon,
                    },
                  ];

                  return (
                    <div
                      key={plot.plotId}
                      id={`plot-card-${plot.dagNo}`}
                      onClick={() => setSelectedPlotId(isSelected ? null : plot.plotId)}
                      className={cn(
                        "p-5 rounded-2xl border transition-all cursor-pointer bg-surface flex flex-col justify-between space-y-4",
                        isSelected
                          ? "ring-2 ring-water border-water shadow-md bg-water/[0.02]"
                          : "border-border hover:border-water/50 hover:shadow-xs"
                      )}
                    >
                      {/* Top Bar: Plot #, Dag No, Khatian, Status & Copy 4 Corners */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                "w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold transition-colors",
                                isSelected
                                  ? "bg-water text-white"
                                  : isSubmerged
                                  ? "bg-water/15 text-water"
                                  : "bg-surface-alt text-secondary border border-border"
                              )}
                            >
                              {formatNumberLocalized(plotIdx + 1, language)}
                            </span>
                            <div>
                              <div className="text-sm font-bold text-ink">
                                {language === "bn" ? "দাগ নং" : "Dag No."} {formatNumberLocalized(plot.dagNo, language)}
                              </div>
                              <div className="text-xs text-secondary font-mono">
                                {language === "bn" ? "খতিয়ান:" : "Khatian:"} {formatNumberLocalized(plot.khatianNo, language)}
                              </div>
                            </div>
                          </div>

                          {/* Copy 4 corners button */}
                          <button
                            type="button"
                            id={`copy-corners-btn-${plot.dagNo}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyFourCorners(plot);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-alt text-xs font-semibold text-ink transition-colors shadow-2xs"
                            title="Copy four lat, lon lines"
                          >
                            {copiedPlotId === plot.plotId ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-gain" />
                                <span className="text-gain">{language === "bn" ? "কপি হয়েছে!" : "Copied!"}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-muted" />
                                <span>{language === "bn" ? "৪টি কোণা কপি করুন" : "Copy 4 corners"}</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Metadata row */}
                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-surface-alt/50 border border-border/60 text-xs">
                          <div>
                            <div className="text-[10px] text-muted">{language === "bn" ? "জমির শ্রেণি" : "Land Class"}</div>
                            <div className="font-semibold text-ink capitalize truncate">
                              {getLocalizedLandClass(plot.landClass, language)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted">{language === "bn" ? "আয়তন" : "Area"}</div>
                            <div className="font-semibold text-ink tabular-nums">
                              {formatArea(plot.areaDecimal, unit, language)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted">{language === "bn" ? "প্লাবন অবস্থা" : "Flood Status"}</div>
                            <div
                              className={cn(
                                "font-semibold text-[11px] truncate",
                                isSubmerged ? "text-water" : "text-gain"
                              )}
                            >
                              {statusLabel}
                            </div>
                          </div>
                        </div>

                        {/* NESTED FOUR CORNER COORDINATES TABLE (ALWAYS VISIBLE) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-ink flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-water" />
                              <span>{language === "bn" ? "চার কোণার স্থানাঙ্ক" : "Four Corner Coordinates"}</span>
                            </span>
                            <span className="text-[10px] text-muted font-mono">
                              {language === "bn" ? "প্রথমে অক্ষাংশ (Lat) • ৬ দশমিক" : "Latitude First • 6 Decimals"}
                            </span>
                          </div>

                          <div className="overflow-x-auto rounded-xl border border-border">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-surface-alt border-b border-border text-[10px] font-semibold text-muted uppercase tracking-wider">
                                  <th className="py-2 px-3">{language === "bn" ? "কোণা" : "Corner"}</th>
                                  <th className="py-2 px-3">{language === "bn" ? "অক্ষাংশ (Lat)" : "Latitude"}</th>
                                  <th className="py-2 px-3">{language === "bn" ? "দ্রাঘিমাংশ (Lon)" : "Longitude"}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/60 font-mono text-[11px]">
                                {cornerRows.map((c) => (
                                  <tr key={c.label} className="hover:bg-surface-alt/40">
                                    <td className="py-1.5 px-3 font-sans font-bold text-ink">
                                      {c.rowLabel}
                                    </td>
                                    <td className="py-1.5 px-3 text-ink font-semibold tabular-nums">
                                      {formatNumberLocalized(c.lat.toFixed(6), language)}
                                    </td>
                                    <td className="py-1.5 px-3 text-secondary font-medium tabular-nums">
                                      {formatNumberLocalized(c.lon.toFixed(6), language)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Open in Google Earth Action */}
                          <button
                            type="button"
                            id={`open-google-earth-btn-${plot.dagNo}`}
                            data-testid="open-google-earth-btn"
                            title="Download the parcel outline as KML and open Google Earth at this parcel"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenInGoogleEarth(plot);
                            }}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-water/40 bg-water/10 hover:bg-water/20 text-water text-xs font-bold transition-colors shadow-2xs"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>{language === "bn" ? "গুগল আর্থে দেখুন" : "Open in Google Earth"}</span>
                          </button>

                          {earthHint && earthHint.plotId === plot.plotId && (
                            <p
                              role="status"
                              className="p-2.5 rounded-xl bg-surface-alt border border-border text-[11px] text-secondary leading-relaxed animate-in fade-in duration-200"
                            >
                              <strong className="text-ink font-mono">{earthHint.fileName}</strong> {language === "bn" ? "ডাউনলোড হয়েছে। গুগল আর্থে দেখতে New → Open local KML file নির্বাচন করে ডাউনলোড করা ফাইলটি সিলেক্ট করুন।" : "downloaded. In Google Earth choose New → Open local KML file and select the downloaded file to display the parcel outline (Earth Pro: double-click the file)."}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Bottom helper */}
                      <div className="pt-1 flex items-center justify-between text-[10px] text-muted">
                        <span>{language === "bn" ? "মানচিত্র জুম করতে কার্ডে ক্লিক করুন" : "Click card to zoom map"}</span>
                        {isSelected && (
                          <span className="text-water font-semibold inline-flex items-center gap-1">
                            <ZoomIn className="w-3 h-3" />
                            {language === "bn" ? "মানচিত্রে প্রদর্শিত" : "Focused on Map"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
