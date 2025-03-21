"use client"

import { useState } from "react"
import { MoreVertical } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { IconButton } from "./icon-button"

interface MoreOptionsMenuProps {
  onSelect?: (action: string) => void
  onClose?: () => void
}

export function MoreOptionsMenu({ onSelect, onClose }: MoreOptionsMenuProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (action: string) => {
    if (onSelect) onSelect(action)
    setOpen(false)
    if (onClose) onClose()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconButton
          icon={MoreVertical}
          name="Plus d'options"
          onClick={(e) => {
            e.stopPropagation()
            setOpen(true)
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-56" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9"
            onClick={() => handleSelect("delete")}
          >
            Supprimer la note
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9"
            onClick={() => handleSelect("add-label")}
          >
            Ajouter un libellé
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9"
            onClick={() => handleSelect("add-drawing")}
          >
            Ajouter un dessin
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9"
            onClick={() => handleSelect("make-copy")}
          >
            Effectuer une copie
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9"
            onClick={() => handleSelect("show-checkboxes")}
          >
            Afficher les cases à cocher
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9"
            onClick={() => handleSelect("copy-to-docs")}
          >
            Copier dans Google Docs
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9"
            onClick={() => handleSelect("version-history")}
          >
            Historique des versions
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

