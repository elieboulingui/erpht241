// /inngest/functions/logTaskStatusUpdated.ts
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logTaskStatusUpdated = inngest.createFunction(
  { id: "log-task-status-updated" },
  { event: "task/status.updated.log-only" },
  async ({ event }) => {
    const { taskId, oldData, newData, userId, organisationId } = event.data;

    await prisma.activityLog.create({
      data: {
        action: "UPDATE_TASK_STATUS",
        entityType: "Tâche",
        entityId: taskId,
        oldData: JSON.stringify(oldData),
        newData: JSON.stringify(newData),
        userId,
        createdByUserId: userId,
        organisationId,
        actionDetails: `Mise à jour du statut de la tâche ${taskId} de '${oldData.status}' à '${newData.status}'.`,
        entityName: "Task",
      },
    });

    return { success: true };
  }
);
