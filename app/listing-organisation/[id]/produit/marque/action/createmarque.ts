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
  description?: string;
  organisationId: string;
  logo?: string;
}) {
  // Vérification des champs obligatoires
  if (!name || !organisationId) {
    throw new Error("Le nom et l'ID de l'organisation sont requis.");
  }

  console.log("organisationId reçu:", organisationId);

  // Extraction de l'ID de l'organisation
  const organisationIdExtracted = organisationId;
  console.log("organisationId extrait:", organisationIdExtracted);

  // Vérification de l'existence de l'organisation dans la base de données
  const organisationExists = await prisma.organisation.findUnique({
    where: { id: organisationIdExtracted },
  });

  if (!organisationExists) {
    console.error(`Aucune organisation trouvée pour l'ID ${organisationIdExtracted}`);
    throw new Error(`Aucune organisation trouvée pour l'ID ${organisationIdExtracted}`);
  }

  // Construction des données de la catégorie
  const categoryData = {
    name,
    organisationId: organisationIdExtracted,
    parentId: null,
    description,
    logo,
  };

  try {
    // Création de la catégorie dans la base de données
    const newCategory = await prisma.brand.create({
      data: categoryData,
    });

    // Revalidation du cache après la création
    revalidatePath(`/listing-organisation/${organisationIdExtracted}/produit/marque`);
    console.log("Cache revalidé avec succès!");

    // Retourner la nouvelle catégorie
    return NextResponse.json(newCategory);
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    throw new Error("Erreur serveur lors de la création de la catégorie.");
  }
}
