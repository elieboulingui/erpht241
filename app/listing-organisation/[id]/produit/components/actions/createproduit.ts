"use server"
import prisma from "@/lib/prisma"; // Import Prisma client

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
    let categoryId: string | null = null; // Explicitly define categoryId type

    // Start a transaction to create both the category and the product atomically
    const result = await prisma.$transaction(async (prisma) => {
      // Check if categories are provided
      if (categories.length > 0) {
        const categoryName = categories[0]; // Assuming the first category is the AI-generated category

        // Use findFirst instead of findUnique for non-unique fields
        const category = await prisma.category.findFirst({
          where: { name: categoryName }, // Find the category by its name
        });

        // If the category does not exist, create it and associate with organisationId
        if (!category) {
          const newCategory = await prisma.category.create({
            data: {
              name: categoryName, // Create the category with the AI-generated name
              organisation: { connect: { id: organisationId } }, // Associate with organisation
            },
          });
          categoryId = newCategory.id; // Save the new category ID
        } else {
          categoryId = category.id; // Use the existing category ID
        }
      }

      // Create the product
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price.replace('FCFA', '').trim()), // Remove 'FCFA' and convert to number
          images,
          categoryId: categoryId || null, // Associate the product with the category
          organisationId,
        },
      });

      // Return the newly created product and its associated category
      return newProduct;
    });

    // Return the result from the transaction (which includes the new product)
    return result;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Erreur lors de la création du produit");
  }
}
