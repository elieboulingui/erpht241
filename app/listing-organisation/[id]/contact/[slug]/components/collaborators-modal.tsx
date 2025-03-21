"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Users } from "lucide-react"
import Image from "next/image"

interface CollaboratorsModalProps {
  isOpen: boolean
  onClose: () => void
  noteId: string
}

export function CollaboratorsModal({ isOpen, onClose, noteId }: CollaboratorsModalProps) {
  const [email, setEmail] = useState("")

  const handleSave = () => {
    console.log(`Partage de la note ${noteId} avec: ${email}`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle>Collaborateurs</DialogTitle>
        </DialogHeader>

        <div className="border-t border-b">
          <div className="flex items-center p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="Nathalie"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Nathalie SANDUKU ELITE</span>
                  <span className="text-xs text-muted-foreground">(Propriétaire)</span>
                </div>
                <div className="text-xs text-muted-foreground">sandukelitenatalie@gmail.com</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-sm">Groupe familial de Nathalie</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                placeholder="Nom ou adresse e-mail pour le partage"
                className="border-none shadow-none focus-visible:ring-0 h-9 pl-0 font-bold text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between p-4 pt-3 pb-3">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button variant={"ghost"} onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>

        <div className="bg-gray-800 text-sm p-3 flex justify-between items-center rounded-t-xl">
          <span className="text-gray-300">Groupe familial disponible.</span>
          <Button variant="ghost" className="h-auto p-0 text-white hover:text-white/85 hover:bg-transparent">
            Afficher
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

