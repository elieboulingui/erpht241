"use server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est correctement configuré
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache"; // Import revalidatePath to trigger revalidation

export async function createCategory({
  name,
  description,
  organisationId,
  logo,
}: {
  name: string;
  description?: string;
  organisationId: string;
  logo?: string; // Make logo optional
}) {
  if (!name || !organisationId) {
    throw new Error("Le nom et l'ID de l'organisation sont requis.");
  }

  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        organisationId,
        logo: logo || "", // You can also use an empty string here as a fallback
        parentId: null,  // Cette ligne assure que la catégorie est parente par défaut
      },
    });

    // Revalidate the path after creation
    revalidatePath('/categories');  // Update with the appropriate path if needed

    return newCategory;
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    throw new Error("Erreur serveur lors de la création de la catégorie.");
  }
}
