import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import Prisma instance
import { revalidatePath } from "next/cache"; // Import revalidatePath

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationId = searchParams.get("organisationId");
  const path = searchParams.get("path"); // Get the path for revalidation

  // Ensure the organisationId is present
  if (!organisationId) {
    return NextResponse.json(
      { error: "L'ID de l'organisation est requis." },
      { status: 400 }
    );
  }

  try {
    // Fetch non-archived contacts for the given organisation
    const contacts = await prisma.contact.findMany({
      where: {
        organisations: {
          some: {
            id: organisationId, // Filter by organisationId
          },
        },
        isArchived: false, // Exclude archived contacts
      },
     
      orderBy: {
        createdAt: "asc", // Order by creation date
      },
    });

    // If a path is provided, revalidate that path
    if (path) {
      revalidatePath(path); // Revalidate the path
      return NextResponse.json({ revalidated: true, now: Date.now() });
    }

    // Return the contacts with the count of products
    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des contacts." },
      { status: 500 }
    );
  }
}
