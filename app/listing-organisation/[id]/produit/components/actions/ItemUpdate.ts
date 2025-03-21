"use server"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

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

    // Vérification des catégories existantes dans l'organisation
    let updatedCategories;
    if (updatedData.categories && updatedData.categories.length > 0) {
      // Vérifier que chaque catégorie existe dans l'organisation
      const existingCategories = await prisma.category.findMany({
        where: {
          id: { in: updatedData.categories },
          organisationId: organisationId,
        },
      });

      // Vérifier les catégories manquantes
      const missingCategories = updatedData.categories.filter(
        (categoryId) => !existingCategories.some((existing) => existing.id === categoryId)
      );

      if (missingCategories.length > 0) {
        throw new Error(`Certaines catégories n'existent pas dans cette organisation : ${missingCategories.join(", ")}`);
      }

      // Connecter les catégories existantes au produit
      updatedCategories = {
        connect: existingCategories.map((category) => ({
          id: category.id, // Connecter les catégories par leur ID
        })),
      };
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      ...updatedData, // Ajouter toutes les données à mettre à jour
    };

    if (updatedCategories) {
      updateData.categories = updatedCategories; // Ajouter les catégories si elles existent
    }

    // Mettre à jour le produit avec les nouvelles données
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId, // Identifier le produit par son ID
      },
      data: updateData, // Mettre à jour avec les données modifiées
    });

    return updatedProduct; // Retourner le produit mis à jour
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);

    // Afficher l'erreur exacte (si disponible) pour aider au débogage
    if (error instanceof Error) {
      throw new Error(`Erreur lors de la mise à jour du produit: ${error.message}`);
    } else {
      throw new Error("Erreur serveur inconnue");
    }
  }
}
