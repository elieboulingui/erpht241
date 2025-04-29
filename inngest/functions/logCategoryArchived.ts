// /inngest/functions/logCategoryArchived.ts
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logCategoryArchived = inngest.createFunction(
  { id: "log-category-archived" },
  { event: "category/archived" },
  async ({ event, step }) => {
    const { id, userId } = event.data;

    const categoryToArchive = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryToArchive) {
      throw new Error("Aucune catégorie trouvée avec cet ID.");
    }

    const archivedCategory = await step.run("archive-category", async () => {
      return await prisma.category.update({
        where: { id },
        data: {
          isArchived: true,
          archivedAt: new Date(),
        },
      });
    });

    // 🔍 Récupération de l'adresse IP via ipify
    const response = await fetch("https://api.ipify.org?format=json");
    const ipData = await response.json();
    const ip = ipData.ip;

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
        ipAddress: ip, // 🆕 Adresse IP ajoutée ici
      },
    });

    return { success: true, id };
  }
);
