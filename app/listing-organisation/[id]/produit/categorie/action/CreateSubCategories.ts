"use server";
import prisma from "@/lib/prisma";

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

    // Correction ici : utilisation de la variable logo au lieu du type string
    const subCategory = await prisma.category.create({
      data: {
        name,
        description: description || null,
        logo: logo ?? null, // Utilisation correcte de la variable
        organisationId,
        parentId,
      },
      include: {
        parent: true,
        organisation: true,
      },
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