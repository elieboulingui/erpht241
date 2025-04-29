import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logInvitationSent = inngest.createFunction(
  {
    name: "Log Invitation Sent",
    id: "1",
  },
  { event: "invitation/sent" },
  async ({ event }) => {
    const {
      invitationId,
      userId,
      createdByUserId,
      organisationId,
      email,
      role,
      accessType,
      ipAddress: eventIp, // Récupération de l'IP depuis l'événement
    } = event.data;

    // 🔁 Si l'IP n'est pas incluse, récupérer l'IP via l'API ipify
    let ipAddress = eventIp;
    if (!ipAddress) {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ipAddress = data.ip;
      } catch (err) {
        console.warn("Impossible de récupérer l'adresse IP :", err);
        ipAddress = "unknown"; // Définir une valeur par défaut en cas d'échec
      }
    }

    // Enregistrement du log d'activité
    await prisma.activityLog.create({
      data: {
        action: "INVITATION_ENVOYÉE",
        entityType: "invitation",
        entityId: invitationId,
        userId,
        createdByUserId,
        organisationId,
        newData: { email, role, accessType },
        createdAt: new Date(),
        ipAddress, // Ajout de l'adresse IP
      },
    });

    return { message: "Activity log enregistré via Inngest" };
  }
);
