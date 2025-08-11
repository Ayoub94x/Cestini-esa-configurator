"use client"

import { useConfigStore } from "@/hooks/use-config-store"
import { BinSelector } from "@/components/bin-selector"
import { ConfigurationStep } from "./configuration-step"
import { QuantityStep } from "./quantity-step"
import { ModelSelector } from "./model-selector"

export function Configurator() {
  const step = useConfigStore((state) => state.step)

  const renderStep = () => {
    switch (step) {
      case "selection":
        return <BinSelector />
      case "configuration":
        return <ConfigurationStep />
      case "quantity":
        return <QuantityStep />
      case "model_selection":
      default:
        return <ModelSelector />
    }
  }

  return <div className="container mx-auto px-4 py-8">{renderStep()}</div>
}
