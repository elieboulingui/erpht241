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
    const {
      action,
      entityType,
      entityId,
      newData,
      userId,
      actionDetails,
      entityName,
    } = event.data;

    // Enregistrer l'activité dans le journal via Prisma
    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        newData: JSON.stringify(newData),
        userId,
        actionDetails,
        entityName,
      },
    });
  }
);
