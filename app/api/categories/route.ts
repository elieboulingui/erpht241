// app/api/categories/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Importing Prisma instance

// Fetch categories by organisationId
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationId = searchParams.get("organisationId");

  // Ensure that the organisationId is provided in the query params
  if (!organisationId) {
    return NextResponse.json(
      { error: "L'ID de l'organisation est requis." },
      { status: 400 }
    );
  }

  try {
    // Use Prisma to fetch categories by organisationId, filtering out archived ones
    const categories = await prisma.category.findMany({
      where: {
        organisationId: organisationId,
        isArchived: false, // You can adjust this if you need different filtering logic
      },
      orderBy: {
        createdAt: "asc", // Example: Order by creation date, you can change as needed
      },
    });

    // Return categories as a JSON response
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    // Handle errors (e.g., database connection issues)
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories." },
      { status: 500 }
    );
  }
}
