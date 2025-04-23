import { inngest } from "@/inngest/client";

export const logDevisCreation = inngest.createFunction(
  { id: "log-devis-creations", name: "Log: Devis Created" },
  { event: "devi/created" },
  async ({ event, step }) => {
    const { devis, userId, organisationId, ipAddress, userAgent } = event.data;

    await step.run("log-devis-creation", async () => {
      const { default: prisma } = await import("@/lib/prisma");

      await prisma.activityLog.create({
        data: {
          action: "CREATE",
          entityType: "Devis",
          entityId: devis.id,
          oldData: { type: "null" },
          newData: JSON.stringify(devis),
          userId,
          createdByUserId: userId,
          organisationId,
          actionDetails: `Création du devis ${devis.devisNumber}`,
          entityName: devis.devisNumber,
          ipAddress,
          userAgent,
        },
      });
    });
  }
);
