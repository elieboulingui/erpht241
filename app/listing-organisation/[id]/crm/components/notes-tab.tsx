"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Note = {
  id: string
  content: string
  createdAt: Date
  updatedAt?: Date
  author: {
    id: string
    name: string
    avatar?: string
  }
  contact: {
    id: string
    name: string
  }
}

export default function NotesTab() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      content:
        "Entretien commercial avec le directeur des achats. Points clés :\n- Budget annuel confirmé à 150 000 €\n- Recherche d'un partenaire pour refonte complète de leur système\n- Concurrence : ils discutent également avec nos 2 principaux concurrents\n- Critères de décision : prix, délai et support technique",
      createdAt: new Date(2025, 4, 5, 14, 30),
      author: {
        id: "user1",
        name: "Sophie Martin",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      contact: {
        id: "contact1",
        name: "Entreprise ABC",
      },
    },
    {
      id: "2",
      content:
        "Appel de suivi avec le responsable technique. Informations importantes :\n- Équipe technique favorable à notre solution après la démo\n- Préoccupations concernant la migration des données existantes\n- Demande d'une proposition détaillée incluant formation et support\n- Décision prévue d'ici 3 semaines",
      createdAt: new Date(2025, 4, 7, 10, 15),
      author: {
        id: "user2",
        name: "Thomas Dubois",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      contact: {
        id: "contact2",
        name: "Société XYZ",
      },
    },
    {
      id: "3",
      content:
        "Réunion stratégique avec le comité de direction. À retenir :\n- Expansion prévue sur 3 nouveaux marchés l'année prochaine\n- Besoin urgent d'une solution évolutive pour accompagner leur croissance\n- Budget supplémentaire possible pour des fonctionnalités premium\n- Demande de références dans leur secteur d'activité",
      createdAt: new Date(2025, 4, 9, 16, 45),
      author: {
        id: "user1",
        name: "Sophie Martin",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      contact: {
        id: "contact3",
        name: "Client 123",
      },
    },
    {
      id: "4",
      content:
        "Feedback après présentation commerciale :\n- Proposition bien reçue par l'équipe décisionnaire\n- Questions sur notre capacité à respecter les délais serrés\n- Intérêt particulier pour notre module d'analyse prédictive\n- Demande de rencontre avec notre directeur technique pour approfondir certains aspects",
      createdAt: new Date(2025, 4, 12, 11, 30),
      author: {
        id: "user2",
        name: "Thomas Dubois",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      contact: {
        id: "contact1",
        name: "Entreprise ABC",
      },
    },
    {
      id: "5",
      content:
        "Analyse de la situation concurrentielle :\n- Client actuellement sous contrat avec notre concurrent principal\n- Insatisfaction liée au support technique insuffisant\n- Opportunité de se différencier sur la qualité du service et la réactivité\n- Point de vigilance : ils négocient fermement sur les tarifs",
      createdAt: new Date(2025, 4, 14, 9, 15),
      author: {
        id: "user1",
        name: "Sophie Martin",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      contact: {
        id: "contact2",
        name: "Société XYZ",
      },
    },
  ])

  const [selectedContact, setSelectedContact] = useState<string>("all")
  const contacts = [
    { id: "all", name: "Tous les contacts" },
    { id: "contact1", name: "Entreprise ABC" },
    { id: "contact2", name: "Société XYZ" },
    { id: "contact3", name: "Client 123" },
  ]

  const filteredNotes = selectedContact === "all" ? notes : notes.filter((note) => note.contact.id === selectedContact)

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Notes commerciales</h3>
        <div className="flex items-center gap-2">
          <Select value={selectedContact} onValueChange={setSelectedContact}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par contact" />
            </SelectTrigger>
            <SelectContent>
              {contacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune note pour le moment</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={note.author.avatar || "/placeholder.svg"} alt={note.author.name} />
                    <AvatarFallback>{note.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-sm">{note.author.name}</span>
                        <span className="text-xs text-[#7f1d1c] font-medium ml-2">Contact: {note.contact.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {format(note.createdAt, "d MMM yyyy à HH:mm", { locale: fr })}
                        </span>
                        {note.updatedAt && (
                          <span className="text-xs text-gray-500 ml-2">
                            (modifié le {format(note.updatedAt, "d MMM yyyy à HH:mm", { locale: fr })})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-2 text-sm whitespace-pre-line">{note.content}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
