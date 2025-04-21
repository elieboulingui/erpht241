"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Pin, Smile, Users } from "lucide-react"
import { IconButton } from "./icon-button"
import { CreateNote } from "@/app/listing-organisation/[id]/contact/[slug]/actions/createNote"
import { AlerteNote } from "./AlerteNote"
import { CollaboratorsModal } from "./collaborators-modal"
import { EmojiPicker } from "./EmojiPicker"

interface CreateNoteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreateNote: (title: string, content: string, contactId: string) => void
}

export function CreateNoteDialog({ isOpen, onOpenChange, onCreateNote }: CreateNoteDialogProps) {
  // États principaux
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [color, setColor] = useState<string | undefined>(undefined)
  const [contactId, setContactId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // États pour les menus et modals
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showReminderMenu, setShowReminderMenu] = useState(false)
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false)
  const [showImageMenu, setShowImageMenu] = useState(false)
  const [showMoreOptionsMenu, setShowMoreOptionsMenu] = useState(false)

  // Références pour les positions des boutons
  const emojiButtonRef = useRef<HTMLButtonElement>(null)
  const reminderButtonRef = useRef<HTMLButtonElement>(null)
  const imageButtonRef = useRef<HTMLButtonElement>(null)
  const moreOptionsButtonRef = useRef<HTMLButtonElement>(null)

  // Fonction pour réinitialiser complètement le modal
  const resetModalState = () => {
    setTitle("")
    setContent("")
    setColor(undefined)
    setShowEmojiPicker(false)
    setShowReminderMenu(false)
    setShowCollaboratorsModal(false)
    setShowImageMenu(false)
    setShowMoreOptionsMenu(false)
    setIsCreating(false)
    setIsSaving(false)
    setIsGenerating(false)
  }

  // Fonction pour extraire l'ID du contact depuis l'URL
  function extractContactId(url: string): string | null {
    const regex = /contact\/([a-z0-9]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  // Récupération de l'ID du contact au montage
  useEffect(() => {
    const currentUrl = window.location.href
    const extractedContactId = extractContactId(currentUrl)
    setContactId(extractedContactId)
  }, [])

  // Génération automatique du contenu
  const generateNoteContent = async () => {
    if (!title.trim()) return

    setIsGenerating(true)

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du contenu")
      }

      const data = await response.json()
      setContent(data.content)
    } catch (error) {
      console.error("Erreur lors de la génération du contenu", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Création d'une nouvelle note
  const handleCreateNote = async () => {
    if (!contactId || !title.trim()) return

    setIsCreating(true)

    try {
      const response = await CreateNote({
        contactId,
        title,
        content,
        color,
        LastModified: new Date(),
      })

      if (response.success) {
        onCreateNote(title, content, contactId)
        resetModalState()
        onOpenChange(false)
      } else {
        console.error("Erreur lors de la création de la note", response.error)
      }
    } catch (error) {
      console.error("Une erreur est survenue lors de la création de la note", error)
    } finally {
      setIsCreating(false)
    }
  }

  // Gestionnaires d'événements pour les boutons
  const handleEmojiClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (emojiButtonRef.current) {
      const rect = emojiButtonRef.current.getBoundingClientRect()
      setEmojiButtonPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      })
    }

    setShowEmojiPicker((prev) => !prev)
  }

  const handleReminderClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (reminderButtonRef.current) {
      const rect = reminderButtonRef.current.getBoundingClientRect()
      setReminderButtonPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      })
    }

    setShowReminderMenu((prev) => !prev)
  }

  const handleCollaboratorsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowCollaboratorsModal((prev) => !prev)
  }

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (imageButtonRef.current) {
      const rect = imageButtonRef.current.getBoundingClientRect()
      setImageButtonPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      })
    }

    setShowImageMenu((prev) => !prev)
  }

  const handleMoreOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (moreOptionsButtonRef.current) {
      const rect = moreOptionsButtonRef.current.getBoundingClientRect()
      setMoreOptionsButtonPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 150,
      })
    }

    setShowMoreOptionsMenu((prev) => !prev)
  }

  // Gestionnaire pour l'ajout d'emoji
  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  // Gestionnaire pour la sélection de rappel
  const handleReminderSelect = (time: string) => {
    console.log(`Rappel défini pour: ${time}`)
    setShowReminderMenu(false)
  }

  // États pour les positions des menus
  const [emojiButtonPosition, setEmojiButtonPosition] = useState({
    top: 0,
    left: 0,
  })
  const [reminderButtonPosition, setReminderButtonPosition] = useState({
    top: 0,
    left: 0,
  })
  const [imageButtonPosition, setImageButtonPosition] = useState({
    top: 0,
    left: 0,
  })
  const [moreOptionsButtonPosition, setMoreOptionsButtonPosition] = useState({
    top: 0,
    left: 0,
  })

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          onOpenChange(open)
          if (!open) {
            resetModalState()
          }
        }}
      >
        <DialogContent className="w-full max-w-2xl ">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Titre"
              className="border-none text-lg font-medium focus-visible:ring-0 px-0 "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex items-center gap-2">
              {title.trim() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateNoteContent}
                  disabled={isGenerating || !title.trim()}
                  className="bg-[#7f1d1c] hover:bg-[#7f1d1c] text-white hover:text-white"
                >
                  {isGenerating ? "Génération..." : "Générer contenu"}
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Textarea
            placeholder={isGenerating ? "Génération du contenu..." : "Contenu de la note..."}
            className="min-h-[500px] border-none resize-none focus-visible:ring-0 px-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isGenerating}
          />

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              {/* <IconButton
                ref={emojiButtonRef}
                className=""
                icon={Smile}
                name="Emoji"
                disabled={isSaving}
                onClick={handleEmojiClick}
              /> */}
              <IconButton
                ref={reminderButtonRef}
                icon={Bell}
                name="Rappel"
                disabled={isSaving}
                onClick={handleReminderClick}
              />
              <IconButton icon={Users} name="Collaborateurs" onClick={handleCollaboratorsClick} />
            </div>

            <Button variant="ghost" onClick={handleCreateNote} disabled={isCreating}>
              {isCreating ? "Création en cours..." : "Fermer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Menus et modals */}
      {/* {showEmojiPicker && (
        <div className="fixed inset-0" style={{ zIndex: 9999 }}>
          <EmojiPicker
            position={emojiButtonPosition}
            onSelectEmoji={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      )} */}
    </>
  )
}