"use server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function getitemsByOrganisationId(id: string) {
  if (!id) {
    throw new Error("L'ID de l'organisation est requis.");
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        organisationId: id, // Utiliser 'organisationId' comme clé de relation
        isArchived: false,    // Ajouter le filtre pour ne récupérer que les produits non archivés
      },
    });

    return products; // Retourner les produits non archivés
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    throw new Error("Erreur serveur");
  }
}
