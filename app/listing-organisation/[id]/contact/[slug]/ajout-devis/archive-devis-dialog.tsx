'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { archiveDevis } from "./action/archivedevis"

interface ArchiveDevisDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  devisId: string | null
}

export function ArchiveDevisDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  devisId 
}: ArchiveDevisDialogProps) {

  // Call archiveDevis only if devisId is not null
  const handleArchive = () => {
    if (devisId) {
      archiveDevis(devisId)
    } else {
      console.error('Devis ID is null')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archiver le devis</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir archiver le devis {devisId || ''} ? 
            Cette action ne peut pas être annulée, mais vous pourrez le restaurer plus tard si nécessaire.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white" 
            onClick={() => {
              handleArchive() // Call the archive function only when devisId is valid
              onConfirm() // Close the dialog
            }}
          >
            Archiver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
