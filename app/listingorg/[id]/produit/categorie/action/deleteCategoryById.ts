"use server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

// Fonction pour supprimer une catégorie par son ID
export async function deleteCategoryById(id: string) {
  if (!id) {
    throw new Error("L'ID de la catégorie est requis.");
  }

  try {
    // Recherche et suppression de la catégorie par son ID
    const deletedCategory = await prisma.category.delete({
      where: {
        id, // Utiliser l'ID de la catégorie pour la supprimer
      },
    });

    if (!deletedCategory) {
      throw new Error("Aucune catégorie trouvée avec cet ID.");
    }

    console.log(`Catégorie ${id} supprimée avec succès.`);
    return deletedCategory; // Retourner la catégorie supprimée si nécessaire
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie:", error);
    throw new Error("Erreur serveur lors de la suppression de la catégorie.");
  }
}
