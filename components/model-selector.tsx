"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useConfigStore } from "@/hooks/use-config-store"
import { binModels } from "@/lib/data"
import { Image } from "./image"

export function ModelSelector() {
  const { selectModel } = useConfigStore()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">1. Scegli il modello di cestino</h1>
      <p className="text-gray-600 mb-6">Seleziona il prodotto che desideri configurare.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {binModels.map((model) => (
          <motion.div
            key={model.id}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="transition-all duration-300 flex flex-col h-full overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl">{model.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center p-6 bg-gray-50">
                <Image src={model.image || "/placeholder.svg"} alt={`Cestino modello ${model.name}`} width={300} height={360} className="w-auto h-80 object-contain" />
              </CardContent>
              <CardFooter className="p-4">
                <Button className="w-full" size="lg" onClick={() => selectModel(model.id)}>
                  Seleziona e configura
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
