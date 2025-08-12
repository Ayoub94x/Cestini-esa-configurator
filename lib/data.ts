import type { LucideProps } from "lucide-react"
import type { ComponentType } from "react"

import {
  ColorIcon,
  FireResistantIcon,
  LightIcon,
  AshtrayIcon,
  WasteLimiterIcon,
  BirdNetIcon,
  DogCompartmentIcon,
  FillSensorIcon,
  CustomPlateIcon,
  UHFTagIcon,
  PoleHookIcon,
} from "@/components/ui/custom-icons"

// URLs for the model images (invertite su richiesta)
const BRANCA_IMAGE_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-23xp1zJBLi1vGhQ9clKBP2RrGmVaHE.png" // Immagine esagonale
const CESTO_IMAGE_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RKer55S6HScORQ4MMOmdGBc6Q9EZrj.png" // Immagine ornamentale
const CITY_IMAGE_URL =
  "/images/city_model.png" // Immagine modello CITY

export type BinSize = "50/60" | "80" | "110"
export type BinModelId = "branca" | "cesto" | "city"

export interface BinModel {
  id: BinModelId
  name: string
  image: string
}

export interface Option {
  code: string
  label: string
  price: number
  percentage?: boolean
  icon?: ComponentType<LucideProps>
  availableFor?: BinSize[]
}

export interface Bin {
  size: BinSize
  modelId: BinModelId
  name: string
  basePrice: number
  prodDays: number
  baseImage: string
  maxPerTruck: number
}

// Define the models
export const binModels: BinModel[] = [
  { id: "branca", name: "BRANCA", image: BRANCA_IMAGE_URL },
  { id: "cesto", name: "CeStò", image: CESTO_IMAGE_URL },
  { id: "city", name: "CITY", image: CITY_IMAGE_URL },
]

// Define all available bins, linked to a model
export const bins: Bin[] = [
  // BRANCA Model (ora con 3 volumi)
  {
    size: "50/60",
    modelId: "branca",
    name: "BRANCA",
    basePrice: 300, // Prezzo stimato
    prodDays: 180,
    baseImage: BRANCA_IMAGE_URL,
    maxPerTruck: 125,
  },
  {
    size: "80",
    modelId: "branca",
    name: "BRANCA",
    basePrice: 360, // Prezzo stimato
    prodDays: 180,
    baseImage: BRANCA_IMAGE_URL,
    maxPerTruck: 88,
  },
  {
    size: "110",
    modelId: "branca",
    name: "BRANCA",
    basePrice: 420, // Prezzo stimato
    prodDays: 90,
    baseImage: BRANCA_IMAGE_URL,
    maxPerTruck: 88,
  },
  // CeStò Model (multiple volumes)
  {
    size: "50/60",
    modelId: "cesto",
    name: "CeStò",
    basePrice: 253,
    prodDays: 180,
    baseImage: CESTO_IMAGE_URL,
    maxPerTruck: 125,
  },
  {
    size: "80",
    modelId: "cesto",
    name: "CeStò",
    basePrice: 329,
    prodDays: 180,
    baseImage: CESTO_IMAGE_URL,
    maxPerTruck: 88,
  },
  {
    size: "110",
    modelId: "cesto",
    name: "CeStò",
    basePrice: 383,
    prodDays: 90,
    baseImage: CESTO_IMAGE_URL,
    maxPerTruck: 88,
  },
  // CITY model variants
  {
    size: "50/60",
    modelId: "city",
    name: "CITY",
    basePrice: 300,
    prodDays: 180,
    baseImage: CITY_IMAGE_URL,
    maxPerTruck: 125,
  },
  {
    size: "80",
    modelId: "city",
    name: "CITY",
    basePrice: 360,
    prodDays: 180,
    baseImage: CITY_IMAGE_URL,
    maxPerTruck: 88,
  },
  {
    size: "110",
    modelId: "city",
    name: "CITY",
    basePrice: 420,
    prodDays: 90,
    baseImage: CITY_IMAGE_URL,
    maxPerTruck: 88,
  },
]

export const options: Option[] = [
  { code: "color", label: "Colorazione personalizzata", price: 5, percentage: true, icon: ColorIcon },
  { code: "v0", label: "Materiale plastico ignifugo (Classe V0)", price: 80, icon: FireResistantIcon },
  { code: "light", label: "Illuminazione LED", price: 65, icon: LightIcon },
  { code: "ashtray", label: "Posacenere", price: 45, icon: AshtrayIcon },
  { code: "waste_limiter", label: "Limitatore di conferimento rifiuti", price: 15, icon: WasteLimiterIcon },
  { code: "bird_net", label: "Rete anti-volatili", price: 65, icon: BirdNetIcon },
  { code: "dog_compartment", label: "Scomp. deiezioni canine", price: 48, icon: DogCompartmentIcon },
  { code: "fill_sensor", label: "Sensore riempimento (no SIM)", price: 185, icon: FillSensorIcon },
  { code: "custom_plate", label: "Placca personalizzazione", price: 15, icon: CustomPlateIcon },
  { code: "uhf_tag", label: "Tag UHF", price: 3.5, icon: UHFTagIcon },
  {
    code: "pole_hook",
    label: "Gancio adatt. palo",
    price: 40,
    availableFor: ["50/60"],
    icon: PoleHookIcon,
  },
]
