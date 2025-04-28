import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Fonction pour récupérer l'adresse IP depuis ipify
const getIpAddress = async (): Promise<string> => {
  const response = await fetch("https://api.ipify.org/?format=json");
  const data = await response.json();
  return data.ip;  // Récupérer l'adresse IP
};

export const logCategoryUpdated = inngest.createFunction(
  { id: "log-category-updated-only" },
  { event: "category/updated.log-only" },
  async ({ event }) => {
    const { oldData, newData, organisationId, userId } = event.data;

    // Récupérer l'adresse IP de l'utilisateur
    const ipAddress = await getIpAddress();

    // Log dans ActivityLog avec Prisma
    await prisma.activityLog.create({
      data: {
        action: "UPDATE_CATEGORY",
        entityType: "Category",
        entityId: newData.id,
        oldData: JSON.stringify(oldData),
        newData: JSON.stringify(newData),
        organisationId,
        userId,
        createdByUserId: userId,
        actionDetails: `Mise à jour de la catégorie "${oldData.name}"`,
        entityName: "Catégorie",
        ipAddress,  // Ajouter l'adresse IP ici
      },
    });

    return { success: true };
  }
);
