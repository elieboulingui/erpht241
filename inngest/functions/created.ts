import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

// Fonction pour récupérer l'adresse IP via https://api.ipify.org/?format=json
const getIpAddress = async (): Promise<string> => {
  const response = await fetch("https://api.ipify.org/?format=json");
  const data = await response.json();
  return data.ip; // Récupérer l'adresse IP
};

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
        userId, // Assurer que l'ID utilisateur est dans l'événement
      } = event.data;

      // Récupérer l'adresse IP de l'utilisateur
      const ipAddress = await getIpAddress();

      console.log("Création du log pour le produit :", productId); // Log pour débogage

      // Création du log d'activité dans la base de données
      await prisma.activityLog.create({
        data: {
          action: "PRODUIT_CRÉÉ",
          entityType: "product",
          entityId: productId,
          organisationId,
          createdByUserId: userId || null, // Ajouter l'ID de l'utilisateur ou null
          newData: {
            name,
            description,
            price,
            images,
            brandId,
            categoryIds,
          },
          createdAt: new Date(),
          ipAddress, // Ajouter l'adresse IP dans le log
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
