import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Fonction pour récupérer l'adresse IP de l'appareil
async function getIpAddress() {
  const response = await fetch("https://api.ipify.org/?format=json");
  const data = await response.json();
  return data.ip;
}

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
    } = event.data;

    // Récupère l'adresse IP de l'appareil
    const ipAddress = await getIpAddress();

    // Enregistre le log de l'invitation envoyée dans la base de données
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

    return { message: "Activity log enregistré via Inngest avec adresse IP" };
  }
);
