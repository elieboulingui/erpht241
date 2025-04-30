import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Workflow Inngest pour gérer l'événement "activity/step.added"
export const stepAddedWorkflow = inngest.createFunction(
  {
    name: "activity/stepadded",
    id: "erp-crm-app"
  },
  { event: "activity/stepadded" }, // Listening to "activity/step.added"
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
      organisationId, // Added here
      ipAddress,
    } = event.data;

    // Creating activity log in the database
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
        organisationId, // Added here
        ipAddress, // Capturing IP address in the log
        createdAt: new Date(),
      },
    });

    return { message: "Log enregistré dans la base de données", activityLog };
  }
);
