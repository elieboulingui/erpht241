import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assure-toi d'importer ton instance Prisma

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log("Request URL:", request.url);

  const categoryId = searchParams.get("categorieId"); // ✅ Récupère bien `categorieId`
  if (!categoryId) {
    console.log("Error: categoryId is missing");
    return NextResponse.json({ error: "categoryId is required" }, { status: 400 });
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId }, // ✅ Cherche par `id`
      include: {
        Product: true,
        Brand: true,
        children: true,
      },
    });

    if (!category) {
      console.log("No category found");
      return NextResponse.json([]); // ✅ Retourne un tableau vide au lieu d'un objet
    }

    console.log("Fetched category:", category);
    return NextResponse.json([category]); // ✅ Envoie un tableau avec l'objet
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
