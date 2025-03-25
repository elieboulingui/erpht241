"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, PenIcon, Sparkles } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { TaskForm } from "./TaskForm"

export default function TaskAddButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)

  const handleManualClick = () => {
    setShowTaskForm(true)
    setIsOpen(false)
  }

  const handleAIClick = () => {
    // Logique pour l'ajout via IA
    setIsOpen(false)
  }

  return (
    <>
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

      <Sheet open={showTaskForm} onOpenChange={setShowTaskForm}>
        <SheetContent className="">
          <SheetHeader>
            <SheetTitle>Créer une nouvelle tâche</SheetTitle>
            <SheetDescription>
              Remplissez les détails de la tâche. Cliquez sur enregistrer une fois terminé.
            </SheetDescription>
          </SheetHeader>
          <TaskForm onCancel={() => setShowTaskForm(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}