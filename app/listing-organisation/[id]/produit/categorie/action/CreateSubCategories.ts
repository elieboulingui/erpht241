"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth"; // Pour récupérer l'utilisateur connecté
import { revalidatePath } from "next/cache";

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
    if (!name || !organisationId || !parentId) {
      throw new Error("Nom, organisation et catégorie parente requis");
    }

    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }

    const userId = session.user.id;

    const parentCategory = await prisma.category.findUnique({
      where: { id: parentId },
    });

    if (!parentCategory) {
      throw new Error("Catégorie parente introuvable");
    }

    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });

    if (!organisation) {
      throw new Error("Organisation invalide");
    }

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

    // ➕ Log d'activité
    await prisma.activityLog.create({
      data: {
        action: "CREATE_SUBCATEGORY",
        entityType: "Category",
        entityId: subCategory.id,
        newData: JSON.stringify(subCategory),
        organisationId: subCategory.organisationId,
        categoryId: subCategory.id,
        userId,
        createdByUserId: userId,
        actionDetails: `Création de la sous-catégorie "${name}"`,
        entityName: "Sous-catégorie",
      },
    });

    // Revalidation du cache
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
