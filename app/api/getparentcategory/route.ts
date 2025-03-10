import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Importer Prisma instance
import { revalidatePath } from 'next/cache';

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
    // Récupérer les catégories principales (sans parentId) et leurs sous-catégories
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
        children: {
          where: {
            isArchived: false, // Filtrer pour éviter les sous-catégories archivées
          },
          include: {
            _count: {
              select: {
                Product: true, // Compte aussi les produits dans les sous-catégories
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Trier par date de création
      },
    });

    // Ajouter le nombre de produits dans la réponse
    const categoriesWithProductCount = categories.map(category => ({
      ...category,
      productCount: category._count.Product, // Ajouter le nombre de produits pour chaque catégorie
      children: category.children.map(child => ({
        ...child,
        productCount: child._count.Product, // Ajouter le nombre de produits pour chaque sous-catégorie
      })),
    }));

    // Utiliser revalidatePath pour forcer une actualisation de la page
    revalidatePath(`/listing-organisation/${organisationId}/produit/categorie`);

    return NextResponse.json(categoriesWithProductCount, { status: 200 });
  } catch (error) {
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories." },
      { status: 500 }
    );
  }
}
