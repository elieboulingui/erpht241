import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Fonction Inngest pour enregistrer un log d'activité lorsque la note est supprimée
export const logNoteDeleted = inngest.createFunction(
    { id: 'note-deleted', name: 'Note Deleted' }, // Assurez-vous que ce nom est valide
    { event: 'note/deleted' },  // L'événement auquel cette fonction est associée
  async ({ event }) => {
    try {
      const { userId, noteId, contactId, organisationId, activity } = event.data;

      console.log("Création du log pour la suppression de la note :", noteId); // Log pour débogage

      // Récupérer l'adresse IP via l'API ipify (ou une autre méthode)
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const ip = data.ip; // L'adresse IP récupérée

      // Création du log d'activité dans la base de données
      await prisma.activityLog.create({
        data: {
          action: "DELETE", // Action de suppression
          entityType: "Note",
          entityId: noteId,
          organisationId, // ID de l'organisation
          contactId, // ID du contact concerné
          createdByUserId: userId, // L'utilisateur qui a supprimé la note
          newData: JSON.stringify({ isArchived: true, archivedAt: new Date() }), // Détails de la suppression
          createdAt: new Date(),
          ipAddress: ip, // Ajouter l'adresse IP dans le log
          actionDetails: activity, // Détails de l'action
        },
      });

      console.log("Log créé avec succès pour la suppression de la note :", noteId); // Log pour débogage

      return { message: "Activity log note supprimée créé avec succès via Inngest" };
    } catch (error) {
      console.error("Erreur dans la fonction logNoteDeleted : ", error);
      throw error; // Relancer l'erreur si elle se produit
    }
  }
);
