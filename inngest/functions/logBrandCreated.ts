import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

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
        newData: JSON.stringify(newData), // Sérialiser les données nouvelles en JSON
        organisationId,
        userId,
        createdByUserId,
        brandId,
        ipAddress: ip, // Ajout de l'adresse IP dans le log
      },
    });

    console.log(`📝 Log de création pour la marque : ${brandId}, IP : ${ip}`);
  }
);
