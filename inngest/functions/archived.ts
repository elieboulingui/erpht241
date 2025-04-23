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

    // Créer l'entrée dans l'Activity Log
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
      },
    });

    return { message: "Log d'archivage du produit créé avec succès via Inngest" };
  }
);
