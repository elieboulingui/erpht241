"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Image, MoreVertical, Pin, Smile, Users } from "lucide-react"
import { IconButton } from "./icon-button"
import { CreateNote } from "@/app/listing-organisation/[id]/contact/[slug]/actions/createNote"
import { ColorPickerButton } from "./color-picker-button"
import { AlerteNote } from "./AlerteNote"
import { SimpleMenu } from "./SimpleMenu"
import { CollaboratorsModal } from "./collaborators-modal"
import { MoreOptionsMenu } from "./MoreOptionsMenu"
import { EmojiPicker } from "./EmojiPicker"

interface CreateNoteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreateNote: (title: string, content: string, contactId: string) => void
}

export function CreateNoteDialog({ isOpen, onOpenChange, onCreateNote }: CreateNoteDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [color, setColor] = useState<string | undefined>(undefined)
  const [contactId, setContactId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

  // États pour les positions des menus
  const [emojiButtonPosition, setEmojiButtonPosition] = useState({ top: 0, left: 0 })
  const [reminderButtonPosition, setReminderButtonPosition] = useState({ top: 0, left: 0 })
  const [imageButtonPosition, setImageButtonPosition] = useState({ top: 0, left: 0 })
  const [moreOptionsButtonPosition, setMoreOptionsButtonPosition] = useState({ top: 0, left: 0 })

  // Fonction pour extraire l'ID du contact depuis l'URL
  function extractContactId(url: string): string | null {
    const regex = /contact\/([a-z0-9]+)/
    const match = url.match(regex)
    return match ? match[1] : null // Retourne l'ID ou null si aucun match
  }

  // Utilisation de useEffect pour récupérer l'ID du contact au moment du montage du composant
  useEffect(() => {
    const currentUrl = window.location.href
    const extractedContactId = extractContactId(currentUrl)
    setContactId(extractedContactId)
  }, [])

  const handleCreateNote = async () => {
    if (!contactId || !title.trim()) return

    setIsCreating(true)

    try {
      // Appel à la fonction CreateNote avec les paramètres nécessaires
      const response = await CreateNote({
        contactId,
        title,
        content,
        color,
        LastModified: new Date(),
      })

      if (response.success) {
        console.log("Note créée avec succès !")

        // Appeler la fonction du parent pour mettre à jour l'état des notes
        onCreateNote(title, content, contactId)

        // Réinitialiser les champs après la création
        setTitle("")
        setContent("")
        setColor(undefined)

        // Fermer le dialogue
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

  const handleColorSelect = (newColor: string) => {
    setColor(newColor)
  }

  // Gestionnaires pour les boutons
  const handleEmojiClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (emojiButtonRef.current) {
      const rect = emojiButtonRef.current.getBoundingClientRect()
      setEmojiButtonPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      })
    }

    // Toggle le menu emoji
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

    // Toggle le menu de rappel
    setShowReminderMenu((prev) => !prev)
  }

  const handleCollaboratorsClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Toggle le modal de collaborateurs
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

    // Toggle le menu d'image
    setShowImageMenu((prev) => !prev)
  }

  const handleMoreOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (moreOptionsButtonRef.current) {
      const rect = moreOptionsButtonRef.current.getBoundingClientRect()
      setMoreOptionsButtonPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 150, // Ajuster pour centrer le menu
      })
    }

    // Toggle le menu d'options
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px]">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Titre"
              className="border-none text-lg font-medium focus-visible:ring-0 px-0 h-auto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pin className="h-5 w-5" />
            </Button>
          </div>

          <Textarea
            placeholder="Créer une note..."
            className="min-h-[100px] border-none resize-none focus-visible:ring-0 px-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <IconButton
                ref={emojiButtonRef}
                className=""
                icon={Smile}
                name="Emoji"
                disabled={isSaving}
                onClick={handleEmojiClick}
              />
              <IconButton
                ref={reminderButtonRef}
                icon={Bell}
                name="Rappel"
                disabled={isSaving}
                onClick={handleReminderClick}
              />
              <IconButton icon={Users} name="Collaborateurs" disabled={isSaving} onClick={handleCollaboratorsClick} />
              {/* <IconButton
                ref={imageButtonRef}
                icon={Image}
                name="Ajouter une image"
                disabled={isSaving}
                onClick={handleImageClick}
              /> */}
              {/* Utilisation du ColorPickerButton avec les props nécessaires */}
              {/* <ColorPickerButton onSelectColor={handleColorSelect} currentColor={color} disabled={isSaving} /> */}
              <IconButton
                ref={moreOptionsButtonRef}
                icon={MoreVertical}
                name="Plus d'options"
                onClick={handleMoreOptionsClick}
              />
            </div>

            <Button variant="ghost" onClick={handleCreateNote} disabled={isCreating}>
              {isCreating ? "Création en cours..." : "Fermer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Menus et modals - Rendus en dehors du Dialog avec z-index élevé */}
      {showEmojiPicker && (
        <div className="fixed inset-0" style={{ zIndex: 9999 }}>
          <EmojiPicker
            position={emojiButtonPosition}
            onSelectEmoji={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      )}

      {showReminderMenu && (
        <div className="fixed inset-0" style={{ zIndex: 9999 }}>
          <AlerteNote
            position={reminderButtonPosition}
            onSelectReminder={handleReminderSelect}
            onClose={() => setShowReminderMenu(false)}
          />
        </div>
      )}

      {showCollaboratorsModal && (
        <div style={{ zIndex: 9999, position: "relative" }}>
          <CollaboratorsModal
            isOpen={showCollaboratorsModal}
            onClose={() => setShowCollaboratorsModal(false)}
            noteId={contactId || ""}
          />
        </div>
      )}

      {/* {showImageMenu && (
        <div className="fixed inset-0" style={{ zIndex: 9999 }}>
          <SimpleMenu title="Ajouter une image" isOpen={showImageMenu} onClose={() => setShowImageMenu(false)}>
            <div>Fonctionnalité d'ajout d'image à venir</div>
          </SimpleMenu>
        </div>
      )} */}

      {showMoreOptionsMenu && (
        <div className="fixed inset-0" style={{ zIndex: 9999 }}>
          <MoreOptionsMenu
            position={moreOptionsButtonPosition}
            onClose={() => setShowMoreOptionsMenu(false)}
            onDeleteClick={() => {
              // Gérer la suppression si nécessaire
              setShowMoreOptionsMenu(false)
            }}
          />
        </div>
      )}
    </>
  )
}

