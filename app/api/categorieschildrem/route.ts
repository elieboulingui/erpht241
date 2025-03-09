import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assurez-vous que le chemin vers Prisma est correct

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationId = searchParams.get("organisationId");

  if (!organisationId) {
    return NextResponse.json(
      { error: "L'ID de l'organisation est requis." },
      { status: 400 }
    );
  }

  try {
    // Récupérer les sous-catégories (enfants) qui ont un parentId (celles qui sont des enfants)
    const subcategories = await prisma.category.findMany({
      where: {
        organisationId,
        parentId: { not: null }, // Les catégories qui ont un parent
        isArchived: false, // Filtrer les sous-catégories actives
      },
    });

    return NextResponse.json(subcategories, { status: 200 });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des sous-catégories." },
      { status: 500 }
    );
  }
}
