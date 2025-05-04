import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

// Fonction Inngest pour enregistrer un log d'activité lorsque le contact est mis à jour
export const logContactUpdated = inngest.createFunction(
  { id: "log-contact-updated", name: "Log Contact Updated" },
  { event: "activity/contact.updated" }, 
  async ({ event }) => {
    try {
      const {
        contactId,
        organisationId,
        name,
        email,
        phone,
        address,
        status_contact,
        userId, // ID de l'utilisateur qui a effectué la mise à jour
        changes, // Les changements apportés au contact
      } = event.data;

      console.log("Création du log pour la mise à jour du contact :", contactId); // Log pour débogage

      // Récupérer l'adresse IP via l'API ipify
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const ip = data.ip; // L'adresse IP récupérée

      // Création du log d'activité dans la base de données
      await prisma.activityLog.create({
        data: {
          action: "CONTACT_MIS_A_JOUR",
          entityType: "contact",
          entityId: contactId,
          organisationId,
          createdByUserId: userId, // L'ID de l'utilisateur qui a effectué la mise à jour
          newData: JSON.stringify({
            name,
            email,
            phone,
            address,
            status_contact,
            changes, // Enregistrer les modifications apportées
          }),
          createdAt: new Date(),
          ipAddress: ip, // Ajout de l'adresse IP dans le log
        },
      });

      console.log("Log créé avec succès pour la mise à jour du contact"); // Log pour débogage

      return { message: "Activity log de mise à jour du contact créé avec succès via Inngest" };
    } catch (error) {
      console.error("Erreur dans la fonction logContactUpdated : ", error);
      throw error; // Relancer l'erreur si elle se produit
    }
  }
);
