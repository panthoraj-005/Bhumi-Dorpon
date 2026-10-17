import { create } from "zustand";
import { AreaUnit, DataMode, HazardType, TimePeriod } from "@/lib/types";
import { Language } from "@/lib/translations";
import { AuthSession, getSavedSession } from "@/lib/auth";

interface AppState {
  // Global Language ('bn' default)
  language: Language;
  setLanguage: (lang: Language) => void;

  // Authentication & Demo Session
  authSession: AuthSession | null;
  setAuthSession: (session: AuthSession | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Global Unit & Period
  unit: AreaUnit;
  setUnit: (unit: AreaUnit) => void;

  period: TimePeriod;
  setPeriod: (period: TimePeriod) => void;

  // Recorded vs Forecast
  dataMode: DataMode;
  setDataMode: (mode: DataMode) => void;

  // Active hazard filter
  activeHazard: HazardType;
  setActiveHazard: (hazard: HazardType) => void;

  // Cascading Selection State
  selectedDistrictId: string | null;
  setSelectedDistrictId: (id: string | null) => void;

  selectedUpazilaId: string | null;
  setSelectedUpazilaId: (id: string | null) => void;

  selectedRiverId: string | null;
  setSelectedRiverId: (id: string | null) => void;

  selectedMouzaId: string | null;
  setSelectedMouzaId: (id: string | null) => void;

  // Reset cascade
  resetCascade: () => void;
}

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "bn";
  const saved = localStorage.getItem("bhumidorpon_language");
  return saved === "en" ? "en" : "bn";
}

export const useAppStore = create<AppState>((set) => ({
  // Default language is strictly Bangla ('bn')
  language: "bn",
  setLanguage: (language) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("bhumidorpon_language", language);
      } catch (e) {
        console.error("Failed to save language preference:", e);
      }
    }
    set({ language });
  },

  // Auth session
  authSession: null,
  setAuthSession: (authSession) => set({ authSession }),
  isAuthModalOpen: false,
  setIsAuthModalOpen: (isAuthModalOpen) => set({ isAuthModalOpen }),

  unit: "decimal",
  setUnit: (unit) => set({ unit }),

  period: "1y",
  setPeriod: (period) => set({ period }),

  dataMode: "recorded",
  setDataMode: (dataMode) => set({ dataMode }),

  activeHazard: "river_erosion",
  setActiveHazard: (activeHazard) => set({ activeHazard }),

  selectedDistrictId: "sirajganj",
  setSelectedDistrictId: (id) =>
    set({
      selectedDistrictId: id,
      selectedUpazilaId: null,
      selectedRiverId: null,
      selectedMouzaId: null,
    }),

  selectedUpazilaId: "kazipur",
  setSelectedUpazilaId: (id) =>
    set({
      selectedUpazilaId: id,
      selectedRiverId: null,
      selectedMouzaId: null,
    }),

  selectedRiverId: "jamuna",
  setSelectedRiverId: (id) =>
    set({
      selectedRiverId: id,
      selectedMouzaId: null,
    }),

  selectedMouzaId: "mouza_meghai",
  setSelectedMouzaId: (id) => set({ selectedMouzaId: id }),

  resetCascade: () =>
    set({
      selectedDistrictId: null,
      selectedUpazilaId: null,
      selectedRiverId: null,
      selectedMouzaId: null,
    }),
}));

