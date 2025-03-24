"use client"

import { useState, useEffect } from "react"
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
            <IconButton className="" icon={Smile} name="Emoji" disabled={isSaving} />
            <IconButton icon={Bell} name="Rappel" disabled={isSaving} />
            <IconButton icon={Users} name="Collaborateurs" disabled={isSaving} />
            <IconButton icon={Image} name="Ajouter une image" disabled={isSaving} />

            {/* Utilisation du ColorPickerButton avec les props nécessaires */}
            <ColorPickerButton onSelectColor={handleColorSelect} currentColor={color} disabled={isSaving} />

            <IconButton icon={MoreVertical} name="Plus d'options" disabled={isSaving} />
            <IconButton icon={Undo2} name="Annuler" disabled={isSaving} />
            <IconButton icon={Redo2} name="Rétablir" disabled={isSaving} />
          </div>

          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Enregistrement..." : "Fermer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

