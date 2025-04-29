"use server"
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { inngest } from "@/inngest/client";

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
    const pathToRevalidate = `/listing-organisation/${organisationId}/produit`;

    const result = await prisma.$transaction(async (prisma) => {
      const categoryIds: string[] = [];

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

        categoryIds.push(category.id);
      }

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
        include: {
          categories: true,
          brand: true, // Inclure la marque si elle est utilisée
        },
      });

      return {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        images: newProduct.images,
        brandId: newProduct.brandId ?? null,
        brand: newProduct.brand ?? null,
        categoryIds,
        categories: newProduct.categories.map((category) => category.name),
      };
    });

    // Revalidate cache
    revalidatePath(pathToRevalidate);

    // Send event to Inngest
    const response = await inngest.send({
      name: "product/created",
      data: {
        organisationId,
        productId: result.id,
        name: result.name,
        description: result.description,
        price: result.price,
        brandId: result.brandId,
        brand: result.brand,
        images: result.images,
        categoryIds: result.categoryIds,
      },
    });

    console.log(response); // Optionnel : pour debug

    return NextResponse.json({ message: "Produit créé avec succès", product: result });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 });
  }
}
