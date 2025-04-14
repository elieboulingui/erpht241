"use server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré
import { auth } from "@/auth"; // Pour récupérer l'utilisateur connecté

export async function updateCategoryById(
  id: string,
  updatedCategory: { name: string; description: string; logo: any }
) {
  if (!id || !updatedCategory.name) {
    throw new Error("L'ID et le nom de la catégorie sont requis.");
  }

  try {
    // Récupérer les données actuelles de la catégorie avant la mise à jour
    const categoryToUpdate = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryToUpdate) {
      throw new Error("Aucune catégorie trouvée avec cet ID.");
    }

    // Récupérer l'utilisateur actuellement authentifié
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }
    const userId = session.user.id;

    // Mise à jour de la catégorie par son ID
    const updatedCategoryData = await prisma.category.update({
      where: { id },
      data: updatedCategory,
    });

    // Log d'activité pour la mise à jour de la catégorie
    await prisma.activityLog.create({
      data: {
        action: "UPDATE_CATEGORY",
        entityType: "Category",
        entityId: id,
        oldData: JSON.stringify(categoryToUpdate), // Les données avant mise à jour
        newData: JSON.stringify(updatedCategoryData), // Les données après mise à jour
        organisationId: categoryToUpdate.organisationId,
        userId,
        createdByUserId: userId,
        actionDetails: `Mise à jour de la catégorie "${categoryToUpdate.name}"`,
        entityName: "Catégorie",
      },
    });

    console.log(`Catégorie ${id} mise à jour avec succès.`);
    return updatedCategoryData;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie:", error);
    throw new Error("Erreur serveur");
  }
}
