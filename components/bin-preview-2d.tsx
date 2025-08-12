"use client"

import { Image } from "./image"
import { useConfigStore } from "@/hooks/use-config-store"
import { options as allOptions } from "@/lib/data"
import { AnimatePresence } from "framer-motion"
import { OptionIcon } from "./option-icon"
import { useIconAnimations } from "@/hooks/use-icon-animations"
import { useEffect, useState } from "react"

export function BinPreview2D() {
  const { selectedBin, selectedOptions, isColorOptionActive, color } = useConfigStore()
  const [containerDimensions, setContainerDimensions] = useState({ width: 400, height: 500 })

  if (!selectedBin) {
    return (
  <div className="flex items-center justify-center h-full w-full bg-muted rounded-lg">
    <p className="text-muted-foreground">Seleziona un cestino per vedere l&apos;anteprima.</p>
      </div>
    )
  }

  const activeOptions = allOptions.filter((opt) => opt.code !== "color" && selectedOptions[opt.code] && opt.icon)
  const totalIcons = activeOptions.length + (isColorOptionActive ? 1 : 0)
  const hasIcons = totalIcons > 0

  const { positions, getAnimationVariants } = useIconAnimations({
    totalIcons,
    containerWidth: containerDimensions.width,
    containerHeight: containerDimensions.height,
    isVisible: hasIcons
  })

  // Aggiorna le dimensioni del container quando cambia
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('bin-preview-for-pdf')
      if (container) {
        const { clientWidth, clientHeight } = container
        setContainerDimensions({ width: clientWidth, height: clientHeight })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return (
    <div id="bin-preview-for-pdf" className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
      <Image 
        src={selectedBin.baseImage || "/placeholder.svg"} 
        alt={`Anteprima Cestino ${selectedBin.name} ${selectedBin.size}L`} 
        width={400} 
        height={500} 
        sizes="(max-width: 640px) 85vw, 420px" 
        className="object-contain w-auto h-full max-w-full max-h-full" 
      />

      <AnimatePresence mode="popLayout">
        {/* Icone degli optional standard */}
        {activeOptions.map((option, index) => {
          const position = positions[index] || { x: 0, y: 0 }
          
          return (
            <OptionIcon
              key={option.code}
              option={option}
              position={position}
              index={index}
              totalIcons={totalIcons}
            />
          )
        })}

        {/* Icona per l'opzione colore */}
        {isColorOptionActive && (
          <OptionIcon
            key="color-option"
            option={allOptions.find(opt => opt.code === "color")!}
            position={positions[activeOptions.length] || { x: 0, y: 0 }}
            index={activeOptions.length}
            totalIcons={totalIcons}
            isColorOption={true}
            color={color}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
