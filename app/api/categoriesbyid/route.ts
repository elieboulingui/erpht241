import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assure-toi d'importer ton instance Prisma

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationId = searchParams.get("organisationId");

  if (!organisationId) {
    return NextResponse.json({ error: "organisationId is required" }, { status: 400 });
  }

  try {
    const categories = await prisma.category.findMany({
      where: { organisationId },
      include: {
        Product: true, // Inclure les produits liés
        Brand: true, // Inclure les marques liées
        children: true, // Inclure les sous-catégories
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
