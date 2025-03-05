"use server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function getitemsByOrganisationId(id: string) {
  if (!id) {
    throw new Error("L'ID de l'organisation est requis.");
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        organisationId: id,
        isArchived: false,
      },
      include: { category: true }
    });

    if (!products) {
      console.warn("No products found for this organisation.");
      return []; // Return an empty array, never null
    }

    return products;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    throw new Error("Erreur serveur");
  }
}
