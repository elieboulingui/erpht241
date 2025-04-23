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
      },
    });
  }
);
