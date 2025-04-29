// /src/inngest/functions/logInvitationAccepted.ts
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logInvitationAccepted = inngest.createFunction(
  {
    id: "log-invitation-accepted",
    name: "Log activité - Invitation acceptée",
  },
  {
    event: "activity/invitation.accepted",
  },
  async ({ event }) => {
    const {
      action,
      entityType,
      entityId,
      newData,
      userId,
      actionDetails,
      entityName,
      ipAddress: eventIp, // Prise en charge de l'IP fournie
    } = event.data;

    // 🔁 Récupérer l'IP si elle n'est pas incluse dans l'événement
    let ipAddress = eventIp;
    if (!ipAddress) {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ipAddress = data.ip;
      } catch (err) {
        console.warn("Impossible de récupérer l'adresse IP :", err);
        ipAddress = "unknown";
      }
    }

    // Enregistrer l'activité
    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        newData: JSON.stringify(newData),
        userId,
        actionDetails,
        entityName,
        ipAddress, // ✅ Adresse IP ajoutée ici
      },
    });
  }
);
