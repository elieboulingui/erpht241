"use client"

import { Button } from "@/components/ui/button"
import { Printer, Send } from "lucide-react"

interface FormActionsProps {
  handlePreview: () => void
  handleSave: () => void
  handleSaveAndSend: () => void
}

export function FormActions({ handlePreview, handleSave, handleSaveAndSend }: FormActionsProps) {
  return (
    <div className="flex flex-wrap justify-between gap-2 bg-black items-center p-4 w-full">
      <Button variant="outline" size="sm">
        Annuler
      </Button>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handlePreview} className="flex items-center gap-1">
          <Printer className="h-4 w-4" /> Prévisualiser et imprimer
        </Button>
        <Button variant="outline" size="sm" onClick={handleSave}>
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

