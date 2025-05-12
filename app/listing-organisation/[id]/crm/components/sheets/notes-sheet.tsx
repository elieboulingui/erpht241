"use client"

import { useState } from "react"
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Plus, StickyNote, Trash2, X, Edit2, Save } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface NotesSheetProps {
  cardId: string
}

export function NotesSheet({ cardId }: NotesSheetProps) {
  const [notes, setNotes] = useState<
    Array<{
      id: string
      title: string
      content: string
      date: string
      author: {
        name: string
        initials: string
      }
    }>
  >([
    {
      id: "1",
      title: "Appel initial",
      content: "Le client est intéressé par notre solution premium. Il souhaite une démo la semaine prochaine.",
      date: "10/05/2023 à 14:30",
      author: {
        name: "Jean Dupont",
        initials: "JD",
      },
    },
    {
      id: "2",
      title: "Points à aborder lors de la démo",
      content:
        "- Fonctionnalités de reporting\n- Intégration avec leur CRM existant\n- Options de personnalisation\n- Tarification pour 25 utilisateurs",
      date: "12/05/2023 à 09:15",
      author: {
        name: "Marie Martin",
        initials: "MM",
      },
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
  })

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState({
    title: "",
    content: "",
  })

  const handleCreateNote = () => {
    if (!newNote.title || !newNote.content) {
      toast.error("Veuillez remplir tous les champs")
      return
    }

    const noteToAdd = {
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
    setNewNote({
      title: "",
      content: "",
    })
    setIsCreating(false)
    toast.success("Note ajoutée avec succès")
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id))
    toast.success("Note supprimée")
  }

  const handleEditNote = (note: (typeof notes)[0]) => {
    setEditingNoteId(note.id)
    setEditingNote({
      title: note.title,
      content: note.content,
    })
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
    toast.success("Note mise à jour")
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
        {!isCreating ? (
          <Button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600"
          >
            <Plus size={16} />
            Ajouter une note
          </Button>
        ) : (
          <div className="bg-gray-700 p-4 rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Nouvelle note</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)} className="h-6 w-6">
                <X size={16} />
              </Button>
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Titre de la note"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="bg-gray-800 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Contenu de la note..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="bg-gray-800 border-gray-600 min-h-[120px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsCreating(false)}
                className="text-gray-300 hover:text-white hover:bg-gray-600"
              >
                Annuler
              </Button>
              <Button onClick={handleCreateNote} className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/80">
                Ajouter
              </Button>
            </div>
          </div>
        )}

        {notes.length > 0 ? (
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
                          <AvatarFallback className="text-xs">{note.author.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-400">{note.author.name}</span>
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
          <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700 hover:text-white">
            Fermer
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}
