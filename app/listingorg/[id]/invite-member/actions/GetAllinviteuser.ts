"use server"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function getinviteByOrganisationId(id: string) {
  if (!id) {
    throw new Error("L'ID de l'organisation est requis.");
  }

  try {
    const invites = await prisma.invitation.findMany({
      where: {
        organisationId: id, // Utiliser 'organisationId' comme clé de relation
      },
      include: {
        invitedBy: true, // Inclure l'utilisateur qui a envoyé l'invitation
        organisation: true, // Inclure les détails de l'organisation
      },
    });

    return invites; // Retourner les invitations
  } catch (error) {
    console.error("Erreur lors de la récupération des invitations:", error);
    throw new Error("Erreur serveur");
  }
}
