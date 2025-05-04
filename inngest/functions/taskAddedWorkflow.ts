import { inngest } from "@/inngest/client";
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

// Workflow pour l'ajout d'une tâche
export const taskAddedWorkflow = inngest.createFunction(
  {
    name: "Log Task Creation",
    id: "task-added-log",
  },
  { event: "activity/task.added" },
  async ({ event }) => {
    const {
      taskId,
      taskType,
      taskStatus,
      taskPriority,
      organisationId,
      userId,
      userName,
    } = event.data;

    // Récupérer l'adresse IP publique de l'utilisateur
    const ipAddress = await fetchPublicIP();

    // Créer un log d'activité
    const activityLog = await prisma.activityLog.create({
      data: {
        action: "TASK_CREATED",
        entityType: "Task",
        entityId: taskId,
        oldData: undefined,  // null for tasks, as there's no previous data
        newData: {
          taskType,
          taskStatus,
          taskPriority,
        },  // Directly pass the JSON object for newData
        userId, // ✅ valeur correcte correspondant à un utilisateur existant
        actionDetails: `La tâche ${taskId} a été créée par ${userName}`,
        entityName: "Task",
        organisationId,
        ipAddress,
        createdAt: new Date(),
      },
    });

    return { message: "✅ Log d'activité enregistré", activityLog };
  }
);
