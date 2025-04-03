"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteDevisDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  devisId: string | null
}

export function DeleteDevisDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  devisId 
}: DeleteDevisDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le devis</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le devis {devisId || ''} ? 
            Cette action ne peut pas être annulée.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white" 
            onClick={onConfirm}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}