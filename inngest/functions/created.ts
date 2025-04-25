import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

// Fonction Inngest pour enregistrer un log d'activité lorsque le produit est créé
export const logProductCreated = inngest.createFunction(
  { id: "log-product-created", name: "Log Product Created" },
  { event: "product/created" }, 
  async ({ event }) => {
    try {
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

      console.log("Création du log pour le produit :", productId); // Log pour débogage

      // Création du log d'activité dans la base de données
      await prisma.activityLog.create({
        data: {
          action: "PRODUIT_CRÉÉ",
          entityType: "product",
          entityId: productId,
          organisationId,
          createdByUserId: null, 
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

      console.log("Log créé avec succès"); // Log pour débogage

      return { message: "Activity log produit créé avec succès via Inngest" };
    } catch (error) {
      console.error("Erreur dans la fonction logProductCreated : ", error);
      throw error; // Relancer l'erreur si elle se produit
    }
  }
);

