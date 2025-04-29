import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

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
        oldData: JSON.stringify(oldData), // Sérialiser les anciennes données en JSON
        newData: JSON.stringify(newData), // Sérialiser les nouvelles données en JSON
        organisationId,
        brandId,
        userId,
        createdByUserId,
        ipAddress: ip, // Ajout de l'adresse IP dans le log
      },
    });

    console.log(`📝 Log d'activité pour la MAJ de marque ${entityId} enregistré. IP : ${ip}`);
  }
);
