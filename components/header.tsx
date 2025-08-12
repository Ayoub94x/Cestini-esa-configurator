"use client"

import { usePriceCalculation } from "@/hooks/use-price-calculation"
import { useConfigStore } from "@/hooks/use-config-store"
import { AnimatePresence, motion } from "framer-motion"
import { Image } from "./image"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

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
          <p className="font-semibold text-foreground">
            {selectedBin.name} {selectedBin.size}L
          </p>
          <p className="text-sm text-muted-foreground -mt-1">Prezzo Configurazione</p>
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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center">
        <div className="flex items-center gap-3 min-w-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden mr-1" aria-label="Apri menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="p-4 space-y-2 text-sm">
                <a href="#step-1" className="block py-2 px-2 rounded hover:bg-accent">Selezione modello</a>
                <a href="#step-2" className="block py-2 px-2 rounded hover:bg-accent">Volumetria</a>
                <a href="#step-3" className="block py-2 px-2 rounded hover:bg-accent">Configurazione</a>
                <a href="#step-4" className="block py-2 px-2 rounded hover:bg-accent">Quantità e PDF</a>
              </nav>
            </SheetContent>
          </Sheet>
          <Image src={LOGO_URL || "/placeholder.svg"} alt="Logo ESA Waste Solutions" width={160} height={50} className="h-8 sm:h-10 w-auto" />
          <span className="truncate font-semibold text-base sm:text-lg text-foreground/80 hidden sm:inline">Configuratore Cestini</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <PriceDisplay />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
