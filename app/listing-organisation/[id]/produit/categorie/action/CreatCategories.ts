"use server";

import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est correctement configuré
import { revalidatePath } from "next/cache"; // Import revalidatePath pour revalider le cache
import { NextResponse } from "next/server"; // Pour envoyer des réponses adaptées

export async function createCategory({
  name,
  description,
  organisationId,
  logo,
}: {
  name: string;
  description?: string;
  organisationId: string;
  logo?: string; // Logo est optionnel
}) {
  // Vérification des champs obligatoires
  if (!name || !organisationId) {
    throw new Error("Le nom et l'ID de l'organisation sont requis.");
  }

  try {
    // Création de la catégorie dans la base de données avec Prisma
    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        organisationId,
        logo: logo || "", // Si pas de logo, une chaîne vide est utilisée
        parentId: null, // Par défaut, la catégorie est parente
      },
    });

    // Revalidation du cache de la page des catégories après création
    revalidatePath(`/listing-organisation/${organisationId}/produit/categorie`);

    // Retour de la nouvelle catégorie créée
    return newCategory;
  } catch (error) {
    // Gestion des erreurs
    console.error("Erreur lors de la création de la catégorie:", error);
    throw new Error("Erreur serveur lors de la création de la catégorie.");
  }
}
