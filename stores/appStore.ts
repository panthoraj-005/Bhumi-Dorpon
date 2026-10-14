import { create } from "zustand";
import { AreaUnit, DataMode, HazardType, TimePeriod } from "@/lib/types";

interface AppState {
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

export const useAppStore = create<AppState>((set) => ({
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
