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

interface DeleteFacutreDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  factureId: string
}

export function DeleteFactureDialog({ isOpen, onClose, onConfirm, factureId }: DeleteFacutreDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la facture</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer la facture {factureId} ? Cette action ne peut pas être annulée.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white" onClick={onConfirm}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

