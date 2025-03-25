"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, PenIcon, Sparkles } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TaskAddButtonProps {
  onAddManual?: () => void
  onAddAI?: () => void
}

export default function TaskAddButton({ onAddManual, onAddAI }: TaskAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleManualClick = () => {
    if (onAddManual) {
      onAddManual()
    }
    setIsOpen(false)
  }

  const handleAIClick = () => {
    if (onAddAI) {
      onAddAI()
    }
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold">
          <Plus className="h-4 w-4 mr-1" /> Ajouter une tâche
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[175px]">
        <DropdownMenuItem onClick={handleManualClick} className="cursor-pointer">
          <PenIcon className="h-4 w-4 mr-2" />
          <span>Manuellement</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAIClick} className="cursor-pointer">
          <Sparkles className="h-4 w-4 mr-2" />
          <span>Via IA</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

