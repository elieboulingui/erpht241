import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logContactUpdate = inngest.createFunction(
  {
    name: "Log Contact Update",
    id: "activity/updatecontact.created",
  },
  { event: "contact.updated" },
  async ({ event }) => {
    const { userId, contactId, oldData, newData } = event.data;

    await prisma.activityLog.create({
      data: {
        action: "UPDATE",
        entityType: "Contact",
        entityId: contactId,
        oldData,
        newData,
        userId,
        contactId,
        createdByUserId: userId,
        updatedByUserId: userId,
        actionDetails: `Mise à jour du contact ${contactId}`,
        entityName: newData.name || oldData.name || null,
      },
    });
  }
);
