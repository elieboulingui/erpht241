"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { IconButton } from "./icon-button"
import { Bell, Users, Image, MoreVertical, Undo2, Redo2, Pin, Smile } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { updateNote } from "../actions/updateNote"
import { ColorPickerButton } from "./color-picker-button"
import type { Note } from "./note-card"
import { EmojiPicker } from "./EmojiPicker"
import { AlerteNote } from "./AlerteNote"
import { SimpleMenu } from "./SimpleMenu"
import { CollaboratorsModal } from "./collaborators-modal"
import { MoreOptionsMenu } from "./MoreOptionsMenu"

export interface NoteEditorModalProps {
  note: Note | null
  isOpen: boolean
  onClose: () => void
  onSave: (note: Note) => void
  onRefreshNotes: () => void
}

export function NoteEditorModal({ note, isOpen, onClose, onSave, onRefreshNotes }: NoteEditorModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPinned, setIsPinned] = useState(false)
  const [color, setColor] = useState<string | undefined>(undefined)
  const [lastModified, setLastModified] = useState<Date>(new Date())
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

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content || "")
      setIsPinned(note.isPinned)
      setColor(note.color)

      try {
        const dateValue = note.lastModified instanceof Date ? note.lastModified : new Date(note.lastModified)
        if (!isNaN(dateValue.getTime())) {
          setLastModified(dateValue)
        } else {
          setLastModified(new Date())
          console.warn("Invalid date detected, using current date instead")
        }
      } catch (error) {
        console.error("Error parsing date:", error)
        setLastModified(new Date())
      }
    }
  }, [note])

  const handleSave = async () => {
    if (!note) return

    setIsSaving(true)

    const updatedData = {
      title,
      content,
      isPinned,
      color,
      lastModified: new Date(),
    }

    try {
      const optimisticNote: Note = {
        ...note,
        ...updatedData,
      }

      onSave(optimisticNote)

      const result = await updateNote(note.id, updatedData)

      if (result.success && result.data) {
        onSave(result.data)

        setTimeout(() => {
          onRefreshNotes()
        }, 300)
      } else {
        console.error("Erreur lors de la mise à jour :", result.error)
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error)
    } finally {
      setIsSaving(false)
      onClose()
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

  let formattedDate = ""
  try {
    if (lastModified && !isNaN(lastModified.getTime())) {
      formattedDate = format(lastModified, "d MMMM", { locale: fr })
    } else {
      formattedDate = "Date inconnue"
    }
  } catch (error) {
    console.error("Error formatting date:", error)
    formattedDate = "Date inconnue"
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && !isSaving && onClose()}>
        <DialogContent className="max-w-3xl">
          <div className="flex justify-between items-start mb-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre"
              className="text-xl font-medium border-none shadow-none focus-visible:ring-0 p-0 h-auto"
              disabled={isSaving}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPinned(!isPinned)}
              className="h-8 w-8"
              disabled={isSaving}
            >
              <Pin className="h-4 w-4" fill={isPinned ? "black" : "none"} />
            </Button>
          </div>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ajouter une note..."
            className="min-h-[100px] border-none shadow-none focus-visible:ring-0 p-0 resize-none"
            disabled={isSaving}
          />

          <div className="flex justify-end items-center">
            <div className="text-sm text-gray-500 font-bold">Modification : {formattedDate}</div>
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <div className="flex items-center gap-2">
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
                disabled={isSaving}
                onClick={handleMoreOptionsClick}
              />
              {/* <IconButton icon={Undo2} name="Annuler" disabled={isSaving} />
              <IconButton icon={Redo2} name="Rétablir" disabled={isSaving} /> */}
            </div>

            <Button variant="outline" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Enregistrement..." : "Fermer"}
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
            noteId={note?.id || ""}
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

