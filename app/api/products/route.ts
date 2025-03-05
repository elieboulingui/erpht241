import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation des champs obligatoires
    const requiredFields = ['name', 'description', 'price', 'organisationId', 'images'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Champs manquants: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Vérification du format numérique du prix
    if (isNaN(Number(body.price)) || Number(body.price) <= 0) {
      return NextResponse.json(
        { error: "Le prix doit être un nombre valide supérieur à 0" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.$transaction(async (tx) => {
      let categoryId = body.categoryId;

      // Gestion de la catégorie
      if (body.categoryName) {
        const category = await tx.category.upsert({
          where: { 
            category_organisation_unique: {
              name: body.categoryName,
              organisationId: body.organisationId
            }
          },
          update: {},
          create: {
            name: body.categoryName,
            organisationId: body.organisationId
          }
        });
        categoryId = category.id;
      }

      // Création du produit
      return tx.product.create({
        data: {
          name: body.name,
          description: body.description,
          price: Number(body.price),
          images: body.images,
          organisationId: body.organisationId,
          categoryId: categoryId || null
        },
        include: {
          category: true
        }
      });
    });

    return NextResponse.json({
      ...newProduct,
      category: newProduct.category?.name || null
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur:', error);

    // Gestion spécifique des erreurs Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      let errorMessage = "Erreur de base de données";
      
      if (error.code === 'P2002') {
        errorMessage = "Violation de contrainte unique (donnée déjà existante)";
      } else if (error.code === 'P2003') {
        errorMessage = "Référence étrangère invalide";
      }

      return NextResponse.json(
        { error: `${errorMessage}: ${error.message}` },
        { status: 500 }
      );
    }

    // Gestion des autres types d'erreurs
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Erreur serveur: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur inconnue" },
      { status: 500 }
    );
  }
}