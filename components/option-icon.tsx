"use client"

import React from "react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Option } from "@/lib/data"

// Funzione per calcolare un bordo di contrasto appropriato
function getContrastBorder(color: string): string {
  // Converte il colore hex in RGB
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calcola la luminanza relativa
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Restituisce un bordo scuro per colori chiari e viceversa
  if (luminance > 0.8) {
    return 'rgba(0, 0, 0, 0.2)' // Bordo scuro per colori molto chiari
  } else if (luminance > 0.5) {
    return 'rgba(0, 0, 0, 0.15)' // Bordo leggermente scuro per colori medi-chiari
  } else if (luminance < 0.2) {
    return 'rgba(255, 255, 255, 0.3)' // Bordo chiaro per colori molto scuri
  } else {
    return 'rgba(255, 255, 255, 0.2)' // Bordo leggermente chiaro per colori medi-scuri
  }
}

interface OptionIconProps {
  option: Option
  position: { x: number; y: number; scale?: number }
  index: number
  totalIcons: number
  isColorOption?: boolean
  color?: string
  className?: string
}

export function OptionIcon({
  option,
  position,
  index,
  totalIcons,
  isColorOption = false,
  color,
  className
}: OptionIconProps) {
  const Icon = option.icon!
  const baseDelay = index * 0.1
  const iconScale = position.scale || 1

  // Varianti di animazione ottimizzate
  const iconVariants = {
    initial: {
      scale: 0,
      opacity: 0,
      rotate: -180,
      filter: "blur(4px)"
    },
    animate: {
      scale: iconScale,
      opacity: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: baseDelay,
        filter: {
          duration: 0.3,
          delay: baseDelay + 0.2
        }
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      rotate: 180,
      filter: "blur(4px)",
      transition: {
        duration: 0.2,
        delay: (totalIcons - index - 1) * 0.05
      }
    },
    hover: {
      scale: iconScale * 1.15,
      rotate: [0, -3, 3, 0],
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        rotate: {
          duration: 0.6,
          ease: "easeInOut"
        }
      }
    },
    tap: {
      scale: iconScale * 0.95,
      transition: {
        duration: 0.1
      }
    }
  }

  // Varianti per l'effetto glow
  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: [0.3, 0.6, 0.3],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: baseDelay + 0.5
      }
    },
    hover: {
      opacity: 0.8,
      scale: 1.4,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            layout
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
            whileTap="tap"
            className={cn(
              "absolute w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 cursor-pointer group",
              className
            )}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 10,
              transformOrigin: "center center"
            }}
          >
            {/* Outer glow effect */}
            <motion.div
              variants={glowVariants}
              className={cn(
                "absolute inset-0 rounded-full blur-md transition-all duration-300",
                isColorOption
                  ? "opacity-30"
                  : "bg-gradient-to-br from-blue-400/20 to-purple-600/20"
              )}
              style={isColorOption ? { backgroundColor: color } : {}}
            />

            {/* Main icon container */}
            <motion.div
              className={cn(
                "relative w-full h-full rounded-full shadow-xl flex items-center justify-center group-hover:shadow-2xl transition-all duration-300",
                isColorOption
                  ? "border-2"
                  : "bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-white/50 backdrop-blur-sm"
              )}
              style={isColorOption ? {
                backgroundColor: color,
                borderColor: getContrastBorder(color || '#000000'),
                boxShadow: `0 8px 25px -8px ${color}40, inset 0 1px 0 rgba(255,255,255,0.2)`
              } : {}}
              whileHover={isColorOption ? {
                boxShadow: `0 12px 35px -8px ${color}60, inset 0 1px 0 rgba(255,255,255,0.3), 0 0 0 1px ${getContrastBorder(color || '#000000')}`
              } : {
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)"
              }}
            >
              {!isColorOption && (
                <>
                  {/* Inner shadow for depth */}
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-transparent to-black/5" />

                  {/* Icon */}
                  <motion.div className="relative z-10">
                    <Icon
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-colors duration-300 text-slate-700 group-hover:text-blue-600"
                    />
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Subtle pulse animation */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full animate-pulse",
                isColorOption ? "opacity-20" : "bg-gradient-to-br from-blue-400/10 to-purple-600/10"
              )}
              style={isColorOption ? { backgroundColor: color } : {}}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />

            {/* Ripple effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              initial={{ scale: 1, opacity: 0 }}
              whileHover={{
                scale: [1, 1.5],
                opacity: [0, 0.5, 0],
                transition: {
                  duration: 0.6,
                  ease: "easeOut"
                }
              }}
            />
          </motion.div>
        </TooltipTrigger>
        
        <TooltipContent 
          side="top" 
          className="bg-slate-800/95 text-white border-slate-700 backdrop-blur-sm"
          sideOffset={8}
        >
          <div className="text-center">
            <p className="font-medium text-sm">{option.label}</p>
            {isColorOption && color && (
              <p className="text-xs text-slate-300 mt-1">{color}</p>
            )}
            <p className="text-xs text-blue-300 mt-1">
              +{option.percentage 
                ? `${option.price}%` 
                : option.price.toLocaleString("it-IT", { style: "currency", currency: "EUR" })
              }
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}