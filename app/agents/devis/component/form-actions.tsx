"use client"

import { Button } from "@/components/ui/button"
import { Printer, Send } from "lucide-react"

interface Devis {
  id: string
  dateFacturation: string
  dateEcheance: string
  taxes: string
  statut: string
}

interface FormActionsProps {
  handlePreview: () => void
  handleSave: (devisData: Devis) => void
  handleSaveAndSend: () => void
}

export function FormActions({ handlePreview, handleSave, handleSaveAndSend }: FormActionsProps) {
  const handleSaveClick = () => {
    // Création d'un nouveau devis avec des valeurs par défaut
    const newDevis: Devis = {
      id: `HT${Math.floor(1000 + Math.random() * 9000)}${new Date().getFullYear()}`,
      dateFacturation: new Date().toLocaleDateString('fr-FR'),
      dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      taxes: "TVA",
      statut: "Attente"
    };
    
    handleSave(newDevis);
  };

  return (
    <div className="flex flex-wrap justify-between gap-2 bg-black items-center p-4 w-full">
      <Button variant="outline" size="sm">
        Annuler
      </Button>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handlePreview} className="flex items-center gap-1">
          <Printer className="h-4 w-4" /> Prévisualiser et imprimer
        </Button>
        <Button variant="outline" size="sm" onClick={handleSaveClick}>
          Enregistrer
        </Button>
        <Button
          size="sm"
          onClick={handleSaveAndSend}
          className="bg-red-800 hover:bg-red-700 text-white flex items-center gap-1"
        >
          <Send className="h-4 w-4" /> Enregistrer et envoyer
        </Button>
      </div>
    </div>
  )
}