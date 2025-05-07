"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Clock, MapPin, Trash2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"

type Appointment = {
  id: string
  title: string
  description?: string
  date: Date
  endTime?: Date
  location?: string
  type: "meeting" | "call" | "video"
  participants: {
    id: string
    name: string
    avatar?: string
  }[]
  contact: {
    id: string
    name: string
  }
}

export default function AppointmentTab() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      title: "Présentation de notre nouvelle offre commerciale",
      description:
        "Présentation détaillée de notre gamme de produits premium et discussion des opportunités de partenariat",
      date: new Date(2025, 4, 15, 10, 0),
      endTime: new Date(2025, 4, 15, 11, 30),
      location: "Siège du client - 15 rue de la Paix, Paris",
      type: "meeting",
      participants: [
        {
          id: "user1",
          name: "Sophie Martin",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "client1",
          name: "Jean Dupont",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
      contact: {
        id: "contact1",
        name: "Entreprise ABC",
      },
    },
    {
      id: "2",
      title: "Suivi de prospection commerciale",
      description: "Point d'étape sur les opportunités identifiées et stratégie de développement du compte",
      date: new Date(2025, 4, 10, 14, 0),
      endTime: new Date(2025, 4, 10, 14, 30),
      type: "call",
      participants: [
        {
          id: "user2",
          name: "Thomas Dubois",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
      contact: {
        id: "contact2",
        name: "Société XYZ",
      },
    },
    {
      id: "3",
      title: "Négociation finale du contrat",
      description: "Discussion des derniers points contractuels et finalisation de l'accord commercial",
      date: new Date(2025, 4, 20, 11, 0),
      endTime: new Date(2025, 4, 20, 12, 0),
      type: "video",
      location: "https://meet.google.com/abc-defg-hij",
      participants: [
        {
          id: "user1",
          name: "Sophie Martin",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "user2",
          name: "Thomas Dubois",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "client1",
          name: "Jean Dupont",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
      contact: {
        id: "contact3",
        name: "Client 123",
      },
    },
    {
      id: "4",
      title: "Démonstration produit pour décideurs",
      description: "Présentation technique et commerciale de notre solution aux décideurs clés",
      date: new Date(2025, 4, 18, 9, 0),
      endTime: new Date(2025, 4, 18, 10, 30),
      type: "meeting",
      location: "Bureaux du client - 8 avenue des Champs-Élysées, Paris",
      participants: [
        {
          id: "user1",
          name: "Sophie Martin",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
      contact: {
        id: "contact2",
        name: "Société XYZ",
      },
    },
    {
      id: "5",
      title: "Réunion de lancement projet",
      description: "Kick-off du projet suite à la signature du contrat, définition des prochaines étapes",
      date: new Date(2025, 4, 25, 14, 0),
      endTime: new Date(2025, 4, 25, 16, 0),
      type: "meeting",
      location: "Nos bureaux - 23 rue du Commerce, Paris",
      participants: [
        {
          id: "user2",
          name: "Thomas Dubois",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "client1",
          name: "Jean Dupont",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
      contact: {
        id: "contact1",
        name: "Entreprise ABC",
      },
    },
  ])

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedView, setSelectedView] = useState<"list" | "calendar">("list")
  const [selectedContact, setSelectedContact] = useState<string>("all")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const contacts = [
    { id: "all", name: "Tous les contacts" },
    { id: "contact1", name: "Entreprise ABC" },
    { id: "contact2", name: "Société XYZ" },
    { id: "contact3", name: "Client 123" },
  ]

  const filteredAppointments =
    selectedContact === "all"
      ? appointments
      : appointments.filter((appointment) => appointment.contact.id === selectedContact)

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4" />
      case "call":
        return <Clock className="h-4 w-4" />
      case "video":
        return <Users className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "meeting":
        return "Réunion"
      case "call":
        return "Appel"
      case "video":
        return "Visioconférence"
      default:
        return "Réunion"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800"
      case "call":
        return "bg-green-100 text-green-800"
      case "video":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Rendez-vous commerciaux</h3>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <button
              className={`px-3 py-1 text-sm ${selectedView === "list" ? "bg-[#7f1d1c] text-white" : "bg-gray-100"}`}
              onClick={() => setSelectedView("list")}
            >
              Liste
            </button>
            <button
              className={`px-3 py-1 text-sm ${selectedView === "calendar" ? "bg-[#7f1d1c] text-white" : "bg-gray-100"}`}
              onClick={() => setSelectedView("calendar")}
            >
              Calendrier
            </button>
          </div>

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

      {selectedView === "list" && (
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun rendez-vous planifié</p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{appointment.title}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                          onClick={() => deleteAppointment(appointment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-xs text-[#7f1d1c] font-medium mt-1">Contact: {appointment.contact.name}</div>

                      {appointment.description && (
                        <p className="text-sm text-gray-600 mt-1">{appointment.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{format(appointment.date, "d MMM yyyy", { locale: fr })}</span>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(appointment.date, "HH:mm")}
                            {appointment.endTime && ` - ${format(appointment.endTime, "HH:mm")}`}
                          </span>
                        </div>

                        <Badge className={getTypeColor(appointment.type)}>
                          {getTypeIcon(appointment.type)}
                          <span className="ml-1">{getTypeLabel(appointment.type)}</span>
                        </Badge>
                      </div>

                      {appointment.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="break-all">{appointment.location}</span>
                        </div>
                      )}

                      {appointment.participants.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-gray-500 mb-1">Participants:</div>
                          <div className="flex flex-wrap gap-2">
                            {appointment.participants.map((participant) => (
                              <div key={participant.id} className="flex items-center gap-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                                  <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{participant.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {selectedView === "calendar" && (
        <div className="border rounded-md p-4">
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="mx-auto" />

          <div className="mt-4">
            <h4 className="font-medium text-sm">
              {selectedDate ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr }) : "Sélectionnez une date"}
            </h4>

            <div className="space-y-2 mt-2 max-h-[300px] overflow-y-auto pr-2">
              {selectedDate &&
                filteredAppointments
                  .filter((a) => format(a.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))
                  .map((appointment) => (
                    <div key={appointment.id} className="p-2 border rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(appointment.type)}>{getTypeIcon(appointment.type)}</Badge>
                          <span className="font-medium text-sm">{appointment.title}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {format(appointment.date, "HH:mm")}
                          {appointment.endTime && ` - ${format(appointment.endTime, "HH:mm")}`}
                        </span>
                      </div>
                      <div className="text-xs text-[#7f1d1c] font-medium mt-1">Contact: {appointment.contact.name}</div>
                    </div>
                  ))}

              {selectedDate &&
                filteredAppointments.filter((a) => format(a.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))
                  .length === 0 && <p className="text-sm text-gray-500 py-2">Aucun rendez-vous pour cette date</p>}
            </div>
          </div>
        </div>
      )}

      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent className="sm:max-w-md">
          {selectedAppointment && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedAppointment.title}</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="text-xs text-[#7f1d1c] font-medium mb-2">
                  Contact: {selectedAppointment.contact.name}
                </div>
                {selectedAppointment.description && (
                  <p className="text-sm text-gray-600 mb-4">{selectedAppointment.description}</p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span>{format(selectedAppointment.date, "d MMMM yyyy", { locale: fr })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      {format(selectedAppointment.date, "HH:mm")}
                      {selectedAppointment.endTime && ` - ${format(selectedAppointment.endTime, "HH:mm")}`}
                    </span>
                  </div>
                  {selectedAppointment.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{selectedAppointment.location}</span>
                    </div>
                  )}
                </div>

                {selectedAppointment.participants.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Participants:</h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                      {selectedAppointment.participants.map((participant) => (
                        <div key={participant.id} className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                            <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{participant.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                  Fermer
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
