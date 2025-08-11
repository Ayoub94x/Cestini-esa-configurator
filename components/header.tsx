"use client"

import { usePriceCalculation } from "@/hooks/use-price-calculation"
import { useConfigStore } from "@/hooks/use-config-store"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"

const LOGO_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_ESA-SH0r2i3VZYnYmHs6wymFizOyag967i.png"

function PriceDisplay() {
  const { totalPrice } = usePriceCalculation()
  const { selectedBin } = useConfigStore()

  return (
    <AnimatePresence>
      {selectedBin && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-right"
        >
          <p className="font-semibold text-gray-800">
            {selectedBin.name} {selectedBin.size}L
          </p>
          <p className="text-sm text-gray-500 -mt-1">Prezzo Configurazione</p>
          <p className="text-2xl font-bold text-primary">
            {totalPrice.toLocaleString("it-IT", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image
            src={LOGO_URL || "/placeholder.svg"}
            alt="Logo ESA Waste Solutions"
            width={160}
            height={50}
            className="h-10 w-auto"
            unoptimized
          />
          <span className="font-bold text-xl text-gray-700 hidden sm:inline">Configuratore Cestini</span>
        </div>
        <PriceDisplay />
      </div>
    </header>
  )
}
