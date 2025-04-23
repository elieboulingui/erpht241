"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client";

export async function updateMarqueByid(
  id: string,
  updatedCategory: { name: string; description: string; logo: any }
) {
  if (!id || !updatedCategory.name) {
    throw new Error("L'ID et le nom de la marque sont requis.");
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }
    const userId = session.user.id;

    // Récupérer la marque avant la mise à jour
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      throw new Error("Marque introuvable.");
    }

    // Mise à jour de la marque
    const updatedBrandData = await prisma.brand.update({
      where: { id },
      data: updatedCategory,
    });

    // 🔄 Envoi de l'événement à Inngest (à la place du log direct)
    await inngest.send({
      name: "activity/brand.updated",
      data: {
        action: "UPDATE_BRAND",
        entityType: "Brand",
        entityId: id,
        oldData: existingBrand,
        newData: updatedBrandData,
        organisationId: existingBrand.organisationId,
        brandId: id,
        userId,
        createdByUserId: userId,
      },
    });

    return updatedBrandData;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la marque:", error);
    throw new Error("Erreur serveur");
  }
}
