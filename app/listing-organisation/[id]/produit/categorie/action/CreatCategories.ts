// src/app/actions/createCategory.ts (action serveur)
"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache"; // Revalidation du chemin

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
    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        organisationId,
        logo: logo || "",
        parentId: null,
      },
    });

    // Revalidation du chemin, mais sans attendre la réponse
    const pathToRevalidate = `/listing-organisation/${organisationId}/produit/categorie`;
    fetch(`/api/api/revalidatePath?path=${pathToRevalidate}`).catch((error) => {
      console.error("Erreur lors de la revalidation du chemin:", error);
    });

    return newCategory; // Retourne la catégorie créée immédiatement
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    throw new Error("Erreur serveur lors de la création de la catégorie.");
  }
}
