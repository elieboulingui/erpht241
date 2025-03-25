"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Users } from "lucide-react"
import Image from "next/image"
import Chargement from "@/components/Chargement"

interface CollaboratorsModalProps {
  isOpen: boolean
  onClose: () => void
  noteId: string
}

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
}

interface NoteDetails {
  user: User
  collaborators: User[]
}

export function CollaboratorsModal({ isOpen, onClose, noteId }: CollaboratorsModalProps) {
  const [email, setEmail] = useState("")
  const [noteDetails, setNoteDetails] = useState<NoteDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen && noteId) {
      fetchNoteCollaborators()
    }
  }, [isOpen, noteId])

  const fetchNoteCollaborators = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/notes/${noteId}/collaborators`)
      if (!response.ok) throw new Error("Failed to fetch collaborators")
      
      const data = await response.json()
      setNoteDetails(data)
    } catch (error) {
      console.error("Error fetching collaborators:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/notes/${noteId}/collaborators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) throw new Error("Failed to add collaborator")

      // Rafraîchir la liste des collaborateurs après l'ajout
      await fetchNoteCollaborators()
      setEmail("")
    } catch (error) {
      console.error("Error adding collaborator:", error)
    }
  }

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>Collaborateurs</DialogTitle>
          </DialogHeader>
          <Chargement/>
        </DialogContent>
      </Dialog>
    )
  }

  if (!noteDetails) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>Collaborateurs</DialogTitle>
          </DialogHeader>
          <Chargement/>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle>Collaborateurs</DialogTitle>
        </DialogHeader>

        <div className="border-t border-b">
          {/* Propriétaire de la note */}
          <div className="flex items-center p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                {noteDetails.user.image ? (
                  <img
                    src={noteDetails.user.image}
                    alt={noteDetails.user.name || "Propriétaire"}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <Users className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">
                    {noteDetails.user.name || noteDetails.user.email}
                  </span>
                  <span className="text-xs text-muted-foreground">(Propriétaire)</span>
                </div>
                <div className="text-xs text-muted-foreground">{noteDetails.user.email}</div>
              </div>
            </div>
          </div>

          {/* Liste des collaborateurs */}
          {noteDetails.collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  {collaborator.image ? (
                    <Image
                      src={collaborator.image}
                      alt={collaborator.name || "Collaborateur"}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <Users className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-sm">{collaborator.name || collaborator.email}</span>
                  <div className="text-xs text-muted-foreground">{collaborator.email}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Champ pour ajouter un nouveau collaborateur */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <Plus className="h-5 w-5 text-gray-500" />
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
          <Button variant={"ghost"} onClick={handleSave}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}