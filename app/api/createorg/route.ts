// app/api/createorganisation/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assure-toi que prisma est correctement importé

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, logo, ownerId } = body;

    if (!name || !slug || !ownerId) {
      return NextResponse.json(
        { error: "Le nom, le slug et l'ID du propriétaire sont requis." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        { error: "Slug invalide. Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets." },
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
    console.error("Erreur lors de la création de l'organisation:", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la création de l'organisation." },
      { status: 500 }
    );
  }
}
