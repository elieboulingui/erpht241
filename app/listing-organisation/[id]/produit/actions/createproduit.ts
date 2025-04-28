"use server"
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { uploadImageToUploadthing } from "@/utils/uploadthings";

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
  images: string[]; // Les images sont envoyées sous forme d'URLs ou de chemins de fichiers
  organisationId: string;
  brandName: string;
}) {
  try {
    const pathToRevalidate = `/listing-organisation/${organisationId}/produit`;

    const result = await prisma.$transaction(async (prisma) => {
      const categoryIds: string[] = [];

      // Création des catégories
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

      // Création de la marque
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

      // Télécharger les images vers Uploadthing et obtenir les URLs
      const uploadedImages = await Promise.all(
        images.map(async (imagePath) => {
          const uploadedImage = await uploadImageToUploadthing(imagePath);
          return uploadedImage.url; // Supposons que `uploadImageToUploadthing` retourne une URL
        })
      );

      // Créer un nouveau produit avec les URLs des images
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price.replace("FCFA", "").trim()),
          images: uploadedImages, // Assurez-vous que la base de données accepte un tableau d'URLs
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
    console.log(response);  // Vérifiez la réponse d'Inngest

    // ✅ Révalidation de la page
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
