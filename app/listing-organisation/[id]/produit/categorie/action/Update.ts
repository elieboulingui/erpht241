"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client";

export async function updateCategoryById(
  id: string,
  updatedCategory: { name: string; description: string; logo: any }
) {
  if (!id || !updatedCategory.name) {
    throw new Error("L'ID et le nom de la catégorie sont requis.");
  }

  try {
    const categoryToUpdate = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryToUpdate) {
      throw new Error("Aucune catégorie trouvée avec cet ID.");
    }

    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }

    const userId = session.user.id;

    const updatedCategoryData = await prisma.category.update({
      where: { id },
      data: updatedCategory,
    });

    // 👉 Envoi de l'événement à Inngest pour log uniquement
    await inngest.send({
      name: "category/updated.log-only",
      data: {
        oldData: categoryToUpdate,
        newData: updatedCategoryData,
        organisationId: categoryToUpdate.organisationId,
        userId,
      },
    });

    console.log(`Catégorie ${id} mise à jour avec succès.`);
    return updatedCategoryData;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie:", error);
    throw new Error("Erreur serveur");
  }
}
