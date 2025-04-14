"use server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré
import { auth } from "@/auth"; // Pour récupérer l'utilisateur connecté

// Fonction pour archiver une catégorie par son ID
export async function deleteCategoryById(id: string) {
  if (!id) {
    throw new Error("L'ID de la catégorie est requis.");
  }

  try {
    // Recherche de la catégorie par son ID
    const categoryToArchive = await prisma.category.findUnique({
      where: {
        id, // Utiliser l'ID de la catégorie pour la retrouver
      },
    });

    // Vérifier si la catégorie existe
    if (!categoryToArchive) {
      throw new Error("Aucune catégorie trouvée avec cet ID.");
    }

    // Récupérer l'utilisateur actuel
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }
    const userId = session.user.id;

    // Mettre à jour la catégorie pour la marquer comme archivée
    const archivedCategory = await prisma.category.update({
      where: {
        id, // Utiliser l'ID de la catégorie pour la mettre à jour
      },
      data: {
        isArchived: true,  // Marquer comme archivée
        archivedAt: new Date(), // Ajouter la date d'archivage
      },
    });

    // Log d'activité pour l'archivage de la catégorie
    await prisma.activityLog.create({
      data: {
        action: "ARCHIVE_CATEGORY",
        entityType: "Category",
        entityId: id,
        oldData: JSON.stringify(categoryToArchive), // Les données avant archivage
        newData: JSON.stringify(archivedCategory), // Les données après archivage
        organisationId: categoryToArchive.organisationId,
        userId,
        createdByUserId: userId,
        actionDetails: `Archivage de la catégorie "${categoryToArchive.name}"`,
        entityName: "Catégorie",
      },
    });

    console.log(`Catégorie ${id} archivée avec succès.`);
    return archivedCategory; // Retourner la catégorie archivée si nécessaire
  } catch (error) {
    console.error("Erreur lors de l'archivage de la catégorie:", error);
    throw new Error("Erreur serveur lors de l'archivage de la catégorie.");
  }
}
