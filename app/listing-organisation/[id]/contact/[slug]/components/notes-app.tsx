"use client"

import { useState } from "react"
import { CreateNoteInput } from "./create-note-input"
import { NoteSection } from "./note-section"
import { CreateNoteDialog } from "./create-note-dialog"

export interface Note {
  id: string
  title: string
  content?: string
  isPinned: boolean
}
export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "HLIUHIJJIO",
      isPinned: true,
    },
    {
      id: "2",
      title: "IKHIJ",
      content: "HIJKLJKLKL",
      isPinned: false,
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null)

  const pinnedNotes = notes.filter((note) => note.isPinned)
  const otherNotes = notes.filter((note) => !note.isPinned)

  const togglePin = (id: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, isPinned: !note.isPinned } : note)))
  }

  const createNote = (title: string, content: string) => {
    if (title.trim()) {
      const newNote = {
        id: Date.now().toString(),
        title: title,
        content: content.trim() || undefined,
        isPinned: false,
      }
      setNotes([newNote, ...notes])
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="p-4 ">
      <div className="mb-6 container mx-auto max-w-3xl">
        <CreateNoteInput onCreateClick={() => setIsDialogOpen(true)} />
      </div>

      {pinnedNotes.length > 0 && (
        <NoteSection
          title="EPINGLEES"
          notes={pinnedNotes}
          hoveredNoteId={hoveredNoteId}
          onHover={setHoveredNoteId}
          onTogglePin={togglePin}
        />
      )}

      <NoteSection
        title="AUTRES"
        notes={otherNotes}
        hoveredNoteId={hoveredNoteId}
        onHover={setHoveredNoteId}
        onTogglePin={togglePin}
      />

      <CreateNoteDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} onCreateNote={createNote} />
    </div>
  )
}

