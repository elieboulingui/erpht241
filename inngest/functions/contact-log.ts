import { inngest } from "@/inngest/client";

export const logContactCreation = inngest.createFunction(
  { id: "log-contact-creation", name: "Log: Contact Created" },
  { event: "contact/created" },
  async ({ event, step }) => {
    const { contact, createdByUserId, organisationId } = event.data;

    // Récupérer l'adresse IP via l'API ipify
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    const ip = data.ip; // L'adresse IP récupérée

    await step.run("log-contact-creation", async () => {
      const { default: prisma } = await import("@/lib/prisma");

      await prisma.activityLog.create({
        data: {
          action: "CREATE_CONTACT",
          entityType: "Contact",
          entityId: contact.id,
          newData: JSON.stringify(contact), // L'objet contact est stringifié avant d'être inséré
          createdByUserId,
          organisationId,
          actionDetails: `Contact ${contact.name} créé.`,
          entityName: contact.name,
          ipAddress: ip, // Ajout de l'adresse IP dans le log
        },
      });
    });
  }
);
