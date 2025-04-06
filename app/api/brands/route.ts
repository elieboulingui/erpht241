import { NextResponse } from 'next/server'; // Import NextResponse from next/server
 // Assure-toi d'avoir initialisé Prisma dans lib/prisma.ts
 import prisma from "@/lib/prisma"
export async function GET(req: Request) {
  try {
    // Récupère les produits associés à l'organisation
    const products = await prisma.brand.findMany({
     select:{
        name:true
     }
    });

    // Réponse avec les produits récupérés
    console.log(products);
    return NextResponse.json(products); // Correct method to return a JSON response in Next.js 13+
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
