/**
 * BhumiDorpon Centralized Bilingual Localization Dictionary (Bangla & English)
 * Default language: Bangla ('bn')
 */

export type Language = "bn" | "en";

export interface TranslationDictionary {
  [key: string]: {
    bn: string;
    en: string;
  };
}

export const TRANSLATIONS = {
  // Brand & Metadata
  appName: {
    bn: "ভূমিদর্পণ",
    en: "BhumiDorpon",
  },
  appTagline: {
    bn: "বাংলাদেশ ক্যাডাস্ট্রাল ভূমির পরিবর্তন রেকর্ড ও মাল্টি-হ্যাজার্ড জিওস্প্যাশিয়াল ড্যাশবোর্ড",
    en: "Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard",
  },
  demoBannerText: {
    bn: "ডেমো ডাটাবেজ: প্রদর্শিত সব মালিকানার নাম, দাগ, খতিয়ান ও ক্ষতিপূরণের তথ্য একাডেমিক ও হ্যাকাথন মূল্যায়নের জন্য কৃত্রিমভাবে তৈরি। কোনো লাইভ সরকারি ডাটাবেজের সাথে সংযুক্ত নয়।",
    en: "DEMO DATA: All owner names, Dag, Khatian numbers, and compensation figures are synthetic for academic and hackathon evaluation. Not connected to live government databases.",
  },
  demoBadge: {
    bn: "ডেমো প্রোটোটাইপ",
    en: "Demo Prototype",
  },
  disclaimerNote: {
    bn: "এটি একটি মডেল-ভিত্তিক অনুমান, কোনো সরকারি রেকর্ড নয়।",
    en: "This is a model-based estimate, not an official government record.",
  },

  // Navigation Items
  navHome: {
    bn: "মূল পাতা",
    en: "Home Dashboard",
  },
  navRiverErosion: {
    bn: "নদীভাঙন",
    en: "River Erosion",
  },
  navFlood: {
    bn: "বন্যা পর্যবেক্ষণ",
    en: "Flood Monitoring",
  },
  navLandslide: {
    bn: "ভূমিধস ঝুঁকি",
    en: "Landslide Hazards",
  },
  navChar: {
    bn: "চর ও দ্বীপাঞ্চল",
    en: "Char Islands",
  },
  navCoastal: {
    bn: "উপকূলীয় পরিবর্তন",
    en: "Coastal Shifts",
  },
  navLandInfo: {
    bn: "ভূমির তথ্য",
    en: "Land Information",
  },
  navSettings: {
    bn: "সেটিংস",
    en: "Settings",
  },
  navDev: {
    bn: "ইউআই উপাদান",
    en: "UI Components",
  },

  // Auth & Session
  login: {
    bn: "লগইন",
    en: "Login",
  },
  signUp: {
    bn: "নিবন্ধন",
    en: "Sign Up",
  },
  signOut: {
    bn: "লগআউট",
    en: "Sign Out",
  },
  logout: {
    bn: "লগ আউট",
    en: "Log out",
  },
  account: {
    bn: "অ্যাকাউন্ট",
    en: "Account",
  },
  username: {
    bn: "ব্যবহারকারীর নাম",
    en: "Username",
  },
  accountProfile: {
    bn: "অ্যাকাউন্ট ও প্রোফাইল",
    en: "Account & Profile",
  },
  accountDetails: {
    bn: "ব্যবহারকারীর তথ্য ও সেশন",
    en: "User Details & Session",
  },
  activeSession: {
    bn: "সক্রিয় সেশন",
    en: "Active Session",
  },
  noActiveSession: {
    bn: "বর্তমানে কোনো অ্যাকাউন্ট লগইন করা নেই",
    en: "No active account session",
  },
  loginToContinue: {
    bn: "সকল ফিচার ব্যবহারে লগইন করুন অথবা ডেমো মোডে প্রবেশ করুন",
    en: "Log in or enter as demo to explore all features",
  },
  aboutProject: {
    bn: "প্রকল্প পরিচিতি",
    en: "About Project",
  },
  teamInformation: {
    bn: "টিম পরিচিতি",
    en: "Team Information",
  },
  viewProjectDetails: {
    bn: "প্রকল্পের বিবরণ দেখুন",
    en: "View Project Details",
  },
  viewTeamInfo: {
    bn: "টিম সম্পর্কিত তথ্য দেখুন",
    en: "View Team Info",
  },
  demoAccessButton: {
    bn: "ডেমো হিসেবে প্রবেশ করুন",
    en: "Enter as Demo",
  },
  demoAccessSubtitle: {
    bn: "লগইন ছাড়া ড্যাশবোর্ড ও সব ফিচার অন্বেষণ করুন",
    en: "Explore the dashboard and all features without logging in",
  },
  demoUserBadge: {
    bn: "ডেমো ব্যবহারকারী",
    en: "Demo User",
  },
  authenticatedUserBadge: {
    bn: "লগইনকৃত ব্যবহারকারী",
    en: "Authenticated User",
  },
  welcomeBack: {
    bn: "স্বাগতম! আপনার অ্যাকাউন্টে লগইন করুন",
    en: "Welcome back! Log in to your account",
  },
  createNewAccount: {
    bn: "নতুন অ্যাকাউন্ট তৈরি করুন",
    en: "Create a new account",
  },
  emailOrUsername: {
    bn: "ইমেইল বা ব্যবহারকারীর নাম",
    en: "Email or Username",
  },
  password: {
    bn: "পাসওয়ার্ড",
    en: "Password",
  },
  confirmPassword: {
    bn: "পাসওয়ার্ড নিশ্চিত করুন",
    en: "Confirm Password",
  },
  fullName: {
    bn: "পূর্ণ নাম",
    en: "Full Name",
  },
  userRole: {
    bn: "ব্যবহারকারীর ভূমিকা",
    en: "User Role",
  },
  roleCitizen: {
    bn: "নাগরিক / জমির মালিক",
    en: "Citizen / Landowner",
  },
  roleSurveyor: {
    bn: "সার্ভেয়ার / কানুনগো / তহশিলদার",
    en: "Surveyor / Field Land Officer",
  },
  roleResearcher: {
    bn: "গবেষক / নীতি নির্ধারক",
    en: "Researcher / Policy Planner",
  },
  rememberMe: {
    bn: "আমাকে মনে রাখুন",
    en: "Remember me",
  },
  forgotPassword: {
    bn: "পাসওয়ার্ড ভুলে গেছেন?",
    en: "Forgot password?",
  },
  alreadyHaveAccount: {
    bn: "ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন",
    en: "Already have an account? Log in",
  },
  dontHaveAccount: {
    bn: "অ্যাকাউন্ট নেই? নতুন অ্যাকাউন্ট খুলুন",
    en: "Don't have an account? Sign up",
  },
  passwordRecoveryTitle: {
    bn: "পাসওয়ার্ড পুনরুদ্ধার",
    en: "Password Recovery",
  },
  passwordRecoveryNotice: {
    bn: "এটি একটি অফলাইন ক্লায়েন্ট ডেমো। পাসওয়ার্ড রিসেট করতে অ্যাডমিন কনসোলে যোগাযোগ করুন অথবা ডেমো মোডে প্রবেশ করুন।",
    en: "This is an offline client demo. For password recovery, contact admin console or use Demo access.",
  },
  loginSuccess: {
    bn: "সফলভাবে লগইন হয়েছে!",
    en: "Successfully logged in!",
  },
  signUpSuccess: {
    bn: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!",
    en: "Account successfully created!",
  },
  invalidCredentials: {
    bn: "ভুল ইমেইল অথবা পাসওয়ার্ড। অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
    en: "Invalid email or password. Please try again.",
  },
  passwordsDoNotMatch: {
    bn: "পাসওয়ার্ড দুটি মেলেনি!",
    en: "Passwords do not match!",
  },

  // Modes & Units
  recordedData: {
    bn: "রেকর্ডকৃত তথ্য",
    en: "Recorded Data",
  },
  forecastData: {
    bn: "পূর্বাভাস (মডেল)",
    en: "Forecast (DL Model)",
  },
  unitDecimal: {
    bn: "শতাংশ",
    en: "Decimal",
  },
  unitAcre: {
    bn: "একর",
    en: "Acre",
  },
  unitHectare: {
    bn: "হেক্টর",
    en: "Hectare",
  },
  period1y: {
    bn: "গত ১ বছর",
    en: "Last 1 year",
  },
  period3y: {
    bn: "গত ৩ বছর",
    en: "Last 3 years",
  },
  period5y: {
    bn: "গত ৫ বছর",
    en: "Last 5 years",
  },
  periodAll: {
    bn: "সর্বমোট সময়",
    en: "All time",
  },

  // Dashboard & Overview
  overviewTitle: {
    bn: "জাতীয় ভূমি পরিবর্তন সামগ্রিক চিত্র",
    en: "National Land Change Overview",
  },
  overviewSubtitle: {
    bn: "মাল্টি-হ্যাজার্ড ক্যাডাস্ট্রাল মৌজা রেকর্ড ও স্যাটেলাইট রিমোট-সেন্সিং ড্যাশবোর্ড",
    en: "Multi-hazard cadastral mouza records & satellite remote-sensing dashboard",
  },
  exploreDisastersBtn: {
    bn: "দুর্যোগসমূহ দেখুন",
    en: "Explore Disasters",
  },
  totalLandLoss: {
    bn: "মোট জমির ক্ষতি",
    en: "Total Land Loss",
  },
  projectedTotalLoss: {
    bn: "জমি সরে যাওয়ার সম্ভাব্য পরিমাণ",
    en: "Projected Total Land Loss",
  },
  landAccretion: {
    bn: "নতুন ভূমি গঠন (পয়স্তি)",
    en: "Land Accretion",
  },
  netBalance: {
    bn: "নিট ভূমির পরিবর্তন",
    en: "Net Balance",
  },
  totalCompensation: {
    bn: "মোট প্রাক্কলিত ক্ষতিপূরণ",
    en: "Total Estimated Compensation",
  },
  projectedCompensation: {
    bn: "প্রত্যাশিত ক্ষতিপূরণ বাজেট",
    en: "Projected Compensation Budget",
  },
  paid: {
    bn: "পরিশোধিত",
    en: "Paid",
  },
  approved: {
    bn: "অনুমোদিত",
    en: "Approved",
  },
  pending: {
    bn: "বিচারাধীন / প্রক্রিয়াধীন",
    en: "Pending",
  },
  hazardModules: {
    bn: "দুর্যোগ মডিউলসমূহ",
    en: "Hazard Modules",
  },
  hazardModulesSubtitle: {
    bn: "৫টি স্বতন্ত্র প্রাকৃতিক দুর্যোগের ক্যাডাস্ট্রাল মৌজা রেকর্ড, মানচিত্র তুলনা ও পূর্বাভাস",
    en: "Dedicated records, cascading selectors, and before/after comparisons for all 5 hazards",
  },
  explore: {
    bn: "অন্বেষণ করুন",
    en: "Explore",
  },

  // Land Information Search Page
  landInfoSearchTitle: {
    bn: "ভূমির তথ্য অনুসন্ধান",
    en: "Land Information Search",
  },
  landInfoSearchSubtitle: {
    bn: "জেলা, উপজেলা, মৌজা, দাগ ও খতিয়ান নম্বর দিয়ে জমির রেকর্ড, মালিকানা ও দুর্যোগ ঝুঁকি জানুন",
    en: "Search cadastral land records, ownership deeds, and disaster risk by District, Upazila, Mouza, Dag, and Khatian",
  },
  districtLabel: {
    bn: "জেলা",
    en: "District",
  },
  upazilaLabel: {
    bn: "উপজেলা",
    en: "Upazila",
  },
  mouzaLabel: {
    bn: "মৌজা",
    en: "Mouza",
  },
  dagNoLabel: {
    bn: "দাগ নম্বর",
    en: "Dag Number",
  },
  khatianNoLabel: {
    bn: "খতিয়ান নম্বর",
    en: "Khatian Number",
  },
  selectDistrictPlaceholder: {
    bn: "জেলা নির্বাচন করুন",
    en: "Select District",
  },
  selectUpazilaPlaceholder: {
    bn: "উপজেলা নির্বাচন করুন",
    en: "Select Upazila",
  },
  selectMouzaPlaceholder: {
    bn: "মৌজা নির্বাচন করুন",
    en: "Select Mouza",
  },
  enterDagPlaceholder: {
    bn: "যেমন: ১০১ বা ০১০১ বা ২২৭১",
    en: "e.g., 101 or 0101 or 2271",
  },
  enterKhatianPlaceholder: {
    bn: "যেমন: RS-475 বা RS-659 বা ১২/এ",
    en: "e.g., RS-475 or RS-659 or 12/A",
  },
  searchBtn: {
    bn: "খুঁজুন",
    en: "Search Land",
  },
  resetBtn: {
    bn: "রিসেট করুন",
    en: "Reset",
  },
  searchValidationRequired: {
    bn: "প্রয়োজনীয় তথ্য দিন (অন্তত জেলা ও উপজেলা নির্বাচন করুন)।",
    en: "Please select at least District and Upazila.",
  },
  noRecordFoundTitle: {
    bn: "কোনো ভূমির রেকর্ড পাওয়া যায়নি",
    en: "No Land Record Found",
  },
  noRecordFoundDesc: {
    bn: "প্রদত্ত দাগ বা খতিয়ান নম্বরে কোনো মিল পাওয়া যায়নি। তথ্যটি যাচাই করে পুনরায় খুঁজুন।",
    en: "No matching record was found for the provided Dag or Khatian numbers. Please verify the input and try again.",
  },

  // Land Information Report Sections
  secLandId: {
    bn: "১. জমির পরিচয় ও পরিমাণ",
    en: "1. Land Identification & Area",
  },
  secOwnership: {
    bn: "২. মালিকানা সংক্রান্ত তথ্য",
    en: "2. Ownership Information",
  },
  secSale: {
    bn: "৩. বিক্রি ও হস্তান্তর সংক্রান্ত তথ্য",
    en: "3. Sale & Transaction Information",
  },
  secLegal: {
    bn: "৪. আইনি তথ্য ও বিরোধ / মামলা",
    en: "4. Legal Information & Court Disputes",
  },
  secTax: {
    bn: "৫. ভূমি উন্নয়ন কর ও পেমেন্ট রেকর্ড",
    en: "5. Land Development Tax & Payments",
  },
  secHistory: {
    bn: "৬. নিবন্ধন ও ভূমির ব্যবহার ইতিহাস",
    en: "6. Registration History & Land Use",
  },
  secMortgage: {
    bn: "৭. এই জমি বন্ধক রেখে ব্যাংক ঋণ নেওয়ার তথ্য",
    en: "7. Land Mortgage & Bank Loan Information",
  },
  mortgageStatusLabel: {
    bn: "বন্ধক বা ঋণের অবস্থা",
    en: "Mortgage / Loan Status",
  },
  mortgageStatusActive: {
    bn: "বন্ধককৃত (ঋণের বিপরীতে দায়বদ্ধ)",
    en: "Mortgaged (Pledged for Loan)",
  },
  mortgageStatusReleased: {
    bn: "বন্ধক অবমুক্ত (পরিশোধিত)",
    en: "Mortgage Released (Repaid)",
  },
  mortgageStatusNoneFound: {
    bn: "কোনো বন্ধক রেকর্ড পাওয়া যায়নি",
    en: "No Mortgage Record Found",
  },
  mortgageStatusUnknown: {
    bn: "তথ্য পাওয়া যায়নি / যাচাই করা সম্ভব হয়নি",
    en: "Information Not Available / Unable to Verify",
  },
  bankNameLabel: {
    bn: "ব্যাংক বা আর্থিক প্রতিষ্ঠান",
    en: "Bank or Financial Institution",
  },
  bankNameNotAvailable: {
    bn: "তথ্য পাওয়া যায়নি",
    en: "Information Not Available",
  },
  loanRefLabel: {
    bn: "ঋণ / বন্ধক রেফারেন্স (সুরক্ষিত)",
    en: "Loan / Mortgage Ref (Masked)",
  },
  loanRefNotAvailable: {
    bn: "প্রযোজ্য নয় / সংরক্ষিত নেই",
    en: "N/A / Not Recorded",
  },
  mortgageDeedLabel: {
    bn: "বন্ধক দলিল নম্বর",
    en: "Mortgage Deed No.",
  },
  mortgageRecordDateLabel: {
    bn: "রেকর্ড / হালনাগাদের তারিখ",
    en: "Record / Update Date",
  },
  releaseInfoLabel: {
    bn: "অবমুক্তি / দায়মুক্তির বিবরণ",
    en: "Release & Clearance Info",
  },
  releaseInfoActive: {
    bn: "বন্ধক কার্যকর রয়েছে (সক্রিয় ঋণ)",
    en: "Mortgage Active (Active Loan)",
  },
  releaseInfoReleased: {
    bn: "দায়মুক্ত (অবমুক্তিপত্র কার্যকর)",
    en: "Discharged (Release Deed Active)",
  },
  releaseInfoUnavailable: {
    bn: "যাচাই করা সম্ভব হয়নি",
    en: "Unable to Verify",
  },
  externalIntegrationRequiredNotice: {
    bn: "অফিসিয়াল তথ্য যাচাইয়ের জন্য বাংলাদেশ ব্যাংক সিআইবি বা সংশ্লিষ্ট সাব-রেজিস্ট্রার কার্যালয়ের সমন্বয় ও বাহ্যিক ডেটা সংযোগ প্রয়োজন।",
    en: "Official verification requires integration with Bangladesh Bank CIB or Sub-Registry archives.",
  },
  demoDataNotice: {
    bn: "এটি একটি নমুনা (ডেমো) রেকর্ড। কোনো লাইভ বা অফিসিয়াল ব্যাংক সংযোগ বিদ্যমান নেই।",
    en: "This is a synthetic demo record. No live or official banking integration exists.",
  },
  secDisasterAnalysis: {
    bn: "দুর্যোগজনিত ভূমির পরিবর্তন ও ঝুঁকি বিশ্লেষণ",
    en: "Disaster-Related Land Change and Risk Analysis",
  },
  historicalLandLossTitle: {
    bn: "ঐতিহাসিক ভূমিক্ষতি ও পরিবেশগত পরিবর্তন",
    en: "Historical Land Loss & Environmental Change",
  },
  futureRiskTitle: {
    bn: "ভবিষ্যৎ দুর্যোগ ঝুঁকি পূর্বাভাস (মডেল প্রক্ষেপণ)",
    en: "Future Disaster Risk Prediction (Model Projection)",
  },

  // Land Information Fields & Badges
  plotArea: {
    bn: "রেকর্ডকৃত জমির আয়তন",
    en: "Recorded Land Area",
  },
  landClass: {
    bn: "জমির শ্রেণি",
    en: "Land Classification",
  },
  physicalStatus: {
    bn: "ভৌত অবস্থা",
    en: "Physical Status",
  },
  statusExisting: {
    bn: "বিদ্যমান ও অপরিবর্তিত",
    en: "Existing & Stable",
  },
  statusPartiallyAffected: {
    bn: "আংশিক ক্ষতিগ্রস্ত / ঝুঁকিপূর্ণ",
    en: "Partially Affected / At Risk",
  },
  statusHistoricallyLost: {
    bn: "ঐতিহাসিকভাবে বিলীন (জলমগ্ন)",
    en: "Historically Submerged (Lost)",
  },
  statusAccreted: {
    bn: "পয়স্তি / নবগঠিত পলিচর",
    en: "Accreted / Newly Formed Alluvial",
  },
  ownerName: {
    bn: "রেকর্ডকৃত মালিকের নাম",
    en: "Recorded Owner's Name",
  },
  fatherName: {
    bn: "পিতার নাম",
    en: "Father's Name",
  },
  ownershipShare: {
    bn: "মালিকানার অংশ",
    en: "Ownership Share",
  },
  saleListingStatus: {
    bn: "বিক্রির জন্য তালিকাভুক্তির অবস্থা",
    en: "Sale Listing Status",
  },
  notListedForSale: {
    bn: "বিক্রির জন্য তালিকাভুক্ত নয়",
    en: "Not Listed for Sale",
  },
  courtCaseStatus: {
    bn: "মামলা বা স্বত্ব বিরোধের অবস্থা",
    en: "Court Dispute / Case Status",
  },
  noPendingCasesFound: {
    bn: "কোনো মামলার তথ্য পাওয়া যায়নি (বাহ্যিক ডেটা সংযোগ প্রয়োজন)",
    en: "No Case Records Found (External Connection Required)",
  },
  taxStatus: {
    bn: "ভূমি উন্নয়ন করের অবস্থা (খাজনা)",
    en: "Land Development Tax Status (Khajna)",
  },
  taxClear: {
    bn: "হালনাগাদ পরিশোধিত",
    en: "Fully Up-to-Date",
  },
  taxOutstanding: {
    bn: "বকেয়া বিদ্যমান",
    en: "Outstanding Dues",
  },
  dataSource: {
    bn: "উৎস",
    en: "Data Source",
  },
  lastUpdated: {
    bn: "সর্বশেষ আপডেট",
    en: "Last Updated",
  },
  verificationStatus: {
    bn: "যাচাইয়ের অবস্থা",
    en: "Verification Status",
  },

  // Status Badges
  badgeVerified: {
    bn: "যাচাইকৃত",
    en: "Verified",
  },
  badgeDemo: {
    bn: "ডেমো ডেটা",
    en: "Demo Data",
  },
  badgeUnverified: {
    bn: "যাচাই করা সম্ভব হয়নি",
    en: "Unverified",
  },
  badgeUnavailable: {
    bn: "তথ্য পাওয়া যায়নি",
    en: "Data Unavailable",
  },
  badgeExternalRequired: {
    bn: "বাহ্যিক ডেটা সংযোগ প্রয়োজন",
    en: "External Connection Required",
  },

  // Landslide Mountain & Event Selector
  mountainLabel: {
    bn: "পাহাড় নির্বাচন",
    en: "Select Mountain",
  },
  selectMountain: {
    bn: "পাহাড় নির্বাচন",
    en: "Select Mountain",
  },
  selectMountainPlaceholder: {
    bn: "পাহাড় নির্বাচন করুন...",
    en: "Select Mountain...",
  },
  eventLabel: {
    bn: "ভূমিধসের ঘটনার তালিকা",
    en: "Landslide Events",
  },
  landslideEventsList: {
    bn: "ভূমিধসের ঘটনার তালিকা",
    en: "Landslide Events",
  },
  selectEventPlaceholder: {
    bn: "কোনো ঘটনা নির্বাচন করুন",
    en: "Select an Event",
  },
  selectAnEvent: {
    bn: "কোনো ঘটনা নির্বাচন করুন",
    en: "Select an Event",
  },
  noLandslideRecordsForMountain: {
    bn: "এই পাহাড়ের কোনো ভূমিধসের তথ্য পাওয়া যায়নি।",
    en: "No landslide records found for this mountain",
  },
  eventDetails: {
    bn: "ঘটনার বিবরণ",
    en: "Event Details",
  },
  eventDetailsTitle: {
    bn: "ঘটনার বিবরণ",
    en: "Event Details",
  },
  eventDate: {
    bn: "ঘটনার তারিখ",
    en: "Event Date",
  },
  eventDateLabel: {
    bn: "ঘটনার তারিখ",
    en: "Event Date",
  },
  affectedSlopeArea: {
    bn: "ক্ষতিগ্রস্ত ঢাল এলাকা",
    en: "Affected Slope Area",
  },
  debrisVolume: {
    bn: "ধ্বসে পড়া মাটির আয়তন",
    en: "Displaced Soil / Debris Volume",
  },
  impactSummary: {
    bn: "প্রভাব ও পুনর্বাসন",
    en: "Impact & Rehabilitation",
  },

  // Common Actions
  openInGoogleEarth: {
    bn: "গুগল আর্থে দেখুন",
    en: "Open in Google Earth",
  },
  copyCorners: {
    bn: "৪ কোণ স্থানাঙ্ক কপি করুন",
    en: "Copy 4 Corners",
  },
  downloadGeoJson: {
    bn: "জিওজেসন ডাউনলোড",
    en: "Download GeoJSON",
  },
  exportCsv: {
    bn: "ডাউনলোড করুন (সিএসভি)",
    en: "Export CSV",
  },
  viewOnMap: {
    bn: "মানচিত্রে দেখুন",
    en: "View on Map",
  },
  copiedSuccess: {
    bn: "কপি সম্পন্ন হয়েছে!",
    en: "Copied to clipboard!",
  },

  // Accessible Table & Grid Localization
  showAccessibleTable: {
    bn: "সারণী তথ্য দেখুন",
    en: "Show accessible data table",
  },
  tableHazardCategory: {
    bn: "দুর্যোগের ধরন",
    en: "Hazard Category",
  },
  tableErosionLoss: {
    bn: "ভাঙনে ক্ষতি",
    en: "Erosion Loss",
  },
  tableAccretionGain: {
    bn: "পয়স্তিতে বৃদ্ধি",
    en: "Accretion Gain",
  },
  tableYearPeriod: {
    bn: "সাল / সময়কাল",
    en: "Year / Period",
  },
  tableProjected: {
    bn: "প্রত্যাশিত",
    en: "Projected",
  },
  tableActions: {
    bn: "কার্যক্রম",
    en: "Actions",
  },
  tableOwner: {
    bn: "মালিকের নাম",
    en: "Owner",
  },
  tableDagNo: {
    bn: "দাগ নং",
    en: "Dag No.",
  },
  tableKhatianNo: {
    bn: "খতিয়ান নং",
    en: "Khatian No.",
  },
  tableArea: {
    bn: "জমির পরিমাণ",
    en: "Area",
  },
  tableStatus: {
    bn: "অবস্থা",
    en: "Status",
  },
  tableEstCompensation: {
    bn: "প্রাক্কলিত ক্ষতিপূরণ (৳)",
    en: "Est. compensation (৳)",
  },
  tablePaidCompensation: {
    bn: "পরিশোধিত (৳)",
    en: "Paid (৳)",
  },
  tableFloodedArea: {
    bn: "প্লাবিত এলাকা",
    en: "Flooded Area",
  },
  tableDepthClass: {
    bn: "প্লাবনের গভীরতা",
    en: "Depth Class",
  },
  tableNoRecordsFound: {
    bn: "কোনো ভূমির রেকর্ড পাওয়া যায়নি",
    en: "No land records found",
  },
  tableSearchAdjustHelp: {
    bn: "দাগ বা খতিয়ান নম্বর পরিবর্তন করে আবার চেষ্টা করুন অথবা অন্য এলাকা বেছে নিন।",
    en: "Try adjusting your search query or selecting a different location.",
  },
  clearSearch: {
    bn: "অনুসন্ধান মুছুন",
    en: "Clear search",
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS;

/**
 * Helper to get translated string by key and language
 */
export function t(key: TranslationKey, lang: Language): string {
  if (!TRANSLATIONS[key]) {
    return key as string;
  }
  return TRANSLATIONS[key][lang] || TRANSLATIONS[key].bn || (key as string);
}

/**
 * Format numerals to Bengali numerals if language is 'bn'
 */
export function formatNumberLocalized(num: number | string | null | undefined, lang: Language): string {
  if (num === null || num === undefined) return "";
  const str = String(num);
  if (lang !== "bn") {
    return str;
  }
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return str.replace(/[0-9]/g, (match) => bengaliDigits[parseInt(match, 10)]);
}

/* =========================================================================
   VERIFIED GEOSPATIAL & CADASTRAL BENGALI LOCALIZATION DICTIONARIES
   Strictly authentic Bangladeshi land administration and geographic terms.
   ========================================================================= */

export const OWNER_NAMES_BN: Record<string, string> = {
  "Rahim Chowdhury": "রহিম চৌধুরী",
  "Fatema Begum": "ফাতেমা বেগম",
  "Kabir Hossain Dewan": "কবির হোসেন দেওয়ান",
  "Ayesha Siddiqua": "আয়েশা সিদ্দিকা",
  "Nurul Huda Mia": "নুরুল হুদা মিয়া",
  "Shamsul Alam Sarker": "শামসুল আলম সরকার",
  "Begum Rokeya Khatun": "বেগম রোকেয়া খাতুন",
  "Anwar Parvez": "আনোয়ার পারভেজ",
  "Nasreen Jahan": "নাসরিন জাহান",
  "Kamal Uddin Ahmed": "কামাল উদ্দিন আহমেদ",
  "Shahana Akter": "শাহানা আক্তার",
  "Mizanur Rahman": "মিজানুর রহমান",
  "Mizanur Rahman Khan": "মিজানুর রহমান খাঁন",
  "Dilruba Parveen": "দিলরুবা পারভীন",
  "Tariqul Islam Talukder": "তরিকুল ইসলাম তালুকদার",
  "Salma Akter Banu": "সালমা আক্তার বানু",
  "Monirul Huq Mollah": "মনিরুল হক মোল্লা",
  "Shirin Sultana": "শিরিন সুলতানা",
  "Habibur Rahman Bepari": "হাবিবুর রহমান বেপারী",
  "Farida Yasmin": "ফরিদা ইয়াসমিন",
  "Golam Mostafa Sikder": "গোলাম মোস্তফা শিকদার",
  "Zakir Hossain Matubbar": "জাকির হোসেন মাতুব্বর",
  "Taslima Nasrin": "তসলিমা নাসরিন",
  "Abdul Matin": "আব্দুল মতিন",
  "Laila Arjumand": "লায়লা আরজুমান্দ",
  "Faridul Islam": "ফরিদুল ইসলাম",
  "Zubair Ahmed": "জুবায়ের আহমেদ",
  "Hosne Ara Begum": "হোসনে আরা বেগম",
  "Monirul Huq": "মনিরুল হক",
  "Sultana Razia": "সুলতানা রাজিয়া",
  "Jalal Uddin Rumi": "জালাল উদ্দিন রুমি",
  "Bilkis Banu": "বিলকিস বানু",
  "Sirajul Islam": "সিরাজুল ইসলাম",
  "Parveen Sultana": "পারভীন সুলতানা",
  "Mahbubur Rahman": "মাহবুবুর রহমান",
  "Afroza Khanam": "আফরোজা খানম",
  "Shahidul Alam": "শহিদুল আলম",
  "Rehana Parveen": "রেহানা পারভীন",
  "Zakir Hossain": "জাকির হোসেন",
  "Hasina Mumtaz": "হাসিনা মমতাজ",
  "Golam Mostafa": "গোলাম মোস্তফা",
  "Salma Khatun": "সালমা খাতুন",
  "Rafiqul Bari": "রফিকুল বারী",
  "Ferdousi Begum": "ফেরদৌসী বেগম",
  "Kazi Nazmul Huda": "কাজী নাজমুল হুদা",
  "Rowshan Ara": "রওশন আরা",
  "Enamul Haque": "এনামুল হক",
  "Momtaz Mahal": "মমতাজ মহল",
  "Tariqul Islam": "তরিকুল ইসলাম",
  "Shirin Akter": "শিরিন আক্তার",
  "Abdul Karim": "আব্দুল করিম",
  "Rahima Begum": "রাহিমা বেগম",
  // Institutional & State entities
  "State Land (Khas / Deed 1/1)": "সরকারি খাস জমি (দলিল ১/১)",
  "State Reserve (Forest Dept)": "সরকারি সংরক্ষিত বনভূমি (বন বিভাগ)",
  "Water Dev Board (BWDB)": "বাংলাদেশ পানি উন্নয়ন বোর্ড (পাউবো)",
  "State Reserve (Khas)": "সরকারি খাস জমি",
  "Unassigned state land": "অনির্ধারিত সরকারি খাস জমি",
  "State Land": "সরকারি জমি (খাস)",
  "State Khas Land": "সরকারি খাস জমি",
};

export const DISTRICTS_BN: Record<string, string> = {
  "sirajganj": "সিরাজগঞ্জ",
  "kurigram": "কুড়িগ্রাম",
  "shariatpur": "শরীয়তপুর",
  "chandpur": "চাঁদপুর",
  "bhola": "ভোলা",
  "sunamganj": "সুনামগঞ্জ",
  "sylhet": "সিলেট",
  "rangamati": "রাঙ্গামাটি",
  "bandarban": "বান্দরবান",
  "coxs_bazar": "কক্সবাজার",
  "noakhali": "নোয়াখালী",
  "khulna": "খুলনা",
  "chattogram": "চট্টগ্রাম",
  "barishal": "বরিশাল",
  "rajshahi": "রাজশাহী",
  "rangpur": "রংপুর",
  "dhaka": "ঢাকা",
};

export const UPAZILAS_BN: Record<string, string> = {
  "kazipur": "কাজীপুর",
  "sirajganj_sadar": "সিরাজগঞ্জ সদর",
  "belkuchi": "বেলকুচি",
  "chilmari": "চিলমারী",
  "rowmari": "রৌমারী",
  "ulipur": "উলিপুর",
  "naria": "নড়িয়া",
  "zajira": "জাজিরা",
  "bhedarganj": "ভেদরগঞ্জ",
  "haimchar": "হাইমচর",
  "chandpur_sadar": "চাঁদপুর সদর",
  "matlab_dakshin": "মতলব দক্ষিণ",
  "char_fasson": "চরফ্যাশন",
  "bhola_sadar": "ভোলা সদর",
  "monpura": "মনপুরা",
  "sunamganj_sadar": "সুনামগঞ্জ সদর",
  "derai": "দিরাই",
  "tahirpur": "তাহিরপুর",
  "jamalganj": "জামালগঞ্জ",
  "gowainghat": "গোয়াইনঘাট",
  "companiganj": "কোম্পানীগঞ্জ",
  "beanibazar": "বিয়ানীবাজার",
  "kawkhali": "কাউখালী",
  "rangamati_sadar": "রাঙ্গামাটি সদর",
  "baghaichhari": "বাঘাইছড়ি",
  "bandarban_sadar": "বান্দরবান সদর",
  "lama": "লামা",
  "rowangchhari": "রোয়াংছড়ি",
  "coxs_bazar_sadar": "কক্সবাজার সদর",
  "teknaf": "টেকনাফ",
  "ukhia": "উখিয়া",
  "maheshkhali": "মহেশখালী",
  "hatiya": "হাতিয়া",
  "subarnachar": "সুবর্ণচর",
  "koyra": "কয়রা",
  "dacope": "দাকোপ",
};

export const MOUZAS_BN: Record<string, string> = {
  "Natuarpara Mouza": "নাটুয়ারপাড়া মৌজা",
  "Girishpur Mouza": "গিরিশপুর মৌজা",
  "Kalyanpur Mouza": "কল্যাণপুর মৌজা",
  "Tengrakhali Mouza": "টেংরাখালী মৌজা",
  "Bhairabnagar Mouza": "ভৈরব নগর মৌজা",
  "Jaflong Mouza": "জাফলং মৌজা",
  "Durgapur Mouza": "দুর্গাপুর মৌজা",
  "Monpura South Mouza": "মনপুরা দক্ষিণ মৌজা",
  "Ghagra Mouza": "ঘাগড়া মৌজা",
  "Ilisha Mouza": "ইলিশা মৌজা",
  "Bholaganj Mouza": "ভোলাগঞ্জ মৌজা",
  "Chilmari Ghat Mouza": "চিলমারী ঘাট মৌজা",
  "Rustampur Mouza": "রুস্তমপুর মৌজা",
  "Kutubdia Para Mouza": "কুতুবদিয়া পাড়া মৌজা",
  "Panchapalli Mouza": "পঞ্চপল্লী মৌজা",
  "Vedvedi Mouza": "ভেদভেদী মৌজা",
  "Naria Bazar Mouza": "নড়িয়া বাজার মৌজা",
  "Tahirpur Haor Mouza": "তাহিরপুর হাওর মৌজা",
  "Ramna Mouza": "রমনা মৌজা",
  "Derai Sadar Mouza": "দিরাই সদর মৌজা",
  "Gandhail Mouza": "গান্ধাইল মৌজা",
  "Haimchar Coastal Mouza": "হাইমচর উপকূলীয় মৌজা",
  "Meghai Mouza": "মেঘাই মৌজা",
  "Shubhagachha Mouza": "শুভগাছা মৌজা",
  "Balia Mouza": "বালিয়া মৌজা",
  "Unassigned new land (Naria Bazar Sector-3)": "অনির্ধারিত নবগঠিত খাস জমি (নড়িয়া বাজার সেক্টর-৩)",
  "Unassigned new land (Natuarpara Sector-3)": "অনির্ধারিত নবগঠিত খাস জমি (নাটুয়ারপাড়া সেক্টর-৩)",
};

export const HILLS_BN: Record<string, string> = {
  // IDs
  "ghagra": "ঘাগড়া শৈল করিডোর",
  "furamon": "ফুরামন চূড়া শৈলশিরা",
  "vedvedi": "ভেদভেদী নগর পাহাড়ি ঢাল",
  "sajek_ridge": "সাজেক উপত্যকা ঢাল",
  "chimbuk": "চিম্বুক পাহাড় চূড়া",
  "nilgiri": "নীলগিরি মালভূমি ঢাল",
  "mirinja": "মিরিঞ্জা শৈলশিরা",
  "keokradong": "কেওক্রাডং পাদদেশীয় পর্বতমালা",
  "himchari": "হিমছড়ি উপকূলীয় পাহাড়ি ঢাল",
  "teknaf_ridge": "টেকনাফ উপদ্বীপ শৈলশিরা",
  "inani_range": "ইনানী সংরক্ষিত পাহাড়মালা",
  "jaflong_hill": "জাফলং সীমান্ত পাহাড়",
  // English display names from public/mocks/hills.json
  "Ghagra Hill Corridor": "ঘাগড়া শৈল করিডোর",
  "Furamon Peak Ridge": "ফুরামন চূড়া শৈলশিরা",
  "Vedvedi Urban Hill Slope": "ভেদভেদী নগর পাহাড়ি ঢাল",
  "Sajek Valley Escarpment": "সাজেক উপত্যকা ঢাল",
  "Chimbuk Hill Crest": "চিম্বুক পাহাড় চূড়া",
  "Nilgiri Plateau Descent": "নীলগিরি মালভূমি ঢাল",
  "Mirinja Ridge": "মিরিঞ্জা শৈলশিরা",
  "Keokradong Foot Range": "কেওক্রাডং পাদদেশীয় পর্বতমালা",
  "Himchari Coastal Hill Slopes": "হিমছড়ি উপকূলীয় পাহাড়ি ঢাল",
  "Teknaf Peninsula Ridge": "টেকনাফ উপদ্বীপ শৈলশিরা",
  "Inani Protected Hill Range": "ইনানী সংরক্ষিত পাহাড়মালা",
  "Jaflong Border Escarpment": "জাফলং সীমান্ত পাহাড়",
  // Lowercase keys
  "ghagra hill corridor": "ঘাগড়া শৈল করিডোর",
  "furamon peak ridge": "ফুরামন চূড়া শৈলশিরা",
  "vedvedi urban hill slope": "ভেদভেদী নগর পাহাড়ি ঢাল",
  "sajek valley escarpment": "সাজেক উপত্যকা ঢাল",
  "chimbuk hill crest": "চিম্বুক পাহাড় চূড়া",
  "nilgiri plateau descent": "নীলগিরি মালভূমি ঢাল",
  "mirinja ridge": "মিরিঞ্জা শৈলশিরা",
  "keokradong foot range": "কেওক্রাডং পাদদেশীয় পর্বতমালা",
  "himchari coastal hill slopes": "হিমছড়ি উপকূলীয় পাহাড়ি ঢাল",
  "teknaf peninsula ridge": "টেকনাফ উপদ্বীপ শৈলশিরা",
  "inani protected hill range": "ইনানী সংরক্ষিত পাহাড়মালা",
  "jaflong border escarpment": "জাফলং সীমান্ত পাহাড়",
  "Batali Hill": "বাটালী হিল",
  "Tiger Pass": "টাইগার পাস",
  "Moti Jhorna": "মতিঝর্ণা",
  "Rangamati Sadar": "রাঙ্গামাটি সদর",
  "Kaptai": "কাপ্তাই",
  "Nilachal": "নীলাচল",
};

export const RIVERS_BN: Record<string, string> = {
  "jamuna": "যমুনা নদী",
  "brahmaputra": "ব্রহ্মপুত্র নদী",
  "padma": "পদ্মা নদী",
  "meghna": "মেঘনা নদী",
  "surma": "সুরমা নদী",
  "sari_goyain": "সারি-গোয়াইন নদী",
  "dholai": "ধলাই নদী",
  "karnafuli": "কর্ণফুলী নদী",
  "sangu": "সাঙ্গু নদী",
  "naf": "নাফ নদী",
  "tentulia": "তেঁতুলিয়া নদী",
  "dakatia": "ডাকাতিয়া নদী",
};

export const LAND_CLASSES_BN: Record<string, string> = {
  "agri": "কৃষি",
  "homestead": "বসতভিটা / বাড়ি",
  "pond": "পুকুর / জলাশয়",
  "commercial": "বাণিজ্যিক",
  "khas": "সরকারি খাস জমি",
  "char_accretion": "পয়স্তি চর জমি",
  "fallow": "পতিত জমি",
  "orchard": "বাগান",
  "nal": "নাল (কৃষি জমি)",
  "bhiti": "ভিটি (উঁচু জমি)",
  "chala": "চালা (উঁচু ঢালু জমি)",
  "baid": "বাইদ (নিচু ধানজমি)",
  "Nal Agricultural": "নল কৃষি জমি",
  "Paddy & Crop Field": "ধান ও রবিশস্য জমি",
  "agricultural": "কৃষি জমি",
};

export const STATUSES_BN: Record<string, string> = {
  "paid": "পরিশোধিত",
  "approved": "অনুমোদিত",
  "pending": "প্রক্রিয়াধীন",
  "not_applied": "আবেদন করা হয়নি",
  "not_applicable": "প্রযোজ্য নয়",
};

export const DEPTH_CLASSES_BN: Record<string, string> = {
  "deep": "গভীর (>১.৫ মি.)",
  "moderate": "মাঝারি (০.৫–১.৫ মি.)",
  "shallow": "অগভীর (<০.৫ মি.)",
  "none": "প্লাবিত নয়",
};

export const RISK_LEVELS_BN: Record<string, string> = {
  "Extreme": "চরম ঝুঁকি",
  "High": "উচ্চ ঝুঁকি",
  "Moderate": "মাঝারি ঝুঁকি",
  "Low": "স্বল্প ঝুঁকি",
  "extreme": "চরম ঝুঁকি",
  "high": "উচ্চ ঝুঁকি",
  "moderate": "মাঝারি ঝুঁকি",
  "low": "স্বল্প ঝুঁকি",
};

export const SOIL_TYPES_BN: Record<string, string> = {
  "Silt-Clay Sandy Loam": "পলি-কাদাযুক্ত বেলে দোআঁশ",
  "Tertiary Sandstone": "টারশিয়ারি বেলেপাথর",
  "Residual Clay Loam": "অবশিষ্ট এঁটেল দোআঁশ",
  "Alluvial Silt Loam": "পলি দোআঁশ মাটি",
  "Weathered Shale & Siltstone": "ক্ষয়প্রাপ্ত শেল ও পলিমাটি",
  "Sandy Silt with Colluvium": "ঢাল ক্ষয়জনিত বেলে পলিমাটি",
  // From hills.json & landslide.json
  "Colluvial sandy clay loam": "কোলুভিয়াল বেলে এঁটেল দোআঁশ",
  "colluvial sandy clay loam": "কোলুভিয়াল বেলে এঁটেল দোআঁশ",
  "Tertiary sandstone weathered shale": "টারশিয়ারি বেলেপাথর ও ক্ষয়প্রাপ্ত শেল",
  "tertiary sandstone weathered shale": "টারশিয়ারি বেলেপাথর ও ক্ষয়প্রাপ্ত শেল",
  "Residual silt loam": "অবশিষ্ট পলি দোআঁশ",
  "residual silt loam": "অবশিষ্ট পলি দোআঁশ",
  "Steep shale terrace": "খাড়া শেল ধাপ",
  "steep shale terrace": "খাড়া শেল ধাপ",
  "Weathered metamorphic clay": "ক্ষয়প্রাপ্ত রূপান্তরিত কাদামাটি",
  "weathered metamorphic clay": "ক্ষয়প্রাপ্ত রূপান্তরিত কাদামাটি",
  "Compact laterite sandy loam": "সংকুচিত ল্যাটেরাইট বেলে দোআঁশ",
  "compact laterite sandy loam": "সংকুচিত ল্যাটেরাইট বেলে দোআঁশ",
  "Silty sandstone colluvium": "পলিযুক্ত বেলেপাথর কোলুভিয়াম",
  "silty sandstone colluvium": "পলিযুক্ত বেলেপাথর কোলুভিয়াম",
  "Friable shale slope": "ভঙ্গুর শেল ঢাল",
  "friable shale slope": "ভঙ্গুর শেল ঢাল",
  "Marine sandstone terrace": "সামুদ্রিক বেলেপাথর ধাপ",
  "marine sandstone terrace": "সামুদ্রিক বেলেপাথর ধাপ",
  "Unconsolidated sandy sediment": "অসংহত বালুকাময় পলি",
  "unconsolidated sandy sediment": "অসংহত বালুকাময় পলি",
  "Lateritic red soil": "ল্যাটেরাইটিক লাল মাটি",
  "lateritic red soil": "ল্যাটেরাইটিক লাল মাটি",
  "Piedmont boulder clay": "পাদদেশীয় নুড়িপাথর কাদা",
  "piedmont boulder clay": "পাদদেশীয় নুড়িপাথর কাদা",
};

export const CORNERS_BN: Record<string, string> = {
  "1 (NW)": "১ (উত্তর-পশ্চিম / NW)",
  "2 (NE)": "২ (উত্তর-পূর্ব / NE)",
  "3 (SE)": "৩ (দক্ষিণ-পূর্ব / SE)",
  "4 (SW)": "৪ (দক্ষিণ-পশ্চিম / SW)",
  "NW": "উত্তর-পশ্চিম (NW)",
  "NE": "উত্তর-পূর্ব (NE)",
  "SE": "দক্ষিণ-পূর্ব (SE)",
  "SW": "দক্ষিণ-পশ্চিম (SW)",
};

/* =========================================================================
   LOCALIZATION FORMATTING FUNCTIONS
   ========================================================================= */

export function getLocalizedOwnerName(name: string, lang: Language): string {
  if (lang !== "bn" || !name) return name;

  // If name has bilingual parenthesized form, e.g. "রহিম চৌধুরী (Rahim Chowdhury)"
  if (name.includes("(") && name.includes(")")) {
    const parts = name.split(/[()]/).filter(Boolean);
    const bnPart = parts.find((p) => /[\u0980-\u09FF]/.test(p));
    if (bnPart) return bnPart.trim();
  }

  // If exact verified match
  if (OWNER_NAMES_BN[name]) {
    return OWNER_NAMES_BN[name];
  }

  // Handle Landowner ID aliases like "Landowner 4"
  const landownerMatch = name.match(/^Landowner\s+(\d+)$/i);
  if (landownerMatch) {
    return `জমির মালিক ${formatNumberLocalized(landownerMatch[1], "bn")}`;
  }

  return name;
}

export function getLocalizedFatherName(name: string, lang: Language): string {
  if (lang !== "bn" || !name) return name;
  let res = name;

  const prefixes: Record<string, string> = {
    "Late Abdul Gafur": "মরহুম আব্দুল গফুর",
    "Late Nurul Islam": "মরহুম নুরুল ইসলাম",
    "Late Mokbul Hossain": "মরহুম মকবুল হোসেন",
    "Late Fazlur Rahman": "মরহুম ফজলুর রহমান",
    "Late Sirajul Islam": "মরহুম সিরাজুল ইসলাম",
    "Late Abdus Sattar": "মরহুম আব্দুস সাত্তার",
    "Late": "মরহুম",
  };

  for (const [en, bn] of Object.entries(prefixes)) {
    if (res.startsWith(en)) {
      res = res.replace(en, bn);
      break;
    }
  }

  const surNames: Record<string, string> = {
    "Chowdhury": "চৌধুরী",
    "Begum": "বেগম",
    "Dewan": "দেওয়ান",
    "Siddiqua": "সিদ্দিকা",
    "Mia": "মিয়া",
    "Sarker": "সরকার",
    "Khatun": "খাতুন",
    "Parvez": "পারভেজ",
    "Jahan": "জাহান",
    "Ahmed": "আহমেদ",
    "Akter": "আক্তার",
    "Rahman": "রহমান",
    "Nasrin": "নাসরিন",
    "Matin": "মতিন",
    "Arjumand": "আরজুমান্দ",
    "Islam": "ইসলাম",
    "Huq": "হক",
    "Razia": "রাজিয়া",
    "Rumi": "রুমি",
    "Banu": "বানু",
    "Sultana": "সুলতানা",
    "Khanam": "খানম",
    "Alam": "আলম",
    "Parveen": "পারভীন",
    "Hossain": "হোসেন",
    "Mumtaz": "মমতাজ",
    "Mostafa": "মোস্তফা",
    "Bari": "বারী",
    "Huda": "হুদা",
    "Ara": "আরা",
    "Haque": "হক",
    "Mahal": "মহল",
  };

  for (const [en, bn] of Object.entries(surNames)) {
    if (res.endsWith(` ${en}`)) {
      res = res.replace(new RegExp(` ${en}$`), ` ${bn}`);
      break;
    }
  }

  return res;
}

export function getLocalizedDistrictName(
  nameOrId?: string,
  langOrFallback?: Language | string,
  maybeLang?: Language
): string {
  const safe = nameOrId || "";
  const lang: Language = (maybeLang || (langOrFallback === "bn" || langOrFallback === "en" ? langOrFallback : "en")) as Language;
  const fallback = typeof langOrFallback === "string" && langOrFallback !== "bn" && langOrFallback !== "en" ? langOrFallback : safe;
  if (!safe && !fallback) return "";

  const text = fallback || safe;
  if (text.includes("(") && text.includes(")")) {
    const bnPart = text.match(/[\u0980-\u09FF\s]+/)?.[0]?.trim();
    const enPart = text.match(/\((.*?)\)/)?.[1]?.trim();
    if (lang === "bn" && bnPart) return bnPart;
    if (lang === "en" && enPart) return enPart;
  }

  if (lang !== "bn") return fallback;
  const key = safe.toLowerCase().trim();
  const fallbackKey = fallback.toLowerCase().trim();
  return DISTRICTS_BN[key] || DISTRICTS_BN[fallbackKey] || DISTRICTS_BN[safe] || DISTRICTS_BN[fallback] || fallback;
}

export function getLocalizedUpazilaName(
  nameOrId?: string,
  langOrFallback?: Language | string,
  maybeLang?: Language
): string {
  const safe = nameOrId || "";
  const lang: Language = (maybeLang || (langOrFallback === "bn" || langOrFallback === "en" ? langOrFallback : "en")) as Language;
  const fallback = typeof langOrFallback === "string" && langOrFallback !== "bn" && langOrFallback !== "en" ? langOrFallback : safe;
  if (!safe && !fallback) return "";

  const text = fallback || safe;
  if (text.includes("(") && text.includes(")")) {
    const bnPart = text.match(/[\u0980-\u09FF\s]+/)?.[0]?.trim();
    const enPart = text.match(/\((.*?)\)/)?.[1]?.trim();
    if (lang === "bn" && bnPart) return bnPart;
    if (lang === "en" && enPart) return enPart;
  }

  if (lang !== "bn") return fallback;
  const key = safe.toLowerCase().trim();
  const fallbackKey = fallback.toLowerCase().trim();
  return UPAZILAS_BN[key] || UPAZILAS_BN[fallbackKey] || UPAZILAS_BN[safe] || UPAZILAS_BN[fallback] || fallback;
}

export function getLocalizedMouzaName(
  nameOrId?: string,
  langOrFallback?: Language | string,
  maybeLang?: Language
): string {
  const safe = nameOrId || "";
  const lang: Language = (maybeLang || (langOrFallback === "bn" || langOrFallback === "en" ? langOrFallback : "en")) as Language;
  const fallback = typeof langOrFallback === "string" && langOrFallback !== "bn" && langOrFallback !== "en" ? langOrFallback : safe;
  if (!safe && !fallback) return "";

  const text = fallback || safe;
  if (text.includes("(") && text.includes(")")) {
    const bnPart = text.match(/[\u0980-\u09FF\s]+/)?.[0]?.trim();
    const enPart = text.match(/\((.*?)\)/)?.[1]?.trim();
    if (lang === "bn" && bnPart) return bnPart;
    if (lang === "en" && enPart) return enPart;
  }

  if (lang !== "bn") return fallback;
  const clean = (fallback || safe).trim();
  if (MOUZAS_BN[clean]) return MOUZAS_BN[clean];
  const withoutMouza = clean.replace(/\s+Mouza$/i, "");
  if (MOUZAS_BN[`${withoutMouza} Mouza`]) return MOUZAS_BN[`${withoutMouza} Mouza`];
  if (MOUZAS_BN[safe]) return MOUZAS_BN[safe];
  return clean;
}

export function getLocalizedLandClass(landClass: string, lang: Language): string {
  if (lang !== "bn" || !landClass) return landClass;
  return LAND_CLASSES_BN[landClass.toLowerCase()] || LAND_CLASSES_BN[landClass] || landClass;
}

export function getLocalizedRiverName(nameOrId: string, lang: Language): string {
  if (lang !== "bn" || !nameOrId) return nameOrId;
  const key = nameOrId.toLowerCase().trim();
  return RIVERS_BN[key] || RIVERS_BN[nameOrId] || nameOrId;
}

export function getLocalizedHillName(nameOrId: string, lang: Language): string {
  if (lang !== "bn" || !nameOrId) return nameOrId;
  const key = nameOrId.toLowerCase().trim();
  return HILLS_BN[key] || HILLS_BN[nameOrId] || nameOrId;
}

export function getLocalizedCompensationStatus(status: string, lang: Language): string {
  if (lang !== "bn" || !status) return status;
  return STATUSES_BN[status.toLowerCase()] || status;
}

export function getLocalizedDepthClass(depth: string, lang: Language): string {
  if (lang !== "bn" || !depth) return depth;
  return DEPTH_CLASSES_BN[depth.toLowerCase()] || depth;
}

export function getLocalizedRiskLevel(risk: string, lang: Language): string {
  if (lang !== "bn" || !risk) return risk;
  return RISK_LEVELS_BN[risk] || RISK_LEVELS_BN[risk.toLowerCase()] || risk;
}

export function getLocalizedSoilType(soil: string, lang: Language): string {
  if (lang !== "bn" || !soil) return soil;
  return SOIL_TYPES_BN[soil] || soil;
}

export function getLocalizedCornerLabel(label: string, lang: Language): string {
  if (lang !== "bn" || !label) return label;
  return CORNERS_BN[label] || label;
}

export const HAZARDS_BN: Record<string, string> = {
  "river_erosion": "নদীভাঙন",
  "river erosion": "নদীভাঙন",
  "flood": "বন্যা",
  "monsoon flood": "বর্ষাকালীন বন্যা",
  "flash flood": "আকস্মিক বন্যা",
  "landslide": "ভূমিধস",
  "char": "চর ও দ্বীপাঞ্চল",
  "char islands": "চর ও দ্বীপাঞ্চল",
  "coastal": "উপকূলীয় ভাঙন",
  "coastal shifts": "উপকূলীয় পরিবর্তন",
  "coastal erosion": "উপকূলীয় ভাঙন",
};

export function getLocalizedHazardName(hazardOrLabel: string, lang: Language): string {
  if (lang !== "bn" || !hazardOrLabel) return hazardOrLabel;
  const key = hazardOrLabel.toLowerCase().trim();
  return HAZARDS_BN[key] || hazardOrLabel;
}

export function getLocalizedLocationLabel(label: string, lang: Language): string {
  if (lang !== "bn" || !label) return label;
  let res = label;
  res = res.replace(/JL[-–\s]*(\d+)/gi, (_, n) => `জেএল-${formatNumberLocalized(n, "bn")}`);
  for (const [en, bn] of Object.entries(RIVERS_BN)) {
    res = res.replace(new RegExp(`\\b${en}\\s+River\\b`, "gi"), `${bn} নদী`);
    res = res.replace(new RegExp(`\\b${en}\\b`, "gi"), bn);
  }
  for (const [en, bn] of Object.entries(DISTRICTS_BN)) {
    res = res.replace(new RegExp(`\\b${en}\\b`, "gi"), bn);
  }
  for (const [en, bn] of Object.entries(UPAZILAS_BN)) {
    res = res.replace(new RegExp(`\\b${en}\\b`, "gi"), bn);
  }
  for (const [en, bn] of Object.entries(HILLS_BN)) {
    res = res.replace(new RegExp(`\\b${en}\\b`, "gi"), bn);
  }
  res = res.replace(/\bChar\s+([A-Za-z]+)\s+Island\s+North\b/gi, (_, name) => `উত্তর চর ${name}`);
  res = res.replace(/\bChar\s+([A-Za-z]+)\s+Island\s+South\b/gi, (_, name) => `দক্ষিণ চর ${name}`);
  res = res.replace(/\bChar\s+([A-Za-z]+)\b/gi, (_, name) => `চর ${name}`);
  for (const [en, bn] of Object.entries(MOUZAS_BN)) {
    res = res.replace(new RegExp(`\\b${en}\\b`, "gi"), bn);
  }
  res = res.replace(/\bMouza\b/gi, "মৌজা");
  // Specific suffixes and zone labels
  res = res.replace(/\bHigh Risk Slope Zone\b/gi, "উচ্চ ঝুঁকিপূর্ণ ঢাল অঞ্চল");
  res = res.replace(/\bHill Tracts Corridor\b/gi, "পার্বত্য চট্টগ্রাম করিডোর");
  res = res.replace(/\bHill Corridor\b/gi, "পাহাড়ি করিডোর");
  res = res.replace(/\bBay of Bengal Estuary\b/gi, "বঙ্গোপসাগর মোহনা");
  res = res.replace(/\bEstuary Projection\b/gi, "মোহনা প্রক্ষেপণ");
  res = res.replace(/\bActive Channel\b/gi, "সক্রিয় চ্যানেল");
  res = res.replace(/\bFlood Channel\b/gi, "প্লাবন চ্যানেল");
  res = res.replace(/\bSari-Goyain River\b/gi, "সারি-গোয়াইন নদী");
  res = res.replace(/\bDholai River\b/gi, "ধলাই নদী");
  res = res.replace(/\bSurma River\b/gi, "সুরমা নদী");
  res = res.replace(/\bJamuna River\b/gi, "যমুনা নদী");
  res = res.replace(/\bBrahmaputra River\b/gi, "ব্রহ্মপুত্র নদী");
  res = res.replace(/\bPadma River\b/gi, "পদ্মা নদী");
  res = res.replace(/\bMeghna River\b/gi, "মেঘনা নদী");
  return res;
}

export function getLocalizedPeriodLabel(period: string, lang: Language): string {
  if (lang !== "bn" || !period) return period;
  let res = formatNumberLocalized(period, "bn");
  res = res.replace(/Years?/gi, "বছর");
  res = res.replace(/Months?/gi, "মাস");
  res = res.replace(/Multi-Year Analysis/gi, "বহুবর্ষীয় বিশ্লেষণ");
  res = res.replace(/Multi-Temporal Satellite Model/gi, "বহু-সময়কালীন উপগ্রহ মডেল");
  res = res.replace(/Monsoonal Slope Rupture/gi, "বর্ষাকালীন ঢাল ধস");
  res = res.replace(/Monsoon Deep Learning Model/gi, "বর্ষাকালীন ডিপ লার্নিং মডেল");
  res = res.replace(/Cadastral Evolution/gi, "ক্যাডাস্ট্রাল বিবর্তন");
  res = res.replace(/Estuarine Dynamics Projection/gi, "মোহনা গতিশীলতা প্রক্ষেপণ");
  res = res.replace(/Inundation Event/gi, "প্লাবন ঘটনা");
  res = res.replace(/Model Projection/gi, "মডেল প্রক্ষেপণ");
  res = res.replace(/Monsoon/gi, "বর্ষা");
  res = res.replace(/January/gi, "জানুয়ারি");
  res = res.replace(/February/gi, "ফেব্রুয়ারি");
  res = res.replace(/March/gi, "মার্চ");
  res = res.replace(/April/gi, "এপ্রিল");
  res = res.replace(/May/gi, "মে");
  res = res.replace(/June/gi, "জুন");
  res = res.replace(/July/gi, "জুলাই");
  res = res.replace(/August/gi, "আগস্ট");
  res = res.replace(/September/gi, "সেপ্টেম্বর");
  res = res.replace(/October/gi, "অক্টোবর");
  res = res.replace(/November/gi, "নভেম্বর");
  res = res.replace(/December/gi, "ডিসেম্বর");
  return res;
}

export function getLocalizedAssessmentTitle(title: string, lang: Language): string {
  if (lang !== "bn" || !title) return title;
  let res = title;
  res = res.replace(/\s+Riverside Bank Erosion Assessment\b/gi, " নদীভাঙন সমীক্ষা ও মূল্যায়ন");
  res = res.replace(/\s+Riverside Bank Erosion Risk Projection\b/gi, " নদীভাঙন ঝুঁকি প্রক্ষেপণ");
  res = res.replace(/\s+Flash Flood Submersion Assessment\b/gi, " আকস্মিক প্লাবন ও ক্ষতি সমীক্ষা");
  res = res.replace(/\s+Flood Inundation & Siltation Assessment\b/gi, " প্লাবন ও পলি সঞ্চয়ন মূল্যায়ন");
  res = res.replace(/\s+Slope Failure & Mass Wasting\b/gi, " পাহাড়ের ঢাল ধস ও মাটি স্খলন");
  res = res.replace(/\s+Mass-Movement Susceptibility Forecast\b/gi, " পাহাড়ি মাটি স্থানচ্যুতি সংবেদনশীলতা পূর্বাভাস");
  res = res.replace(/\s+Accretion & Consolidation\b/gi, " পলি সঞ্চয়ন ও চরের স্থায়িত্ব");
  res = res.replace(/\s+Morphological Evolution & Stability Projection\b/gi, " ভূমিরূপ বিবর্তন ও স্থায়িত্ব প্রক্ষেপণ");
  res = res.replace(/\s+Estuarine Shoreline Migration\b/gi, " মোহনা তীররেখার স্থানান্তর");
  res = res.replace(/\s+Coastal Shoreline Shift & Accretion Projection\b/gi, " উপকূলীয় তীররেখা স্থানান্তর ও পয়স্তি প্রক্ষেপণ");
  res = res.replace(/\bMouza\b/gi, "মৌজা");
  for (const [en, bn] of Object.entries(MOUZAS_BN)) {
    res = res.replace(new RegExp(`\\b${en}\\b`, "gi"), bn);
  }
  for (const [en, bn] of Object.entries(HILLS_BN)) {
    res = res.replace(new RegExp(`\\b${en}\\b`, "gi"), bn);
  }
  res = res.replace(/\bChar\s+([A-Za-z]+)\s+Island\s+North\b/gi, (_, name) => `উত্তর চর ${name}`);
  res = res.replace(/\bChar\s+([A-Za-z]+)\s+Island\s+South\b/gi, (_, name) => `দক্ষিণ চর ${name}`);
  res = res.replace(/\bChar\s+([A-Za-z]+)\b/gi, (_, name) => `চর ${name}`);
  return res;
}

export const METRIC_LABELS_BN: Record<string, string> = {
  "Bank Retreat Rate": "তীরভাঙনের বার্ষিক হার",
  "Eroded Homesteads": "বিলীন বসতভিটা",
  "Embankment Status": "বেড়িবাঁধের অবস্থা",
  "Seaward Accretion": "সমুদ্রাভিমুখী পয়স্তি",
  "Western Bank Erosion": "পশ্চিম তীরভাঙন",
  "Salinity Index": "লবণাক্ততার মাত্রা",
  "Consolidated Area": "স্থায়ী চরের আয়তন",
  "Accretion Velocity": "পলি সঞ্চয়নের বেগ",
  "Stability Score": "স্থায়িত্ব সূচক",
  "Debris Volume": "স্থানান্তরিত ধ্বংসাবশেষ",
  "Slope Gradient": "পাহাড়ের ঢাল নতিমাত্রা",
  "Casualties Avoided": "নিরাপদে আশ্রিত পরিবার",
  "Rainfall Threshold": "বৃষ্টিপাতের মাত্রা",
};

export const METRIC_SUBLABELS_BN: Record<string, string> = {
  "Active right channel": "সক্রিয় ডান চ্যানেল",
  "Relocated to polder": "বাঁধের অভ্যন্তরে স্থানান্তরিত",
  "Geo-bag deployment": "জিওব্যাগ ডাম্পিং চলমান",
  "Mudflat expansion": "উপকূলীয় পলিময় এলাকা বৃদ্ধি",
  "Tidal bore impact": "জোয়ারের তীব্র স্রোত",
  "High tidal influence": "উচ্চ জোয়ারের প্রভাব",
  "Vegetated sandbar body": "ঘাসাবৃত পলিময় চর",
  "Upstream sediment trapping": "উজান থেকে পলি অবক্ষেপণ",
  "Alluvial consolidation": "পলির জমাটবদ্ধতা",
  "Colluvial soil collapse": "পাহাড়ের মাটি স্খলন",
  "Unvegetated terrace": "উদ্ভিদহীন পাহাড়ি ধাপ",
  "Early warning protocol": "পূর্ব সতর্কবার্তা ব্যবস্থা",
};

export function getLocalizedMetric(
  metric: { label: string; value: string; sublabel?: string },
  lang: Language
): { label: string; value: string; sublabel?: string } {
  if (lang !== "bn") return metric;
  const label = METRIC_LABELS_BN[metric.label] || metric.label;
  const sublabel = metric.sublabel ? (METRIC_SUBLABELS_BN[metric.sublabel] || metric.sublabel) : undefined;
  let value = formatNumberLocalized(metric.value, "bn");
  value = value.replace(/m\/yr/gi, "মি./বছর");
  value = value.replace(/Units?/gi, "টি বসতি");
  value = value.replace(/Families/gi, "টি পরিবার");
  value = value.replace(/Breached\s+(\d+)m/gi, (_, n) => `${formatNumberLocalized(n, "bn")} মিটার ক্ষতিগ্রস্ত`);
  value = value.replace(/dec\/yr/gi, "শতাংশ/বছর");
  value = value.replace(/dec\b/gi, "শতাংশ");
  value = value.replace(/m³\b/gi, "ঘনমিটার");
  value = value.replace(/° Angle\b/gi, "° কোণ");
  return { label, value, sublabel };
}

const MONTHS_BN = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

export function formatDateLocalized(dateStr: string | undefined | null, lang: Language): string {
  if (!dateStr) return "";
  if (lang !== "bn") return dateStr;

  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (!isNaN(year) && !isNaN(monthIdx) && monthIdx >= 0 && monthIdx < 12 && !isNaN(day)) {
      return `${formatNumberLocalized(day, "bn")} ${MONTHS_BN[monthIdx]} ${formatNumberLocalized(year, "bn")}`;
    }
  }
  return formatNumberLocalized(dateStr, "bn");
}

export function getLocalizedOwnerId(ownerId: string, lang: Language): string {
  if (!ownerId) return "";
  const num = ownerId.replace(/^owner_?/i, "");
  if (lang === "bn") {
    return `মালিক নং ${formatNumberLocalized(num, "bn")}`;
  }
  return `Owner #${num}`;
}

export function getLocalizedBankName(bankName: string | undefined, lang: Language): string {
  if (!bankName) return lang === "bn" ? "তথ্য পাওয়া যায়নি" : "Information Not Available";
  if (lang === "bn") {
    return bankName;
  }
  const match = bankName.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    return match[1];
  }
  return bankName;
}

export function getLocalizedLoanStatus(
  status: "active" | "released" | "closed" | "disputed" | "unknown" | undefined,
  hasMortgage: boolean | null | undefined,
  lang: Language
): string {
  if (hasMortgage === true || status === "active") {
    return lang === "bn" ? "বন্ধককৃত (ঋণের বিপরীতে দায়বদ্ধ)" : "Mortgaged (Pledged for Loan)";
  }
  if (status === "released" || status === "closed") {
    return lang === "bn" ? "বন্ধক অবমুক্ত (পরিশোধিত)" : "Mortgage Released (Repaid)";
  }
  if (hasMortgage === false) {
    return lang === "bn" ? "কোনো বন্ধক রেকর্ড পাওয়া যায়নি" : "No Mortgage Record Found";
  }
  return lang === "bn" ? "তথ্য পাওয়া যায়নি / যাচাই করা সম্ভব হয়নি" : "Information Not Available / Unable to Verify";
}





