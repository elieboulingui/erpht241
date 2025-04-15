import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Importer l'instance Prisma
import { revalidatePath } from "next/cache"; // Importer revalidatePath

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationId = searchParams.get("organisationId");
  const path = searchParams.get("path"); // Récupérer le paramètre path pour la revalidation

  // Vérification que l'ID de l'organisation est présent
  if (!organisationId) {
    return NextResponse.json(
      { error: "L'ID de l'organisation est requis." },
      { status: 400 }
    );
  }

  try {
    // Récupérer toutes les catégories non archivées pour l'organisation donnée
    const categories = await prisma.category.findMany({
      where: {
        organisationId: organisationId, // Filtrer par ID d'organisation
        isArchived: false, // Filtrer pour exclure les catégories archivées
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
        parent: { // Inclure la catégorie parente
          select: {
            name: true, // Sélectionner uniquement le nom de la catégorie parente
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
      parentCategoryName: category.parent?.name || null, // Ajouter le nom de la catégorie parente
      children: category.children.map(child => ({
        ...child,
        productCount: child._count.Product, // Nombre de produits dans la sous-catégorie
      })),
    }));

    // Si un path est fourni, revalider ce path
    if (path) {
      revalidatePath(path); // Revalidation du chemin
      return NextResponse.json({ revalidated: true, now: Date.now() });
    }

    // Retourner les catégories avec le nombre de produits et le nom de la catégorie parente
    return NextResponse.json(categoriesWithProductCount, { status: 200 });
  } catch (error) {
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories." },
      { status: 500 }
    );
  }
}
