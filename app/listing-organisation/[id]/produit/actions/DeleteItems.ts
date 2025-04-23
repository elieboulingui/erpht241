"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth"; // Assure-toi que ce chemin est correct selon ton projet

export async function deleteProductByOrganisationAndProductId(
  organisationId: string,
  productId: string
) {
  if (!organisationId || !productId) {
    throw new Error("L'ID de l'organisation et l'ID du produit sont requis.");
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }

    const userId = session.user.id;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Produit non trouvé.");
    }

    if (product.organisationId !== organisationId) {
      throw new Error("Le produit n'appartient pas à cette organisation.");
    }

    const archivedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    // Log dans ActivityLog
    await prisma.activityLog.create({
      data: {
        action: "ARCHIVE_PRODUCT",
        entityType: "Product",
        entityId: archivedProduct.id,
        oldData: JSON.stringify(product),
        newData: JSON.stringify(archivedProduct),
        organisationId,
        userId,
        createdByUserId: userId,
        productId: archivedProduct.id,
      },
    });

    console.log(`Produit ${productId} archivé avec succès.`);
    return archivedProduct;
  } catch (error) {
    console.error("Erreur lors de l'archivage du produit:", error);
    throw new Error("Erreur serveur lors de l'archivage du produit.");
  }
}
