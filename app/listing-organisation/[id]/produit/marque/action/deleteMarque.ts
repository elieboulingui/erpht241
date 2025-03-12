"use server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

// Fonction pour archiver une catégorie par son ID
export async function deleteMarqueById(id: string) {
  if (!id) {
    throw new Error("L'ID de la catégorie est requis.");
  }

  try {
    // Recherche de la catégorie par son ID
    const categoryToArchive = await prisma.brand.findUnique({
      where: {
        id, // Utiliser l'ID de la catégorie pour la retrouver
      },
    });

    // Vérifier si la catégorie existe
    if (!categoryToArchive) {
      throw new Error("Aucune catégorie trouvée avec cet ID.");
    }

    // Mettre à jour la catégorie pour la marquer comme archivée
    const archivedCategory = await prisma.brand.update({
      where: {
        id, // Utiliser l'ID de la catégorie pour la mettre à jour
      },
      data: {
        isArchived: true,  // Marquer comme archivée
        archivedAt: new Date(), // Ajouter la date d'archivage
      },
    });

    console.log(`Catégorie ${id} archivée avec succès.`);
    return archivedCategory; // Retourner la catégorie archivée si nécessaire
  } catch (error) {
    console.error("Erreur lors de l'archivage de la catégorie:", error);
    throw new Error("Erreur serveur lors de l'archivage de la catégorie.");
  }
}
