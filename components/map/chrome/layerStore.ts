import { create } from "zustand";

export type LayerPreset = "survey" | "analysis" | "clean";
export type ViewTarget = "reach" | "mouza";

export interface LayerState {
  // Layer Groups & Toggles
  landuse: boolean;
  roads: boolean;
  buildings: boolean;
  embankments: boolean;
  graticule: boolean;

  upazila: boolean;
  mouzaBoundaries: boolean;
  mouzaLabels: boolean;
  mouzaTint: boolean;

  water: boolean;
  waterLabels: boolean;

  plots: boolean;
  dagLabels: boolean;
  ownerColours: boolean;

  hazardLayers: boolean;
  historyLines: boolean;

  // Terrain layers (Landslide)
  elevationTint: boolean;
  hillshade: boolean;
  contours: boolean;
  slope: boolean;
  elevationChange: boolean;

  // Opacity
  hazardOpacity: number;
  basemapOpacity: number;

  // Preset & View
  preset: LayerPreset;
  viewTarget: ViewTarget;

  // Interactive Hover & Highlight
  hoveredMouzaId: string | null;

  // Actions
  toggleLayer: (key: keyof Omit<LayerState, "hazardOpacity" | "basemapOpacity" | "preset" | "viewTarget" | "hoveredMouzaId" | "setHazardOpacity" | "setBasemapOpacity" | "applyPreset" | "setViewTarget" | "setHoveredMouzaId" | "resetLayers">) => void;
  setHazardOpacity: (opacity: number) => void;
  setBasemapOpacity: (opacity: number) => void;
  applyPreset: (preset: LayerPreset) => void;
  setViewTarget: (target: ViewTarget) => void;
  setHoveredMouzaId: (id: string | null) => void;
  resetLayers: () => void;
}

const DEFAULT_LAYER_FLAGS = {
  landuse: true,
  roads: true,
  buildings: true,
  embankments: true,
  graticule: true,

  upazila: true,
  mouzaBoundaries: true,
  mouzaLabels: true,
  mouzaTint: true,

  water: true,
  waterLabels: true,

  plots: true,
  dagLabels: true,
  ownerColours: true,

  hazardLayers: true,
  historyLines: true,

  elevationTint: true,
  hillshade: true,
  contours: true,
  slope: false,
  elevationChange: false,

  hazardOpacity: 0.88,
  basemapOpacity: 1.0,
  preset: "analysis" as LayerPreset,
  viewTarget: "mouza" as ViewTarget,
  hoveredMouzaId: null as string | null,
};

export const useLayerStore = create<LayerState>((set) => ({
  ...DEFAULT_LAYER_FLAGS,

  toggleLayer: (key) =>
    set((state) => ({
      [key]: !state[key],
    })),

  setHazardOpacity: (hazardOpacity) => set({ hazardOpacity }),
  setBasemapOpacity: (basemapOpacity) => set({ basemapOpacity }),

  applyPreset: (preset) => {
    if (preset === "survey") {
      set({
        preset: "survey",
        landuse: true,
        roads: true,
        buildings: true,
        embankments: true,
        graticule: true,
        upazila: true,
        mouzaBoundaries: true,
        mouzaLabels: true,
        mouzaTint: true,
        water: true,
        waterLabels: true,
        plots: true,
        dagLabels: true,
        hazardLayers: true,
        hazardOpacity: 0.7,
        basemapOpacity: 1.0,
      });
    } else if (preset === "analysis") {
      set({
        preset: "analysis",
        landuse: true,
        roads: true,
        buildings: false,
        embankments: true,
        graticule: true,
        upazila: true,
        mouzaBoundaries: true,
        mouzaLabels: true,
        mouzaTint: true,
        water: true,
        waterLabels: true,
        plots: true,
        dagLabels: false,
        hazardLayers: true,
        hazardOpacity: 1.0,
        basemapOpacity: 0.8,
      });
    } else if (preset === "clean") {
      set({
        preset: "clean",
        landuse: false,
        roads: false,
        buildings: false,
        embankments: false,
        graticule: false,
        upazila: true,
        mouzaBoundaries: true,
        mouzaLabels: true,
        mouzaTint: false,
        water: true,
        waterLabels: false,
        plots: false,
        dagLabels: false,
        hazardLayers: true,
        hazardOpacity: 1.0,
        basemapOpacity: 0.5,
      });
    }
  },

  setViewTarget: (viewTarget) => set({ viewTarget }),
  setHoveredMouzaId: (hoveredMouzaId) => set({ hoveredMouzaId }),
  resetLayers: () => set({ ...DEFAULT_LAYER_FLAGS }),
}));
