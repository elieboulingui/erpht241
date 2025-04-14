"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createCategory({
  name,
  description,
  organisationId,
  logo,
}: {
  name: string;
  description?: string;
  organisationId: string;
  logo?: string;
}) {
  if (!name || !organisationId) {
    throw new Error("Le nom et l'ID de l'organisation sont requis.");
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }

    const userId = session.user.id;

    // Création de la catégorie
    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        organisationId,
        logo: logo || "",
        parentId: null,
      },
    });

    // Création de l'entrée dans ActivityLog
    await prisma.activityLog.create({
      data: {
        action: "CREATE_CATEGORY",
        entityType: "Category",
        entityId: newCategory.id,
        newData: JSON.stringify(newCategory),
        organisationId: newCategory.organisationId,
        categoryId: newCategory.id,
        userId,
        createdByUserId: userId,
      },
    });

    // Revalidation du cache (ne bloque pas la réponse)
    const pathToRevalidate = `/listing-organisation/${organisationId}/produit/categorie`;

    fetch(`/api/revalidapath?path=${pathToRevalidate}`).catch((error) => {
      console.error("Erreur lors de la revalidation du chemin:", error);
    });

    return newCategory;
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    throw new Error("Erreur serveur lors de la création de la catégorie.");
  }
}
