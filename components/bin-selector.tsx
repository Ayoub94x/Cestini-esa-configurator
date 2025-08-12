"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useConfigStore } from "@/hooks/use-config-store"
import { bins, binModels } from "@/lib/data"
import { Image } from "./image"
import { ArrowLeft, CheckCircle2, ArrowRight, Package } from "lucide-react"

export function BinSelector() {
  const { selectBin, selectedBin, selectedModelId, setStep } = useConfigStore()

  const model = binModels.find((m) => m.id === selectedModelId)
  const binsForModel = bins.filter((b) => b.modelId === selectedModelId)

  if (!model) return null // Should not happen

  return (
    <div id="step-2" className="scroll-mt-24 max-w-6xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="mb-8 sm:mb-12">
        {/* Back Button with improved styling */}
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setStep("model_selection")} 
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
              2
            </div>
            <span className="text-sm font-medium text-primary">Secondo passo</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
            Scegli la volumetria per <span className="text-primary">{model.name}</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Seleziona la capacità più adatta alle tue esigenze specifiche e al volume di rifiuti previsto.
          </p>
        </div>
      </div>

      {/* Enhanced Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {binsForModel.map((bin, index) => {
          const isSelected = selectedBin?.size === bin.size
          
          return (
            <motion.div
              key={`${bin.name}-${bin.size}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring", 
                stiffness: 100 
              }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="group"
            >
              <Card
                className={`relative h-full border-2 transition-all duration-300 overflow-hidden bg-card/50 backdrop-blur-sm group-hover:shadow-xl ${
                  isSelected 
                    ? "border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10" 
                    : "border-border/50 hover:border-primary/30 hover:shadow-primary/5"
                }`}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center z-10">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                
                {/* Card Header with enhanced styling */}
                <CardHeader className="pb-4 text-center">
                  <CardTitle className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
                    isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
                  }`}>
                    <div className="flex items-center justify-center gap-2">
                      <Package className="w-6 h-6" />
                      {bin.size} Litri
                    </div>
                  </CardTitle>
                  <CardDescription className="text-sm font-medium text-muted-foreground">
                    Capacità di stoccaggio
                  </CardDescription>
                </CardHeader>
                
                {/* Enhanced Image Container */}
                <CardContent className="flex-1 flex flex-col items-center gap-4 sm:gap-6 p-6">
                  <div className="relative w-full max-w-[160px] aspect-square flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                      isSelected 
                        ? "bg-gradient-to-br from-primary/10 to-primary/20 opacity-100" 
                        : "bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100"
                    }`} />
                    <Image 
                      src={bin.baseImage || "/placeholder.svg"} 
                      alt={`Cestino da ${bin.size} litri`} 
                      width={160} 
                      height={160} 
                      sizes="(max-width: 640px) 50vw, 160px" 
                      className={`relative z-10 w-auto h-full max-h-[140px] object-contain transition-transform duration-300 ${
                        isSelected ? "scale-105" : "group-hover:scale-105"
                      }`} 
                    />
                  </div>
                  
                  {/* Enhanced Price Display */}
                  <div className="text-center space-y-2">
                    <div className={`text-3xl sm:text-4xl font-bold transition-colors duration-300 ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}>
                      {bin.basePrice.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                      IVA esclusa • Prezzo base
                    </p>
                    
                    {/* Additional info */}
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Produzione: {bin.prodDays} giorni</span>
                        <span>Max/camion: {bin.maxPerTruck}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                {/* Enhanced CTA Button */}
                <CardFooter className="p-6 pt-4">
                  <Button
                    className={`w-full h-12 text-base font-semibold group/btn relative overflow-hidden transition-all duration-300 ${
                      isSelected 
                        ? "bg-primary hover:bg-primary/90" 
                        : "hover:bg-primary hover:text-primary-foreground"
                    }`}
                    onClick={() => selectBin(bin)}
                    variant={isSelected ? "default" : "outline"}
                  >
                    <span className="flex items-center justify-center gap-2 transition-transform duration-200 group-hover/btn:translate-x-1">
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Selezionato
                          <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                        </>
                      ) : (
                        <>
                          <Package className="w-5 h-5" />
                          Seleziona capacità
                          <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                        </>
                      )}
                    </span>
                  </Button>
                </CardFooter>
                
                {/* Subtle hover indicator */}
                {!isSelected && (
                  <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Card>
            </motion.div>
          )
        })}
      </div>
      
      {/* Additional info section */}
      <div className="mt-12 sm:mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          Non sei sicuro della capacità giusta? 
          <span className="text-primary font-medium cursor-pointer hover:underline ml-1">
            Consulta la nostra guida alla scelta
          </span>
        </p>
      </div>
    </div>
  )
}
