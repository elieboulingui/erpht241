// app/api/product-details/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
// Assurez-vous d'importer le client Prisma
import  Product  from '@prisma/client';

export async function GET(request: Request) {
  // Extraire l'ID du produit à partir des paramètres de la requête
  const url = new URL(request.url);
  const productId = url.searchParams.get('id');
  
  if (!productId) {
    return NextResponse.json({ error: 'ID du produit requis' }, { status: 400 });
  }

  try {
    // Rechercher le produit par son ID dans la base de données
    const product  = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        organisation: true, // Inclure les détails de l'organisation associée si nécessaire
        categories: true,  // Inclure les catégories associées
      },
    });

    // Si le produit n'existe pas
    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    // Retourner les détails du produit
    return NextResponse.json(product);
  } catch (error) {
    // Gestion des erreurs
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
