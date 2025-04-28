import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Fonction pour récupérer l'adresse IP depuis ipify
const getIpAddress = async (): Promise<string> => {
  const response = await fetch("https://api.ipify.org/?format=json");
  const data = await response.json();
  return data.ip;  // Récupérer l'adresse IP
};

export const logBrandUpdated = inngest.createFunction(
  {
    id: "log-brand-updated",
    name: "Log activité - Marque mise à jour",
  },
  {
    event: "activity/brand.updated",
  },
  async ({ event }) => {
    const {
      action,
      entityType,
      entityId,
      oldData,
      newData,
      organisationId,
      brandId,
      userId,
      createdByUserId,
    } = event.data;

    // Récupérer l'adresse IP de l'utilisateur
    const ipAddress = await getIpAddress();

    // Créer un log d'activité dans Prisma avec l'adresse IP
    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        oldData: JSON.stringify(oldData),
        newData: JSON.stringify(newData),
        organisationId,
        brandId,
        userId,
        createdByUserId,
        ipAddress, // Ajouter l'adresse IP ici
      },
    });

    console.log(`📝 Log d'activité pour la MAJ de marque ${entityId} enregistré.`);
  }
);
