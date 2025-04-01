import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const organisationId = url.searchParams.get('organisationId');
  
  if (!organisationId) {
    return NextResponse.json({ error: "L'ID de l'organisation est requis." }, { status: 400 });
  }

  try {
    // Récupérer les produits en incluant les images et les catégories
    const products = await prisma.product.findMany({
      where: { organisationId, isArchived: false },
      include: {
        categories: true,  // Inclure les catégories ici
      },
    });

    console.log("Produits récupérés:", products);  // Assurez-vous que vous voyez les produits dans la console

    return NextResponse.json(products);  // Retourner les produits en format JSON
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
