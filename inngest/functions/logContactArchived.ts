import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logContactArchived = inngest.createFunction(
  { name: "Log Contact Archive", id: "activity/contact.archive" },
  { event: "contact.archive" },
  async ({ event }) => {
    const { userId, contactId, oldData, newData } = event.data;

    // 🔍 Récupérer l'adresse IP publique du serveur (ou proxy)
    const response = await fetch("https://api.ipify.org?format=json");
    const ipData = await response.json();
    const ip = ipData.ip;

    await prisma.activityLog.create({
      data: {
        action: "ARCHIVE_CONTACT",
        entityType: "Contact",
        entityId: contactId,
        oldData,
        newData,
        userId,
        createdByUserId: userId,
        updatedByUserId: userId,
        organisationId: oldData.organisationId ?? null,
        contactId,
        actionDetails: `Contact ${newData.name ?? contactId} archivé via Inngest.`,
        entityName: newData.name ?? null,
        ipAddress: ip, // ✅ Ajout de l’adresse IP ici
      },
    });
  }
);
