import prisma from "@/lib/prisma";
import { inngest } from "../client";

export const logProductCreated = inngest.createFunction(
  { id: "log-product-created", name: "Log Product Created" },
  { event: "product/created" },
  async ({ event }) => {
    const {
      organisationId,
      productId,
      name,
      description,
      price,
      brandId,
      images,
      categoryIds,
    } = event.data;

    await prisma.activityLog.create({
      data: {
        action: "PRODUIT_CRÉÉ",
        entityType: "product",
        entityId: productId,
        organisationId,
        createdByUserId: null, // Tu peux injecter l'ID user si tu le passes
        newData: {
          name,
          description,
          price,
          images,
          brandId,
          categoryIds,
        },
        createdAt: new Date(),
      },
    });

    return { message: "Activity log produit créé avec succès via Inngest" };
  }
);
