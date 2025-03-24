"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"

interface MoreOptionsMenuProps {
  position: { top: number; left: number }
  onClose: () => void
  onDeleteClick: () => void
}

export function MoreOptionsMenu({ position, onClose, onDeleteClick }: MoreOptionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const handleOptionClick = (action: string) => {
    console.log(action)
    onClose()
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border rounded-md shadow-md w-64"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="py-2">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9 px-3 rounded-none"
            onClick={() => {
              onDeleteClick()
              onClose()
            }}
          >
            <span>Supprimer la note</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9 px-3 rounded-none"
            onClick={() => handleOptionClick("Ajouter un libellé")}
          >
            <span>Ajouter un libellé</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9 px-3 rounded-none"
            onClick={() => handleOptionClick("Ajouter un dessin")}
          >
            <span>Ajouter un dessin</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9 px-3 rounded-none"
            onClick={() => handleOptionClick("Effectuer une copie")}
          >
            <span>Effectuer une copie</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9 px-3 rounded-none"
            onClick={() => handleOptionClick("Afficher les cases à cocher")}
          >
            <span>Afficher les cases à cocher</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9 px-3 rounded-none"
            onClick={() => handleOptionClick("Copier dans Google Docs")}
          >
            <span>Copier dans Google Docs</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9 px-3 rounded-none"
            onClick={() => handleOptionClick("Historique des versions")}
          >
            <span>Historique des versions</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

