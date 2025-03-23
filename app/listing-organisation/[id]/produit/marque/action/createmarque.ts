"use server";

import prisma from "@/lib/prisma"; // Ensure Prisma is configured properly
import { NextResponse } from "next/server";

// Helper for error handling
const handleError = (message: string) => {
  console.error(message);
  return NextResponse.json({ error: message }, { status: 400 });
};

// Function to check if the organization exists
const checkOrganisationExists = async (organisationId: string) => {
  const organisation = await prisma.organisation.findUnique({
    where: { id: organisationId },
  });

  if (!organisation) {
    throw new Error("Organisation introuvable.");
  }
  return organisation;
};

// Main function to create a brand
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
  // Input validation
  if (!name || !organisationId) {
    console.error("Erreur: Le nom et l'ID de l'organisation sont requis.");
    return handleError("Le nom et l'ID de l'organisation sont requis.");
  }

  try {
    // Check if the organization exists
    const organisation = await checkOrganisationExists(organisationId);

    // Prepare the brand data
    const categoryData = {
      name,
      organisationId,
      description,
      logo,
    };

    console.log("Données de la marque : ", categoryData);

    // Create the brand in the database
    const newCategory = await prisma.brand.create({
      data: categoryData,
    });

    // Serialize the response to avoid complex objects
    const responseData = JSON.parse(JSON.stringify(newCategory));

    // Path to revalidate (dynamically including the organisationId)
    const pathToRevalidate = `/listing-organisation/${organisationId}/produit/marque`;

    // Revalidate the cache using an API request
    await fetch(`/api/revalidatePath?path=${pathToRevalidate}`, {
      method: 'GET', // Or POST, depending on how your API is set up
    });

    console.log("Nouvelle marque créée : ", responseData);

    // Return the newly created brand as JSON
    return NextResponse.json(responseData);
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    return handleError(errorMessage);
  }
}
