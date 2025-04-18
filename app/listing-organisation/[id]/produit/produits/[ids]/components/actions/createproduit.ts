"use server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache"; // Importing the revalidatePath function

export async function  createProduct({
  name,
  description,
  price,
  categories,
  images,
  organisationId,
  brandName, // Ajout du champ brandName pour la marque
}: {
  name: string;
  description: string;
  price: string;
  categories: string[];
  images: string[];
  organisationId: string;
  brandName: string; // Champ pour le nom de la marque
}) {
  try {
    // Path to revalidate after product creation
    const pathToRevalidate = `/listing-organisation/${organisationId}/produit`;

    // Start a transaction to create product, categories, and brand
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

      // Vérifier si la marque existe déjà dans l'organisation
      let brand = await prisma.brand.findFirst({
        where: { name: brandName, organisationId },
      });

      // Si la marque n'existe pas, la créer
      if (!brand) {
        brand = await prisma.brand.create({
          data: {
            name: brandName,
            organisationId,
          },
        });
      }

      // Create the product, including the categories and brand relation
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price.replace('FCFA', '').trim()), // Clean price input
          images,
          organisationId,
          brandId: brand.id, // Associer la marque au produit
          categories: {
            connect: categoryIds.map(id => ({ id })), // Connecter les catégories au produit
          },
        },
        include: {
          categories: true, // Inclure les catégories dans le résultat
        },
      });

      // Return a plain object with just necessary fields (excluding Prisma instance)
      return {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        images: newProduct.images,
        brand: brand.name, // Inclure le nom de la marque
        categories: newProduct.categories.map((category) => category.name), // Simplifier les catégories
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
