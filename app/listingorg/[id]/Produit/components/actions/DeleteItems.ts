"use server"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function deleteProductByOrganisationAndProductId(organisationId: string, productId: string) {
  if (!organisationId || !productId) {
    throw new Error("L'ID de l'organisation et l'ID du produit sont requis.");
  }

  try {
    // Supprimer le produit basé sur l'ID de l'organisation et l'ID du produit
    const product = await prisma.product.delete({
      where: {
        id: productId,  // Supprimer par l'ID du produit
      },
      // Assurez-vous que le produit appartient bien à l'organisation avant de le supprimer
      // Cela évite la suppression d'un produit d'une autre organisation.
      // Si vous souhaitez une vérification supplémentaire, vous pouvez ajouter une condition `organisationId` dans votre logique.
    });

    return product; // Retourner le produit supprimé
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    throw new Error("Erreur serveur");
  }
}
