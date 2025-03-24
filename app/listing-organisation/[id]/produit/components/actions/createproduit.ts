"use server"
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache"; // Importing the revalidatePath function

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
    // Path to revalidate after product creation
    const pathToRevalidate = `/listing-organisation/${organisationId}/produit`;

    // Start a transaction to create product and categories
    const result = await prisma.$transaction(async (prisma) => {
      const categoryIds: string[] = [];

      // Loop through categories, creating or fetching each one
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

        categoryIds.push(category.id); // Collect category IDs
      }

      // Create the product, including the categories relation
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price.replace('FCFA', '').trim()), // Clean price input
          images,
          organisationId,
          categories: {
            connect: categoryIds.map(id => ({ id })),
          },
        },
        include: {
          categories: true, // Include categories in the result (if needed)
        },
      });

      // Return a plain object with just necessary fields (excluding Prisma instance)
      return {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        images: newProduct.images,
        categories: newProduct.categories.map((category) => category.name), // Simplify categories
      };
    });

    // Revalidate the cache for the given path
    revalidatePath(pathToRevalidate); // Trigger cache invalidation

    // Return the product creation success response
    return NextResponse.json({ message: "Produit créé avec succès", product: result });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 });
  }
}
