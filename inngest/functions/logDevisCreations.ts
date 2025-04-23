import { inngest } from "@/inngest/client";

export const logDevisCreations = inngest.createFunction(
  { id: "log-devis-creation", name: "Log: Devis Created" },
  { event: "devis/created" },
  async ({ event, step }) => {
    const { devis, userId, organisationId, contactId, ipAddress, userAgent } = event.data;

    await step.run("log-devis-creation", async () => {
      const { default: prisma } = await import("@/lib/prisma");

      await prisma.activityLog.create({
        data: {
          action: "Création de devis",
          entityType: "Devis",
          entityId: devis.id,
          oldData: { type: "null" },
          newData: JSON.stringify(devis),
          userId,
          organisationId,
          createdByUserId: userId,
          actionDetails: `Création du devis ${devis.devisNumber} pour le contact ${contactId}`,
          entityName: "Devis",
          ipAddress,
          userAgent,
        },
      });
    });
  }
);
