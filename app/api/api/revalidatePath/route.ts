"use server"
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function createProduct({
  name,
  description,
  price,
  categories,
  images,
  organisationId,
}: {
  name: string;
  description: string;
  price: string;
  categories: string[];
  images: string[];
  organisationId: string;
}) {
  try {
    // Path to revalidate
    const pathToRevalidate = `/listing-organisation/${organisationId}/produit`;

    // Ensure this URL is valid and properly formatted
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; 
    const revalidateUrl = `${baseUrl}/api/revalidatePath?path=${encodeURIComponent(pathToRevalidate)}`;

    // Asynchronously trigger the revalidation without blocking product creation
    setTimeout(() => {
      fetch(revalidateUrl, {
        method: 'GET',
      }).catch((error) => {
        console.error("Erreur lors de la révalidation du cache : ", error);
      });
    }, 0);

    // Start a transaction to create both the category and the product atomically
    const result = await prisma.$transaction(async (prisma) => {
      const categoryIds: string[] = [];

      // Create or fetch categories and collect their IDs
      for (const categoryName of categories) {
        let category = await prisma.category.findFirst({
          where: { name: categoryName, organisationId },
        });

        if (!category) {
          category = await prisma.category.create({
            data: {
              name: categoryName,
              organisation: { connect: { id: organisationId } },
            },
          });
        }

        categoryIds.push(category.id); // Store the category ID
      }

      // Create the product and associate it with the categories
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price.replace('FCFA', '').trim()),
          images,
          organisationId,
          categories: {
            connect: categoryIds.map(id => ({ id })),
          },
        },
      });

      return newProduct;
    });

    return NextResponse.json({ message: "Produit créé avec succès", product: result });
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Erreur lors de la création du produit");
  }
}
