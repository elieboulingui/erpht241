import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Déclare la fonction en 3 arguments séparés
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

    // Récupérer l'adresse IP via l'API ipify
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    const ip = data.ip; // L'adresse IP récupérée

    // Enregistrer l'action dans le log d'activité avec l'adresse IP
    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        oldData: JSON.stringify(oldData),
        newData: JSON.stringify(newData),
        userId,
        organisationId,
        ipAddress: ip, // Ajout de l'adresse IP dans le log
      },
    });

    console.log(`📝 Log archivé pour la marque : ${entityId}, IP : ${ip}`);
  }
);
