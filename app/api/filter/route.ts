import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const categoryId = req.nextUrl.searchParams.get('categoryId'); // ID de la catégorie
  
    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }
  
    try {
      // Récupérer les produits associés à cette catégorie
      const products = await prisma.product.findMany({
        where: {
          categories: {
            some: {
              id: categoryId, // Utilisation de "some" pour vérifier la catégorie
            },
          },
          isArchived: false, // Filtrer les produits non archivés
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          images: true
        }
      });
  
      if (products.length === 0) {
        return new NextResponse("No products found for this category", { status: 404 });
      }
  
      // Retourner les produits
      return NextResponse.json(products);
    } catch (error) {
      console.error('[CATEGORIES_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
}
