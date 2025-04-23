"use server"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function getCategoriesofOneOrganisation(id: string) {
  if (!id) {
    throw new Error("L'ID de l'organisation est requis.");
  }

  try {
    const categories = await prisma.category.findMany({
      where: {
        organisationId: id, // Utiliser 'organisationId' comme clé de relation
        isArchived: false,    // Ajouter le filtre pour ne récupérer que les catégories non archivées
      },
      select: {
        id: true,        // Récupérer uniquement l'ID de la catégorie
        name: true,      // Récupérer uniquement le nom de la catégorie
      },
    });

    return categories; // Retourner uniquement les informations sélectionnées
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    throw new Error("Erreur serveur");
  }
}
