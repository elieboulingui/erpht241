import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assure-toi que prisma est correctement importé
import { z } from 'zod';

// Schéma de validation des données d'organisation
const organisationSchema = z.object({
  name: z.string().min(1, "Le nom de l'organisation est requis"),
  slug: z.string().min(1, "Le slug est requis").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide"),
  logo: z.string().url().optional(), // Logo URL (optionnel)
  ownerId: z.string().min(1, "L'ID du propriétaire est requis"),
});

// Handler POST pour la création de l'organisation
export async function POST(request: Request) {
  try {
    // Lecture et validation des données envoyées dans le corps de la requête
    const body = await request.json();
    const parsedBody = organisationSchema.parse(body);

    const { name, slug, logo, ownerId } = parsedBody;

    // Log de débogage
    console.log("Parsed body:", parsedBody);

    // Vérification si l'utilisateur propriétaire existe
    const ownerExists = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!ownerExists) {
      return NextResponse.json(
        { error: "L'utilisateur propriétaire spécifié n'existe pas." },
        { status: 404 }
      );
    }

    // Création de l'organisation
    const organisation = await prisma.organisation.create({
      data: {
        name,
        slug,
        logo,
        ownerId,
      },
    });

    // Réponse à l'utilisateur
    return NextResponse.json(
      { message: "Organisation créée avec succès", organisation },
      { status: 201 }
    );
  } catch (error) {
    // Gestion des erreurs de validation
    if (error instanceof z.ZodError) {
      console.log("Zod Validation Errors:", error.errors); // Log détaillé des erreurs de validation
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // Gestion des erreurs génériques
    console.error("Erreur dans le serveur:", error); // Log de l'erreur pour le débogage
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la création de l'organisation." },
      { status: 500 }
    );
  }
}
