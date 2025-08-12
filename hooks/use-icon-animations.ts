"use client"

import { useEffect, useState } from "react"

interface IconPosition {
  x: number
  y: number
  scale: number
  rotation: number
}

interface UseIconAnimationsProps {
  totalIcons: number
  containerWidth: number
  containerHeight: number
  isVisible: boolean
}

export function useIconAnimations({
  totalIcons,
  containerWidth,
  containerHeight,
  isVisible
}: UseIconAnimationsProps) {
  const [positions, setPositions] = useState<IconPosition[]>([])
  const [animationPhase, setAnimationPhase] = useState<'entering' | 'stable' | 'exiting'>('entering')

  // Calcola posizioni ottimizzate per le icone con layout a colonne alternate
  const calculateOptimalPositions = (): IconPosition[] => {
    if (totalIcons === 0) return []

    const positions: IconPosition[] = []
    const padding = 20 // Padding dai bordi
    const iconSize = 64 // Dimensione approssimativa dell'icona
    const spacing = 16 // Spaziatura tra le icone
    const maxIconsPerColumn = 6 // Massimo numero di icone per colonna

    // Calcola quante colonne servono
    const totalColumns = Math.ceil(totalIcons / maxIconsPerColumn)
    
    // Per ogni icona, determina la sua posizione
    for (let i = 0; i < totalIcons; i++) {
      const columnIndex = Math.floor(i / maxIconsPerColumn)
      const positionInColumn = i % maxIconsPerColumn
      
      let x: number
      let scale = 1
      
      // Alterna le colonne tra destra e sinistra
      if (columnIndex % 2 === 0) {
        // Colonne pari: lato destro
        const rightColumnOffset = Math.floor(columnIndex / 2)
        x = containerWidth - iconSize - padding - (rightColumnOffset * (iconSize + spacing))
      } else {
        // Colonne dispari: lato sinistro
        const leftColumnOffset = Math.floor(columnIndex / 2)
        x = padding + (leftColumnOffset * (iconSize + spacing))
      }
      
      // Se ci sono troppe colonne, riduci la scala delle icone
      if (totalColumns > 4) {
        scale = 0.8
        x = columnIndex % 2 === 0 
          ? containerWidth - (iconSize * scale) - padding - (Math.floor(columnIndex / 2) * (iconSize * scale + spacing * 0.8))
          : padding + (Math.floor(columnIndex / 2) * (iconSize * scale + spacing * 0.8))
      }
      
      // Calcola la posizione Y centrata per la colonna
      const iconsInThisColumn = Math.min(maxIconsPerColumn, totalIcons - (columnIndex * maxIconsPerColumn))
      const columnHeight = (iconsInThisColumn * iconSize * scale) + ((iconsInThisColumn - 1) * spacing)
      const startY = (containerHeight - columnHeight) / 2
      const y = startY + (positionInColumn * (iconSize * scale + spacing))
      
      positions.push({
        x,
        y,
        scale,
        rotation: 0
      })
    }

    return positions
  }

  // Aggiorna posizioni quando cambiano i parametri
  useEffect(() => {
    if (containerWidth > 0 && containerHeight > 0) {
      const newPositions = calculateOptimalPositions()
      setPositions(newPositions)
    }
  }, [totalIcons, containerWidth, containerHeight])

  // Gestisce le fasi di animazione
  useEffect(() => {
    if (isVisible) {
      setAnimationPhase('entering')
      const timer = setTimeout(() => {
        setAnimationPhase('stable')
      }, 1000) // Tempo per completare l'animazione di entrata
      
      return () => clearTimeout(timer)
    } else {
      setAnimationPhase('exiting')
    }
  }, [isVisible])

  // Genera varianti di animazione per Framer Motion
  const getAnimationVariants = (index: number) => {
    const baseDelay = index * 0.1
    const position = positions[index]
    
    if (!position) {
      return {
        initial: { scale: 0, opacity: 0, rotate: -180 },
        animate: { scale: 0, opacity: 0, rotate: 0 },
        exit: { scale: 0, opacity: 0, rotate: 180 }
      }
    }

    return {
      initial: {
        scale: 0,
        opacity: 0,
        rotate: -180,
        x: position.x,
        y: position.y
      },
      animate: {
        scale: 1,
        opacity: 1,
        rotate: 0,
        x: position.x,
        y: position.y,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
          delay: baseDelay
        }
      },
      exit: {
        scale: 0,
        opacity: 0,
        rotate: 180,
        transition: {
          duration: 0.2,
          delay: (totalIcons - index - 1) * 0.05 // Animazione di uscita inversa
        }
      },
      hover: {
        scale: 1.2,
        zIndex: 20,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 15
        }
      },
      tap: {
        scale: 0.95
      }
    }
  }

  return {
    positions,
    animationPhase,
    getAnimationVariants
  }
}