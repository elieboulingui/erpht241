"use client"

import { useEffect, useState } from "react"
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Plus, StickyNote, Trash2, X, Edit2, Save } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Chargement from "@/components/Chargement"
import { Loader } from "@/components/ChargementCart"

interface NotesSheetProps {
  cardId: string
}

interface Note {
  id: string
  title: string
  content: string
  date: string
  author?: {
    name?: string
    initials?: string
  }
}

export function NotesSheet({ cardId }: NotesSheetProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState({ title: "", content: "" })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNotes() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/note/${cardId}/devis`)
        const data = await res.json()
        if (res.ok) {
          setNotes(data.notes || [])
        } else {
          toast.error(data.error || "Erreur lors du chargement des notes")
        }
      } catch (error) {
        console.error("Erreur API:", error)
        toast.error("Impossible de récupérer les notes")
      } finally {
        setIsLoading(false)
      }
    }

    if (cardId) {
      fetchNotes()
    }
  }, [cardId])

  const handleCreateNote = () => {
    if (!newNote.title || !newNote.content) {
      toast.error("Veuillez remplir tous les champs")
      return
    }

    const noteToAdd: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      date: new Date().toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      author: {
        name: "Jo Nath",
        initials: "JN",
      },
    }

    setNotes([noteToAdd, ...notes])
    setNewNote({ title: "", content: "" })
    setIsCreating(false)
    toast.success("Note ajoutée (non sauvegardée en base)")
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id))
    toast.success("Note supprimée (non supprimée en base)")
  }

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id)
    setEditingNote({ title: note.title, content: note.content })
  }

  const handleSaveEdit = (id: string) => {
    if (!editingNote.title || !editingNote.content) {
      toast.error("Veuillez remplir tous les champs")
      return
    }

    setNotes(
      notes.map((note) =>
        note.id === id
          ? {
              ...note,
              title: editingNote.title,
              content: editingNote.content,
              date: note.date + " (modifiée)",
            }
          : note,
      ),
    )

    setEditingNoteId(null)
    toast.success("Note mise à jour (non sauvegardée en base)")
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-white">Notes</SheetTitle>
        <SheetDescription className="text-gray-400">
          Ajoutez et consultez les notes relatives à cette opportunité
        </SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-4">
        {isLoading ? (
         <Loader/>
        ) : notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-gray-700 p-4 rounded-md">
                {editingNoteId === note.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editingNote.title}
                      onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                      className="bg-gray-800 border-gray-600 font-medium"
                    />
                    <Textarea
                      value={editingNote.content}
                      onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                      className="bg-gray-800 border-gray-600 min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingNoteId(null)}
                        className="text-gray-300 hover:text-white"
                      >
                        Annuler
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(note.id)}
                        className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/80"
                      >
                        <Save size={14} className="mr-1" />
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <StickyNote size={18} className="text-yellow-400 mt-1" />
                        <div>
                          <h4 className="font-medium">{note.title}</h4>
                          <p className="whitespace-pre-line text-sm mt-2">{note.content}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-white"
                          onClick={() => handleEditNote(note)}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-red-400"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-600 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 bg-red-500">
                          <AvatarFallback className="text-xs">
                            {note.author?.initials ?? "??"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-400">
                          {note.author?.name ?? "Inconnu"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{note.date}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Aucune note disponible</p>
          </div>
        )}
      </div>

      <SheetFooter className="mt-4">
        <SheetClose asChild>
          <Button variant="ghost" className="border-gray-600 text-white hover:bg-gray-700 hover:text-white">
            Fermer
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}
