import { inngest } from "@/inngest/client";  // Importation de l'API Inngest
import prisma from "@/lib/prisma";  // Client Prisma pour interagir avec ta base de données

// Création de la fonction Inngest pour traiter l'événement "activity/updatenote.created"
export const logNoteUpdated = inngest.createFunction(
  { id: 'note-updated', name: 'Note Updated' },  // ID et nom de la fonction
  { event: 'activitys/updatenote.created' },  // L'événement auquel cette fonction est associée
  async ({ event }) => {
    try {
      // Extraction des données de l'événement
      const { action, entityType, entityId, entityName, oldData, newData, userId, actionDetails } = event.data;

      console.log("Handling note update event:", event.data);  // Log pour débogage

      // Récupération de l'adresse IP via l'API ipify
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      const ipAddress = ipData.ip;  // L'adresse IP récupérée

      // Création d'un log d'activité dans la base de données via Prisma
      await prisma.activityLog.create({
        data: {
          action,  // Action effectuée
          entityType,  // Type de l'entité (ici, Note)
          entityId,  // ID de l'entité mise à jour
          entityName,  // Nom de l'entité (titre de la note)
          oldData: JSON.stringify(oldData),  // Données avant la mise à jour
          newData: JSON.stringify(newData),  // Données après la mise à jour
          createdByUserId: userId,  // ID de l'utilisateur ayant effectué l'action
          ipAddress,  // Ajout de l'adresse IP récupérée
          actionDetails,  // Détails supplémentaires sur l'action
          createdAt: new Date(),  // Date de création du log
        },
      });

      console.log("Activity log created successfully for note update:", entityId);  // Log pour débogage

      return { message: "Activity log created successfully" };  // Retourner un message de succès
    } catch (error) {
      console.error("Error logging note update:", error);  // Log des erreurs
      throw error;  // Relancer l'erreur si elle se produit
    }
  }
);
