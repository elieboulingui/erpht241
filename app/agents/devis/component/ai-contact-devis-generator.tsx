"use client"

import { useState } from "react"
;('import { useState } from "react')
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

// Predefined quotes for different domains
const PREDEFINED_QUOTES = {
  construction: [
    "Rénovation complète d'une salle de bain: 5,000€ - 8,000€",
    "Installation électrique pour une maison de 100m²: 3,500€ - 4,500€",
    "Peinture intérieure d'un appartement de 70m²: 1,800€ - 2,500€",
    "Construction d'une extension de 20m²: 25,000€ - 35,000€",
    "Pose de carrelage pour 50m²: 2,000€ - 3,000€",
  ],
  informatique: [
    "Développement d'un site web vitrine: 1,500€ - 3,000€",
    "Création d'une application mobile sur mesure: 8,000€ - 15,000€",
    "Maintenance informatique annuelle (10 postes): 2,400€/an",
    "Installation d'un réseau d'entreprise: 3,500€ - 5,000€",
    "Migration vers le cloud: 4,000€ - 7,000€",
  ],
  marketing: [
    "Campagne publicitaire sur les réseaux sociaux (3 mois): 2,500€ - 4,000€",
    "Refonte d'identité visuelle complète: 3,000€ - 5,000€",
    "Création de contenu mensuel (blog + réseaux): 1,200€/mois",
    "Étude de marché approfondie: 4,500€ - 7,000€",
    "Stratégie marketing annuelle: 5,000€ - 8,000€",
  ],
  default: [
    "Service de base: 500€ - 1,000€",
    "Service standard: 1,000€ - 2,500€",
    "Service premium: 2,500€ - 5,000€",
    "Forfait mensuel: 300€/mois",
    "Prestation complète: 3,000€ - 6,000€",
  ],
}

export function DevisGenerator({ onClose = () => {} }: { onClose?: () => void }) {
  const [quotes, setQuotes] = useState<{ content: string; checked: boolean }[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [domain, setDomain] = useState("")

  const generateQuotes = () => {
    setIsGenerating(true)

    // Simulate API delay
    setTimeout(() => {
      // Get quotes based on domain or use default if domain doesn't match
      const domainKey = domain.toLowerCase()
      const quotesList = Object.keys(PREDEFINED_QUOTES).includes(domainKey)
        ? PREDEFINED_QUOTES[domainKey as keyof typeof PREDEFINED_QUOTES]
        : PREDEFINED_QUOTES.default

      setQuotes(quotesList.map((quote) => ({ content: quote, checked: false })))
      setIsGenerating(false)
    }, 1000)
  }

  const handleSelectChange = (index: number) => {
    setQuotes((prevQuotes) =>
      prevQuotes.map((quote, i) => (i === index ? { ...quote, checked: !quote.checked } : quote)),
    )
  }

  const handleSubmitQuotes = () => {
    const selectedQuotes = quotes.filter((quote) => quote.checked)

    if (selectedQuotes.length === 0) {
      toast.error("Aucun devis sélectionné !")
      return
    }

    // Simulate successful submission
    toast.success("Devis ajoutés avec succès !")
    setQuotes([])
    onClose()
  }

  return (
    <DialogContent>
      <DialogHeader>
        <h2 className="text-xl font-semibold">Générer des devis</h2>
        <p className="text-sm">Entrez un domaine pour générer des devis</p>
      </DialogHeader>

      <div className="space-y-4">
        {/* Input for domain */}
        <div className="flex items-center space-x-4">
          <Input
            className="pr-10 focus:outline-none focus:ring-0 border-2 border-gray-300 rounded-md"
            placeholder="Entrez un domaine (ex: construction, informatique, marketing)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={isGenerating}
          />
          <Button onClick={generateQuotes} className="bg-black text-white hover:bg-black/80" disabled={isGenerating}>
            {isGenerating ? "Génération en cours..." : "Générer des devis"}
          </Button>
        </div>

        {/* Quotes list */}
        {quotes.length > 0 && (
          <div className="flex flex-col gap-3 mt-6 max-h-[300px] overflow-y-auto">
            {quotes.map((quote, index) => (
              <div
                key={index}
                className="flex items-start gap-2 bg-white p-3 rounded-md border border-gray-300 cursor-pointer"
                onClick={() => handleSelectChange(index)}
              >
                <Checkbox checked={quote.checked} onChange={() => handleSelectChange(index)} className="mt-1 mr-3" />
                <span>{quote.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      {quotes.some((quote) => quote.checked) && (
        <DialogFooter className="flex justify-start pt-2">
          <Button
            onClick={handleSubmitQuotes}
            className="w-full bg-black hover:bg-black/80 text-white"
            disabled={quotes.every((quote) => !quote.checked)}
          >
            Ajouter les devis
          </Button>
        </DialogFooter>
      )}
    </DialogContent>
  )
}

