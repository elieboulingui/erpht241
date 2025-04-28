import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Fonction pour récupérer l'adresse IP via https://api.ipify.org/?format=json
const getIpAddress = async (): Promise<string> => {
  const response = await fetch("https://api.ipify.org/?format=json");
  const data = await response.json();
  return data.ip; // Récupérer l'adresse IP
};

// Fonction pour créer un log d'archivage du produit
export const logProductArchived = inngest.createFunction(
  {
    name: "Log Product Archived",
    id: "a"
  },
  { event: "product/archived" },
  async ({ event }) => {
    const { organisationId, productId, oldData, newData, userId } = event.data;

    try {
      // Récupérer l'adresse IP
      const ipAddress = await getIpAddress();

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
          ipAddress, // Ajouter l'adresse IP dans le log
        },
      });

      return { message: "Log d'archivage du produit créé avec succès via Inngest" };
    } catch (error) {
      console.error("Erreur lors de l'archivage du produit : ", error);
      throw error; // Relancer l'erreur si elle se produit
    }
  }
);
