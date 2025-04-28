// /inngest/functions/logCategoryCreated.ts
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logCategoryCreated = inngest.createFunction(
  { id: "log-category-created" },
  { event: "category/created" },
  async ({ event, step }) => {
    const { name, organisationId, userId } = event.data;

    // Récupération de la catégorie existante
    const existingCategory = await step.run("fetch-category", async () => {
      const category = await prisma.category.findFirst({
        where: {
          name,
          organisationId,
        },
      });

      if (!category) {
        throw new Error(`Aucune catégorie trouvée avec le nom ${name} pour l'organisation ${organisationId}`);
      }

      return category;
    });

    // Log de l'action dans l'ActivityLog
    await prisma.activityLog.create({
      data: {
        action: "FETCH_CATEGORY", // Action pour récupération
        entityType: "Category",
        entityId: existingCategory.id,
        newData: JSON.stringify(existingCategory),
        organisationId: existingCategory.organisationId,
        categoryId: existingCategory.id,
        userId,
        createdByUserId: userId,
      },
    });

    // Optionnel : Revalidation côté Inngest (si nécessaire)
    await step.run("revalidate-path", async () => {
      const path = `/listing-organisation/${organisationId}/produit/categorie`;
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidapath?path=${path}`);
      } catch (err) {
        console.error("Erreur revalidation dans Inngest:", err);
      }
    });

    return { success: true, id: existingCategory.id };
  }
);
