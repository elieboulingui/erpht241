"use server";
import prisma from "@/lib/prisma"; // Ensure Prisma is correctly configured in this path

// Fonction pour archiver l'invitation
export async function archiveInviteByEmail(email: string, organisationId: string) {
  // Vérifier si l'invitation existe dans la base de données
  const invitation = await prisma.invitation.findUnique({
    where: {
      email_organisationId: {
        email, // Email de l'utilisateur invité
        organisationId, // ID de l'organisation
      },
    },
  });

  // Si l'invitation n'est pas trouvée, lever une erreur
  if (!invitation) {
    throw new Error("Invitation non trouvée pour cet email et organisation.");
  }

  // Si l'invitation existe, la marquer comme archivée
  const archivedInvite = await prisma.invitation.update({
    where: {
      id: invitation.id, // Utiliser l'ID de l'invitation pour la mettre à jour
    },
    data: {
      isArchived: true, // Indiquer que l'invitation est archivée
      archivedAt: new Date(), // Date actuelle de l'archivage
      archivedBy: organisationId, // ID de l'utilisateur qui archive l'invitation
    },
  });

  return archivedInvite; // Retourner l'invitation mise à jour
}
