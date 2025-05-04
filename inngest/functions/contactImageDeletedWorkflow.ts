import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Fonction pour récupérer l'IP publique
async function fetchPublicIP(): Promise<string> {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    if (!res.ok) {
      throw new Error("Failed to fetch public IP.");
    }
    const data = await res.json();
    return data.ip;  // Retourner l'IP publique
  } catch (error) {
    console.error("Error fetching IP:", error);
    return "Unknown IP";  // Retourner "Unknown IP" en cas d'erreur
  }
}

export const contactImageDeletedWorkflow = inngest.createFunction(
  {
    name: "Log Contact Image Deletion",
    id: "contact-image-deleted-log",
  },
  { event: "activity/contact.image.deleted" }, // Assurez-vous que cet événement est envoyé ailleurs dans votre app
  async ({ event }) => {
    const { userId, contactId, organisationId, activity } = event.data;

    try {
      // Vérifier si les données nécessaires sont présentes
      if (!userId || !contactId || !organisationId || !activity) {
        throw new Error("Missing necessary event data. Ensure all fields are provided.");
      }

      // Récupérer l'adresse IP publique
      const userIp = await fetchPublicIP();
      console.log(`IP fetched: ${userIp}`);

      // Logique de traitement ici, comme l'enregistrement dans une autre base de données, envoi de notifications, etc.
      console.log(`Event received: ${activity}`);

      // Exemple de journalisation dans la base de données
      await prisma.activityLog.create({
        data: {
          action: "CONTACT_IMAGE_DELETED",
          entityType: "Contact",
          entityId: contactId,
          actionDetails: activity,
          organisationId: organisationId,
          userId: userId,
          ipAddress: userIp,  // Ajouter l'adresse IP récupérée
          createdAt: new Date(),
        },
      });

      return { message: "Activity logged successfully." };
    } catch (error) {
      console.error("Error logging activity:", error);
      return { message: `Failed to log activity` };  // Détails de l'erreur pour le débogage
    }
  }
);
