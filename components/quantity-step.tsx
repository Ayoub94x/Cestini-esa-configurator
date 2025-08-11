"use client"

import { useConfigStore } from "@/hooks/use-config-store"
import { usePriceCalculation } from "@/hooks/use-price-calculation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, Calendar } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuoteDialog } from "./quote-dialog"
import Image from "next/image"

export function QuantityStep() {
  const { selectedBin, quantity, setQuantity, setStep } = useConfigStore()
  const { totalPrice, productionDays, isTruckCapacityExceeded, truckCapacity, priceBreakdown } = usePriceCalculation()

  if (!selectedBin || !priceBreakdown) return null

  const unitPrice = priceBreakdown.total / quantity

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => setStep("configuration")} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">3. Riepilogo e Quantità</h1>
          <p className="text-gray-600">Definisci la quantità e scarica il tuo preventivo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Riepilogo Configurazione</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Image
                src={selectedBin.baseImage || "/placeholder.svg"}
                alt={`${selectedBin.name} ${selectedBin.size}L`}
                width={80}
                height={80}
                className="rounded-md bg-gray-100 p-1 object-contain"
                unoptimized
              />
              <div>
                <p className="font-bold text-lg">
                  Cestino {selectedBin.name} {selectedBin.size}L
                </p>
                <p className="text-sm text-gray-500">Prezzo unitario configurato</p>
                <p className="font-semibold text-xl">
                  {unitPrice.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Tempi di produzione: <strong>{productionDays} giorni</strong>
                </span>
              </div>
              {/* La riga del trasporto è stata rimossa */}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div>
            <Label htmlFor="quantity" className="font-semibold text-gray-700 text-lg">
              Quantità
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="50"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value, 10) || 1)}
              className="mt-2 w-32 text-lg p-2"
            />
            {isTruckCapacityExceeded && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Attenzione: Più viaggi necessari</AlertTitle>
                <AlertDescription>
                  La quantità ({quantity}) supera la capienza del camion ({truckCapacity} pz).
                </AlertDescription>
              </Alert>
            )}
          </div>
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <p className="text-lg font-semibold text-gray-700">Prezzo Totale Finale</p>
              <p className="text-5xl font-bold text-primary">
                {totalPrice.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
              </p>
              <p className="text-sm text-gray-500">IVA esclusa</p>
            </CardContent>
          </Card>
          <QuoteDialog />
        </div>
      </div>
    </div>
  )
}
