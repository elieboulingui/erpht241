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
      },
    });

    console.log(`📝 Log d'activité pour la MAJ de marque ${entityId} enregistré.`);
  }
);
