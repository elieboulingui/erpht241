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

    // Revalidation du chemin (utilisation ici ou dans une route API)
    const pathToRevalidate = `/listing-organisation/${organisationId}/produit/categorie`; // Dynamique avec organisationId
    await fetch(`/api/api/revalidatePath?path=${pathToRevalidate}`); // Utilisation d'une requête API pour la revalidation

    return newCategory; // Retourne la catégorie créée
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    throw new Error("Erreur serveur lors de la création de la catégorie.");
  }
}
