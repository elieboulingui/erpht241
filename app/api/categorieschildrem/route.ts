import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assurez-vous que le chemin vers Prisma est correct

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get("organisationId");
  
    if (!organisationId) {
      return NextResponse.json({ error: "L'ID de l'organisation est requis." }, { status: 400 });
    }
  
    try {
      // Récupérer uniquement les sous-catégories (celles qui ont un parentCategoryId)
      const subcategories = await prisma.category.findMany({
        where: {
          organisationId,
          parentId: { not: null }, // Filtrer les sous-catégories qui ont un parentCategoryId
          isArchived: false,
        },
      });
  
      return NextResponse.json(subcategories, { status: 200 });
    } catch (error) {
      console.error("Erreur:", error);
      return NextResponse.json({ error: "Erreur lors de la récupération des sous-catégories." }, { status: 500 });
    }
  }
  
  