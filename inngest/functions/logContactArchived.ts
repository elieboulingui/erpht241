import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logContactArchived = inngest.createFunction(
  { name: "Log Contact Archive", id: "activity/contact.archive" },
  { event: "contact.archive" },
  async ({ event }) => {
    const { userId, contactId, oldData, newData } = event.data;

    await prisma.activityLog.create({
      data: {
        action: "ARCHIVE_CONTACT",
        entityType: "Contact",
        entityId: contactId,
        oldData,
        newData,
        userId,
        createdByUserId: userId,
        updatedByUserId: userId,
        organisationId: oldData.organisationId ?? null,
        contactId,
        actionDetails: `Contact ${newData.name ?? contactId} archivé via Inngest.`,
        entityName: newData.name ?? null,
      },
    });
  }
);
