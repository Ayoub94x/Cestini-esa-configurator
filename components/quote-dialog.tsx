"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useConfigStore } from "@/hooks/use-config-store"
import { usePriceCalculation } from "@/hooks/use-price-calculation"
import { Download, Loader2 } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
// import html2canvas from "html2canvas" // Removed unused import
import { options } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const LOGO_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_ESA-SH0r2i3VZYnYmHs6wymFizOyag967i.png"

type ImageDataResult = { dataUrl: string; width: number; height: number }

// Helper function to load images from URL and get their Data URL and natural size
const getImageDataUrl = (url: string): Promise<ImageDataResult> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const naturalWidth = img.width
      const naturalHeight = img.height
      const canvas = document.createElement("canvas")
      canvas.width = naturalWidth
      canvas.height = naturalHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        resolve({ dataUrl: canvas.toDataURL("image/png"), width: naturalWidth, height: naturalHeight })
      } else {
        reject(new Error("Could not get canvas context"))
      }
    }

    img.onerror = (err) => {
      reject(new Error(`Image loading failed: ${err}`))
    }

    img.src = url
  })
}

// Helper function to draw icons directly in PDF (replicating Lucide React icons)
const drawIconInPdf = (doc: jsPDF, option: { code: string }, x: number, y: number, size: number = 16, color: string = "#374151") => {
  const centerX = x + size / 2
  const centerY = y + size / 2
  const scale = size / 24 // Lucide icons are 24x24 by default

  doc.setDrawColor(color)
  doc.setFillColor(color)
  doc.setLineWidth(1.5 * scale)

  switch (option.code) {
    case "color":
      // Palette icon (simple Lucide style)
      // Main palette shape
      const paletteWidth = 12 * scale
      const paletteHeight = 8 * scale
      const thumbHole = 2 * scale
      
      // Draw palette outline
      doc.roundedRect(centerX - paletteWidth/2, centerY - paletteHeight/2, paletteWidth, paletteHeight, 1 * scale, 1 * scale, "S")
      
      // Thumb hole
      doc.circle(centerX + paletteWidth/3, centerY, thumbHole, "S")
      
      // Color dots
      doc.setFillColor("#ef4444")
      doc.circle(centerX - paletteWidth/3, centerY - paletteHeight/4, 1 * scale, "F")
      doc.setFillColor("#22c55e")
      doc.circle(centerX - paletteWidth/6, centerY - paletteHeight/4, 1 * scale, "F")
      doc.setFillColor("#3b82f6")
      doc.circle(centerX, centerY - paletteHeight/4, 1 * scale, "F")
      break

    case "v0":
      // FlameOff icon (flame with slash)
      // Draw flame shape (approximate polygon via lines)
      const flamePoints = [
        [centerX, centerY - 6 * scale],
        [centerX - 3 * scale, centerY - 2 * scale],
        [centerX - 2 * scale, centerY + 2 * scale],
        [centerX + 2 * scale, centerY + 2 * scale],
        [centerX + 3 * scale, centerY - 2 * scale],
      ]
      for (let i = 0; i < flamePoints.length; i++) {
        const [x1, y1] = flamePoints[i]
        const [x2, y2] = flamePoints[(i + 1) % flamePoints.length]
        doc.line(x1, y1, x2, y2)
      }
      
      // Draw slash line
      doc.setLineWidth(2 * scale)
      doc.line(centerX - 6 * scale, centerY - 6 * scale, centerX + 6 * scale, centerY + 6 * scale)
      break

    case "light":
      // Lightbulb icon (simple bulb shape)
      // Bulb circle
      doc.circle(centerX, centerY - 2 * scale, 4 * scale, "S")
      
      // Base lines
      doc.line(centerX - 2 * scale, centerY + 2 * scale, centerX + 2 * scale, centerY + 2 * scale)
      doc.line(centerX - 2 * scale, centerY + 3 * scale, centerX + 2 * scale, centerY + 3 * scale)
      doc.line(centerX - 1 * scale, centerY + 4 * scale, centerX + 1 * scale, centerY + 4 * scale)
      break

    case "ashtray":
      // Cigarette icon (simple line with tip)
      // Cigarette body
      doc.setLineWidth(2 * scale)
      doc.line(centerX - 6 * scale, centerY, centerX + 6 * scale, centerY)
      
      // Filter tip
      doc.setFillColor("#f59e0b")
      doc.rect(centerX + 4 * scale, centerY - 1 * scale, 2 * scale, 2 * scale, "F")
      
      // Glowing tip
      doc.setFillColor("#ef4444")
      doc.circle(centerX - 6 * scale, centerY, 1 * scale, "F")
      break

    case "waste_limiter":
      // ArrowDownToLine icon
      // Horizontal line at bottom
      doc.setLineWidth(2 * scale)
      doc.line(centerX - 6 * scale, centerY + 6 * scale, centerX + 6 * scale, centerY + 6 * scale)
      
      // Vertical arrow line
      doc.line(centerX, centerY - 6 * scale, centerX, centerY + 4 * scale)
      
      // Arrow head
      doc.line(centerX - 3 * scale, centerY + 1 * scale, centerX, centerY + 4 * scale)
      doc.line(centerX + 3 * scale, centerY + 1 * scale, centerX, centerY + 4 * scale)
      break

    case "bird_net":
      // Bird icon (simple bird silhouette)
      // Bird body
      doc.setLineWidth(1.5 * scale)
      // Body curve
      doc.line(centerX - 4 * scale, centerY, centerX + 2 * scale, centerY)
      
      // Wing
      doc.line(centerX - 2 * scale, centerY, centerX - 1 * scale, centerY - 3 * scale)
      doc.line(centerX - 1 * scale, centerY - 3 * scale, centerX + 1 * scale, centerY - 2 * scale)
      
      // Head and beak
      doc.circle(centerX + 2 * scale, centerY, 1.5 * scale, "S")
      doc.line(centerX + 3.5 * scale, centerY, centerX + 5 * scale, centerY - 1 * scale)
      break

    case "dog_compartment":
      // Dog icon (simple dog silhouette)
      // Dog head
      doc.circle(centerX - 2 * scale, centerY - 1 * scale, 2 * scale, "S")
      
      // Ears
      doc.line(centerX - 3 * scale, centerY - 2 * scale, centerX - 2 * scale, centerY - 4 * scale)
      doc.line(centerX - 1 * scale, centerY - 2 * scale, centerX - 2 * scale, centerY - 4 * scale)
      
      // Body
      doc.ellipse(centerX + 1 * scale, centerY + 1 * scale, 3 * scale, 2 * scale, "S")
      
      // Legs
      doc.line(centerX - 1 * scale, centerY + 2 * scale, centerX - 1 * scale, centerY + 4 * scale)
      doc.line(centerX + 1 * scale, centerY + 2 * scale, centerX + 1 * scale, centerY + 4 * scale)
      doc.line(centerX + 3 * scale, centerY + 2 * scale, centerX + 3 * scale, centerY + 4 * scale)
      
      // Tail
      doc.line(centerX + 4 * scale, centerY, centerX + 6 * scale, centerY - 2 * scale)
      break

    case "fill_sensor":
      // Signal icon (signal bars)
      // Signal bars of increasing height
      const barHeights = [2, 4, 6, 8]
      barHeights.forEach((height, index) => {
        const barX = centerX - 6 * scale + index * 3 * scale
        const barY = centerY + 4 * scale - height * scale
        doc.rect(barX, barY, 2 * scale, height * scale, "F")
      })
      break

    case "custom_plate":
      // BadgeInfo icon (info badge)
      // Circle outline
      doc.circle(centerX, centerY, 6 * scale, "S")
      
      // Info "i" symbol
      doc.setFillColor(color)
      doc.circle(centerX, centerY - 2 * scale, 1 * scale, "F")
      doc.rect(centerX - 0.5 * scale, centerY, 1 * scale, 4 * scale, "F")
      break

    case "uhf_tag":
      // RadioTower icon (radio tower with waves)
      // Tower base
      doc.setLineWidth(2 * scale)
      doc.line(centerX, centerY + 6 * scale, centerX, centerY - 6 * scale)
      
      // Tower cross beams
      doc.line(centerX - 2 * scale, centerY - 2 * scale, centerX + 2 * scale, centerY - 2 * scale)
      doc.line(centerX - 1 * scale, centerY - 4 * scale, centerX + 1 * scale, centerY - 4 * scale)
      
      // Radio waves
      doc.setLineWidth(1 * scale)
      for (let i = 1; i <= 3; i++) {
        const radius = i * 2 * scale
        doc.ellipse(centerX + 4 * scale, centerY - 4 * scale, radius, radius, "S")
      }
      break

    case "pole_hook":
      // Anchor icon (simple anchor shape)
      // Anchor shaft
      doc.setLineWidth(2 * scale)
      doc.line(centerX, centerY - 6 * scale, centerX, centerY + 4 * scale)
      
      // Anchor ring
      doc.circle(centerX, centerY - 6 * scale, 2 * scale, "S")
      
      // Anchor arms
      doc.line(centerX - 4 * scale, centerY + 2 * scale, centerX + 4 * scale, centerY + 2 * scale)
      
      // Anchor flukes
      doc.line(centerX - 4 * scale, centerY + 2 * scale, centerX - 2 * scale, centerY + 4 * scale)
      doc.line(centerX + 4 * scale, centerY + 2 * scale, centerX + 2 * scale, centerY + 4 * scale)
      
      // Fluke tips
      doc.line(centerX - 2 * scale, centerY + 4 * scale, centerX - 3 * scale, centerY + 3 * scale)
      doc.line(centerX + 2 * scale, centerY + 4 * scale, centerX + 3 * scale, centerY + 3 * scale)
      break

    default:
      // Default icon - simple circle
      doc.circle(centerX, centerY, size / 4, "S")
      break
  }
}

export function QuoteDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const { selectedBin, selectedOptions, isColorOptionActive, quantity, color } = useConfigStore()
  const { priceBreakdown } = usePriceCalculation()

  // Optional client data and notes used in the PDF layout (keeps current flow intact)
  const [clientName, setClientName] = useState("")
  const [clientAddress, setClientAddress] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [notes, setNotes] = useState("")

  const handleGeneratePdf = async () => {
    if (!selectedBin || !priceBreakdown) return
    setIsGenerating(true)

    try {
      const doc = new jsPDF("p", "pt", "a4")
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const margin = 48
      const contentWidth = pageWidth - (margin * 2)
      
      // Minimal, sober palette
      const colors = {
        primary: [17, 24, 39] as [number, number, number],      // Near-black text
        secondary: [55, 65, 81] as [number, number, number],    // Dark gray
        accent: [59, 130, 246] as [number, number, number],     // Subtle accent (brand)
        success: [16, 185, 129] as [number, number, number],    // Green for price badges
        light: [249, 250, 251] as [number, number, number],     // Light gray background
        border: [229, 231, 235] as [number, number, number],    // Divider/border
        text: [17, 24, 39] as [number, number, number],         // Body text
        textLight: [107, 114, 128] as [number, number, number]  // Muted text
      }
      
      // Load logo and bin image
      const logoImg = await getImageDataUrl(LOGO_URL)
      let binImageData: ImageDataResult | null = null
      
      try {
        binImageData = await getImageDataUrl(selectedBin.baseImage)
      } catch (error) {
        console.warn("Could not load bin image:", error)
      }

      // === HEADER (minimal) ===
      let currentY = margin

      // Logo (preserve aspect ratio, fit within max 140x40)
      const logoMaxWidth = 140
      const logoTargetHeight = 40
      let logoDrawWidth = (logoImg.width / logoImg.height) * logoTargetHeight
      let logoDrawHeight = logoTargetHeight
      if (logoDrawWidth > logoMaxWidth) {
        const s = logoMaxWidth / logoDrawWidth
        logoDrawWidth = logoMaxWidth
        logoDrawHeight = logoDrawHeight * s
      }
      doc.addImage(logoImg.dataUrl, "PNG", margin, currentY, logoDrawWidth, logoDrawHeight)

      // Company info
      doc.setTextColor(...colors.text)
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text("Ecologia Soluzione Ambiente S.p.A.", pageWidth - margin, currentY + 8, { align: "right" })
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...colors.textLight)
      doc.text("Via Vittorio Veneto, 2-2/A", pageWidth - margin, currentY + 22, { align: "right" })
      doc.text("42021 Bibbiano (RE)", pageWidth - margin, currentY + 34, { align: "right" })
      doc.text("P.IVA IT01494430356", pageWidth - margin, currentY + 46, { align: "right" })

      currentY += 66

      // Title row
      doc.setTextColor(...colors.primary)
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.text("Preventivo", margin, currentY)

      const quoteNumber = `ESA-${Date.now().toString().slice(-6)}`
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...colors.textLight)
      doc.text(`Data: ${new Date().toLocaleDateString("it-IT")}`, pageWidth - margin, currentY - 6, { align: "right" })
      doc.text(`N° ${quoteNumber}`, pageWidth - margin, currentY + 8, { align: "right" })

      // Divider
      currentY += 16
      doc.setDrawColor(...colors.border)
      doc.setLineWidth(0.8)
      doc.line(margin, currentY, pageWidth - margin, currentY)
      currentY += 20

      // === CLIENT SECTION ===
      doc.setTextColor(...colors.secondary)
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text("Dati Cliente", margin, currentY)
      doc.setDrawColor(...colors.border)
      doc.setLineWidth(0.6)
      doc.line(margin, currentY + 6, pageWidth - margin, currentY + 6)
      currentY += 18

      const clientLines: string[] = []
      if (clientName) clientLines.push(clientName)
      if (clientAddress) clientLines.push(clientAddress)
      const contactParts = [clientEmail, clientPhone].filter(Boolean)
      if (contactParts.length) clientLines.push(contactParts.join(" • "))
      doc.setTextColor(...colors.text)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      if (clientLines.length > 0) {
        clientLines.forEach((line, idx) => {
          doc.text(line, margin, currentY + idx * 14)
        })
      } else {
        doc.setTextColor(...colors.textLight)
        doc.text("— Nessun dato cliente fornito —", margin, currentY)
      }
      currentY += clientLines.length > 0 ? clientLines.length * 14 + 18 : 32

      // === PRODUCT SECTION (minimal) ===
      doc.setTextColor(...colors.secondary)
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text("Dettagli Prodotto", margin, currentY)
      doc.setDrawColor(...colors.border)
      doc.setLineWidth(0.6)
      doc.line(margin, currentY + 6, pageWidth - margin, currentY + 6)
      currentY += 22
      
      // Layout: small image on left, simple text on right
      const imageWidth = 110
      const imageHeight = 95
      const imageX = margin
      const imageY = currentY

      // draw bounding box border for clarity
      doc.setDrawColor(...colors.border)
      doc.setLineWidth(0.6)
      doc.rect(imageX, imageY, imageWidth, imageHeight)

      if (binImageData) {
        // keep aspect ratio: fit within imageWidth x imageHeight
        const scale = Math.min(imageWidth / binImageData.width, imageHeight / binImageData.height)
        const drawW = binImageData.width * scale
        const drawH = binImageData.height * scale
        const drawX = imageX + (imageWidth - drawW) / 2
        const drawY = imageY + (imageHeight - drawH) / 2
        doc.addImage(binImageData.dataUrl, "PNG", drawX, drawY, drawW, drawH)
      } else {
        doc.setFontSize(9)
        doc.setTextColor(...colors.textLight)
        doc.text("Immagine non disponibile", imageX + imageWidth / 2, imageY + imageHeight / 2, { align: "center" })
      }

      const detailsX = imageX + imageWidth + 16
      const detailsY = imageY + 2
      doc.setTextColor(...colors.primary)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text(`${selectedBin.name} ${selectedBin.size}L`, detailsX, detailsY)

      const specs = [
        { label: "Modello", value: selectedBin.name },
        { label: "Capacità", value: `${selectedBin.size} L` },
        { label: "Quantità", value: `${quantity} pz` },
        { label: "Produzione", value: `${selectedBin.prodDays} giorni` },
      ]

      let specY = detailsY + 18
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...colors.text)
      specs.forEach((spec) => {
        doc.setTextColor(...colors.textLight)
        doc.text(`${spec.label}:`, detailsX, specY)
        doc.setTextColor(...colors.text)
        doc.text(spec.value, detailsX + 60, specY)
        specY += 14
      })

      currentY = Math.max(currentY + imageHeight, specY) + 18

      // === OPTIONAL SECTION (minimal list) ===
      const selectedOptionsList = []
      
      if (isColorOptionActive) {
        const colorOption = options.find(opt => opt.code === "color")
        if (colorOption) selectedOptionsList.push(colorOption)
      }
      
      for (const optionCode in selectedOptions) {
        if (selectedOptions[optionCode]) {
          const option = options.find(opt => opt.code === optionCode)
          if (option) {
            const isAvailable = !option.availableFor || option.availableFor.includes(selectedBin.size)
            if (isAvailable) selectedOptionsList.push(option)
          }
        }
      }

      if (selectedOptionsList.length > 0) {
        // Section title
        doc.setTextColor(...colors.secondary)
        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.text("Optional selezionati", margin, currentY)
        doc.setDrawColor(...colors.border)
        doc.setLineWidth(0.6)
        doc.line(margin, currentY + 6, pageWidth - margin, currentY + 6)
        currentY += 18

        // Simple bullet list
        doc.setTextColor(...colors.text)
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        selectedOptionsList.forEach((option, idx) => {
          const lineY = currentY + idx * 14
          const priceText = option.price ? (option.percentage ? `(+${option.price}%)` : `(+€${option.price})`) : ""
          doc.text(`• ${option.label} ${priceText}`, margin, lineY)
        })
        currentY += selectedOptionsList.length * 14 + 12
      }

      // === PRICING SECTION ===
      doc.setTextColor(...colors.secondary)
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text("Riepilogo prezzi", margin, currentY)
      doc.setDrawColor(...colors.border)
      doc.setLineWidth(0.6)
      doc.line(margin, currentY + 6, pageWidth - margin, currentY + 6)
      currentY += 16
      
      // Modern pricing table
      const tableData = priceBreakdown.items.map((item) => {
        return [
          item.label,
          item.quantity.toString(),
          item.unitPrice.toLocaleString("it-IT", { style: "currency", currency: "EUR" }),
          item.total.toLocaleString("it-IT", { style: "currency", currency: "EUR" })
        ]
      })

      autoTable(doc, {
        startY: currentY,
        head: [["Descrizione", "Quantità", "Prezzo unitario", "Totale"]],
        body: tableData,
        theme: "plain",
        headStyles: {
          fillColor: [245, 247, 250],
          textColor: colors.text,
          fontSize: 10,
          fontStyle: "bold",
          halign: "left",
          lineColor: colors.border,
          lineWidth: 0.8,
          cellPadding: { top: 8, bottom: 8, left: 8, right: 8 },
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: { top: 8, bottom: 8, left: 8, right: 8 },
          textColor: colors.text,
          lineColor: colors.border,
          lineWidth: 0.5,
        },
        columnStyles: {
          0: { cellWidth: 230, halign: "left", fontStyle: "normal" },
          1: { cellWidth: 70, halign: "center", fontStyle: "normal" },
          2: { cellWidth: 110, halign: "right", fontStyle: "normal" },
          3: { cellWidth: 110, halign: "right", fontStyle: "bold" },
        },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        margin: { left: margin, right: margin },
        styles: { overflow: "linebreak", cellWidth: "wrap" },
      })

      // === TOTAL + NOTES/CONDITIONS SECTION ===
      const afterTableY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 18

      // Total (emphasized)
      const totalText = priceBreakdown.total.toLocaleString("it-IT", { style: "currency", currency: "EUR" })
      doc.setDrawColor(...colors.border)
      doc.setLineWidth(0.8)
      doc.line(margin, afterTableY, pageWidth - margin, afterTableY)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.setTextColor(...colors.text)
      doc.text("Totale preventivo (IVA esclusa)", margin, afterTableY + 20)
      doc.setFontSize(20)
      doc.text(totalText, pageWidth - margin, afterTableY + 22, { align: "right" })

      // Notes & Conditions
      let notesY = afterTableY + 42
      doc.setTextColor(...colors.secondary)
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text("Condizioni e note", margin, notesY)
      doc.setDrawColor(...colors.border)
      doc.setLineWidth(0.6)
      doc.line(margin, notesY + 6, pageWidth - margin, notesY + 6)
      notesY += 18

      doc.setTextColor(...colors.text)
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      const defaultConditions = [
        "Validità del preventivo: 30 giorni",
        "Prezzi netti, IVA esclusa",
        "Condizioni di pagamento secondo accordi",
      ]
      const allNotes = notes ? [notes, ...defaultConditions] : defaultConditions
      allNotes.forEach((line, idx) => {
        doc.text(`• ${line}`, margin, notesY + idx * 14)
      })

      const date = new Date().toISOString().split("T")[0]
      doc.save(`preventivo_esa_${date}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full" disabled={!selectedBin}>
          <Download className="mr-2 h-5 w-5" />
          Scarica Preventivo PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Conferma Download Preventivo</DialogTitle>
          <DialogDescription>
            Stai per generare un PDF con il riepilogo della configurazione attuale. Vuoi procedere?
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nome/Ragione sociale</Label>
            <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Es. Rossi S.r.l." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email</Label>
            <Input id="clientEmail" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="nome@azienda.it" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientPhone">Telefono</Label>
            <Input id="clientPhone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+39 ..." />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="clientAddress">Indirizzo</Label>
            <Input id="clientAddress" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Via, CAP, Città, Provincia" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Note/Condizioni</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Eventuali condizioni, scadenze o note importanti da evidenziare nel PDF" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annulla
          </Button>
          <Button onClick={handleGeneratePdf} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generazione...
              </>
            ) : (
              "Genera PDF"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
