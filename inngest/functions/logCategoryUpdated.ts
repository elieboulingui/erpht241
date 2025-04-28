// /inngest/functions/logCategoryUpdated.ts
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logCategoryUpdated = inngest.createFunction(
  { id: "log-category-updated-only" },
  { event: "category/updated.log-only" },
  async ({ event }) => {
    const { oldData, newData, organisationId, userId } = event.data;

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
      },
    });

    return { success: true };
  }
);
