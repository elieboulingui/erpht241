import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logContactUpdate = inngest.createFunction(
  {
    name: "Log Contact Update",
    id: "activity/updatecontact.created",
  },
  { event: "contact.updated" },
  async ({ event }) => {
    const { userId, contactId, oldData, newData } = event.data;

    // 🔍 Récupération de l’adresse IP publique
    const response = await fetch("https://api.ipify.org?format=json");
    const ipData = await response.json();
    const ip = ipData.ip;

    await prisma.activityLog.create({
      data: {
        action: "UPDATE",
        entityType: "Contact",
        entityId: contactId,
        oldData,
        newData,
        userId,
        contactId,
        createdByUserId: userId,
        updatedByUserId: userId,
        actionDetails: `Mise à jour du contact ${contactId}`,
        entityName: newData.name || oldData.name || null,
        ipAddress: ip, // ✅ Ajout de l'adresse IP
      },
    });
  }
);
