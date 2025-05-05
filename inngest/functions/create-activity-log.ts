import { inngest } from "../client";
import prisma from "@/lib/prisma";

export const createActivityLog = inngest.createFunction(
  { id: "activity/log.created" },
  { event: "activity/notes.created" },
  async ({ event, step }) => {
    const { action, entityType, entityId, newData, oldData, userId } = event.data;

    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        newData,
        oldData,
        userId,
        // Ajoute d'autres champs selon ce que tu veux suivre
      },
    });

    return { success: true };
  }
);
