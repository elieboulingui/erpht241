"use server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function updateMarqueByid(
  id: string,
  updatedCategory: { name: string; description: string; logo: any }
) {
  if (!id || !updatedCategory.name) {
    throw new Error("L'ID et le nom de la marque sont requis.");
  }

  try {
    // Mise à jour de la marque par son ID
    const updatedBrandData = await prisma.brand.update({
      where: { id },
      data: updatedCategory,
    });

    return updatedBrandData;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la marque:", error);
    throw new Error("Erreur serveur");
  }
}
