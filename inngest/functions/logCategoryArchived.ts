import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Fonction pour récupérer l'adresse IP depuis ipify
const getIpAddress = async (): Promise<string> => {
  const response = await fetch("https://api.ipify.org/?format=json");
  const data = await response.json();
  return data.ip;  // Récupérer l'adresse IP
};

export const logCategoryArchived = inngest.createFunction(
  { id: "log-category-archived" },
  { event: "category/archived" },
  async ({ event, step }) => {
    const { id, userId } = event.data;

    // Récupérer la catégorie à archiver
    const categoryToArchive = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryToArchive) {
      throw new Error("Aucune catégorie trouvée avec cet ID.");
    }

    // Archiver la catégorie
    const archivedCategory = await step.run("archive-category", async () => {
      return await prisma.category.update({
        where: { id },
        data: {
          isArchived: true,
          archivedAt: new Date(),
        },
      });
    });

    // Récupérer l'adresse IP de l'utilisateur
    const ipAddress = await getIpAddress();

    // Log de l'activité dans ActivityLog
    await prisma.activityLog.create({
      data: {
        action: "ARCHIVE_CATEGORY",
        entityType: "Category",
        entityId: id,
        oldData: JSON.stringify(categoryToArchive),
        newData: JSON.stringify(archivedCategory),
        organisationId: categoryToArchive.organisationId,
        userId,
        createdByUserId: userId,
        actionDetails: `Archivage de la catégorie "${categoryToArchive.name}"`,
        entityName: "Catégorie",
        ipAddress,  // Ajouter l'adresse IP ici
      },
    });

    return { success: true, id };
  }
);
