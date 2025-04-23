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

    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        oldData: JSON.stringify(oldData),
        newData: JSON.stringify(newData),
        userId,
        organisationId,
      },
    });

    console.log(`📝 Log archivé pour la marque : ${entityId}`);
  }
);
