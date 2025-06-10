import { inngest } from "@/inngest/client";

export const logContactCreation = inngest.createFunction(
  { id: "contact/created", name: "Log: Contact Created" },
  { event: "contact/created" },
  async ({ event, step }) => {
    const { contact, createdByUserId, organisationId, ipAddress } = event.data;

    await step.run("log-contact-creation", async () => {
      const { default: prisma } = await import("@/lib/prisma");

      await prisma.activityLog.create({
        data: {
          action: "CREATE_CONTACT",
          entityType: "Contact",
          entityId: contact.id,
          newData: JSON.stringify(contact),
          createdByUserId,
          organisationId,
          actionDetails: `Contact ${contact.name} créé.`,
          entityName: contact.name,
          ipAddress,
        },
      });
    });
  }
);
