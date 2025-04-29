import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logProductArchived = inngest.createFunction(
  {
    name: "Log Product Archived",
    id: "a"
  },
  { event: "product/archived" },
  async ({ event }) => {
    const { organisationId, productId, oldData, newData, userId } = event.data;

    // Récupérer l'adresse IP via l'API ipify
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    const ip = data.ip; // L'adresse IP

    // Créer l'entrée dans l'Activity Log avec l'adresse IP
    await prisma.activityLog.create({
      data: {
        action: "ARCHIVE_PRODUCT",
        entityType: "Product",
        entityId: productId,
        organisationId,
        oldData: JSON.stringify(oldData), // Anciennes données du produit
        newData: JSON.stringify(newData), // Nouvelles données du produit
        userId, // ID de l'utilisateur ayant archivé
        createdByUserId: userId, // L'utilisateur ayant initié l'action
        createdAt: new Date(),
        ipAddress: ip, // Ajout de l'adresse IP dans le log
      },
    });

    return { message: "Log d'archivage du produit créé avec succès via Inngest" };
  }
);
