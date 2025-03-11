"use server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est correctement configuré
import { revalidatePath } from "next/cache"; // Import revalidatePath pour revalider le cache
import { NextResponse } from "next/server"; // Pour envoyer des réponses adaptées

export async function creatcategory({
  name,
  description,
  organisationId,
  logo,
}: {
  name: string;
  description?: string;  // description est optionnelle
  organisationId: string;
  logo?: string;  // logo est optionnel
}) {
  // Vérification des champs obligatoires
  if (!name || !organisationId) {
    throw new Error("Le nom et l'ID de l'organisation sont requis.");
  }

  // Construction de l'objet categoryData
  const categoryData: any = {
    name,
    organisationId,
    parentId: null, // Par défaut, la catégorie est parente
  };

  // Ajouter description et logo seulement s'ils sont définis
  if (description !== undefined) categoryData.description = description;
  if (logo !== undefined) categoryData.logo = logo;

  
  // Si parentId est null, assurez-vous qu'il ne soit pas passé
  if (categoryData.parentId === null) delete categoryData.parentId;

  // Log pour vérifier l'objet avant d'envoyer à Prisma
  console.log("categoryData avant création:", categoryData);

  try {
    // Création de la catégorie dans la base de données avec Prisma
    const newCategory = await prisma.brand.create({
      data: categoryData,
    });

    // Revalidation du cache de la page des catégories après création
    revalidatePath(`/listing-organisation/${organisationId}/produit/marque`);

    // Retour de la nouvelle catégorie créée
    return newCategory;
  } catch (error) {
    // Ajout d'un log d'erreur plus détaillé pour comprendre le problème
    console.error("Erreur lors de la création de la catégorie:", error);
    throw new Error("Erreur serveur lors de la création de la catégorie.");
  }
}
