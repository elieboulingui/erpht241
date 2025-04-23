"use server";

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
  brandName,
}: {
  name: string;
  description: string;
  price: string;
  categories: string[];
  images: string[];
  organisationId: string;
  brandName: string;
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

      let brand = await prisma.brand.findFirst({
        where: { name: brandName, organisationId },
      });

      if (!brand) {
        brand = await prisma.brand.create({
          data: {
            name: brandName,
            organisationId,
          },
        });
      }

      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price.replace("FCFA", "").trim()),
          images,
          organisationId,
          brandId: brand.id,
          categories: {
            connect: categoryIds.map((id) => ({ id })),
          },
        },
        include: {
          categories: true,
        },
      });

      return {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        images: newProduct.images,
        brand: brand.name,
        brandId: brand.id,
        categoryIds,
        categories: newProduct.categories.map((category) => category.name),
      };
    });

    // ✅ Envoie l’événement Inngest
    await inngest.send({
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

    // ✅ Révalidation de la page
    revalidatePath(pathToRevalidate);

    return NextResponse.json({
      message: "Produit créé avec succès",
      product: result,
    });
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du produit" },
      { status: 500 }
    );
  }
}
