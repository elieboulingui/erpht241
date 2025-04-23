"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth"; // Assure-toi que ce chemin est correct selon ton projet
import { inngest } from "@/inngest/client";

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

    // Archiver le produit
    const archivedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    // ✅ Envoi de l'événement à Inngest
    await inngest.send({
      name: "product/archived",  // Nom de l'événement
      data: {
        organisationId,
        productId: archivedProduct.id,
        oldData: product,
        newData: archivedProduct,
        userId,
      },
    });

    console.log(`Produit ${productId} archivé avec succès.`);
    return archivedProduct;
  } catch (error) {
    console.error("Erreur lors de l'archivage du produit:", error);
    throw new Error("Erreur serveur lors de l'archivage du produit.");
  }
}
