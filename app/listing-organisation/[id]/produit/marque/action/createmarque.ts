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

  // Vérification de l'ID de l'organisation pour extraire l'ID réel
  const organisationIdExtracted = organisationId.split('/')[2]; // L'ID se trouve après le 2ème '/'
  
  console.log("organisationId extrait:", organisationIdExtracted); // Log de l'ID extrait pour vérification

  // Vérification si l'organisation existe dans la base de données
  const organisationExists = await prisma.organisation.findUnique({
    where: { id: organisationIdExtracted },
  });

  if (!organisationExists) {
    console.error(`Aucune organisation trouvée pour l'ID ${organisationIdExtracted}`);  // Log si organisation non trouvée
    throw new Error(`Aucune organisation trouvée pour l'ID ${organisationIdExtracted}`);
  }

  // Construction de l'objet categoryData
  const categoryData: any = {
    name,
    organisationId: organisationIdExtracted, // Utilisation de l'ID extrait
    parentId: null, // Par défaut, la catégorie est parente
  };

  // Ajouter description et logo seulement s'ils sont définis
  if (description !== undefined) categoryData.description = description;
  if (logo !== undefined) categoryData.logo = logo;

  // Si parentId est null, assurez-vous qu'il ne soit pas passé
  if (categoryData.parentId === null) delete categoryData.parentId;

  // Log avant l'envoi des données à Prisma
  console.log("categoryData avant création:", categoryData);

  try {
    // Création de la catégorie dans la base de données avec Prisma
    const newCategory = await prisma.brand.create({
      data: categoryData,
    });

    // Revalidation du cache de la page des catégories après création
    revalidatePath(`/listing-organisation/${organisationIdExtracted}/produit/marque`);

    // Retour de la nouvelle catégorie créée
    return newCategory;
  } catch (error) {
    // Log détaillé en cas d'erreur
    console.error("Erreur lors de la création de la catégorie:", error);
    throw new Error("Erreur serveur lors de la création de la catégorie.");
  }
}
