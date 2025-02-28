import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Données reçues:", body);

    const { name, description, category, price, images, organisationId } = body;

    // Vérification des champs requis
    if (!name || !description || !category || !price || !images || !organisationId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Vérification que prisma.product est défini
    if (!prisma.product) {
      console.error("Prisma 'product' est undefined");
      return new Response(JSON.stringify({ error: "Produit non défini dans Prisma" }), { status: 500 });
    }

    console.log("Création du produit dans la base de données...");

    // Création du produit dans la base de données
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        category,
        price,
        images,
        organisationId,
      },
    });

    console.log("Produit créé:", newProduct);

    return new Response(JSON.stringify(newProduct), { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la création du produit' }), { status: 500 });
  }
}
