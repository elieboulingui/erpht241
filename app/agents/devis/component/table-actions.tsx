"use client"

import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface TableActionsProps {
  addProductLine: () => void
  clearAllLines: () => void
}

export function TableActions({ addProductLine, clearAllLines }: TableActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button variant="outline" size="sm" onClick={addProductLine} className="flex items-center gap-1">
        <Plus className="h-4 w-4" /> Ajouter une ligne
      </Button>
      <Button variant="outline" size="sm" onClick={clearAllLines} className="flex items-center gap-1">
        <Trash2 className="h-4 w-4" /> Effacer tous les lignes
      </Button>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Plus className="h-4 w-4" /> Ajouter sous total
      </Button>
    </div>
  )
}

