import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logNoteCreated = inngest.createFunction(
    { id: "log-note-created", name: "Log Note Created" },
    { event: "activity/note.created" },
    async ({ event }) => {
      try {
        const { userId, noteId, contactId, organisationId, activity, noteDetails } = event.data;
  
        // Ajoutez des logs pour vérifier la présence de noteId
        console.log("Vérification des données de l'événement:", event.data);
  
        // Vérifier si `noteId` est présent
        if (!noteId) {
          throw new Error("Missing noteId.");
        }
  
        // Récupérer l'adresse IP via l'API ipify
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        const ip = data.ip; // L'adresse IP récupérée
  
        // Enregistrer un log d'activité dans la base de données
        await prisma.activityLog.create({
          data: {
            action: "CREATE",
            entityType: "Note",
            entityId: noteId, // ID de la note créée
            organisationId,
            contactId,
            createdByUserId: userId,
            newData: JSON.stringify(noteDetails),
            createdAt: new Date(),
            ipAddress: ip,
            actionDetails: activity,
          },
        });
  
        console.log("Log créé avec succès pour la note :", noteId); // Log pour débogage
  
        return { message: "Activity log note créée avec succès via Inngest" };
      } catch (error) {
        console.error("Erreur dans la fonction logNoteCreated : ", error);
        return { message: `Échec de la création du log d'activité` };
      }
    }
  );
  