import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
export const logDevisCreation = inngest.createFunction(
  { id: "log-devis-created", name: "Log: Devis Created" },
  { event: "activit/devi.created" }, // ✅ corriger le nom de l’événement ici
  async ({ event, step }) => {
    const {
      devis,
      userId,
      organisationId,
      userAgent,
      actionDetails,
    } = event.data;

    // 🔍 Récupération de l'IP publique via ipify
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const { ip: ipAddress } = await ipRes.json();

    await step.run("log-devis-creation", async () => {
    

      await prisma.activityLog.create({
        data: {
          action: "CREATE",
          entityType: "Devis",
          entityId: devis.id,
          entityName: devis.devisNumber,
          oldData: undefined,
          newData: JSON.stringify(devis),
          userId,
          createdByUserId: userId,
          organisationId,
          actionDetails: actionDetails || `Création du devis ${devis.devisNumber}`,
          ipAddress,
          userAgent,
          createdAt: new Date(), // tu peux l'ajouter pour le timestamp explicite
        },
      });
    });
  }
);
