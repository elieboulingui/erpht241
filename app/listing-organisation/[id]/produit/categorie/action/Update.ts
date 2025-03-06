// /app/actions/updateCategoryById.ts
"use server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function updateCategoryById(
  id: string,
  updatedCategory: { name: string; description: string, logo:any }
) {
  if (!id || !updatedCategory.name) {
    throw new Error("L'ID et le nom de la catégorie sont requis.");
  }

  try {
    // Mise à jour de la catégorie par son ID
    const updatedCategoryData = await prisma.category.update({
      where: { id },
      data: updatedCategory,
    });

    return updatedCategoryData;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie:", error);
    throw new Error("Erreur serveur");
  }
}
