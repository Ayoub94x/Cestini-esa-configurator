"use client"

import React from "react"
import type { LucideProps } from "lucide-react"
import { cn } from "@/lib/utils"

// Icona per colorazione personalizzata
export const ColorIcon: React.FC<LucideProps> = ({ className, size = 24, ...rest }) => (
  <svg
    width={typeof size === "number" ? size : 24}
    height={typeof size === "number" ? size : 24}
    viewBox="0 0 24 24"
    fill="none"
    className={cn("text-current", className)}
    {...rest}
  >
    {/* Cerchio semplice per il colore */}
    <circle cx="12" cy="12" r="10" fill="currentColor" />
  </svg>
)

// Icona per materiale ignifugo
export const FireResistantIcon: React.FC<LucideProps> = ({ className, size = 24, ...rest }) => (
  <svg
    width={typeof size === "number" ? size : 24}
    height={typeof size === "number" ? size : 24}
    viewBox="0 0 24 24"
    fill="none"
    className={cn("text-current", className)}
    {...rest}
  >
    <path
      d="M12 2L8 8h8l-4-6z"
      fill="currentColor"
      opacity="0.8"
    />
    <rect x="10" y="8" width="4" height="12" rx="2" fill="currentColor" />
    <circle cx="12" cy="14" r="2" fill="white" opacity="0.9" />
    <path
      d="M6 22h12M9 22v-2M15 22v-2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

// Icona per illuminazione LED
export const LightIcon: React.FC<LucideProps> = ({ className, size = 24, ...rest }) => (
  <svg
    width={typeof size === "number" ? size : 24}
    height={typeof size === "number" ? size : 24}
    viewBox="0 0 24 24"
    fill="none"
    className={cn("text-current", className)}
    {...rest}
  >
    <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.9" />
    <path
      d="M12 2v2M12 20v2M22 12h-2M4 12H2M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41M19.07 19.07l-1.41-1.41M6.34 6.34L4.93 4.93"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

// Icona per posacenere
export const AshtrayIcon: React.FC<LucideProps> = ({ className, size = 24, ...rest }) => (
  <svg
    width={typeof size === "number" ? size : 24}
    height={typeof size === "number" ? size : 24}
    viewBox="0 0 24 24"
    fill="none"
    className={cn("text-current", className)}
    {...rest}
  >
    <ellipse cx="12" cy="18" rx="8" ry="4" fill="currentColor" opacity="0.8" />
    <ellipse cx="12" cy="16" rx="8" ry="2" fill="currentColor" />
    <rect x="6" y="12" width="2" height="6" rx="1" fill="currentColor" opacity="0.6" />
    <rect x="16" y="10" width="2" height="8" rx="1" fill="currentColor" opacity="0.6" />
    <circle cx="7" cy="8" r="1" fill="currentColor" opacity="0.4" />
    <circle cx="17" cy="6" r="1" fill="currentColor" opacity="0.4" />
  </svg>
)

// Icona per limitatore rifiuti
export const WasteLimiterIcon: React.FC<LucideProps> = ({ className, size = 24, ...rest }) => (
  <svg
    width={typeof size === "number" ? size : 24}
    height={typeof size === "number" ? size : 24}
    viewBox="0 0 24 24"
    fill="none"
    className={cn("text-current", className)}
    {...rest}
  >
    <rect x="6" y="8" width="12" height="12" rx="2" fill="currentColor" opacity="0.8" />
    <rect x="8" y="6" width="8" height="4" rx="1" fill="currentColor" />
    <path
      d="M12 12v4M10 14h4"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M9 4L12 2l3 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Icona per rete anti-volatili
export const BirdNetIcon: React.FC<LucideProps> = ({ className, size = 24, ...rest }) => (
  <svg
    width={typeof size === "number" ? size : 24}
    height={typeof size === "number" ? size : 24}
    viewBox="0 0 24 24"
    fill="none"
    className={cn("text-current", className)}
    {...rest}
  >
    <path
      d="M3 8h18M3 12h18M3 16h18M8 4v16M12 4v16M16 4v16"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity="0.7"
    />
    <path
      d="M6 6c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M14 18c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"
      fill="currentColor"
      opacity="0.9"
    />
  </svg>
)

// Icona per scomparto deiezioni canine
export const DogCompartmentIcon: React.FC<LucideProps> = ({ className, size = 24, ...rest }) => (
  <svg
    width={typeof size === "number" ? size : 24}
    height={typeof size === "number" ? size : 24}
    viewBox="0 0 24 24"
    fill="none"
    className={cn("text-current", className)}
    {...rest}
  >
    <path
      d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="9" cy="9" r="1" fill="currentColor" />
    <circle cx="15" cy="9" r="1" fill="currentColor" />
    <path
      d="M12 13c1 0 2 1 2 2v5H10v-5c0-1 1-2 2-2z"
      fill="currentColor"
      opacity="0.8"
    />
    <ellipse cx="12" cy="21" rx="6" ry="1" fill="currentColor" opacity="0.4" />
  </svg>
)

// Icona per sensore riempimento
export const FillSensorIcon: React.FC<LucideProps> = ({ className, size = 24, ...rest }) => (
  <svg
    width={typeof size === "number" ? size : 24}
    height={typeof size === "number" ? size : 24}
    viewBox="0 0 24 24"
    fill="none"
    className={cn("text-current", className)}
    {...rest}
  >
    <rect x="8" y="6" width="8" height="12" rx="2" fill="currentColor" opacity="0.8" />
    <rect x="9" y="8" width="6" height="2" rx="1" fill="white" opacity="0.9" />
    <rect x="9" y="11" width="6" height="2" rx="1" fill="white" opacity="0.7" />
    <rect x="9" y="14" width="6" height="2" rx="1" fill="white" opacity="0.5" />
    <circle cx="12" cy="4" r="2" fill="currentColor" />
    <path
      d="M10 4h4M12 2v4"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

// Icona per placca personalizzazione
export const CustomPlateIcon: React.FC<LucideProps> = ({ className, size = 24, ...rest }) => (
  <svg
    width={typeof size === "number" ? size : 24}
    height={typeof size === "number" ? size : 24}
    viewBox="0 0 24 24"
    fill="none"
    className={cn("text-current", className)}
    {...rest}
  >
    <rect x="4" y="8" width="16" height="8" rx="2" fill="currentColor" opacity="0.8" />
    <rect x="6" y="10" width="4" height="1" rx="0.5" fill="white" opacity="0.9" />
    <rect x="6" y="12" width="6" height="1" rx="0.5" fill="white" opacity="0.7" />
    <rect x="6" y="14" width="5" height="1" rx="0.5" fill="white" opacity="0.5" />
    <circle cx="16" cy="12" r="2" fill="white" opacity="0.3" />
    <circle cx="16" cy="12" r="1" fill="currentColor" />
  </svg>
)

// Icona per tag UHF
export const UHFTagIcon: React.FC<LucideProps> = ({ className, size = 24, ...rest }) => (
  <svg
    width={typeof size === "number" ? size : 24}
    height={typeof size === "number" ? size : 24}
    viewBox="0 0 24 24"
    fill="none"
    className={cn("text-current", className)}
    {...rest}
  >
    <rect x="6" y="9" width="12" height="6" rx="1" fill="currentColor" opacity="0.8" />
    <rect x="8" y="11" width="8" height="2" rx="0.5" fill="white" opacity="0.9" />
    <path
      d="M4 12c0-4 2-6 4-6M20 12c0-4-2-6-4-6M4 12c0 4 2 6 4 6M20 12c0 4-2 6 4 6"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      opacity="0.6"
    />
  </svg>
)

// Icona per gancio adattatore palo
export const PoleHookIcon: React.FC<LucideProps> = ({ className, size = 24, ...rest }) => (
  <svg
    width={typeof size === "number" ? size : 24}
    height={typeof size === "number" ? size : 24}
    viewBox="0 0 24 24"
    fill="none"
    className={cn("text-current", className)}
    {...rest}
  >
    <rect x="11" y="2" width="2" height="16" fill="currentColor" opacity="0.8" />
    <path
      d="M8 18c0-2 1.5-4 4-4s4 2 4 4v2c0 1-1 2-2 2h-4c-1 0-2-1-2-2v-2z"
      fill="currentColor"
    />
    <circle cx="12" cy="6" r="2" fill="currentColor" />
    <path
      d="M10 6h4"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
)

// Mappa delle icone personalizzate
export const customIcons = {
  color: ColorIcon,
  v0: FireResistantIcon,
  light: LightIcon,
  ashtray: AshtrayIcon,
  waste_limiter: WasteLimiterIcon,
  bird_net: BirdNetIcon,
  dog_compartment: DogCompartmentIcon,
  fill_sensor: FillSensorIcon,
  custom_plate: CustomPlateIcon,
  uhf_tag: UHFTagIcon,
  pole_hook: PoleHookIcon,
} as const

export type CustomIconKey = keyof typeof customIcons