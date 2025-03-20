"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArchiveRestore, Bell, Image, MoreVertical, Pin, Users, Palette } from "lucide-react"
import { IconButton } from "./icon-button"
import { NoteEditorModal } from "./NoteEditorModal"

export interface Note {
  id: string
  title: string
  content?: string
  isPinned: boolean
  lastModified: Date
}

interface NoteCardProps {
  note: Note
  isHovered: boolean
  onHover: (id: string | null) => void
  onTogglePin: (id: string) => void
  onUpdateNote: (id: string, updatedNote: Partial<Note>) => void
  onRefreshNotes: () => void
}

export function NoteCard({ note, isHovered, onHover, onTogglePin, onUpdateNote, onRefreshNotes }: NoteCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = () => {
    setIsModalOpen(true)
  }

  const handleSaveNote = (updatedNote: Note) => {
    onUpdateNote(note.id, updatedNote)
  }

  return (
    <>
      <Card
        className={cn("relative bg-white transition-shadow hover:shadow-md w-[30%]", "cursor-pointer group h-36")}
        onMouseEnter={() => onHover(note.id)}
        onMouseLeave={() => onHover(null)}
        onClick={handleCardClick}
      >
        <CardContent className="py-4 px-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between">
              <span className="font-medium">{note.title}</span>
              {isHovered && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTogglePin(note.id)
                  }}
                >
                  <Pin className="h-4 w-4" fill={note.isPinned ? "black" : "none"} />
                </Button>
              )}
            </div>
            {note.content && <p className="text-sm text-muted-foreground">{note.content}</p>}
          </div>

          {isHovered && (
            <div className="flex items-center gap-6 mt-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <IconButton icon={Bell} name="Rappel" onClick={(e) => e.stopPropagation()} />
              <IconButton icon={Users} name="Collaborateurs" onClick={(e) => e.stopPropagation()} />
              <IconButton icon={Palette} name="Modifier la couleur" onClick={(e) => e.stopPropagation()} />
              <IconButton icon={Image} name="Ajouter une image" onClick={(e) => e.stopPropagation()} />
              <IconButton icon={ArchiveRestore} name="Archiver" onClick={(e) => e.stopPropagation()} />
              <IconButton icon={MoreVertical} name="Plus d'options" onClick={(e) => e.stopPropagation()} />
            </div>
          )}
        </CardContent>
      </Card>

      <NoteEditorModal
        note={note}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        onRefreshNotes={onRefreshNotes}
      />
    </>
  )
}

