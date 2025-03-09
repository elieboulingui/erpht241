import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const organisationId = req.nextUrl.searchParams.get('organisationId');
  const categoryId = req.nextUrl.searchParams.get('categoryName'); // Utilisation du categoryId ici

  if (!organisationId || !categoryId) {
    return new NextResponse("Organisation ID et catégorie requis", { status: 400 });
  }

  try {
    console.log('Organisation ID:', organisationId);
    console.log('Category ID:', categoryId);

    // Recherche la catégorie par son ID
    const selectedCategory = await prisma.category.findUnique({
      where: { id: categoryId }, // Utilisation de l'ID pour chercher la catégorie
      select: {
        id: true,
        name: true,
        parentId: true,
        children: {
          select: { id: true }
        }
      }
    });

    if (!selectedCategory) {
      return new NextResponse("Catégorie non trouvée", { status: 404 });
    }

    // Récupérer les produits associés à la catégorie par son ID
    const products = await prisma.product.findMany({
      where: {
        organisationId,
        categories: {
          some: {
            id: categoryId, // Filtrer par ID de catégorie
            isArchived: false
          }
        }
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
            parentId: true
          }
        }
      }
    });

    return NextResponse.json(products); // Retourner les produits associés à la catégorie spécifique
  } catch (error) {
    console.error('[SELECTCATEGORY_GET]', error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
