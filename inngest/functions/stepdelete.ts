import { inngest } from "../client";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Obtenir l'IP publique
async function fetchPublicIP(): Promise<string> {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "";
  }
}

export const dealStageDeletedWorkflow = inngest.createFunction(
  {
    name: "Log Deal Stage Deletion",
    id: "deal-stage-deleted-log",
  },
  { event: "dealStage/deleted" },
  async ({ event }) => {
    const {
      stageId,
      userId,
      userName,
      userRole,
      deletedAt,
      organisationId,
      oldData,
    } = event.data;

    const ipAddress = await fetchPublicIP();

    const activityLog = await prisma.activityLog.create({
      data: {
        action: "DEAL_STAGE_DELETED",
        entityType: "DealStage",
        entityId: stageId,
        oldData,
        newData: Prisma.JsonNull,
        userId, // ✅ valeur correcte correspondant à un utilisateur existant
        actionDetails: `L'étape ${stageId} a été supprimée par ${userName} (${userRole})`,
        entityName: "DealStage",
        organisationId,
        ipAddress,
        createdAt: new Date(),
      },
    });

    return { message: "✅ Log enregistré", activityLog };
  }
);
