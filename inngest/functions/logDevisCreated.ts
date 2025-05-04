import { inngest } from "@/inngest/client";

export const logDevisCreatedByia = inngest.createFunction(
  { id: "log-devis-create", name: "Log: Devis Created" },
  { event: "devisia/created" },
  async ({ event, step }) => {
    let { devis, userId, organisationId, contactId, ipAddress, userAgent } = event.data;

    // 🔁 Fallback : Si l'IP n'est pas fournie dans l'event, on la récupère depuis l'extérieur
    if (!ipAddress) {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ipAddress = data.ip;
      } catch (err) {
        console.warn("Impossible de récupérer l'adresse IP :", err);
        ipAddress = "unknown";
      }
    }

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
