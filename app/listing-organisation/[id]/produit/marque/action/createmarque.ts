"use server";

import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est correctement configuré
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Helper pour gérer les erreurs
const handleError = (message: string) => {
  console.error(message);
  return NextResponse.json({ error: message }, { status: 400 });
};

// Fonction pour vérifier si l'organisation existe
const checkOrganisationExists = async (organisationId: string) => {
  const organisation = await prisma.organisation.findUnique({
    where: { id: organisationId },
  });

  if (!organisation) {
    throw new Error("Organisation introuvable.");
  }
  return organisation;
};

// Fonction principale pour créer une marque
export async function createmarque({
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
  // Validation des paramètres d'entrée
  if (!name || !organisationId) {
    console.error("Erreur: Le nom et l'ID de l'organisation sont requis.");
    return handleError("Le nom et l'ID de l'organisation sont requis.");
  }

  try {
    // Vérifier si l'organisation existe
    const organisation = await checkOrganisationExists(organisationId);

    // Préparation des données de la nouvelle marque
    const categoryData = {
      name,
      organisationId,
      description,
      logo,
    };

    console.log("Données de la marque : ", categoryData);

    // Création de la marque dans la base de données
    const newCategory = await prisma.brand.create({
      data: categoryData,
    });

    // Sérialisation de la réponse pour éviter les objets complexes
    const responseData = JSON.parse(JSON.stringify(newCategory));

    // Revalidation du cache pour la page concernée
    revalidatePath(`/listing-organisation/${organisationId}/produit/marque`);

    console.log("Nouvelle marque créée : ", responseData);

    // Retourner la nouvelle catégorie créée sous forme de JSON
    return NextResponse.json(responseData);
  } catch (error) {
    // Si une erreur se produit, la traiter et retourner une réponse appropriée
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    return handleError(errorMessage);
  }
}
