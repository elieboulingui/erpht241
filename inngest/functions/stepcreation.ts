import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Workflow Inngest pour gérer l'événement "activity/step.added"
export const stepAddedWorkflow = inngest.createFunction(
  {
    name: "Log Step Creation",
    id: "n",
  },
  { event: "activity/step.added" }, // Écoute l'événement "activity/step.added"
  async ({ event }) => {
    const {
      action,
      entityType,
      entityId,
      oldData,
      newData,
      userId,
      actionDetails,
      entityName,
      organisationId, // 👈 Ajout ici
      ipAddress,

    } = event.data;

    // Vous pouvez maintenant traiter l'événement et faire des actions supplémentaires, comme enregistrer le log dans la base de données
    const activityLog = await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        oldData,
        newData,
        userId,
        actionDetails,
        entityName,
        organisationId, // 👈 Ajout ici
        ipAddress, // Ajouter l'adresse IP dans le log
        createdAt: new Date(),
      },
    });

    return { message: "Log enregistré dans la base de données", activityLog };
  }
);
