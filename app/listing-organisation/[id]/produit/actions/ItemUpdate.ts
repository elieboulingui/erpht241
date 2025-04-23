"use server"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré
import { auth } from "@/auth"; // Importe votre méthode d'authentification pour récupérer l'utilisateur

interface ProductUpdateData {
  name?: string;
  description?: string;
  categories?: string[]; // Liste des ID des catégories à associer
  price?: number;
  images?: string[];
  actions?: string;
}

export async function updateProductByOrganisationAndProductId(
  organisationId: string,
  productId: string,
  updatedData: ProductUpdateData
) {
  if (!organisationId || !productId) {
    throw new Error("L'ID de l'organisation et l'ID du produit sont requis.");
  }

  try {
    // Récupérer l'utilisateur authentifié à partir de auth() (assurez-vous que la méthode auth() fonctionne correctement)
    const session = await auth(); // Appeler auth() pour récupérer la session utilisateur

    if (!session || !session.user) {
      throw new Error("Utilisateur non authentifié.");
    }

    const userId = session.user.id; // ID de l'utilisateur authentifié

    // Vérifier si le produit existe et appartient à l'organisation avant de le mettre à jour
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Produit introuvable.");
    }

    if (product.organisationId !== organisationId) {
      throw new Error("Organisation non correspondante pour ce produit.");
    }

    // Récupérer l'ancienne donnée pour le journal d'activités
    const oldData = JSON.stringify(product); // Sérialiser l'ancien produit

    // Vérification des catégories existantes dans l'organisation
    let updatedCategories;
    if (updatedData.categories && updatedData.categories.length > 0) {
      const existingCategories = await prisma.category.findMany({
        where: {
          id: { in: updatedData.categories },
          organisationId: organisationId,
        },
      });

      const missingCategories = updatedData.categories.filter(
        (categoryId) => !existingCategories.some((existing) => existing.id === categoryId)
      );

      if (missingCategories.length > 0) {
        throw new Error(`Certaines catégories n'existent pas dans cette organisation : ${missingCategories.join(", ")}`);
      }

      updatedCategories = {
        connect: existingCategories.map((category) => ({
          id: category.id,
        })),
      };
    }

    const updateData: any = {
      ...updatedData,
    };

    if (updatedCategories) {
      updateData.categories = updatedCategories;
    }

    // Mettre à jour le produit avec les nouvelles données
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: updateData,
    });

    // Enregistrer l'activité dans le journal
    await prisma.activityLog.create({
      data: {
        action: "UPDATE",
        entityType: "Product",
        entityId: productId,
        oldData: oldData ? JSON.parse(oldData) : undefined,
        newData: JSON.stringify(updatedProduct),
        userId: userId, // ID de l'utilisateur qui effectue la mise à jour
        organisationId: organisationId,
        createdByUserId: userId, // L'utilisateur qui a effectué la mise à jour
        actionDetails: `Produit ${productId} mis à jour`,
        entityName: updatedProduct.name, // Nom du produit mis à jour
      },
    });

    return updatedProduct;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);

    if (error instanceof Error) {
      throw new Error(`Erreur lors de la mise à jour du produit: ${error.message}`);
    } else {
      throw new Error("Erreur serveur inconnue");
    }
  }
}
