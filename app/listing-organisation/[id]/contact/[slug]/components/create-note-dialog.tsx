"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Image, MoreVertical, Pin, Plus, Redo, Undo, Users } from "lucide-react"
import { IconButton } from "./icon-button"
import { ColorPickerButton } from "./color-picker-button"

interface CreateNoteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreateNote: (title: string, content: string) => void
}

export function CreateNoteDialog({ isOpen, onOpenChange, onCreateNote }: CreateNoteDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleCreateNote = () => {
    onCreateNote(title, content)
    setTitle("")
    setContent("")
  }

  return (
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
            <IconButton icon={Bell} name="Rappel" />
            <IconButton icon={Users} name="Collaborateurs" />
            <ColorPickerButton />
            <IconButton icon={Image} name="Ajouter une image" />
            <IconButton icon={Plus} name="Ajouter" />
            <IconButton icon={MoreVertical} name="Plus d'options" />
            <IconButton icon={Undo} name="Annuler" />
            <IconButton icon={Redo} name="Rétablir" />
          </div>

          <Button variant="ghost" onClick={handleCreateNote}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

