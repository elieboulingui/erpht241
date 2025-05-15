import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, MapPin, Trash2, Users, Video } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale"; // Assurez-vous d'importer la locale de 'date-fns'

interface RendezVousSheetProps {
  cardId: string;
}

export function RendezVousSheet({ cardId }: RendezVousSheetProps) {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fonction pour récupérer les rendez-vous via l'API
  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/opportunitymeeting?id=${cardId}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des rendez-vous");
      }

      const data = await response.json();
      setMeetings(data); // Mettre à jour l'état avec les rendez-vous récupérés
    } catch (error) {
      toast.error("Erreur lors de la récupération des rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  // Utiliser useEffect pour récupérer les rendez-vous lorsque le composant est monté
  useEffect(() => {
    fetchMeetings();
  }, [cardId]); // Recharger les rendez-vous quand cardId change

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== id));
    toast.success("Rendez-vous supprimé");
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <>
      <div className="mt-6 space-y-4">
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
    </>
  );
}
