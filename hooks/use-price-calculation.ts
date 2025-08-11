"use client"

import { useMemo } from "react"
import { useConfigStore } from "./use-config-store"
import { options as allOptions } from "@/lib/data"

export function usePriceCalculation() {
  const { selectedBin, selectedOptions, quantity, isColorOptionActive } = useConfigStore()

  const priceBreakdown = useMemo(() => {
    if (!selectedBin) return null

    const items: { label: string; quantity: number; unitPrice: number; total: number }[] = []
    let subtotal = 0

    items.push({
      label: `Cestino ${selectedBin.name} ${selectedBin.size}L`,
      quantity: quantity,
      unitPrice: selectedBin.basePrice,
      total: selectedBin.basePrice * quantity,
    })
    subtotal += selectedBin.basePrice * quantity

    // Calcolo per l'opzione colore
    if (isColorOptionActive) {
      const colorOption = allOptions.find((opt) => opt.code === "color")
      if (colorOption) {
        const colorPrice = Number.parseFloat((selectedBin.basePrice * (colorOption.price / 100)).toFixed(2))
        items.push({ label: colorOption.label, quantity, unitPrice: colorPrice, total: colorPrice * quantity })
        subtotal += colorPrice * quantity
      }
    }

    // Altri optional
    for (const optionCode in selectedOptions) {
      if (selectedOptions[optionCode]) {
        const option = allOptions.find((opt) => opt.code === optionCode)
        if (option) {
          const isAvailable = !option.availableFor || option.availableFor.includes(selectedBin.size)
          if (isAvailable) {
            if (option.percentage) {
              const optionPrice = Number.parseFloat((selectedBin.basePrice * (option.price / 100)).toFixed(2))
              items.push({ label: option.label, quantity, unitPrice: optionPrice, total: optionPrice * quantity })
              subtotal += optionPrice * quantity
            } else {
              items.push({ label: option.label, quantity, unitPrice: option.price, total: option.price * quantity })
              subtotal += option.price * quantity
            }
          }
        }
      }
    }

    const total = subtotal

    return {
      items,
      subtotal,
      total,
    }
  }, [selectedBin, selectedOptions, quantity, isColorOptionActive])

  const truckCapacity = selectedBin?.maxPerTruck ?? 0
  const isTruckCapacityExceeded = quantity > truckCapacity

  return {
    priceBreakdown,
    totalPrice: priceBreakdown?.total ?? 0,
    productionDays: selectedBin?.prodDays ?? 0,
    isTruckCapacityExceeded,
    truckCapacity,
  }
}
