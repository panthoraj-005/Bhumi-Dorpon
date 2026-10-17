/**
 * BhumiDorpon Land Information Search & Hazard Risk Analysis Service
 * Connects cadastral plots, ownership khatians, transaction logs, tax records,
 * and disaster-related physical change / deep-learning risk prediction models.
 */

import { Corner } from "./types";
import { deriveCorners } from "./data";

export type DataStatusBadge =
  | "verified"
  | "demo"
  | "unverified"
  | "unavailable"
  | "external_required";

export interface LandIdentification {
  districtId: string;
  districtName: string;
  upazilaId: string;
  upazilaName: string;
  mouzaId: string;
  mouzaName: string;
  jlNo: string;
  dagNo: string;
  khatianNo: string;
  plotId: string;
  areaDecimal: number;
  landClass: string;
  physicalStatus: "existing" | "partially_affected" | "historically_lost" | "accreted";
  corners: [Corner, Corner, Corner, Corner];
  coordinates: [number, number];
  polygon?: [number, number][][];
}

export interface LandOwnership {
  ownerName: string;
  fatherName: string;
  phone: string;
  nidMasked: string;
  sharePercent: number;
  recordedDate: string;
  dataSource: string;
  verificationStatus: DataStatusBadge;
}

export interface LandSaleListing {
  isListedForSale: boolean;
  listingStatus: string;
  askingPriceBDT?: number;
  listingDate?: string;
  dataSource: string;
  statusBadge: DataStatusBadge;
}

export interface LandLegalInfo {
  hasPendingDispute: boolean;
  caseStatus: string;
  caseNumber?: string;
  courtName?: string;
  verificationStatus: DataStatusBadge;
  dataSource: string;
}

export interface LandTaxInfo {
  taxStatus: "up_to_date" | "outstanding" | "exempt" | "unknown";
  assessmentYear: string;
  outstandingAmountBDT: number;
  lastPaymentDate?: string;
  receiptNumber?: string;
  statusBadge: DataStatusBadge;
  dataSource: string;
}

export interface LandRegistrationHistory {
  registrationDeedNo: string;
  mutationKhatianNo: string;
  registrationOffice: string;
  registrationYear: number;
  lastLandUse: string;
  soilCondition: string;
  statusBadge: DataStatusBadge;
  dataSource: string;
}

export interface DisasterHazardHistory {
  eventDate: string;
  disasterType: "river_erosion" | "flood" | "landslide" | "char" | "coastal";
  disasterNameBn: string;
  disasterNameEn: string;
  observationPeriod: string;
  affectedAreaDecimal: number;
  recordedPreviousAreaDecimal: number;
  estimatedLandLossDecimal: number;
  sedimentAccretionDecimal: number;
  physicalImpact: "permanent_loss" | "temporary_inundation" | "active_erosion" | "sediment_deposition";
  dataSource: string;
  observationDate: string;
  isHistoricallySubmerged: boolean;
  historicalCoordinates?: [number, number];
}

export interface FutureRiskPrediction {
  hazardType: "river_erosion" | "flood" | "landslide" | "coastal" | "char";
  hazardNameBn: string;
  hazardNameEn: string;
  probabilityPercent: number;
  riskCategory: "Low" | "Moderate" | "High" | "Extreme";
  forecastPeriod: string;
  modelName: string;
  confidencePercent: number;
  observationDate: string;
  isModelEstimate: boolean;
  explanationBn: string;
  explanationEn: string;
}

export interface LandInformationReport {
  identification: LandIdentification;
  ownership: LandOwnership;
  sale: LandSaleListing;
  legal: LandLegalInfo;
  tax: LandTaxInfo;
  history: LandRegistrationHistory;
  disasterHistory: DisasterHazardHistory[];
  futurePredictions: FutureRiskPrediction[];
  isFound: boolean;
}

/**
 * Searches cadastral land record by cascading criteria:
 * District, Upazila, Mouza, Dag No., Khatian No.
 * Preserves leading zeros in dagNo and khatianNo.
 */
export async function searchLandInformation(criteria: {
  districtId: string;
  upazilaId: string;
  mouzaId?: string;
  dagNo?: string;
  khatianNo?: string;
}): Promise<LandInformationReport | null> {
  const cleanDag = criteria.dagNo ? criteria.dagNo.trim() : "";
  const cleanKhatian = criteria.khatianNo ? criteria.khatianNo.trim() : "";

  // Artificial realistic lookup delay
  await new Promise((resolve) => setTimeout(resolve, 260));

  let plots: any[] = [];
  let owners: any[] = [];
  let mouzas: any[] = [];
  let common: any = null;

  if (typeof window !== "undefined") {
    try {
      const [plotsRes, ownersRes, mouzasRes, commonRes] = await Promise.all([
        fetch("/mocks/plots.json"),
        fetch("/mocks/owners.json"),
        fetch("/mocks/mouzas.json"),
        fetch("/mocks/common.json"),
      ]);
      plots = await plotsRes.json();
      owners = await ownersRes.json();
      mouzas = await mouzasRes.json();
      common = await commonRes.json();
    } catch (e) {
      console.error("Failed to load search dependencies:", e);
      return null;
    }
  } else {
    const fs = require("fs");
    const path = require("path");
    plots = JSON.parse(fs.readFileSync(path.join(process.cwd(), "mocks", "plots.json"), "utf-8"));
    owners = JSON.parse(fs.readFileSync(path.join(process.cwd(), "mocks", "owners.json"), "utf-8"));
    mouzas = JSON.parse(fs.readFileSync(path.join(process.cwd(), "mocks", "mouzas.json"), "utf-8"));
    common = JSON.parse(fs.readFileSync(path.join(process.cwd(), "mocks", "common.json"), "utf-8"));
  }

  const district = common?.districts?.find((d: any) => d.id === criteria.districtId);
  const upazila = common?.upazilas?.find((u: any) => u.id === criteria.upazilaId);

  // Filter plots matching mouza, dag, khatian
  let matchedPlot: any = null;

  if (cleanDag || cleanKhatian) {
    matchedPlot = plots.find((p: any) => {
      // Must match mouza if provided
      if (criteria.mouzaId && p.mouzaId !== criteria.mouzaId) return false;

      // Dag check (exact string match preserving leading zeros)
      if (cleanDag && p.dagNo !== cleanDag) return false;

      // Khatian check (exact string or case-insensitive match)
      if (
        cleanKhatian &&
        p.khatianNo.toLowerCase() !== cleanKhatian.toLowerCase()
      ) {
        return false;
      }

      return true;
    });
  }

  // If no exact plot was found but mouza is chosen, pick a representative plot in that mouza if dag/khatian was empty
  if (!matchedPlot && criteria.mouzaId && !cleanDag && !cleanKhatian) {
    matchedPlot = plots.find((p: any) => p.mouzaId === criteria.mouzaId);
  }

  // If still not found, return null
  if (!matchedPlot) {
    // If user provided a specific Dag or Khatian that does not exist
    if (cleanDag || cleanKhatian) {
      return null;
    }
    // Pick the first available plot in upazila mouzas
    const upazilaMouzaIds = new Set(
      mouzas.filter((m: any) => m.upazilaId === criteria.upazilaId).map((m: any) => m.id)
    );
    matchedPlot = plots.find((p: any) => upazilaMouzaIds.has(p.mouzaId)) || plots[0];
  }

  const mouza = mouzas.find((m: any) => m.id === matchedPlot.mouzaId) || {
    id: matchedPlot.mouzaId,
    name: "মেঘাই মৌজা (Meghai)",
    jlNo: "JL-42",
  };

  const owner = owners.find((o: any) => o.id === matchedPlot.ownerId) || {
    name: "রহিম চৌধুরী (Rahim Chowdhury)",
    phone: "+880 1715 000000",
    nid: "19855859500000",
  };

  // Derive coordinates and corners
  const ring = (matchedPlot.polygon?.[0] as [number, number][]) || [
    [89.6274, 24.5565],
    [89.6293, 24.5564],
    [89.629, 24.5554],
    [89.6274, 24.5554],
    [89.6274, 24.5565],
  ];

  const corners = matchedPlot.corners || deriveCorners(ring);
  const centerLat = Number(((corners[0].lat + corners[2].lat) / 2).toFixed(6));
  const centerLon = Number(((corners[0].lon + corners[2].lon) / 2).toFixed(6));

  // Determine physical status based on dag number or hazard context
  const isLost = matchedPlot.dagNo === "101" || matchedPlot.dagNo === "0101";
  const isPartiallyAffected = matchedPlot.dagNo === "102" || matchedPlot.dagNo === "2271";

  const physicalStatus = isLost
    ? "historically_lost"
    : isPartiallyAffected
    ? "partially_affected"
    : "existing";

  // Father name generation
  const fatherPrefixes = [
    "মরহুম আব্দুল গফুর",
    "মরহুম নুরুল ইসলাম",
    "মরহুম মকবুল হোসেন",
    "মরহুম ফজলুর রহমান",
    "মরহুম সিরাজুল ইসলাম",
  ];
  const fatherIdx = (matchedPlot.dagNo.charCodeAt(0) || 0) % fatherPrefixes.length;
  const fatherName = `${fatherPrefixes[fatherIdx]} ${owner.name.split(" ")[0] || "চৌধুরী"}`;

  // Report Construction
  const report: LandInformationReport = {
    isFound: true,
    identification: {
      districtId: district?.id || criteria.districtId,
      districtName: district?.name || "সিরাজগঞ্জ (Sirajganj)",
      upazilaId: upazila?.id || criteria.upazilaId,
      upazilaName: upazila?.name || "কাজীপুর (Kazipur)",
      mouzaId: mouza.id,
      mouzaName: mouza.name,
      jlNo: mouza.jlNo || "JL-42",
      dagNo: matchedPlot.dagNo,
      khatianNo: matchedPlot.khatianNo,
      plotId: matchedPlot.id,
      areaDecimal: matchedPlot.areaDecimal || 42.5,
      landClass: matchedPlot.landClass || "কৃষি (Nal Agricultural)",
      physicalStatus,
      corners,
      coordinates: [centerLon, centerLat],
      polygon: matchedPlot.polygon,
    },

    ownership: {
      ownerName: owner.name,
      fatherName,
      phone: owner.phone,
      nidMasked: owner.nid ? `${owner.nid.slice(0, 4)}******${owner.nid.slice(-4)}` : "1985******3156",
      sharePercent: 100,
      recordedDate: "২০২৩-১১-১৪ (14 Nov 2023)",
      dataSource: "উপজেলা ভূমি প্রশাসন ক্যাডাস্ট্রাল আর.এস. রেকর্ড (Upazila Cadastral RS)",
      verificationStatus: "demo",
    },

    sale: {
      isListedForSale: false,
      listingStatus: "বিক্রির জন্য কোনো আবেদন বা তালিকাভুক্তি পাওয়া যায়নি",
      dataSource: "জাতীয় ভূমি রেজিস্ট্রেশন ও হস্তান্তর পোর্টাল (National Land Portal)",
      statusBadge: "external_required",
    },

    legal: {
      hasPendingDispute: false,
      caseStatus: "কোনো দেওয়ানি বা স্বত্ব মামলার সক্রিয় রেকর্ড নেই",
      dataSource: "জেলা দায়রা ও দেওয়ানি আদালত রেকর্ড ডেটাবেজ",
      verificationStatus: "external_required",
    },

    tax: {
      taxStatus: "up_to_date",
      assessmentYear: "১৪৩০-১৪৩১ বঙ্গাব্দ (2023-2024)",
      outstandingAmountBDT: 0,
      lastPaymentDate: "২০২৪-০৪-১২",
      receiptNumber: "LD-TAX-2024-884920",
      statusBadge: "demo",
      dataSource: "ভূমি উন্নয়ন কর অনলাইন ব্যবস্থাপনা সিস্টেম (ldtax.gov.bd)",
    },

    history: {
      registrationDeedNo: `DEED-${matchedPlot.dagNo}-2019`,
      mutationKhatianNo: `MUT-${matchedPlot.khatianNo}-04`,
      registrationOffice: `${upazila?.name || "কাজীপুর"} সাব-রেজিস্ট্রার কার্যালয়`,
      registrationYear: 2019,
      lastLandUse: "আমন ধান ও রবিশস্য উৎপাদন (Paddy & Crop Field)",
      soilCondition: "পলি দোআঁশ মাটি (Alluvial Silt Loam)",
      statusBadge: "demo",
      dataSource: "জেলা রেকর্ডরুম ও মৌজা খতিয়ান রেজিস্টার",
    },

    disasterHistory: [
      {
        eventDate: "আগস্ট ২০২০ – অক্টোবর ২০২৩",
        disasterType: "river_erosion",
        disasterNameBn: "যমুনা নদীর তীব্র ভাঙন ও গতিপথ পরিবর্তন",
        disasterNameEn: "Jamuna River Bank Erosion & Channel Shift",
        observationPeriod: "২০২০ – ২০২৩ বার্ষিক উপগ্রহ নিরীক্ষা",
        affectedAreaDecimal: isLost ? matchedPlot.areaDecimal : 18.4,
        recordedPreviousAreaDecimal: matchedPlot.areaDecimal,
        estimatedLandLossDecimal: isLost ? matchedPlot.areaDecimal : 18.4,
        sedimentAccretionDecimal: 0,
        physicalImpact: isLost ? "permanent_loss" : "active_erosion",
        dataSource: "ইউরোপীয় স্পেস এজেন্সি Sentinel-2 ও সিগমা-০ রাডার রিমোট সেন্সিং",
        observationDate: "অক্টোবর ২০২৪",
        isHistoricallySubmerged: isLost,
        historicalCoordinates: [centerLon, centerLat],
      },
      {
        eventDate: "জুলাই ২০২২",
        disasterType: "flood",
        disasterNameBn: "মৌসুমী আকস্মিক প্লাবন ও পলি সঞ্চয়ন",
        disasterNameEn: "Monsoon Flash Flood Inundation & Siltation",
        observationPeriod: "২০২২ বর্ষা মৌসুম",
        affectedAreaDecimal: 35.0,
        recordedPreviousAreaDecimal: matchedPlot.areaDecimal,
        estimatedLandLossDecimal: 0,
        sedimentAccretionDecimal: 4.2,
        physicalImpact: "temporary_inundation",
        dataSource: "বাংলাদেশ পানি উন্নয়ন বোর্ড (BWDB) ও স্যাটেলাইট এসএআর",
        observationDate: "আগস্ট ২০২২",
        isHistoricallySubmerged: false,
      },
    ],

    futurePredictions: [
      {
        hazardType: "river_erosion",
        hazardNameBn: "নদীভাঙন ঝুঁকি",
        hazardNameEn: "River Erosion Risk",
        probabilityPercent: isLost ? 95 : 68,
        riskCategory: isLost ? "Extreme" : "High",
        forecastPeriod: "২০২৫ – ২০২৭ (Monsoon Cycle)",
        modelName: "GeoAI-BD v2.4 (Multitemporal ConvLSTM)",
        confidencePercent: 88,
        observationDate: "অক্টোবর ২০২৪",
        isModelEstimate: true,
        explanationBn:
          "যমুনা নদীর প্রধান চ্যানেলের ডাইভারজেন্স ও তীব্র নদীবাঁক প্রবাহের কারণে তীরবর্তী এই দাগের মাটি ক্ষয়প্রবণতায় রয়েছে।",
        explanationEn:
          "High flow shear velocity and active bank thalweg migration position this parcel in the active erosion buffer.",
      },
      {
        hazardType: "flood",
        hazardNameBn: "বন্যা প্লাবন ঝুঁকি",
        hazardNameEn: "Flood Inundation Probability",
        probabilityPercent: 42,
        riskCategory: "Moderate",
        forecastPeriod: "বর্ষা ২০২৫",
        modelName: "HydroSAR-FloodNet v1.8",
        confidencePercent: 82,
        observationDate: "সেপ্টেম্বর ২০২৪",
        isModelEstimate: true,
        explanationBn:
          "বিপদসীমার ০.৫ মিটার ওপরে পানি প্রবাহিত হলে অস্থায়ী নিমজ্জনের সম্ভাবনা রয়েছে।",
        explanationEn:
          "Vulnerable to temporary backwater surcharge if river stage exceeds danger level by 0.5m.",
      },
      {
        hazardType: "landslide",
        hazardNameBn: "ভূমিধস ঝুঁকি",
        hazardNameEn: "Landslide Risk",
        probabilityPercent: 4,
        riskCategory: "Low",
        forecastPeriod: "২০২৫",
        modelName: "InSAR SlopeNet v2.1",
        confidencePercent: 94,
        observationDate: "জুন ২০২৪",
        isModelEstimate: true,
        explanationBn: "সমতল পলি গঠিত ভূ-প্রকৃতির কারণে ঢাল পতনের কোনো ঝুঁকি নেই।",
        explanationEn: "Flat alluvial plain topography indicates negligible mass-wasting susceptibility.",
      },
      {
        hazardType: "coastal",
        hazardNameBn: "উপকূলীয় ক্ষয় ও জোয়ার",
        hazardNameEn: "Coastal Erosion & Surge",
        probabilityPercent: 2,
        riskCategory: "Low",
        forecastPeriod: "২০২৫ – ২০২৬",
        modelName: "CoastWatch-Delta v1.2",
        confidencePercent: 96,
        observationDate: "নভেম্বর ২০২৪",
        isModelEstimate: true,
        explanationBn: "অভ্যন্তরীণ নদীবর্তী অঞ্চলে অবস্থিত হওয়ায় সামুদ্রিক জোয়ারের সরাসরি প্রভাব নেই।",
        explanationEn: "Inland riverine location is naturally protected from marine tidal surges.",
      },
    ],
  };

  return report;
}
