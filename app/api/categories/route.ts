import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Importer l'instance Prisma

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationId = searchParams.get("organisationId");

  // Vérification que l'ID de l'organisation est présent
  if (!organisationId) {
    return NextResponse.json(
      { error: "L'ID de l'organisation est requis." },
      { status: 400 }
    );
  }

  try {
    // Récupérer toutes les catégories (avec ou sans parentId) pour l'organisation donnée
    const categories = await prisma.category.findMany({
      where: {
        organisationId: organisationId,
        // tu peux ajouter d'autres filtres si nécessaire (par exemple, isArchived)
      },
      include: {
        _count: {
          select: {
            Product: true, // Compte le nombre de produits dans chaque catégorie
          },
        },
        children: {
          include: {
            _count: {
              select: {
                Product: true, // Compte les produits dans les sous-catégories
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Trier par date de création des catégories
      },
    });

    // Ajouter le nombre de produits pour chaque catégorie et sous-catégorie
    const categoriesWithProductCount = categories.map(category => ({
      ...category,
      productCount: category._count.Product, // Nombre de produits dans la catégorie principale
      children: category.children.map(child => ({
        ...child,
        productCount: child._count.Product, // Nombre de produits dans la sous-catégorie
      })),
    }));

    // Retourner les catégories avec le nombre de produits
    return NextResponse.json(categoriesWithProductCount, { status: 200 });
  } catch (error) {
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories." },
      { status: 500 }
    );
  }
}
