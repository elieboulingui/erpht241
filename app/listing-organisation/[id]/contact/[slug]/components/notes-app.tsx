"use client"

import { useState, useEffect, useCallback } from "react"
import { CreateNoteInput } from "./create-note-input"
import { NoteSection } from "./note-section"
import { CreateNoteDialog } from "./create-note-dialog"
import { updateNote } from "../actions/updateNote"
import Chargement from "@/components/Chargement"

export interface Note {
  id: string
  title: string
  content?: string
  isPinned: boolean
  lastModified: Date
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [contactId, setContactId] = useState<string | null>(null)

  const extractContactId = (url: string): string | null => {
    const regex = /contact\/([a-z0-9]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  // Use useCallback to memoize the fetchNotes function
  const fetchNotes = useCallback(async (contactId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/notes?contactId=${contactId}`)
      if (response.ok) {
        const data = await response.json()
        console.log("Notes fetched:", data)
        setNotes(data)
      } else {
        console.error("Failed to fetch notes")
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create a refreshNotes function that can be passed to child components
  const refreshNotes = useCallback(() => {
    if (contactId) {
      fetchNotes(contactId)
    }
  }, [contactId, fetchNotes])

  useEffect(() => {
    const url = window.location.href
    const extractedContactId = extractContactId(url)

    if (extractedContactId) {
      setContactId(extractedContactId)
      fetchNotes(extractedContactId)
    }
  }, [fetchNotes])

  const pinnedNotes = notes.filter((note) => note.isPinned)
  const otherNotes = notes.filter((note) => !note.isPinned)

  const togglePin = async (id: string) => {
    const noteToUpdate = notes.find((note) => note.id === id)
    if (!noteToUpdate) return

    const updatedNote = { ...noteToUpdate, isPinned: !noteToUpdate.isPinned }

    // Optimistic update
    setNotes(notes.map((note) => (note.id === id ? updatedNote : note)))

    // Update in the backend
    try {
      await updateNote(id, { isPinned: updatedNote.isPinned })

      // Refresh notes after a short delay to ensure server sync
      setTimeout(() => {
        refreshNotes()
      }, 300)
    } catch (error) {
      console.error("Error updating note:", error)
      // Revert on error
      setNotes(notes.map((note) => (note.id === id ? noteToUpdate : note)))
    }
  }

  const handleCreateNote = async (title: string, content: string, contactId: string) => {
    if (!title.trim() || !contactId) return

    // Create a temporary ID for optimistic UI update
    const tempId = `temp-${Date.now()}`

    // Create new note object
    const newNote = {
      id: tempId,
      title: title,
      content: content.trim() || undefined,
      isPinned: false,
      lastModified: new Date(),
    }

    // Optimistic update - add the new note to the list immediately
    setNotes([newNote, ...notes])

    // The actual creation is handled by the CreateNoteDialog component
    // After creation, refresh the notes to get the real ID
    setTimeout(() => {
      refreshNotes()
    }, 300)
  }

  return (
    <div className="p-4 ">
      <div className="mb-6 container mx-auto max-w-3xl">
        <CreateNoteInput onCreateClick={() => setIsDialogOpen(true)} />
      </div>

      {loading ? (
        <Chargement />
      ) : (
        <>
          {pinnedNotes.length > 0 && (
            <NoteSection
              title="EPINGLEES"
              notes={pinnedNotes}
              hoveredNoteId={hoveredNoteId}
              onHover={setHoveredNoteId}
              onTogglePin={togglePin}
              onUpdateNote={updateNote}
              onRefreshNotes={refreshNotes}
            />
          )}

          <NoteSection
            title="AUTRES"
            notes={otherNotes}
            hoveredNoteId={hoveredNoteId}
            onHover={setHoveredNoteId}
            onTogglePin={togglePin}
            onUpdateNote={updateNote}
            onRefreshNotes={refreshNotes}
          />
        </>
      )}

      <CreateNoteDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} onCreateNote={handleCreateNote} />
    </div>
  )
}

