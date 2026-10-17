/**
 * BhumiDorpon Landslide Mountain & Historical Event Data Service
 * Maps Chittagong Hill Tracts mountains to historical slope failure events
 * and deep-learning forecast scenarios for both recorded and forecast modes.
 */

import { DataMode } from "./types";

export interface LandslideEventRecord {
  id: string;
  hillId: string;
  mode: DataMode;
  mountainNameBn: string;
  mountainNameEn: string;
  eventNameBn: string;
  eventNameEn: string;
  eventDate: string;
  year: number;
  locationBn: string;
  locationEn: string;
  affectedSlopeAreaDecimal: number;
  debrisVolumeM3: number;
  slopeGradientDeg: number;
  rainfallMm24h: number;
  casualtiesAvoidedFamilies: number;
  homesteadsAtRisk: number;
  impactSummaryBn: string;
  impactSummaryEn: string;
  isDemo: boolean;
  modelConfidenceScore?: number;
}

export const LANDSLIDE_EVENTS: LandslideEventRecord[] = [
  // --- GHAGRA HILL CORRIDOR ---
  {
    id: "ev_ghagra_2024",
    hillId: "ghagra",
    mode: "recorded",
    mountainNameBn: "ঘাগড়া শৈল করিডোর",
    mountainNameEn: "Ghagra Hill Corridor",
    eventNameBn: "জুন ২০২৪ মৌসুমী ঢাল ধস ও ধ্বংসাবশেষ প্রবাহ",
    eventNameEn: "June 2024 Monsoonal Slope Rupture & Debris Flow",
    eventDate: "১৮-২০ জুন ২০২৪",
    year: 2024,
    locationBn: "ঘাগড়া ইউনিয়ন, কাউখালী, রাঙ্গামাটি",
    locationEn: "Ghagra Union, Kawkhali, Rangamati",
    affectedSlopeAreaDecimal: 117.6,
    debrisVolumeM3: 43200,
    slopeGradientDeg: 42,
    rainfallMm24h: 310,
    casualtiesAvoidedFamilies: 17,
    homesteadsAtRisk: 24,
    impactSummaryBn: "টানা ৩ দিনের ভারি বর্ষণে ঢালের উপরিভাগের বেলে-দোআঁশ মাটি ধসে পড়ে ৬টি ঘরবাড়ি ক্ষতিগ্রস্ত হয়। আগাম সতর্কতায় হতাহত এড়ানো সম্ভব হয়েছে।",
    impactSummaryEn: "Three consecutive days of extreme monsoonal downpour triggered colluvial soil slope failure, impacting 6 homesteads.",
    isDemo: false,
  },
  {
    id: "ev_ghagra_2017",
    hillId: "ghagra",
    mode: "recorded",
    mountainNameBn: "ঘাগড়া শৈল করিডোর",
    mountainNameEn: "Ghagra Hill Corridor",
    eventNameBn: "ঐতিহাসিক ২০১৭ প্রলয়ংকারী পাহাড়ধস বিপর্যয়",
    eventNameEn: "Historic 2017 Catastrophic Landslide Disaster",
    eventDate: "১২-১৩ জুন ২০১৭",
    year: 2017,
    locationBn: "কাউখালী-ঘাগড়া আঞ্চলিক মহাসড়ক ঢাল",
    locationEn: "Kawkhali-Ghagra Regional Highway Slope",
    affectedSlopeAreaDecimal: 245.8,
    debrisVolumeM3: 98500,
    slopeGradientDeg: 45,
    rainfallMm24h: 343,
    casualtiesAvoidedFamilies: 8,
    homesteadsAtRisk: 65,
    impactSummaryBn: "বাংলাদেশের ইতিহাসের অন্যতম ভয়াবহ পাহাড়ধস। পাহাড়ি যোগাযোগ সম্পূর্ণ বিচ্ছিন্ন হয়ে পড়ে এবং ব্যাপক মাটি প্রতিস্থাপিত হয়।",
    impactSummaryEn: "One of the most catastrophic landslide events in Bangladesh history with severe highway cutoff and massive displacement.",
    isDemo: true,
  },
  {
    id: "ev_ghagra_fc_2025",
    hillId: "ghagra",
    mode: "forecast",
    mountainNameBn: "ঘাগড়া শৈল করিডোর",
    mountainNameEn: "Ghagra Hill Corridor",
    eventNameBn: "২০২৫-২০২৬ প্রক্ষেপিত বর্ষাকালীন উচ্চ-ঝুঁকি পূর্বাভাস",
    eventNameEn: "2025–2026 Monsoon High-Risk Susceptibility Forecast",
    eventDate: "বর্ষা ২০২৫ (মডেল প্রক্ষেপণ)",
    year: 2025,
    locationBn: "ঘাগড়া উত্তর ঢাল ঝুঁকিপূর্ণ বাফার জোন",
    locationEn: "Ghagra North Slope High Susceptibility Buffer",
    affectedSlopeAreaDecimal: 146.1,
    debrisVolumeM3: 81760,
    slopeGradientDeg: 44,
    rainfallMm24h: 280,
    casualtiesAvoidedFamilies: 25,
    homesteadsAtRisk: 42,
    impactSummaryBn: "InSAR উপগ্রহ রাডার বিকৃতি ও ঢাল খাড়া কোণ বিশ্লেষণে ৪২টি বসতবাড়ির জন্য আগাম ঝুঁকিপূর্ণ বাফার এলাকা চিহ্নিত।",
    impactSummaryEn: "InSAR displacement velocity coupled with DEM slope angle pinpoints an acute hazard envelope for 42 downslope plots.",
    isDemo: true,
    modelConfidenceScore: 90,
  },

  // --- FURAMON PEAK RIDGE ---
  {
    id: "ev_furamon_2023",
    hillId: "furamon",
    mode: "recorded",
    mountainNameBn: "ফুরমোন শৃঙ্গ শৈলশিরা",
    mountainNameEn: "Furamon Peak Ridge",
    eventNameBn: "আগস্ট ২০২৩ আকস্মিক ঢাল স্খলন",
    eventNameEn: "August 2023 Sudden Colluvial Slope Slip",
    eventDate: "৫ আগস্ট ২০২৩",
    year: 2023,
    locationBn: "ফুরমোন পাদদেশ, রাঙ্গামাটি সদর",
    locationEn: "Furamon Foothills, Rangamati Sadar",
    affectedSlopeAreaDecimal: 84.5,
    debrisVolumeM3: 31200,
    slopeGradientDeg: 38,
    rainfallMm24h: 245,
    casualtiesAvoidedFamilies: 12,
    homesteadsAtRisk: 18,
    impactSummaryBn: "পাহাড়ের মধ্যবর্তী অংশে ফাটল দেখা দেয় এবং গাছপালাসহ ঢাল নিচের কৃষি জমিতে ধসে পড়ে।",
    impactSummaryEn: "Mid-slope tension cracks propagated into debris slide over terrace agricultural lands.",
    isDemo: false,
  },
  {
    id: "ev_furamon_fc_2025",
    hillId: "furamon",
    mode: "forecast",
    mountainNameBn: "ফুরমোন শৃঙ্গ শৈলশিরা",
    mountainNameEn: "Furamon Peak Ridge",
    eventNameBn: "২০২৫ ফুরমোন পশ্চিম ঢাল পূর্বাভাস",
    eventNameEn: "2025 Furamon West Ridge Susceptibility Projection",
    eventDate: "২০২৫ বর্ষা মৌসুম",
    year: 2025,
    locationBn: "ফুরমোন পশ্চিম শৈলশিরা",
    locationEn: "Furamon West Ridge Corridor",
    affectedSlopeAreaDecimal: 98.2,
    debrisVolumeM3: 45000,
    slopeGradientDeg: 40,
    rainfallMm24h: 260,
    casualtiesAvoidedFamilies: 19,
    homesteadsAtRisk: 28,
    impactSummaryBn: "টারশিয়ারি বেলেপাথরের ক্ষয় ও বৃষ্টির পানির অনুপ্রবেশের কারণে মাঝারি থেকে উচ্চ ধসের আশঙ্কা।",
    impactSummaryEn: "Weathered Tertiary sandstone strata exhibit elevated moisture retention risk.",
    isDemo: true,
    modelConfidenceScore: 85,
  },

  // --- VEDVEDI URBAN HILL SLOPE ---
  {
    id: "ev_vedvedi_2017",
    hillId: "vedvedi",
    mode: "recorded",
    mountainNameBn: "ভেদভেদী শহুরে পাহাড় ঢাল",
    mountainNameEn: "Vedvedi Urban Hill Slope",
    eventNameBn: "ভেদভেদী বসতি এলাকায় প্রলয়ংকারী ভূমিধস",
    eventNameEn: "Vedvedi Urban Settlement Major Landslide",
    eventDate: "১৩ জুন ২০১৭",
    year: 2017,
    locationBn: "ভেদভেদী পৌর এলাকা, রাঙ্গামাটি সদর",
    locationEn: "Vedvedi Ward, Rangamati Municipality",
    affectedSlopeAreaDecimal: 165.0,
    debrisVolumeM3: 62000,
    slopeGradientDeg: 35,
    rainfallMm24h: 343,
    casualtiesAvoidedFamilies: 14,
    homesteadsAtRisk: 52,
    impactSummaryBn: "পাহাড় কেটে অপরিকল্পিত বসতি গড়ে তোলার কারণে ঘনবসতিপূর্ণ ভেদবেদী এলাকায় ব্যাপক ভূমিধস ঘটে।",
    impactSummaryEn: "Unplanned anthropogenic hill-cutting induced fatal slope failure across dense settlements.",
    isDemo: true,
  },
  {
    id: "ev_vedvedi_fc_2025",
    hillId: "vedvedi",
    mode: "forecast",
    mountainNameBn: "ভেদভেদী শহুরে পাহাড় ঢাল",
    mountainNameEn: "Vedvedi Urban Hill Slope",
    eventNameBn: "ভেদভেদী ঘনবসতি ঢাল প্রক্ষেপণ",
    eventNameEn: "Vedvedi High-Density Settlement Slope Projection",
    eventDate: "বর্ষা ২০২৫",
    year: 2025,
    locationBn: "ভেদভেদী পূর্ব ঢাল রেঞ্জ",
    locationEn: "Vedvedi East Slope Range",
    affectedSlopeAreaDecimal: 110.5,
    debrisVolumeM3: 38000,
    slopeGradientDeg: 36,
    rainfallMm24h: 250,
    casualtiesAvoidedFamilies: 22,
    homesteadsAtRisk: 38,
    impactSummaryBn: "বৃষ্টিপাতের মাত্রা ২০০ মিমি অতিক্রম করলে তাৎক্ষণিক স্থানান্তর বাফার প্রয়োজন।",
    impactSummaryEn: "Early evacuation buffer triggered when 24h rainfall exceeds 200mm threshold.",
    isDemo: true,
    modelConfidenceScore: 88,
  },

  // --- CHIMBUK HILL CREST ---
  {
    id: "ev_chimbuk_2023",
    hillId: "chimbuk",
    mode: "recorded",
    mountainNameBn: "চিম্বুক পাহাড়চূড়া",
    mountainNameEn: "Chimbuk Hill Crest",
    eventNameBn: "আগস্ট ২০২৩ চিম্বুক সড়ক যোগাযোগ বিচ্ছিন্নকারী ভূমিধস",
    eventNameEn: "August 2023 Chimbuk Ridge Highway Collapse",
    eventDate: "৭ আগস্ট ২০২৩",
    year: 2023,
    locationBn: "বান্দরবান-চিম্বুক-রুমা সড়ক",
    locationEn: "Bandarban-Chimbuk-Ruma Road Corridor",
    affectedSlopeAreaDecimal: 192.4,
    debrisVolumeM3: 88400,
    slopeGradientDeg: 44,
    rainfallMm24h: 365,
    casualtiesAvoidedFamilies: 9,
    homesteadsAtRisk: 30,
    impactSummaryBn: "রেকর্ড বৃষ্টিপাতে চিম্বুক পাহাড়ের খাড়া খাদ ধসে পড়ে প্রায় ৩০০ ফুট সড়ক নিশ্চিহ্ন হয়।",
    impactSummaryEn: "Extreme precipitation induced severe embankment failure, severing 300ft of road link.",
    isDemo: true,
  },
  {
    id: "ev_chimbuk_fc_2025",
    hillId: "chimbuk",
    mode: "forecast",
    mountainNameBn: "চিম্বুক পাহাড়চূড়া",
    mountainNameEn: "Chimbuk Hill Crest",
    eventNameBn: "২০২৫ চিম্বুক রিজ হাই-রিস্ক পূর্বাভাস",
    eventNameEn: "2025 Chimbuk Escarpment Failure Forecast",
    eventDate: "২০২৫ বর্ষা মৌসুম",
    year: 2025,
    locationBn: "চিম্বুক দক্ষিণ পাহাড় ঢাল",
    locationEn: "Chimbuk South Escarpment",
    affectedSlopeAreaDecimal: 210.0,
    debrisVolumeM3: 95000,
    slopeGradientDeg: 45,
    rainfallMm24h: 300,
    casualtiesAvoidedFamilies: 15,
    homesteadsAtRisk: 45,
    impactSummaryBn: "খাড়া ঢাল ও দুর্বল শিলা গঠনের কারণে ৪৪ ডিগ্রির বেশি কোণে অবস্থিত অংশ ঝুঁকিপূর্ণ।",
    impactSummaryEn: "Steep slope angles exceeding 44° combined with weathered clay increase slip probability.",
    isDemo: true,
    modelConfidenceScore: 89,
  },

  // --- NILGIRI PLATEAU DESCENT ---
  {
    id: "ev_nilgiri_2023",
    hillId: "nilgiri",
    mode: "recorded",
    mountainNameBn: "নীলগিরি মালভূমি ঢাল",
    mountainNameEn: "Nilgiri Plateau Descent",
    eventNameBn: "২০২৩ নীলগিরি গিরিখাদ ধস",
    eventNameEn: "2023 Nilgiri Gorge Rock & Soil Fall",
    eventDate: "১০ আগস্ট ২০২৩",
    year: 2023,
    locationBn: "নীলগিরি পর্যটন কমপ্লেক্স সংযোগ ঢাল",
    locationEn: "Nilgiri Plateau Access Slope",
    affectedSlopeAreaDecimal: 78.0,
    debrisVolumeM3: 29000,
    slopeGradientDeg: 40,
    rainfallMm24h: 290,
    casualtiesAvoidedFamilies: 20,
    homesteadsAtRisk: 15,
    impactSummaryBn: "পাহাড়ি মাটির সাথে পাথরের খণ্ড নেমে এসে যোগাযোগ বাধাগ্রস্ত করে।",
    impactSummaryEn: "Mixed rock-soil debris roll along the gorge slope.",
    isDemo: true,
  },

  // --- SAJEK VALLEY ESCARPMENT ---
  {
    id: "ev_sajek_2024",
    hillId: "sajek_ridge",
    mode: "recorded",
    mountainNameBn: "সাজেক ভ্যালি খাড়া ঢাল",
    mountainNameEn: "Sajek Valley Escarpment",
    eventNameBn: "জুলাই ২০২৪ সাজেক সড়ক ধস",
    eventNameEn: "July 2024 Sajek Access Slope Failure",
    eventDate: "২ জুলাই ২০২৪",
    year: 2024,
    locationBn: "বাঘাইছড়ি-সাজেক পাহাড়ি পথ",
    locationEn: "Baghaichhari-Sajek Mountain Route",
    affectedSlopeAreaDecimal: 112.0,
    debrisVolumeM3: 51000,
    slopeGradientDeg: 46,
    rainfallMm24h: 275,
    casualtiesAvoidedFamilies: 18,
    homesteadsAtRisk: 22,
    impactSummaryBn: "পাহাড়ের কিনারায় মাটি সরে গিয়ে যোগাযোগ দুই দিন বিচ্ছিন্ন থাকে।",
    impactSummaryEn: "Roadside shoulder slip blocked access for 48 hours.",
    isDemo: true,
  },

  // --- HIMCHARI COASTAL HILL SLOPES ---
  {
    id: "ev_himchari_2024",
    hillId: "himchari",
    mode: "recorded",
    mountainNameBn: "হিমছড়ি উপকূলীয় পাহাড় ঢাল",
    mountainNameEn: "Himchari Coastal Hill Slopes",
    eventNameBn: "সেপ্টেম্বর ২০২৪ হিমছড়ি মেরিন ড্রাইভ পাহাড়ধস",
    eventNameEn: "September 2024 Marine Drive Himchari Landslip",
    eventDate: "১৩ সেপ্টেম্বর ২০২৪",
    year: 2024,
    locationBn: "হিমছড়ি মেরিন ড্রাইভ সংলগ্ন ঢাল, কক্সবাজার",
    locationEn: "Himchari Marine Drive Coastal Escarpment",
    affectedSlopeAreaDecimal: 64.5,
    debrisVolumeM3: 21500,
    slopeGradientDeg: 41,
    rainfallMm24h: 312,
    casualtiesAvoidedFamilies: 35,
    homesteadsAtRisk: 12,
    impactSummaryBn: "টানা ভারী বৃষ্টিতে বেলেপাথরের পাহাড় ধসে মেরিন ড্রাইভের ওপর পড়ে যান চলাচল বন্ধ হয়।",
    impactSummaryEn: "Colluvial marine sandstone slipped directly onto the Marine Drive highway corridor.",
    isDemo: false,
  },
  {
    id: "ev_himchari_fc_2025",
    hillId: "himchari",
    mode: "forecast",
    mountainNameBn: "হিমছড়ি উপকূলীয় পাহাড় ঢাল",
    mountainNameEn: "Himchari Coastal Hill Slopes",
    eventNameBn: "২০২৫ হিমছড়ি উপকূলীয় ক্ষয় ও ধস পূর্বাভাস",
    eventNameEn: "2025 Himchari Marine Bluff Susceptibility Model",
    eventDate: "২০২৫ বর্ষা মৌসুম",
    year: 2025,
    locationBn: "হিমছড়ি সৈকত সংলগ্ন পাহাড়ি সারি",
    locationEn: "Himchari Beach Coastal Bluffs",
    affectedSlopeAreaDecimal: 82.0,
    debrisVolumeM3: 34000,
    slopeGradientDeg: 42,
    rainfallMm24h: 280,
    casualtiesAvoidedFamilies: 40,
    homesteadsAtRisk: 16,
    impactSummaryBn: "সামুদ্রিক লবণাক্ত বাতাস ও চরম বর্ষণে বেলেপাথরের ভঙ্গুরতা বৃদ্ধিজনিত মডেল পূর্বাভাস।",
    impactSummaryEn: "Coastal bluff erosion and friable marine sandstone saturation projection.",
    isDemo: true,
    modelConfidenceScore: 91,
  },
];

/**
 * Get all available events for a mountain and mode
 */
export function getEventsForMountain(
  hillId: string,
  mode: DataMode = "recorded"
): LandslideEventRecord[] {
  return LANDSLIDE_EVENTS.filter(
    (ev) => ev.hillId === hillId && ev.mode === mode
  );
}

/**
 * Get a specific event by ID
 */
export function getLandslideEventById(
  eventId: string
): LandslideEventRecord | null {
  return LANDSLIDE_EVENTS.find((ev) => ev.id === eventId) || null;
}

/**
 * Get default event for a mountain and mode
 */
export function getDefaultEventForMountain(
  hillId: string,
  mode: DataMode = "recorded"
): LandslideEventRecord | null {
  const events = getEventsForMountain(hillId, mode);
  return events[0] || null;
}
