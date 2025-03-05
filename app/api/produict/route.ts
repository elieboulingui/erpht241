// app/api/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const organisationId = url.searchParams.get('organisationId');
  
  if (!organisationId) {
    return NextResponse.json({ error: "L'ID de l'organisation est requis." }, { status: 400 });
  }

  try {
    const products = await prisma.product.findMany({
      where: { organisationId },
      include: { category: true },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
