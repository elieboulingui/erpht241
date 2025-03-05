"use server"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function updateProductByOrganisationAndProductId(
  organisationId: string,
  productId: string,
  updatedData: { 
    name?: string; 
    description?: string; 
    category?: string; // Handle category connection here
    price?: number; 
    images?: string[]; 
    actions?: string 
  }
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

    // Prepare the category update if needed
    const updatedCategory = updatedData.category ? {
      connect: { 
        category_organisation_unique: {  // Using the composite unique constraint field
          name: updatedData.category,
          organisationId: organisationId // Pass the organisationId to match the unique constraint
        }
      }
    } : undefined;

    // Mettre à jour le produit avec les nouvelles données
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId, // Identifier le produit par son ID
      },
      data: {
        ...updatedData,
        category: updatedCategory, // Ensure category is passed as a connected object
      },
    });

    return updatedProduct; // Retourner le produit mis à jour
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);
    throw new Error("Erreur serveur");
  }
}
