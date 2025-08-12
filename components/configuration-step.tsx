"use client"

import { useConfigStore } from "@/hooks/use-config-store"
import { options, bins } from "@/lib/data"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BinPreview2D } from "@/components/bin-preview-2d"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Palette, Settings, CheckCircle2, Plus } from "lucide-react"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { motion } from "framer-motion"

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

function ColorSelector() {
  const { color, setColor, isColorOptionActive, toggleColorOption } = useConfigStore()
  const colorOptionData = options.find((opt) => opt.code === "color")

  if (!colorOptionData) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-primary/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Personalizzazione Colore
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <Checkbox 
                id="color-toggle" 
                checked={isColorOptionActive} 
                onCheckedChange={toggleColorOption}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
              />
              <Label htmlFor="color-toggle" className="text-sm font-medium text-foreground cursor-pointer">
                {colorOptionData.label}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">+{colorOptionData.price}%</span>
            </div>
          </div>
          
          {isColorOptionActive && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-2 border-t border-border/50"
            >
              <div className="flex items-center gap-4">
                <Label htmlFor="color-picker" className="text-sm font-medium text-foreground">
                  Scegli il tuo colore:
                </Label>
                <div className="relative">
                  <Input
                    id="color-picker"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-16 h-10 p-1 border-2 border-border hover:border-primary transition-colors duration-200 cursor-pointer"
                  />
                  <div 
                    className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
                    style={{ 
                      backgroundColor: color,
                      border: `2px solid ${getContrastBorder(color)}`,
                      boxShadow: `0 4px 12px ${color}20, inset 0 1px 0 rgba(255,255,255,0.2)`
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function ConfigurationStep() {
  const { selectedBin, selectedOptions, toggleOption, setStep, selectedModelId } = useConfigStore()

  if (!selectedBin) return null

  const handleGoBack = () => {
    // If the model has multiple volumes, go back to volume selection. Otherwise, go back to model selection.
    const binsForModel = bins.filter((b) => b.modelId === selectedModelId)
    if (binsForModel.length > 1) {
      setStep("selection")
    } else {
      setStep("model_selection")
    }
  }

  return (
    <div id="step-3" className="scroll-mt-24 max-w-7xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="mb-8 sm:mb-12">
        {/* Back Button with improved styling */}
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGoBack} 
            className="mr-4 h-10 px-4 hover:bg-primary/5 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Indietro
          </Button>
        </div>
        
        {/* Header content with improved typography */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full mb-4">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <span className="text-sm font-medium text-primary">Terzo passo</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
            Configura il tuo <span className="text-primary">{selectedBin.name}</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Personalizza il tuo cestino con colori e optional aggiuntivi. Visualizza l'anteprima in tempo reale.
          </p>
        </div>
      </div>

      {/* Enhanced Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-1 space-y-6">
          <ColorSelector />
          
          {/* Enhanced Optional Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-primary/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Optional Aggiuntivi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  {options.map((option, index) => {
                    if (option.code === "color") return null

                    const isAvailable = !option.availableFor || option.availableFor.includes(selectedBin.size)
                    const isChecked = !!selectedOptions[option.code]

                    return (
                      <motion.div
                        key={option.code}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`group flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                                  !isAvailable 
                                    ? "opacity-50 cursor-not-allowed border-border/30 bg-muted/20" 
                                    : isChecked
                                    ? "border-primary/50 bg-primary/5 shadow-sm shadow-primary/10"
                                    : "border-border/30 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
                                }`}
                                onClick={() => isAvailable && toggleOption(option.code)}
                              >
                                <Checkbox
                                  id={option.code}
                                  checked={isChecked}
                                  onCheckedChange={() => isAvailable && toggleOption(option.code)}
                                  disabled={!isAvailable}
                                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <Label
                                  htmlFor={option.code}
                                  className={`flex-1 text-sm font-medium cursor-pointer transition-colors duration-200 ${
                                    !isAvailable 
                                      ? "text-muted-foreground" 
                                      : isChecked
                                      ? "text-primary font-semibold"
                                      : "text-foreground group-hover:text-primary"
                                  }`}
                                >
                                  {option.label}
                                </Label>
                                <div className="flex items-center gap-1">
                                  {isChecked && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                  <span className={`text-sm font-semibold transition-colors duration-200 ${
                                    isChecked ? "text-primary" : "text-muted-foreground"
                                  }`}>
                                    +{option.price.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                                  </span>
                                </div>
                              </div>
                            </TooltipTrigger>
                            {!isAvailable && (
                              <TooltipContent>
                                <p>Non disponibile per questa capacità</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Preview Section */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center"
          >
            <Card className="w-full h-full border-2 border-border/50 bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6 h-full flex items-center justify-center">
                <BinPreview2D />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 sm:mt-12 flex justify-center"
      >
        <Button 
          onClick={() => setStep("quantity")} 
          size="lg"
          className="h-12 px-8 text-base font-semibold group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
        >
          <span className="flex items-center gap-2 transition-transform duration-200 group-hover:translate-x-1">
            Procedi alla quantità
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </Button>
      </motion.div>
      
      {/* Additional info section */}
      <div className="mt-8 sm:mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Hai bisogno di aiuto con la configurazione? 
          <span className="text-primary font-medium cursor-pointer hover:underline ml-1">
            Contatta il nostro supporto tecnico
          </span>
        </p>
      </div>
    </div>
  )
}
