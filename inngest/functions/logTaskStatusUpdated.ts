import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logTaskStatusUpdated = inngest.createFunction(
  { id: "log-task-status-updated" },
  { event: "task/status.updated.log-only" },
  async ({ event }) => {
    const { taskId, oldData, newData, userId, organisationId, ipAddress: eventIp } = event.data;

    // Si l'IP n'est pas fournie dans l'événement, récupérez-la via l'API
    let ipAddress = eventIp;
    if (!ipAddress) {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ipAddress = data.ip;
      } catch (err) {
        console.warn("Impossible de récupérer l'adresse IP :", err);
        ipAddress = "unknown";  // Définir "unknown" en cas d'échec
      }
    }

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
        ipAddress,  // Ajouter l'adresse IP ici
      },
    });

    return { success: true };
  }
);
