import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: Request) {
  try {
    // Récupérer la session de l'utilisateur
    const session = await auth(); 

    if (!session?.user) {
      return NextResponse.redirect("/connexion");
    }

    const ownerId = session.user.id;

    console.log("Requête reçue pour créer une organisation.");

    const body = await request.json();
    const { name, slug, logo } = body;

    // Validation des données
    if (!name || !slug || !ownerId) {
      return NextResponse.json(
        { error: "Le nom, le slug et l'ID du propriétaire sont requis." },
        { status: 400 }
      );
    }

    const ownerExists = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!ownerExists) {
      return NextResponse.json(
        { error: "L'utilisateur propriétaire spécifié n'existe pas." },
        { status: 404 }
      );
    }

    const existingSlug = await prisma.organisation.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "Le slug spécifié existe déjà." },
        { status: 400 }
      );
    }

    const organisation = await prisma.organisation.create({
      data: { name, slug, logo, ownerId },
    });

    return NextResponse.json(
      { message: "Organisation créée avec succès", organisation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur serveur lors de la création de l'organisation:", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la création de l'organisation." },
      { status: 500 }
    );
  }
}
