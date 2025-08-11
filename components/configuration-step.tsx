"use client"

import { useConfigStore } from "@/hooks/use-config-store"
import { options, bins } from "@/lib/data"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BinPreview2D } from "@/components/bin-preview-2d"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

function ColorSelector() {
  const { color, setColor, isColorOptionActive, toggleColorOption } = useConfigStore()
  const colorOptionData = options.find((opt) => opt.code === "color")

  if (!colorOptionData) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Colore</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox id="color-toggle" checked={isColorOptionActive} onCheckedChange={toggleColorOption} />
            <Label htmlFor="color-toggle" className="text-sm font-medium text-gray-800">
              {colorOptionData.label}
            </Label>
          </div>
          <span className="text-sm font-semibold text-gray-600">+{colorOptionData.price}%</span>
        </div>
        {isColorOptionActive && (
          <div className="mt-4 flex items-center gap-4">
            <Label htmlFor="color-picker">Scegli un colore:</Label>
            <Input
              id="color-picker"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 p-1"
            />
          </div>
        )}
      </CardContent>
    </Card>
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
    <div>
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={handleGoBack} className="mr-4 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">3. Configura il tuo {selectedBin.name}</h1>
          <p className="text-gray-600">Scegli gli optional. Le icone appariranno sull&apos;anteprima.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <ColorSelector />
          <div>
            <Label className="font-semibold text-gray-700 text-lg">Optional Aggiuntivi</Label>
            <div className="space-y-3 mt-2 max-h-[45vh] overflow-y-auto pr-2">
              {options.map((option) => {
                if (option.code === "color") return null

                const isAvailable = !option.availableFor || option.availableFor.includes(selectedBin.size)
                const isChecked = !!selectedOptions[option.code]

                return (
                  <TooltipProvider key={option.code} delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${!isAvailable ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                        >
                          <Checkbox
                            id={option.code}
                            checked={isChecked}
                            onCheckedChange={() => isAvailable && toggleOption(option.code)}
                            disabled={!isAvailable}
                          />
                          <Label
                            htmlFor={option.code}
                            className={`flex-1 text-sm font-medium ${!isAvailable ? "text-gray-400" : "text-gray-800"}`}
                          >
                            {option.label}
                          </Label>
                          <span className="text-sm font-semibold text-gray-600">
                            +{option.price.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                          </span>
                        </div>
                      </TooltipTrigger>
                      {!isAvailable && (
                        <TooltipContent>
                          <p>Non disponibile per questa capacità</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 min-h-[70vh] flex items-center justify-center">
          <BinPreview2D />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={() => setStep("quantity")} size="lg">
          Avanti
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
