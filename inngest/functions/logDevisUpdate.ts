import { inngest } from "@/inngest/client";

export const logDevisUpdate = inngest.createFunction(
  { id: "log-devis-update", name: "Log: Devis Updated" },
  { event: "devis/updated" },
  async ({ event, step }) => {
    const { oldData, newData, userId, organisationId, ipAddress, userAgent } = event.data;

    await step.run("log-devis-update", async () => {
      const { default: prisma } = await import("@/lib/prisma");

      await prisma.activityLog.create({
        data: {
          action: "UPDATE",
          entityType: "Devis",
          entityId: newData.id,
          oldData: JSON.stringify(oldData),
          newData: JSON.stringify(newData),
          userId,
          createdByUserId: userId,
          organisationId,
          actionDetails: "Devis mis à jour",
          entityName: "Devis",
          ipAddress,
          userAgent,
        },
      });
    });
  }
);
