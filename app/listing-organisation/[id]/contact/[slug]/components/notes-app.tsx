"use client";

import { useState, useEffect } from "react";
import { CreateNoteInput } from "./create-note-input";
import { NoteSection } from "./note-section";
import { CreateNoteDialog } from "./create-note-dialog";

export interface Note {
  id: string;
  title: string;
  content?: string;
  isPinned: boolean;
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);

  // Fonction pour extraire l'ID du contact à partir de l'URL
  const extractContactId = (url: string): string | null => {
    const regex = /contact\/([a-z0-9]{16})/; // L'ID semble être un alphanumérique de 16 caractères
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Utilisation de useEffect pour récupérer les notes dès que l'ID est disponible
  useEffect(() => {
    const url = window.location.href; // Récupère l'URL actuelle
    const contactId = extractContactId(url); // Extrait l'ID du contact

    if (contactId) {
      fetchNotes(contactId); // Appelle la fonction pour récupérer les notes
    }
  }, []);

  // Fonction pour récupérer les notes de l'API
  const fetchNotes = async (contactId: string) => {
    try {
      alert(contactId)
      const response = await fetch(`/api/notes?contactId=${contactId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Notes fetched:", data);
        setNotes(data); // Mettez à jour l'état avec les notes récupérées
      } else {
        console.error("Failed to fetch notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
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

      <CreateNoteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateNote={createNote}
      />
    </div>
  );
}
