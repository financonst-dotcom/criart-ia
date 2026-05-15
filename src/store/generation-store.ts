import { create } from "zustand";
import type { Generation, GenerationType, ImageFormat } from "@/types";

interface GenerationState {
  activeGeneration: Generation | null;
  pendingConfig: {
    type: GenerationType | null;
    format: ImageFormat;
    numImages: number;
    prompt: string;
    negativePrompt: string;
    style: string;
    inputImages: string[];
    settings: Record<string, unknown>;
  };
  isGenerating: boolean;
  results: Generation[];
  error: string | null;

  setActiveGeneration: (generation: Generation | null) => void;
  updateConfig: (config: Partial<GenerationState["pendingConfig"]>) => void;
  setGenerating: (generating: boolean) => void;
  addResult: (generation: Generation) => void;
  clearResults: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const DEFAULT_CONFIG: GenerationState["pendingConfig"] = {
  type: null,
  format: "square",
  numImages: 2,
  prompt: "",
  negativePrompt: "",
  style: "photorealistic",
  inputImages: [],
  settings: {},
};

export const useGenerationStore = create<GenerationState>()((set) => ({
  activeGeneration: null,
  pendingConfig: DEFAULT_CONFIG,
  isGenerating: false,
  results: [],
  error: null,

  setActiveGeneration: (generation) => set({ activeGeneration: generation }),

  updateConfig: (config) =>
    set((state) => ({
      pendingConfig: { ...state.pendingConfig, ...config },
    })),

  setGenerating: (isGenerating) => set({ isGenerating, error: null }),

  addResult: (generation) =>
    set((state) => ({ results: [generation, ...state.results] })),

  clearResults: () => set({ results: [] }),

  setError: (error) => set({ error, isGenerating: false }),

  reset: () =>
    set({
      pendingConfig: DEFAULT_CONFIG,
      isGenerating: false,
      results: [],
      error: null,
    }),
}));
