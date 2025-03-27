"use server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function deleteProductByOrganisationAndProductId(organisationId: string, productId: string) {
  if (!organisationId || !productId) {
    throw new Error("L'ID de l'organisation et l'ID du produit sont requis.");
  }

  try {
    // Chercher le produit avant de l'archiver
    const product = await prisma.product.findUnique({
      where: {
        id: productId,  // Chercher le produit par son ID
      },
    });

    // Vérifier si le produit existe
    if (!product) {
      throw new Error("Produit non trouvé.");
    }

    // Vérifier que le produit appartient à l'organisation spécifiée
    if (product.organisationId !== organisationId) {
      throw new Error("Le produit n'appartient pas à cette organisation.");
    }

    // Archiver le produit en mettant à jour les champs isArchived et archivedAt
    const archivedProduct = await prisma.product.update({
      where: {
        id: productId,  // Utiliser l'ID du produit pour effectuer la mise à jour
      },
      data: {
        isArchived: true, // Marquer comme archivé
        archivedAt: new Date(), // Enregistrer la date d'archivage
      },
    });

    console.log(`Produit ${productId} archivé avec succès.`);
    return archivedProduct; // Retourner le produit archivé
  } catch (error) {
    console.error("Erreur lors de l'archivage du produit:", error);
    throw new Error("Erreur serveur lors de l'archivage du produit.");
  }
}
