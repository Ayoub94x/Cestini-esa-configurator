"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useConfigStore } from "@/hooks/use-config-store"
import { binModels } from "@/lib/data"
import { Image } from "./image"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export function ModelSelector() {
  const { selectModel } = useConfigStore()

  return (
    <div id="step-1" className="scroll-mt-24 max-w-6xl mx-auto">
      {/* Header Section with improved typography and spacing */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full mb-4">
          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <span className="text-sm font-medium text-primary">Primo passo</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
          Scegli il modello di cestino
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Seleziona il prodotto che meglio si adatta alle tue esigenze e inizia la configurazione personalizzata.
        </p>
      </div>

      {/* Models Grid with enhanced layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {binModels.map((model, index) => (
          <motion.div
            key={model.id}
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
            <Card className="relative h-full border-2 border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5">
              {/* Card Header with improved styling */}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl font-bold text-center text-foreground group-hover:text-primary transition-colors duration-300">
                  {model.name}
                </CardTitle>
              </CardHeader>
              
              {/* Image Container with enhanced presentation */}
              <CardContent className="flex-1 flex items-center justify-center p-6 sm:p-8 relative">
                <div className="relative w-full max-w-[280px] aspect-[4/5] flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Image 
                    src={model.image || "/placeholder.svg"} 
                    alt={`Cestino modello ${model.name}`} 
                    width={280} 
                    height={350} 
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 280px" 
                    className="relative z-10 w-auto h-full max-h-[300px] object-contain transition-transform duration-300 group-hover:scale-105" 
                  />
                </div>
              </CardContent>
              
              {/* Enhanced CTA Button */}
              <CardFooter className="p-6 pt-4">
                <Button 
                  className="w-full h-12 text-base font-semibold group/btn relative overflow-hidden" 
                  size="lg" 
                  onClick={() => selectModel(model.id)}
                >
                  <span className="flex items-center justify-center gap-2 transition-transform duration-200 group-hover/btn:translate-x-1">
                    <CheckCircle2 className="w-5 h-5" />
                    Seleziona e configura
                    <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </span>
                </Button>
              </CardFooter>
              
              {/* Subtle hover indicator */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Additional info section */}
      <div className="mt-12 sm:mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          Hai bisogno di aiuto nella scelta? 
          <span className="text-primary font-medium cursor-pointer hover:underline ml-1">
            Contatta il nostro team
          </span>
        </p>
      </div>
    </div>
  )
}
