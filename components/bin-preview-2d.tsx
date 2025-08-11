"use client"

import Image from "next/image"
import { useConfigStore } from "@/hooks/use-config-store"
import { options as allOptions } from "@/lib/data"
import { AnimatePresence, motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Palette } from "lucide-react"

export function BinPreview2D() {
  const { selectedBin, selectedOptions, isColorOptionActive, color } = useConfigStore()

  if (!selectedBin) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg">
        <p className="text-gray-500">Seleziona un cestino per vedere l'anteprima.</p>
      </div>
    )
  }

  const activeOptions = allOptions.filter((opt) => opt.code !== "color" && selectedOptions[opt.code] && opt.icon)

  return (
    <div id="bin-preview-for-pdf" className="relative w-[400px] h-[500px] flex items-center justify-center">
      <Image
        src={selectedBin.baseImage || "/placeholder.svg"}
        alt={`Anteprima Cestino ${selectedBin.name} ${selectedBin.size}L`}
        width={400}
        height={500}
        priority
        className="object-contain w-auto h-full max-w-full max-h-full"
        unoptimized
      />

      <AnimatePresence>
        {activeOptions.map((option, index) => {
          const totalIcons = activeOptions.length + (isColorOptionActive ? 1 : 0)
          const angle = (index / totalIcons) * 2 * Math.PI - Math.PI / 2
          const radiusX = 220
          const radiusY = 260
          const x = Math.cos(angle) * radiusX + 200
          const y = Math.sin(angle) * radiusY + 250
          const Icon = option.icon!

          return (
            <TooltipProvider key={option.code} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute w-14 h-14 rounded-full flex items-center justify-center cursor-pointer bg-gradient-to-br from-white/90 to-gray-200/70 shadow-lg backdrop-blur-sm ring-1 ring-black/5"
                    style={{
                      left: `${x - 28}px`,
                      top: `${y - 28}px`,
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-inner">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{option.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}

        {isColorOptionActive &&
          (() => {
            const totalIcons = activeOptions.length + 1
            const angle = (activeOptions.length / totalIcons) * 2 * Math.PI - Math.PI / 2
            const radiusX = 220
            const radiusY = 260
            const x = Math.cos(angle) * radiusX + 200
            const y = Math.sin(angle) * radiusY + 250

            return (
              <TooltipProvider key="color-option" delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.15, zIndex: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="absolute w-14 h-14 rounded-full flex items-center justify-center cursor-pointer bg-gradient-to-br from-white/90 to-gray-200/70 shadow-lg backdrop-blur-sm ring-1 ring-black/5"
                      style={{
                        left: `${x - 28}px`,
                        top: `${y - 28}px`,
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner"
                        style={{ backgroundColor: color }}
                      >
                        <Palette className="w-7 h-7 text-white/80" />
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Colore personalizzato: {color}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })()}
      </AnimatePresence>
    </div>
  )
}
