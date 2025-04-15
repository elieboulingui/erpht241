import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Importer Prisma instance

// Définition du type pour une catégorie avec les sous-catégories et productCount
interface CategoryWithCount {
  id: string;
  name: string;
  description: string | null;
  organisationId: string;
  productCount: number; // Nombre de produits pour cette catégorie
  parentName?: string | null; // Nom de la catégorie parente, si disponible
  children: CategoryWithCount[]; // Sous-catégories de type CategoryWithCount
}

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
    // Récupérer les catégories principales (sans parentId)
    const categories = await prisma.category.findMany({
      where: {
        organisationId: organisationId,
        isArchived: false,
        parentId: null, // Filtrer pour obtenir seulement les catégories principales (sans parent)
      },
      include: {
        _count: {
          select: {
            Product: true, // Compte les produits dans chaque catégorie
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Trier par date de création
      },
    });

    // Transformation des catégories pour inclure le champ productCount et les sous-catégories
    const categoriesWithProductCount: CategoryWithCount[] = await Promise.all(
      categories.map(async (category) => {
        // Récupérer les sous-catégories de cette catégorie
        const children = await prisma.category.findMany({
          where: {
            parentId: category.id, // Filtrer pour obtenir les sous-catégories de cette catégorie
            isArchived: false, // Filtrer pour éviter les sous-catégories archivées
          },
          include: {
            _count: {
              select: {
                Product: true, // Compte les produits dans chaque sous-catégorie
              },
            },
            parent: { // Jointure pour récupérer les informations de la catégorie parente
              select: {
                name: true, // Nom de la catégorie parente
              },
            },
          },
        });

        // Formater et nettoyer les données pour chaque sous-catégorie
        const formattedChildren = children.map((child) => ({
          id: child.id,
          name: child.name,
          description: child.description,
          organisationId: child.organisationId,
          productCount: child._count.Product, // Nombre de produits pour la sous-catégorie
          parentName: child.parent?.name || null, // Récupérer le nom de la catégorie parente
          children: [], // Les sous-catégories sont vides pour le moment (on ne les récupère pas ici)
        }));

        // Retourner la catégorie principale avec son productCount et les sous-catégories formatées
        return {
          ...category,
          productCount: category._count.Product, // Nombre de produits pour la catégorie principale
          children: formattedChildren, // Sous-catégories formatées
        };
      })
    );

    // Retourner la réponse avec les catégories et leurs sous-catégories
    return NextResponse.json(categoriesWithProductCount, { status: 200 });
  } catch (error) {
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories." },
      { status: 500 }
    );
  }
}
