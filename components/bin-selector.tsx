"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useConfigStore } from "@/hooks/use-config-store"
import { bins, binModels } from "@/lib/data"
import { Image } from "./image"
import { ArrowLeft } from "lucide-react"

export function BinSelector() {
  const { selectBin, selectedBin, selectedModelId, setStep } = useConfigStore()

  const model = binModels.find((m) => m.id === selectedModelId)
  const binsForModel = bins.filter((b) => b.modelId === selectedModelId)

  if (!model) return null // Should not happen

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => setStep("model_selection")} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">2. Scegli la volumetria per {model.name}</h1>
          <p className="text-gray-600">Seleziona la capacità più adatta alle tue esigenze.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {binsForModel.map((bin) => (
          <motion.div
            key={`${bin.name}-${bin.size}`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card
              className={`transition-all duration-300 flex flex-col h-full ${selectedBin?.size === bin.size ? "border-primary ring-2 ring-primary" : "border-gray-200"}`}
            >
              <CardHeader>
                <CardTitle>{bin.size} Litri</CardTitle>
                <CardDescription>Prezzo base</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center gap-6">
                <Image src={bin.baseImage || "/placeholder.svg"} alt={`Cestino da ${bin.size} litri`} width={150} height={150} className="w-32 h-auto object-contain" />
                <div className="flex-1 text-center">
                  <p className="text-4xl font-bold text-gray-800">
                    {bin.basePrice.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">IVA esclusa</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => selectBin(bin)}
                  variant={selectedBin?.size === bin.size ? "default" : "outline"}
                >
                  {selectedBin?.size === bin.size ? "Selezionato" : "Configura"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
