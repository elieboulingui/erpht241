import { inngest } from "@/inngest/client";

// Fonction pour obtenir l'adresse IP de l'utilisateur
async function getIpAddress() {
  const response = await fetch("https://api.ipify.org/?format=json");
  const data = await response.json();
  return data.ip;
}

export const logOrganisationCreation = inngest.createFunction(
  { id: "log-organisation-creation", name: "Log: Organisation Created" },
  { event: "organisation/created" },
  async ({ event, step }) => {
    const { organisation, userId } = event.data;

    // Récupère l'adresse IP de l'utilisateur
    const ipAddress = await getIpAddress();

    await step.run("log-organisation", async () => {
      const { default: prisma } = await import("@/lib/prisma");

      // Crée l'enregistrement dans le log avec l'adresse IP
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
          ipAddress,  // Ajoute l'adresse IP ici
        },
      });
    });
  }
);
