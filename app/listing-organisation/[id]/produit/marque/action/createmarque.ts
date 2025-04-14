"use server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Assure-toi que ce chemin est correct

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
  if (!name || !organisationId) {
    return handleError("Le nom et l'ID de l'organisation sont requis.");
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return handleError("Utilisateur non authentifié.");
    }
    const userId = session.user.id;

    await checkOrganisationExists(organisationId);

    const brandData = {
      name,
      organisationId,
      description,
      logo,
    };

    const newBrand = await prisma.brand.create({
      data: brandData,
    });

    // 🔍 Enregistrer dans ActivityLog
    await prisma.activityLog.create({
      data: {
        action: "CREATE_BRAND",
        entityType: "Brand",
        entityId: newBrand.id,
        newData: JSON.stringify(brandData),
        organisationId,
        userId,
        createdByUserId: userId,
        brandId: newBrand.id,
      },
    });

    const responseData = JSON.parse(JSON.stringify(newBrand));

    const pathToRevalidate = `/listing-organisation/${organisationId}/produit/marque`;
    const baseURL = process.env.BASE_URL || "http://localhost:3000";
    const revalidateURL = `${baseURL}/api/api/revalidatePath?path=${pathToRevalidate}`;

    fetch(revalidateURL, {
      method: "GET",
    }).catch((revalidateError) => {
      console.error("Erreur lors de la révalidation du cache : ", revalidateError);
    });

    return NextResponse.json({ message: "Création réussie de la marque", brand: responseData });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    return handleError(errorMessage);
  }
}
