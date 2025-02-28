"use server"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function updateProductByOrganisationAndProductId(
  organisationId: string,
  productId: string,
  updatedData: { name?: string; description?: string; category?: string; price?: number; images?: string[]; actions?: string }
) {
  if (!organisationId || !productId) {
    throw new Error("L'ID de l'organisation et l'ID du produit sont requis.");
  }

  try {
    // Vérifier si le produit appartient à l'organisation avant de le mettre à jour
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    // Si le produit n'existe pas ou n'appartient pas à l'organisation spécifiée
    if (!product || product.organisationId !== organisationId) {
      throw new Error("Produit introuvable ou organisation non correspondante.");
    }

    // Mettre à jour le produit avec les nouvelles données
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId, // Identifier le produit par son ID
      },
      data: {
        ...updatedData, // Appliquer les nouvelles données
      },
    });

    return updatedProduct; // Retourner le produit mis à jour
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);
    throw new Error("Erreur serveur");
  }
}
