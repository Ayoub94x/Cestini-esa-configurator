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
import html2canvas from "html2canvas"
import { options } from "@/lib/data"

const LOGO_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_ESA-SH0r2i3VZYnYmHs6wymFizOyag967i.png"

// Helper function to load images from URL and get their Data URL
const getImageDataUrl = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous" // Important for loading external images into canvas

    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL("image/png"))
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
const drawIconInPdf = (doc: any, option: any, x: number, y: number, size: number = 16, color: string = "#374151") => {
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
      // Draw flame shape
      const flamePoints = [
        [centerX, centerY - 6 * scale],
        [centerX - 3 * scale, centerY - 2 * scale],
        [centerX - 2 * scale, centerY + 2 * scale],
        [centerX + 2 * scale, centerY + 2 * scale],
        [centerX + 3 * scale, centerY - 2 * scale]
      ]
      doc.polygon(flamePoints, "S")
      
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

  const handleGeneratePdf = async () => {
    if (!selectedBin || !priceBreakdown) return
    setIsGenerating(true)

    try {
      const doc = new jsPDF("p", "pt", "a4")
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const margin = 50
      const contentWidth = pageWidth - (margin * 2)
      
      // Modern color palette
      const colors = {
        primary: [25, 39, 52],      // Dark blue-gray
        secondary: [71, 85, 105],   // Medium gray
        accent: [59, 130, 246],     // Blue accent
        success: [16, 185, 129],    // Green
        light: [248, 250, 252],     // Very light gray
        border: [226, 232, 240],    // Light border
        text: [15, 23, 42],         // Dark text
        textLight: [100, 116, 139]  // Light text
      }
      
      // Load logo and bin image
      const logoImgData = await getImageDataUrl(LOGO_URL)
      let binImageData: string | null = null
      
      try {
        binImageData = await getImageDataUrl(selectedBin.baseImage)
      } catch (error) {
        console.warn("Could not load bin image:", error)
      }

      // === HEADER SECTION ===
      let currentY = margin
      
      // Header background with subtle gradient effect
      doc.setFillColor(...colors.light)
      doc.rect(0, 0, pageWidth, 140, "F")
      
      // Thin accent line at top
      doc.setFillColor(...colors.accent)
      doc.rect(0, 0, pageWidth, 4, "F")
      
      // Logo with better positioning
      doc.addImage(logoImgData, "PNG", margin, currentY, 140, 47)
      
      // Company info - modern typography
      doc.setTextColor(...colors.text)
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text("Ecologia Soluzione Ambiente S.p.A.", pageWidth - margin, currentY + 10, { align: "right" })
      
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...colors.textLight)
      doc.text("Via Vittorio Veneto, 2-2/A", pageWidth - margin, currentY + 25, { align: "right" })
      doc.text("42021 Bibbiano (RE)", pageWidth - margin, currentY + 38, { align: "right" })
      doc.text("P.IVA IT01494430356", pageWidth - margin, currentY + 51, { align: "right" })
      
      currentY = 160
      
      // === DOCUMENT TITLE SECTION ===
      // Title with modern styling
      doc.setTextColor(...colors.primary)
      doc.setFontSize(28)
      doc.setFont("helvetica", "bold")
      doc.text("PREVENTIVO", margin, currentY)
      
      // Subtitle line
      doc.setFillColor(...colors.accent)
      doc.rect(margin, currentY + 10, 120, 2, "F")
      
      // Document info in organized layout
      currentY += 40
      const docInfoY = currentY
      
      // Left side - Date
      doc.setTextColor(...colors.textLight)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text("DATA EMISSIONE", margin, docInfoY)
      doc.setTextColor(...colors.text)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(new Date().toLocaleDateString("it-IT"), margin, docInfoY + 15)
      
      // Right side - Quote number
      const quoteNumber = `ESA-${Date.now().toString().slice(-6)}`
      doc.setTextColor(...colors.textLight)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text("PREVENTIVO N°", pageWidth - margin, docInfoY, { align: "right" })
      doc.setTextColor(...colors.text)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(quoteNumber, pageWidth - margin, docInfoY + 15, { align: "right" })
      
      currentY += 50

      // === PRODUCT SECTION ===
      // Section title
      doc.setTextColor(...colors.primary)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text("DETTAGLI PRODOTTO", margin, currentY)
      
      // Section separator line
      doc.setFillColor(...colors.border)
      doc.rect(margin, currentY + 8, contentWidth, 1, "F")
      
      currentY += 30
      
      // Modern product card with clean design
      const cardHeight = 140
      const imageWidth = 120
      const imageHeight = 110
      
      // Card background with subtle shadow
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(margin, currentY, contentWidth, cardHeight, 8, 8, "F")
      doc.setDrawColor(...colors.border)
      doc.setLineWidth(1)
      doc.roundedRect(margin, currentY, contentWidth, cardHeight, 8, 8, "S")
      
      // Product image section
      const imageX = margin + 20
      const imageY = currentY + 15
      
      // Image background
      doc.setFillColor(...colors.light)
      doc.roundedRect(imageX, imageY, imageWidth, imageHeight, 6, 6, "F")
      
      if (binImageData) {
        doc.addImage(binImageData, "PNG", imageX + 10, imageY + 5, imageWidth - 20, imageHeight - 10)
      } else {
        // Modern placeholder
        doc.setFillColor(...colors.border)
        doc.roundedRect(imageX + 20, imageY + 20, imageWidth - 40, imageHeight - 40, 4, 4, "F")
        doc.setFontSize(10)
        doc.setTextColor(...colors.textLight)
        doc.text("Immagine", imageX + imageWidth/2, imageY + imageHeight/2 - 5, { align: "center" })
        doc.text("non disponibile", imageX + imageWidth/2, imageY + imageHeight/2 + 8, { align: "center" })
      }
      
      // Product details with modern layout
      const detailsX = imageX + imageWidth + 30
      const detailsY = currentY + 25
      
      // Product name - prominent
      doc.setTextColor(...colors.primary)
      doc.setFontSize(18)
      doc.setFont("helvetica", "bold")
      doc.text(`${selectedBin.name} ${selectedBin.size}L`, detailsX, detailsY)
      
      // Product specifications in organized grid
      const specs = [
        { label: "Modello", value: selectedBin.name },
        { label: "Capacità", value: `${selectedBin.size} Litri` },
        { label: "Quantità", value: `${quantity} pz` },
        { label: "Produzione", value: `${selectedBin.prodDays} giorni` }
      ]
      
      let specY = detailsY + 25
      specs.forEach((spec, index) => {
        // Label
        doc.setTextColor(...colors.textLight)
        doc.setFontSize(9)
        doc.setFont("helvetica", "bold")
        doc.text(spec.label.toUpperCase(), detailsX, specY)
        
        // Value
        doc.setTextColor(...colors.text)
        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        doc.text(spec.value, detailsX, specY + 12)
        
        specY += 22
      })
      
      currentY += cardHeight + 30

      // === OPTIONAL SECTION ===
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
        doc.setTextColor(...colors.primary)
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        doc.text("OPTIONAL SELEZIONATI", margin, currentY)
        
        // Section separator line
        doc.setFillColor(...colors.border)
        doc.rect(margin, currentY + 8, contentWidth, 1, "F")
        
        currentY += 30
        
        // Modern options layout - single column for better readability
        const optionHeight = 60
        const optionSpacing = 15
        
        selectedOptionsList.forEach((option, index) => {
          const optionY = currentY + index * (optionHeight + optionSpacing)
          
          // Option card with modern styling
          doc.setFillColor(255, 255, 255)
          doc.roundedRect(margin, optionY, contentWidth, optionHeight, 6, 6, "F")
          doc.setDrawColor(...colors.border)
          doc.setLineWidth(1)
          doc.roundedRect(margin, optionY, contentWidth, optionHeight, 6, 6, "S")
          
          // Icon section
          const iconX = margin + 20
          const iconY = optionY + 15
          const iconSize = 30
          
          // Icon background
          doc.setFillColor(...colors.light)
          doc.circle(iconX + iconSize/2, iconY + iconSize/2, iconSize/2, "F")
          doc.setDrawColor(...colors.border)
          doc.setLineWidth(1)
          doc.circle(iconX + iconSize/2, iconY + iconSize/2, iconSize/2, "S")
          
          // Draw icon
          try {
            let iconColor = "#3b82f6"
            if (option.code === 'color') {
              iconColor = color || "#ff6b35"
            }
            drawIconInPdf(doc, option, iconX + 1, iconY + 1, iconSize - 2, iconColor)
          } catch (error) {
            // Fallback icon
            doc.setFillColor(...colors.accent)
            doc.circle(iconX + iconSize/2, iconY + iconSize/2, 8, "F")
            doc.setFillColor(255, 255, 255)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(10)
            doc.text("?", iconX + iconSize/2 - 3, iconY + iconSize/2 + 3)
          }
          
          // Option details
          const textX = iconX + iconSize + 20
          const textY = optionY + 20
          
          // Option name
          doc.setTextColor(...colors.text)
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          doc.text(option.label, textX, textY)
          
          // Option description (if available)
          if (option.description) {
            doc.setTextColor(...colors.textLight)
            doc.setFontSize(9)
            doc.setFont("helvetica", "normal")
            const descLines = doc.splitTextToSize(option.description, contentWidth - textX - 120)
            doc.text(descLines[0] || "", textX, textY + 15)
          }
          
          // Price display
          if (option.price) {
            const priceText = option.percentage ? `+${option.price}%` : `+€${option.price}`
            const priceX = margin + contentWidth - 80
            
            // Price badge
            doc.setFillColor(...colors.success)
            doc.roundedRect(priceX, optionY + 15, 70, 20, 10, 10, "F")
            
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(10)
            doc.setFont("helvetica", "bold")
            doc.text(priceText, priceX + 35, optionY + 27, { align: "center" })
          }
        })
        
        currentY += selectedOptionsList.length * (optionHeight + optionSpacing) + 20
      }

      // === PRICING SECTION ===
      // Section title
      doc.setTextColor(...colors.primary)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text("RIEPILOGO PREZZI", margin, currentY)
      
      // Section separator line
      doc.setFillColor(...colors.border)
      doc.rect(margin, currentY + 8, contentWidth, 1, "F")
      
      currentY += 30
      
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
        head: [["Descrizione", "Quantità", "Prezzo Unitario", "Totale"]],
        body: tableData,
        theme: "plain",
        headStyles: { 
          fillColor: colors.primary,
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: "bold",
          halign: "center",
          cellPadding: { top: 12, bottom: 12, left: 8, right: 8 }
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: { top: 10, bottom: 10, left: 8, right: 8 },
          textColor: colors.text,
          lineColor: colors.border,
          lineWidth: 0.5
        },
        columnStyles: {
          0: { cellWidth: 220, halign: "left", fontStyle: "normal" },
          1: { cellWidth: 80, halign: "center", fontStyle: "normal" },
          2: { cellWidth: 110, halign: "right", fontStyle: "normal" },
          3: { cellWidth: 110, halign: "right", fontStyle: "bold" }
        },
        alternateRowStyles: {
          fillColor: colors.light
        },
        margin: { left: margin, right: margin },
        styles: {
          overflow: 'linebreak',
          cellWidth: 'wrap'
        },
        didDrawPage: (data) => {
          // Modern footer with better styling
          const footerY = pageHeight - 40
          
          // Footer background
          doc.setFillColor(...colors.light)
          doc.rect(0, footerY - 10, pageWidth, 50, "F")
          
          // Footer text
          doc.setTextColor(...colors.textLight)
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.text(
            "Preventivo valido 30 giorni • Prezzi netti, IVA esclusa • Condizioni di pagamento secondo accordi",
            pageWidth / 2,
            footerY + 5,
            { align: "center" }
          )
          
          // Company footer info
          doc.setFontSize(8)
          doc.text(
            "ESA S.p.A. • www.esaspa.it • info@esaspa.it",
            pageWidth / 2,
            footerY + 18,
            { align: "center" }
          )
        },
      })

      // === TOTAL SECTION ===
      const finalY = (doc as any).lastAutoTable.finalY + 30
      
      // Total card with modern styling - increased height to avoid overlapping
      const totalCardHeight = 60
      const totalCardY = finalY
      
      // Card shadow effect
      doc.setFillColor(0, 0, 0, 0.1)
      doc.rect(margin + 2, totalCardY + 2, contentWidth, totalCardHeight, "F")
      
      // Main card background with gradient effect
      doc.setFillColor(...colors.primary)
      doc.rect(margin, totalCardY, contentWidth, totalCardHeight, "F")
      
      // Accent line at the top
      doc.setFillColor(...colors.accent)
      doc.rect(margin, totalCardY, contentWidth, 3, "F")
      
      // Total label - positioned higher
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text(
        "TOTALE PREVENTIVO",
        margin + 20,
        totalCardY + 18
      )
      
      // Total amount - repositioned with more space
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      const totalText = priceBreakdown.total.toLocaleString("it-IT", { style: "currency", currency: "EUR" })
      doc.text(
        totalText,
        pageWidth - margin - 20,
        totalCardY + 35,
        { align: "right" }
      )
      
      // IVA notice - positioned lower to avoid overlap
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(255, 255, 255)
      doc.text(
        "(IVA esclusa)",
        pageWidth - margin - 20,
        totalCardY + 50,
        { align: "right" }
      )

      // Reset text color
      doc.setTextColor(0, 0, 0)

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Conferma Download Preventivo</DialogTitle>
          <DialogDescription>
            Stai per generare un PDF con il riepilogo della configurazione attuale. Vuoi procedere?
          </DialogDescription>
        </DialogHeader>
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
