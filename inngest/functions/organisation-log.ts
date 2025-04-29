import { inngest } from "@/inngest/client";

// Fonction pour logguer la création de l'organisation
export const logOrganisationCreation = inngest.createFunction(
  { id: "log-organisation-creation", name: "Log: Organisation Created" },
  { event: "organisation/created" },
  async ({ event, step }) => {
    // Extraction des données envoyées dans l'événement
    const { organisation, userId, ipAddress: eventIp } = event.data;

    console.log("Event Data:", event.data);  // Afficher les données de l'événement

    // Vérifier si l'organisation et son id sont présents
    if (!organisation || !organisation.id) {
      console.error("Organisation data or id is missing.");
      throw new Error("Organisation data or id is missing.");
    }

    // Récupérer l'adresse IP si elle n'est pas fournie
    let ipAddress = eventIp;
    if (!ipAddress) {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ipAddress = data.ip;
      } catch (err) {
        console.warn("Impossible de récupérer l'adresse IP :", err);
        ipAddress = "unknown"; // Définir une valeur par défaut en cas d'échec
      }
    }

    // Exécution de l'étape pour enregistrer un log dans la base de données
    await step.run("log-organisation", async () => {
      const { default: prisma } = await import("@/lib/prisma");

      // Enregistrement dans le log d'activité avec l'adresse IP
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
          ipAddress,  // Ajout de l'adresse IP ici
        },
      });
    });
  }
);
