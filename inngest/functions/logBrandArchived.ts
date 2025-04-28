import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Fonction pour récupérer l'adresse IP depuis ipify
const getIpAddress = async (): Promise<string> => {
  const response = await fetch("https://api.ipify.org/?format=json");
  const data = await response.json();
  return data.ip;  // Récupérer l'adresse IP
};

export const logBrandArchived = inngest.createFunction(
  {
    id: "log-brand-archived",
    name: "Log activité - Marque archivée",
  },
  {
    event: "activity/brand.archived",
  },
  async ({ event }) => {
    const {
      action,
      entityType,
      entityId,
      oldData,
      newData,
      userId,
      organisationId,
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
        userId,
        organisationId,
        ipAddress,  // Ajouter l'adresse IP ici
      },
    });

    console.log(`📝 Log archivé pour la marque : ${entityId}`);
  }
);
