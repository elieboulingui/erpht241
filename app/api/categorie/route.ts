import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Importer l'instance Prisma

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
        parentId: null,
      },
      include: {
        _count: {
          select: {
            Product: true,
          },
        },
        parent: {
          select: {
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                Product: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Corriger le typage pour refléter la réalité des données
    const categoriesWithProductCount = categories.map(category => ({
      ...category,
      productCount: category._count.Product,
      parentCategoryName: category.parent?.name || null,
      children: category.children.map(child => ({
        ...child,
        productCount: child._count.Product,
      })),
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
