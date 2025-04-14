"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function creatcategory({
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

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Utilisateur non authentifié.");
  }

  const userId = session.user.id;

  const categoryData: any = {
    name,
    organisationId,
    parentId: null,
  };

  if (description !== undefined) categoryData.description = description;
  if (logo !== undefined) categoryData.logo = logo;
  if (categoryData.parentId === null) delete categoryData.parentId;

  console.log("categoryData avant création:", categoryData);

  try {
    const newCategory = await prisma.category.create({
      data: categoryData,
    });

    // Création du log d'activité
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

    revalidatePath(`/listing-organisation/${organisationId}/produit/categorie`);

    return newCategory;
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    throw new Error("Erreur serveur lors de la création de la catégorie.");
  }
}
