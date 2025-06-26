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
import { CalendarIcon, Clock, MapPin, Trash2, Users, Video } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader } from "@/components/ChargementCart"

interface RendezVousSheetProps {
  cardId: string
}

export function RendezVousSheet({ cardId }: RendezVousSheetProps) {
  const [meetings, setMeetings] = useState<Array<{
    id: string
    title: string
    date: string
    time: string
    type: string
    location: string
    participants: string[]
    notes?: string
  }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!cardId) {
      console.warn("cardId est undefined, fetch ignoré.")
      return
    }

    const fetchMeetings = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/opportunitymeeting?id=${cardId}`)
        const data = await res.json()

        if (res.ok) {
          setMeetings(Array.isArray(data) ? data : [])
        } else {
          toast.error(data.error || "Erreur lors du chargement des rendez-vous")
        }
      } catch (err) {
        console.error("Erreur lors du chargement des rendez-vous:", err)
        toast.error("Erreur réseau")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMeetings()
  }, [cardId])

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== id))
    toast.success("Rendez-vous supprimé")
  }

  if (!cardId) {
    return <div className="p-4 text-center text-red-500">Erreur : Aucun identifiant de carte fourni.</div>
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-white">Rendez-vous</SheetTitle>
        <SheetDescription className="text-gray-400">
          Gérez les rendez-vous associés à cette opportunité
        </SheetDescription>
      </SheetHeader>

      <div className="pb-16">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : meetings.length > 0 ? (
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="bg-gray-700 p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{meeting.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-300">
                      <div className="flex items-center">
                        <CalendarIcon size={14} className="mr-1 text-gray-400" />
                        {format(new Date(meeting.date), "dd MMMM yyyy", { locale: fr })}
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
                  <div className="mt-2 text-sm text-gray-400 bg-gray-800 p-2 rounded-md">
                    {meeting.notes}
                  </div>
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

      <div className="fixed bottom-0 right-0 w-full p-4 flex justify-end space-x-2">
        <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold px-4 py-2 rounded-lg">
          Ajouter
        </Button>
        <SheetClose asChild>
          <Button variant="ghost" className="border border-gray-600 text-white hover:bg-gray-700 hover:text-white">
            Fermer
          </Button>
        </SheetClose>
      </div>
    </>
  )
}