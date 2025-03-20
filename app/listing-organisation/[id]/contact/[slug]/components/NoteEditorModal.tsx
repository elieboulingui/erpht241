"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { IconButton } from "./icon-button"
import { ColorPickerButton } from "./color-picker-button"
import { Bell, Users, Image, MoreVertical, Undo2, Redo2, Pin, Smile } from "lucide-react"
import type { Note } from "./note-card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface NoteEditorModalProps {
  note: Note | null
  isOpen: boolean
  onClose: () => void
  onSave: (note: Note) => void
}

export function NoteEditorModal({ note, isOpen, onClose, onSave }: NoteEditorModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPinned, setIsPinned] = useState(false)
  const [lastModified, setLastModified] = useState<Date>(new Date())

  // Reset form when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content || "")
      setIsPinned(note.isPinned)
      setLastModified(new Date())
    }
  }, [note])

  const handleSave = () => {
    if (!note) return

    onSave({
      ...note,
      title,
      content,
      isPinned,
    })

    onClose()
  }

  const formattedDate = format(lastModified, "d MMMM", { locale: fr })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <div className="flex justify-between items-start mb-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre"
            className="text-xl font-medium border-none shadow-none focus-visible:ring-0 p-0 h-auto"
          />
          <Button variant="ghost" size="icon" onClick={() => setIsPinned(!isPinned)} className="h-8 w-8">
            <Pin className="h-4 w-4" fill={isPinned ? "black" : "none"} />
          </Button>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ajouter une note..."
          className="min-h-[100px] border-none shadow-none focus-visible:ring-0 p-0 resize-none"
        />

        <div className="flex justify-end items-center ">
          <div className="text-sm text-gray-500 font-bold">Modification : {formattedDate}</div>
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <div className="flex items-center gap-2">
            <IconButton icon={Smile} name="Emoji" />
            <IconButton icon={Bell} name="Rappel" />
            <IconButton icon={Users} name="Collaborateurs" />
            <IconButton icon={Image} name="Ajouter une image" />
            <ColorPickerButton />
            <IconButton icon={MoreVertical} name="Plus d'options" />
            <IconButton icon={Undo2} name="Annuler" />
            <IconButton icon={Redo2} name="Rétablir" />
          </div>

          <Button variant={"outline"} onClick={handleSave}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

