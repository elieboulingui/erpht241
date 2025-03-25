"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BiSolidHomeHeart } from "react-icons/bi"
import { FiUserPlus } from "react-icons/fi"
import Image from "next/image"
import Chargement from "@/components/Chargement"
import { Plus } from "lucide-react"

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

      await fetchNoteCollaborators()
      setEmail("")
    } catch (error) {
      console.error("Error adding collaborator:", error)
    }
  }

  if (isLoading || !noteDetails) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>Collaborateurs</DialogTitle>
          </DialogHeader>
          <Chargement />
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
                    src={noteDetails.user.image || "/placeholder.svg?height=32&width=32"}
                    alt={noteDetails.user.name || "Propriétaire"}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <BiSolidHomeHeart className="h-5 w-5 text-gray-500" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{noteDetails.user.name || noteDetails.user.email}</span>
                  <span className="text-xs text-muted-foreground">(Propriétaire)</span>
                </div>
                <div className="text-xs text-muted-foreground">{noteDetails.user.email}</div>
              </div>
            </div>
          </div>

          {/* Groupe familial */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <BiSolidHomeHeart className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-sm">
                Groupe familial de {noteDetails.user.name?.split(" ")[0] || "l'utilisateur"}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Champ pour ajouter un nouveau collaborateur */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <FiUserPlus className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                placeholder="Nom ou adresse e-mail pour le partage"
                className="border-none shadow-none focus-visible:ring-0 h-9 pl-0 font-bold text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Liste des collaborateurs */}
          {noteDetails.collaborators.length > 0 && (
            <div className="p-4 border-t">
              {noteDetails.collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center gap-3 mb-3 last:mb-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    {collaborator.image ? (
                      <img
                        src={collaborator.image || "/placeholder.svg?height=32&width=32"}
                        alt={collaborator.name || "Collaborateur"}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <FiUserPlus className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{collaborator.name || collaborator.email}</div>
                    <div className="text-xs text-muted-foreground">{collaborator.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between p-4 pt-3 pb-3">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85">
            Enregistrer
          </Button>
        </DialogFooter>

        <div className="bg-[#7f1d1c] text-sm p-3 flex justify-between items-center rounded-t-xl">
          <span className="text-gray-300">Groupe familial disponible.</span>
          <Button variant="ghost" className="h-auto p-0 text-white hover:text-white/85 hover:bg-transparent">
            Afficher
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
