// /src/inngest/functions/logInvitationAccepted.ts
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Utilise la méthode createFunction avec 3 arguments
export const logInvitationAccepted = inngest.createFunction(
  // Configuration générale de la fonction
  {
    id: "log-invitation-accepted",
    name: "Log activité - Invitation acceptée",
  },
  // Déclencheur (trigger)
  {
    event: "activity/invitation.accepted", // L'événement à écouter
  },
  // Handler de la fonction
  async ({ event }) => {
    try {
      const {
        action,
        entityType,
        entityId,
        newData,
        userId,
        actionDetails,
        entityName,
        role,  // Récupérer le rôle (s'il est envoyé)
        ipAddress, // Récupérer l'adresse IP (s'il est envoyé)
      } = event.data;

      // Enregistrer l'activité dans le journal via Prisma
      await prisma.activityLog.create({
        data: {
          action,
          entityType,
          entityId,
          newData: JSON.stringify(newData),  // Sérialiser newData pour Prisma
          userId,
          actionDetails,
          entityName,
          role,  // Ajouter le rôle de l'utilisateur
          ipAddress,  // Ajouter l'adresse IP de l'utilisateur
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'activité:", error);
      // Optionnel : Vous pouvez envoyer un message d'erreur si besoin
      throw new Error("Erreur lors de l'enregistrement de l'activité");
    }
  }
);
