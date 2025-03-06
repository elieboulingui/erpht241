"use server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function getCategoriesByOrganisationId(id: string) {
  if (!id) {
    throw new Error("L'ID de l'organisation est requis.");
  }

  try {
    // Recherche des catégories non archivées liées à l'organisation par son ID
    const organisationWithCategories = await prisma.organisation.findUnique({
      where: {
        id, // Utiliser l'ID de l'organisation pour la rechercher
      },
      include: {
        Category: {
          where: {
            isArchived: false, // Filtrer pour récupérer uniquement les catégories non archivées
          },
        },
      },
    });

    if (!organisationWithCategories) {
      throw new Error("Aucune organisation trouvée avec cet ID.");
    }

    // Retourner les catégories associées à l'organisation qui ne sont pas archivées
    return organisationWithCategories.Category;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories non archivées:", error);
    throw new Error("Erreur serveur");
  }
}
