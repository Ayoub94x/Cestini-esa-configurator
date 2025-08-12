"use client"

import { useState, useEffect } from "react"
import { useConfigStore } from "@/hooks/use-config-store"
import { usePriceCalculation } from "@/hooks/use-price-calculation"
import { options as allOptions } from "@/lib/data"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  AlertCircle, 
  ArrowLeft, 
  Calendar, 
  Minus, 
  Plus, 
  Truck, 
  Info, 
  Package,
  Euro,
  Clock,
  Zap,
  TrendingUp,
  ShoppingCart
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuoteDialog } from "./quote-dialog"
import { Image } from "./image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function QuantityStep() {
  const { selectedBin, quantity, setQuantity, setStep, selectedOptions, isColorOptionActive } = useConfigStore()
  const { totalPrice, productionDays, isTruckCapacityExceeded, truckCapacity, priceBreakdown } = usePriceCalculation()
  const [previousTotal, setPreviousTotal] = useState(0)
  const [showPriceAnimation, setShowPriceAnimation] = useState(false)

  if (!selectedBin || !priceBreakdown) return null

  const unitPrice = priceBreakdown.total / quantity
  const finalPrice = totalPrice

  // Animazione prezzo
  useEffect(() => {
    if (previousTotal !== totalPrice && previousTotal > 0) {
      setShowPriceAnimation(true)
      const timer = setTimeout(() => setShowPriceAnimation(false), 600)
      return () => clearTimeout(timer)
    }
    setPreviousTotal(totalPrice)
  }, [totalPrice, previousTotal])

  // Controlli quantità avanzati
  const handleQuantityChange = (newQuantity: number) => {
    const clampedQuantity = Math.max(1, Math.min(50, newQuantity))
    setQuantity(clampedQuantity)
  }

  const quickQuantities = [1, 5, 10, 20, 30]

  // Filtra opzioni selezionate
  const selectedOptionsList = []
  
  if (isColorOptionActive) {
    const colorOption = allOptions.find(opt => opt.code === "color")
    if (colorOption) selectedOptionsList.push(colorOption)
  }
  
  for (const optionCode in selectedOptions) {
    if (selectedOptions[optionCode]) {
      const option = allOptions.find(opt => opt.code === optionCode)
      if (option) {
        const isAvailable = !option.availableFor || option.availableFor.includes(selectedBin.size)
        if (isAvailable) selectedOptionsList.push(option)
      }
    }
  }

  return (
    <div id="step-4" className="scroll-mt-24 max-w-7xl mx-auto">
      {/* Header con navigazione */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center mb-8"
      >
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setStep("configuration")} 
          className="mr-4 hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Riepilogo e Quantità
          </h1>
          <p className="text-muted-foreground text-lg">
            Rivedi la tua configurazione e definisci la quantità desiderata
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Sezione Riepilogo Dettagliato */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="xl:col-span-2 space-y-6"
        >
          {/* Card Prodotto Principale */}
          <Card className="overflow-hidden border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-4">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">Configurazione Prodotto</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Image 
                    src={selectedBin.baseImage || "/placeholder.svg"} 
                    alt={`${selectedBin.name} ${selectedBin.size}L`} 
                    width={120} 
                    height={120} 
                    sizes="120px" 
                    className="rounded-xl bg-muted p-2 object-contain border-2 border-border" 
                  />
                  <Badge className="absolute -top-2 -right-2 bg-primary text-white">
                    {selectedBin.size}L
                  </Badge>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      Cestino {selectedBin.name}
                    </h3>
                    <p className="text-muted-foreground">Modello {selectedBin.size} Litri</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Euro className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">Prezzo base:</span>
                      <span className="font-semibold">
                        {selectedBin.basePrice.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-muted-foreground">Produzione:</span>
                      <span className="font-semibold">{productionDays} giorni</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-orange-600" />
                      <span className="text-muted-foreground">Max/camion:</span>
                      <span className="font-semibold">{truckCapacity} pz</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Opzioni Selezionate */}
          {selectedOptionsList.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle>Opzioni Selezionate</CardTitle>
                  <Badge variant="secondary">{selectedOptionsList.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {selectedOptionsList.map((option, index) => {
                    const optionPrice = option.percentage 
                      ? selectedBin.basePrice * (option.price / 100)
                      : option.price
                    
                    return (
                      <motion.div
                        key={option.code}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/60 border"
                      >
                        <div className="flex items-center gap-3">
                          {option.icon && <option.icon className="h-5 w-5 text-primary" />}
                          <div>
                            <p className="font-medium text-foreground">{option.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {option.percentage ? `+${option.price}%` : `+€${option.price}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            +{optionPrice.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                          </p>
                          <p className="text-xs text-muted-foreground">per unità</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card Dettaglio Prezzi */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Dettaglio Prezzi</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {priceBreakdown.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.unitPrice.toLocaleString("it-IT", { style: "currency", currency: "EUR" })} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {item.total.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                    </p>
                  </div>
                ))}
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Subtotale</span>
                  <span>{priceBreakdown.subtotal.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</span>
                </div>
                

              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sezione Controlli Quantità e Totale */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Card Controlli Quantità */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <CardTitle>Quantità</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Controllo quantità principale */}
              <div className="space-y-4">
                <Label className="text-base font-semibold text-foreground/80">
                  Seleziona quantità
                </Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-12 w-12 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value, 10) || 1)}
                    className="text-center text-xl font-bold h-12 w-24"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 50}
                    className="h-12 w-12 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quantità rapide */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">
                  Quantità rapide
                </Label>
                <div className="flex flex-wrap gap-2">
                  {quickQuantities.map((qty) => (
                    <Button
                      key={qty}
                      variant={quantity === qty ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleQuantityChange(qty)}
                      className="min-w-[50px]"
                    >
                      {qty}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Alert capacità camion */}
              <AnimatePresence>
                {isTruckCapacityExceeded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Attenzione: Più viaggi necessari</AlertTitle>
                      <AlertDescription>
                        La quantità ({quantity}) supera la capienza del camion ({truckCapacity} pz).
                        Saranno necessari {Math.ceil(quantity / truckCapacity)} viaggi.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>


            </CardContent>
          </Card>

          {/* Card Prezzo Totale */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground/80">Prezzo Totale</p>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={finalPrice}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        color: showPriceAnimation ? "#10b981" : "#000"
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="text-4xl sm:text-5xl font-bold text-primary"
                    >
                      {finalPrice.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                    </motion.div>
                  </AnimatePresence>
                  <p className="text-sm text-muted-foreground">IVA esclusa</p>
                </div>



                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Prezzo unitario:</span>
                    <span className="font-medium">
                      {unitPrice.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Quantità:</span>
                    <span className="font-medium">{quantity} pz</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pulsante Preventivo */}
          <QuoteDialog />
        </motion.div>
      </div>
    </div>
  )
}
