import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Fonction pour récupérer l'adresse IP depuis ipify
const getIpAddress = async (): Promise<string> => {
  const response = await fetch("https://api.ipify.org/?format=json");
  const data = await response.json();
  return data.ip;  // Récupérer l'adresse IP
};

export const logBrandCreated = inngest.createFunction(
  {
    id: "log-brand-created",
    name: "Log activité - Création de marque",
  },
  { event: "activity/brand.created" },
  async ({ event }) => {
    const {
      action,
      entityType,
      entityId,
      newData,
      organisationId,
      userId,
      createdByUserId,
      brandId,
    } = event.data;

    // Récupérer l'adresse IP de l'utilisateur
    const ipAddress = await getIpAddress();

    // Créer un log d'activité dans Prisma avec l'adresse IP
    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        newData: JSON.stringify(newData),
        organisationId,
        userId,
        createdByUserId,
        brandId,
        ipAddress, // Ajouter l'adresse IP ici
      },
    });

    console.log(`📝 Log d'activité pour la création de marque ${entityId} enregistré.`);
  }
);
