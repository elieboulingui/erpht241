import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// fichier: /api/filter/route.ts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id');  // Récupérer l'id du produit depuis les paramètres de l'URL

  if (!productId) {
    return new NextResponse("L'ID du produit est requis", { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,  // Recherche du produit avec l'id fourni
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        categories: {
          select: {
            id: true,
            name: true,
            parentId: true,
          },
        },
        organisationId: true,
        createdAt: true,
        updatedAt: true,
        isArchived: true,
        archivedAt: true,
        archivedBy: true,
      },
    });

    if (!product) {
      return new NextResponse("Produit non trouvé", { status: 404 });
    }

    // Envelopper l'objet dans un tableau avant de le renvoyer
    return NextResponse.json([product]);
  } catch (error) {
    console.error('[FILTER_GET]', error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
