import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Fonction pour récupérer l'IP publique
async function fetchPublicIP(): Promise<string> {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    if (!response.ok) {
      throw new Error("Failed to fetch public IP from ipify.");
    }
    const data = await response.json();
    return data.ip; // Retourner l'IP publique
  } catch (error) {
    console.error("Erreur lors de la récupération de l'IP publique:", error);
    return "Unknown IP"; // Retourner une IP par défaut en cas d'échec
  }
}

// Fonction Inngest pour enregistrer un log d'activité lorsque le feedback est créé
export const logFeedbackCreated = inngest.createFunction(
  { id: "log-feedback-created", name: "Log Feedback Created" },
  { event: "feedback.created" }, // L'événement auquel cette fonction est associée
  async ({ event }) => {
    try {
      const { userId, feedbackId, contactId, organisationId, activity, feedbackDetails } = event.data;

      // Vérifier si toutes les données nécessaires sont présentes
      if (!userId || !feedbackId || !contactId || !organisationId || !activity || !feedbackDetails) {
        throw new Error("Données manquantes dans l'événement.");
      }

      console.log("Création du log pour le feedback :", feedbackId); // Log pour débogage

      // Récupérer l'adresse IP via l'API ipify
      const ip = await fetchPublicIP();
      console.log("IP récupérée :", ip); // Log pour débogage

      // Création du log d'activité dans la base de données
      await prisma.activityLog.create({
        data: {
          action: "FEEDBACK_CRÉÉ",
          entityType: "feedbackContact",
          entityId: feedbackId,
          organisationId, // ID de l'organisation
          contactId, // ID du contact concerné
          createdByUserId: userId, // L'utilisateur qui a créé le feedback
          newData: JSON.stringify(feedbackDetails), // Détails du feedback créé
          createdAt: new Date(),
          ipAddress: ip, // Ajouter l'adresse IP dans le log
        },
      });

      console.log("Log créé avec succès pour le feedback :", feedbackId); // Log pour débogage

      return { message: "Log d'activité pour le feedback créé avec succès." };
    } catch (error) {
      console.error("Erreur dans la fonction logFeedbackCreated : ", error);
      return { message: `Échec de la création du log d'activité` }; // Retourner un message d'erreur détaillé
    }
  }
);
