import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Fonction pour récupérer l'adresse IP de l'appareil
async function getIpAddress() {
  const response = await fetch("https://api.ipify.org/?format=json");
  const data = await response.json();
  return data.ip;
}

export const logTaskStatusUpdated = inngest.createFunction(
  { id: "log-task-status-updated" },
  { event: "task/status.updated.log-only" },
  async ({ event }) => {
    const { taskId, oldData, newData, userId, organisationId } = event.data;

    // Récupère l'adresse IP de l'appareil
    const ipAddress = await getIpAddress();

    // Enregistre le log de mise à jour de statut de la tâche dans la base de données
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
        ipAddress, // Ajout de l'adresse IP
      },
    });

    return { success: true };
  }
);
