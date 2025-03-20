"use client";

import { useState, useEffect } from "react";
import { CreateNoteInput } from "./create-note-input";
import { NoteSection } from "./note-section";
import { CreateNoteDialog } from "./create-note-dialog";
import { updateNote } from "../actions/updateNote";
import Chargement from "@/components/Chargement"

export interface Note {
  id: string;
  title: string;
  content?: string;
  isPinned: boolean;
  lastModified: Date;
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const extractContactId = (url: string): string | null => {
    const regex = /contact\/([a-z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const url = window.location.href;
    const contactId = extractContactId(url);

    if (contactId) {
      fetchNotes(contactId);
    }
  }, []);

  const fetchNotes = async (contactId: string) => {
    try {
      const response = await fetch(`/api/notes?contactId=${contactId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Notes fetched:", data);
        setNotes(data);
      } else {
        console.error("Failed to fetch notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const pinnedNotes = notes.filter((note) => note.isPinned);
  const otherNotes = notes.filter((note) => !note.isPinned);

  const togglePin = (id: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
  };

  const createNote = (title: string, content: string) => {
    if (title.trim()) {
      const newNote = {
        id: Date.now().toString(),
        title: title,
        content: content.trim() || undefined,
        isPinned: false,
        lastModified: new Date(),
      };
      setNotes([newNote, ...notes]);
      setIsDialogOpen(false);
    }
  };

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
            />
          )}

          <NoteSection
            title="AUTRES"
            notes={otherNotes}
            hoveredNoteId={hoveredNoteId}
            onHover={setHoveredNoteId}
            onTogglePin={togglePin}
            onUpdateNote={updateNote}
          />
        </>
      )}

      <CreateNoteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateNote={createNote}
      />
    </div>
  );
}
