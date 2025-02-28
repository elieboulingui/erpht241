"use server"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function getitemsByOrganisationId(id: string) {
  if (!id) {
    throw new Error("L'ID de l'organisation est requis.");
  }

  try {
    const product = await prisma.product.findMany({
      where: {
        organisationId: id, // Utiliser 'organisationId' comme clé de relation
      },
    });

    return product; // Retourner les invitations
  } catch (error) {
    console.error("Erreur lors de la récupération des invitations:", error);
    throw new Error("Erreur serveur");
  }
}
