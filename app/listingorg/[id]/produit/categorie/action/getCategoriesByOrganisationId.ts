// /app/actions/getCategoriesByOrganisationId.ts
"use server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function getCategoriesByOrganisationId(id: string) {
  if (!id) {
    throw new Error("L'ID de l'organisation est requis.");
  }

  try {
    // Recherche des catégories liées à l'organisation par son ID
    const organisationWithCategories = await prisma.organisation.findUnique({
      where: {
        id, // Utiliser l'ID de l'organisation pour la rechercher
      },
      include: {
        Category: true, // Inclure les catégories associées à l'organisation
      },
    });

    if (!organisationWithCategories) {
      throw new Error("Aucune organisation trouvée avec cet ID.");
    }

    // Retourner les catégories associées à l'organisation
    return organisationWithCategories.Category;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    throw new Error("Erreur serveur");
  }
}
