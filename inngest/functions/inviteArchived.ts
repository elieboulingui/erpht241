import { Inngest } from "inngest";
import prisma from "@/lib/prisma"; // Prisma pour interagir avec la base de données

// Crée une fonction Inngest pour écouter l'événement 'invite/archived'
export const inviteArchived = new Inngest({
  id: "invite-archived-fn",
}).createFunction(
  {
    name: "Invite Archived Listener",
    id: "events",
  }, // Nom de la fonction
  { event: "invite/archived" }, // L'événement à écouter
  async ({ event }) => {
    const { invitationId, userId, organisationId, oldData, newData } = event.data; // Extraire les données de l'événement

    // Fonction pour récupérer l'adresse IP de l'utilisateur via ipify
    const getIpAddress = async (): Promise<string> => {
      const response = await fetch("https://api.ipify.org/?format=json");
      const data = await response.json();
      return data.ip; // Récupérer l'adresse IP
    };

    // Récupérer l'adresse IP de l'utilisateur
    const ipAddress = await getIpAddress();

    // Enregistrer l'action dans le log d'activité avec l'adresse IP
    await prisma.activityLog.create({
      data: {
        action: "archive_invite", // Action
        entityType: "Invitation", // Type d'entité
        entityId: invitationId, // ID de l'invitation
        oldData: JSON.stringify(oldData), // Anciennes données de l'invitation
        newData: JSON.stringify(newData), // Nouvelles données de l'invitation
        userId, // L'utilisateur ayant archivé l'invitation
        createdByUserId: userId, // ID de l'utilisateur créateur
        organisationId, // Organisation associée
        invitationId, // ID de l'invitation
        createdAt: new Date(), // Date de création
        ipAddress, // Ajouter l'adresse IP ici
      },
    });

    // Retourner une réponse
    return { status: "Invitation Archived Logged" };
  }
);
