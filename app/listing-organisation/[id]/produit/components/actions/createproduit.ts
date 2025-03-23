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
    // Start a transaction to create both the category and the product atomically
    const result = await prisma.$transaction(async (prisma) => {
      const categoryIds: string[] = [];

      // Create or fetch categories and collect their IDs
      for (const categoryName of categories) {
        let category = await prisma.category.findFirst({
          where: { name: categoryName, organisationId }, // Ensure it's from the correct organisation
        });

        if (!category) {
          // Create new category if it doesn't exist
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
          price: parseFloat(price.replace('FCFA', '').trim()), // Remove 'FCFA' and convert to number
          images,
          organisationId,
          categories: {
            connect: categoryIds.map(id => ({ id })), // Associate product with categories
          },
        },
      });

      // Return the newly created product
      return newProduct;
    });

    // Path to revalidate
    const pathToRevalidate = `/listing-organisation/${organisationId}/produit`;

    // Trigger revalidation in the background (don't wait for it to complete)
    fetch(`api/api/revalidatePath?path=${pathToRevalidate}`, {
      method: 'GET',
    }).catch((revalidateError) => {
      console.error("Erreur lors de la révalidation du cache : ", revalidateError);
    });

    // Return the result from the transaction (which includes the new product)
    return NextResponse.json({ message: "Produit créé avec succès", product: result });
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Erreur lors de la création du produit");
  }
}
