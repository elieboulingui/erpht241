import {  NoteCard } from "./note-card"


export interface Note {
  id: string
  title: string
  content?: string
  isPinned: boolean
}
interface NoteSectionProps {
  title: string
  notes: Note[]
  hoveredNoteId: string | null
  onHover: (id: string | null) => void
  onTogglePin: (id: string) => void
}

export function NoteSection({ title, notes, hoveredNoteId, onHover, onTogglePin }: NoteSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-medium text-muted-foreground mb-2">{title}</h2>
      <div className="grid grid-cols-1 gap-4">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isHovered={hoveredNoteId === note.id}
            onHover={onHover}
            onTogglePin={onTogglePin} onUpdateNote={function (note: Note): void {
              throw new Error("Function not implemented.")
            } }          />
        ))}
      </div>
    </div>
  )
}

