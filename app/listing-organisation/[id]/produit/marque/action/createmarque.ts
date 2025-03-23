"use server"
import prisma from "@/lib/prisma";
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
    const newBrand = await prisma.brand.create({
      data: categoryData,
    });

    // Serialize the response to avoid complex objects
    const responseData = JSON.parse(JSON.stringify(newBrand));

    // Path to revalidate (dynamically including the organisationId)
    const pathToRevalidate = `/listing-organisation/${organisationId}/produit/marque`;

    // Construct the full URL for revalidation
    const baseURL = process.env.BASE_URL || 'http://localhost:3000'; // Adjust based on your environment
    const revalidateURL = `${baseURL}/api/revalidatePath?path=${pathToRevalidate}`;

    // Trigger revalidation in the background (don't wait for it to complete)
    fetch(revalidateURL, {
      method: 'GET', // Or POST, depending on how your API is set up
    }).catch((revalidateError) => {
      console.error("Erreur lors de la révalidation du cache : ", revalidateError);
      // Ignore revalidation errors
    });

    // Return success message along with the new brand data
    return NextResponse.json({ message: "Création réussie de la marque", brand: responseData });
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    return handleError(errorMessage);
  }
}
