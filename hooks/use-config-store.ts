import { create } from "zustand"
import { type Bin, bins as allBins, type BinModelId } from "@/lib/data"

type Step = "model_selection" | "selection" | "configuration" | "quantity"

interface ConfigState {
  step: Step
  selectedModelId: BinModelId | null
  selectedBin: Bin | null
  selectedOptions: Record<string, boolean>
  quantity: number
  color: string
  isColorOptionActive: boolean
  setStep: (step: Step) => void
  selectModel: (modelId: BinModelId) => void
  selectBin: (bin: Bin) => void
  toggleOption: (optionCode: string) => void
  setQuantity: (quantity: number) => void
  setColor: (color: string) => void
  toggleColorOption: () => void
  reset: () => void
}

const initialState = {
  step: "model_selection" as Step,
  selectedModelId: null,
  selectedBin: null,
  selectedOptions: {},
  quantity: 1,
  color: "#333333",
  isColorOptionActive: false,
}

export const useConfigStore = create<ConfigState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  selectModel: (modelId) => {
    const binsForModel = allBins.filter((b) => b.modelId === modelId)
    // Ora entrambi i modelli hanno più di una versione, quindi andranno sempre alla selezione del volume.
    if (binsForModel.length === 1) {
      set({
        selectedModelId: modelId,
        selectedBin: binsForModel[0],
        step: "configuration",
        selectedOptions: {},
        quantity: 1,
        color: "#333333",
        isColorOptionActive: false,
      })
    } else {
      set({
        selectedModelId: modelId,
        step: "selection",
        selectedBin: null,
      })
    }
  },
  selectBin: (bin) =>
    set({
      selectedBin: bin,
      step: "configuration",
      selectedOptions: {},
      quantity: 1,
      color: "#333333",
      isColorOptionActive: false,
    }),
  toggleOption: (optionCode) =>
    set((state) => ({
      selectedOptions: {
        ...state.selectedOptions,
        [optionCode]: !state.selectedOptions[optionCode],
      },
    })),
  setQuantity: (quantity) => set({ quantity: Math.max(1, Math.min(50, quantity)) }),
  setColor: (color) => set({ color }),
  toggleColorOption: () =>
    set((state) => ({
      isColorOptionActive: !state.isColorOptionActive,
    })),
  reset: () => set(initialState),
}))
