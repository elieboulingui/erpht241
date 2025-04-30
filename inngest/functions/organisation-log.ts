import { inngest } from "@/inngest/client";

// Fonction pour logguer la création de l'organisation
export const logOrganisationCreation = inngest.createFunction(
  { id: "log-organisation-creation", name: "Log: Organisation Created" },
  { event: "organisation/created" },
  async ({ event, step }) => {
    const { organisation, userId } = event.data;

    console.log("Event Data:", event.data);

    if (!organisation || !organisation.id) {
      console.error("Organisation data or id is missing.");
      throw new Error("Organisation data or id is missing.");
    }

    // Récupération systématique de l'adresse IP
    let ipAddress = "unknown";
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      ipAddress = data.ip;
    } catch (err) {
      console.warn("Impossible de récupérer l'adresse IP :", err);
    }

    await step.run("log-organisation", async () => {
      const { default: prisma } = await import("@/lib/prisma");

      await prisma.activityLog.create({
        data: {
          action: "CREATE",
          entityType: "Organisation",
          entityId: organisation.id,
          newData: JSON.stringify(organisation),
          userId: userId,
          organisationId: organisation.id,
          createdByUserId: userId,
          actionDetails: `Création de l'organisation ${organisation.name}`,
          entityName: organisation.name,
          ipAddress,
        },
      });
    });
  }
);
