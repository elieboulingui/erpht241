"use server"
import { auth } from "@/auth"; // Si tu utilises next-auth
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
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
    const pathToRevalidate = `/listing-organisation/${organisationId}/produit`;

    // Récupérer la session utilisateur pour obtenir l'ID
    const session = await auth(); // Cela dépend de ta configuration, utilise getServerSession si tu utilises next-auth
    if (!session || !session.user || !session.user.id) {
      throw new Error("Utilisateur non authentifié");
    }

    const userId = session.user.id; // Extraire l'ID de l'utilisateur de la session

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
          price: parseFloat(price.replace("FCFA", "").trim()),
          images,
          organisationId,
          categories: {
            connect: categoryIds.map((id) => ({ id })),
          },
        },
        include: {
          categories: true,
        },
      });

      // Ajout d'un enregistrement dans le journal d'activité
      await prisma.activityLog.create({
        data: {
          action: "CREATE_PRODUCT",
          entityType: "Product",
          entityId: newProduct.id,
          newData: JSON.stringify(newProduct),
          userId,
          createdByUserId: userId,
          organisationId,
          productId: newProduct.id,
        },
      });

      return {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        images: newProduct.images,
        categories: newProduct.categories.map((category) => category.name),
      };
    });

    revalidatePath(pathToRevalidate);

    return NextResponse.json({
      message: "Produit créé avec succès",
      product: result,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du produit" },
      { status: 500 }
    );
  }
}
