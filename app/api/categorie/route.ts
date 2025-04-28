// app/api/categories/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Importer Prisma instance

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
    const categories = await prisma.category.findMany({
      where: {
        organisationId: organisationId,
        isArchived: false,
        parentId: null,  // Filtrer pour récupérer uniquement les catégories parentes
      },
      include: {
        _count: {
          select: {
            Product: true, // Compte les produits dans chaque catégorie
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Ajouter le nombre de produits dans la réponse
    const categoriesWithProductCount = categories.map(category => ({
      ...category,
      productCount: category._count.Product, // Ajouter le nombre de produits à chaque catégorie
    }));

    return NextResponse.json(categoriesWithProductCount, { status: 200 });
  } catch (error) {
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories." },
      { status: 500 }
    );
  }
}