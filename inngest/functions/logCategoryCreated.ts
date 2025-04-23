// /inngest/functions/logCategoryCreated.ts
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logCategoryCreated = inngest.createFunction(
  { id: "log-category-created" },
  { event: "category/created" },
  async ({ event, step }) => {
    const { name, description, organisationId, logo, userId } = event.data;

    const newCategory = await step.run("create-category", async () => {
      const category = await prisma.category.create({
        data: {
          name,
          description,
          organisationId,
          logo: logo || "",
          parentId: null,
        },
      });

      await prisma.activityLog.create({
        data: {
          action: "CREATE_CATEGORY",
          entityType: "Category",
          entityId: category.id,
          newData: JSON.stringify(category),
          organisationId: category.organisationId,
          categoryId: category.id,
          userId,
          createdByUserId: userId,
        },
      });

      return category;
    });

    // Optionnel : Tu peux aussi revalider ici côté Inngest
    await step.run("revalidate-path", async () => {
      const path = `/listing-organisation/${organisationId}/produit/categorie`;
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidapath?path=${path}`);
      } catch (err) {
        console.error("Erreur revalidation dans Inngest:", err);
      }
    });

    return { success: true, id: newCategory.id };
  }
);
