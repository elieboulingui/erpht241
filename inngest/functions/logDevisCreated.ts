import { inngest } from "@/inngest/client";

export const logDevisCreated = inngest.createFunction(
  { id: "log-devis-created", name: "Log: Devis Created" },
  { event: "devisia/created" }, //
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
          createdByUserId: userId,
          organisationId,
          actionDetails: `Création du devis ${devis.devisNumber} pour le contact ${contactId}`,
          entityName: "Devis",
          ipAddress,
          userAgent,
        },
      });
    });
  }
);
