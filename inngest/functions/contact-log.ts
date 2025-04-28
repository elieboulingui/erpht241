import { inngest } from "@/inngest/client";

export const logContactCreation = inngest.createFunction(
  { id: "log-contact-creation", name: "Log: Contact Created" },
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
          newData: contact,
          createdByUserId,
          organisationId,
          actionDetails: `Contact ${contact.name} créé depuis l'IP: ${ipAddress}.`, // Log de l'adresse IP ici
          entityName: contact.name,
          ipAddress, // Si tu veux aussi stocker l'IP dans l'activité (optionnel)
        },
      });
    });
  }
);
