"use client"

import { useState } from "react"
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Plus, CalendarIcon, Clock, MapPin, Users, Trash2, X, Video } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface RendezVousSheetProps {
  cardId: string
}

export function RendezVousSheet({ cardId }: RendezVousSheetProps) {
  const [meetings, setMeetings] = useState<
    Array<{
      id: string
      title: string
      date: Date
      time: string
      location: string
      type: "physical" | "virtual"
      participants: string[]
      notes: string
    }>
  >([
    {
      id: "1",
      title: "Présentation initiale",
      date: new Date(2023, 4, 15),
      time: "14:30",
      location: "Bureau client",
      type: "physical",
      participants: ["Jean Dupont", "Marie Martin"],
      notes: "Présenter les fonctionnalités principales du produit",
    },
    {
      id: "2",
      title: "Suivi de projet",
      date: new Date(2023, 4, 22),
      time: "10:00",
      location: "Zoom",
      type: "virtual",
      participants: ["Jean Dupont", "Sophie Leclerc"],
      notes: "Faire le point sur l'avancement du projet",
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: new Date(),
    time: "",
    location: "",
    type: "physical" as "physical" | "virtual",
    participants: "",
    notes: "",
  })

  const handleCreateMeeting = () => {
    if (!newMeeting.title || !newMeeting.time) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    const meetingToAdd = {
      id: Date.now().toString(),
      title: newMeeting.title,
      date: newMeeting.date,
      time: newMeeting.time,
      location: newMeeting.location,
      type: newMeeting.type,
      participants: newMeeting.participants
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p),
      notes: newMeeting.notes,
    }

    setMeetings([...meetings, meetingToAdd])
    setNewMeeting({
      title: "",
      date: new Date(),
      time: "",
      location: "",
      type: "physical",
      participants: "",
      notes: "",
    })
    setIsCreating(false)
    toast.success("Rendez-vous créé avec succès")
  }

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter((m) => m.id !== id))
    toast.success("Rendez-vous supprimé")
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-white">Rendez-vous</SheetTitle>
        <SheetDescription className="text-gray-400">Planifiez et gérez vos rendez-vous avec le client</SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-4">
        {!isCreating ? (
          <Button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600"
          >
            <Plus size={16} />
            Planifier un rendez-vous
          </Button>
        ) : (
          <div className="bg-gray-700 p-4 rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Nouveau rendez-vous</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)} className="h-6 w-6">
                <X size={16} />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-title">Titre</Label>
              <Input
                id="meeting-title"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                className="bg-gray-800 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={newMeeting.date}
                onSelect={(date) => date && setNewMeeting({ ...newMeeting, date })}
                className="border border-gray-600 rounded-md bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-time">Heure</Label>
              <Input
                id="meeting-time"
                type="time"
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                className="bg-gray-800 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label>Type de rendez-vous</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={newMeeting.type === "physical" ? "default" : "outline"}
                  className={newMeeting.type === "physical" ? "bg-[#7f1d1c] hover:bg-[#7f1d1c]/80" : "border-gray-600"}
                  onClick={() => setNewMeeting({ ...newMeeting, type: "physical" })}
                >
                  <MapPin size={16} className="mr-2" />
                  Présentiel
                </Button>
                <Button
                  type="button"
                  variant={newMeeting.type === "virtual" ? "default" : "outline"}
                  className={newMeeting.type === "virtual" ? "bg-[#7f1d1c] hover:bg-[#7f1d1c]/80" : "border-gray-600"}
                  onClick={() => setNewMeeting({ ...newMeeting, type: "virtual" })}
                >
                  <Video size={16} className="mr-2" />
                  Virtuel
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-location">Lieu / Lien</Label>
              <Input
                id="meeting-location"
                value={newMeeting.location}
                onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                className="bg-gray-800 border-gray-600"
                placeholder={newMeeting.type === "physical" ? "Adresse physique" : "Lien de visioconférence"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-participants">Participants (séparés par des virgules)</Label>
              <Input
                id="meeting-participants"
                value={newMeeting.participants}
                onChange={(e) => setNewMeeting({ ...newMeeting, participants: e.target.value })}
                className="bg-gray-800 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-notes">Notes</Label>
              <Textarea
                id="meeting-notes"
                value={newMeeting.notes}
                onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                className="bg-gray-800 border-gray-600 min-h-[80px]"
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
              <Button onClick={handleCreateMeeting} className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/80">
                Planifier
              </Button>
            </div>
          </div>
        )}

        {meetings.length > 0 ? (
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="bg-gray-700 p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{meeting.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-300">
                      <div className="flex items-center">
                        <CalendarIcon size={14} className="mr-1 text-gray-400" />
                        {format(meeting.date, "dd MMMM yyyy", { locale: fr })}
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1 text-gray-400" />
                        {meeting.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-300">
                      {meeting.type === "physical" ? (
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-1 text-gray-400" />
                          {meeting.location}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Video size={14} className="mr-1 text-gray-400" />
                          {meeting.location}
                        </div>
                      )}
                    </div>
                    {meeting.participants.length > 0 && (
                      <div className="flex items-center mt-1 text-sm text-gray-300">
                        <Users size={14} className="mr-1 text-gray-400" />
                        {meeting.participants.join(", ")}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-400"
                    onClick={() => handleDeleteMeeting(meeting.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                {meeting.notes && (
                  <div className="mt-2 text-sm text-gray-400 bg-gray-800 p-2 rounded-md">{meeting.notes}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Aucun rendez-vous planifié</p>
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
