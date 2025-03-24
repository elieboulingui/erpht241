"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache"; // Importing revalidatePath for cache revalidation

export async function createSubCategory({
  name,
  organisationId,
  parentId,
  logo,
  description,
}: {
  name: string;
  organisationId: string;
  parentId: string;
  logo?: string;
  description?: string;
}) {
  try {
    // Validation des champs requis
    if (!name || !organisationId || !parentId) {
      throw new Error("Nom, organisation et catégorie parente requis");
    }

    // Vérifier l'existence du parent
    const parentCategory = await prisma.category.findUnique({
      where: { id: parentId },
    });

    if (!parentCategory) {
      throw new Error("Catégorie parente introuvable");
    }

    // Vérifier l'organisation
    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });

    if (!organisation) {
      throw new Error("Organisation invalide");
    }

    // Création de la sous-catégorie
    const subCategory = await prisma.category.create({
      data: {
        name,
        description: description || null,
        logo: logo ?? null,
        organisationId,
        parentId,
      },
      include: {
        parent: true,
        organisation: true,
      },
    });

    // Revalidation du chemin après création
    const pathToRevalidate = `/listing-organisation/${organisationId}/produit/categorie`;
    fetch(`/api/api/revalidatePath?path=${pathToRevalidate}`).catch((error) => {
      console.error("Erreur lors de la revalidation du chemin:", error);
    });

    return {
      success: true,
      data: subCategory,
      message: "Sous-catégorie créée avec succès",
    };

  } catch (error) {
    console.error("Erreur création sous-catégorie:", error);
    return {
      success: false,
      message: error instanceof Error 
        ? error.message 
        : "Erreur interne du serveur",
    };
  }
}
