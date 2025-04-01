import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: "L'ID de l'organisation est requis." }, { status: 400 });
  }

  try {
    // Récupérer les produits en incluant les images et les catégories
    const Contact = await prisma.contact.findMany({
      where: { id, isArchived: false },
  
    });

    console.log("Produits récupérés:", Contact);  // Assurez-vous que vous voyez les produits dans la console

    return NextResponse.json(Contact);  // Retourner les produits en format JSON
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
