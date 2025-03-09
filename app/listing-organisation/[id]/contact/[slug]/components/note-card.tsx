"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArchiveRestore, Bell, Image, MoreVertical, Pin, Users } from "lucide-react"
import { IconButton } from "./icon-button"
import { ColorPickerButton } from "./color-picker-button"

export interface Note {
  id: string
  title: string
  content?: string
  isPinned: boolean
}
interface NoteCardProps {
  note: Note
  isHovered: boolean
  onHover: (id: string | null) => void
  onTogglePin: (id: string) => void
}

export function NoteCard({ note, isHovered, onHover, onTogglePin }: NoteCardProps) {
  return (
    <Card
      className={cn("relative bg-white transition-shadow hover:shadow-md  w-[20%] ", "cursor-pointer group")}
      onMouseEnter={() => onHover(note.id)}
      onMouseLeave={() => onHover(null)}
    >
      <CardContent className="p-4">
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
                <Pin className="h-4 w-4" />
              </Button>
            )}
          </div>
          {note.content && <p className="text-sm text-muted-foreground">{note.content}</p>}
        </div>

        {isHovered && (
          <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <IconButton icon={Bell} name="Rappel" />
            <IconButton icon={Users} name="Collaborateurs" />
            <ColorPickerButton />
            <IconButton icon={Image} name="Ajouter une image" />
            <IconButton icon={ArchiveRestore} name="Archiver" />
            <IconButton icon={MoreVertical} name="Plus d'options" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

