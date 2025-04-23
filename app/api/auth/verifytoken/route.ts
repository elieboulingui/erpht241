import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { inngest } from '@/inngest/client';

export async function POST(req: NextRequest) {
  const { identifier, token } = await req.json();

  if (!identifier || !token) {
    console.error("Données manquantes dans la requête:", { identifier, token });
    return NextResponse.json({ error: "Les données du token sont manquantes." }, { status: 400 });
  }

  try {
    // Vérifie si le token existe et est valide
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier,
          token,
        },
      },
    });

    if (!verificationToken) {
      console.error("Token non trouvé pour identifier:", identifier);
      return NextResponse.json({ error: "Token non trouvé." }, { status: 400 });
    }

    // Met à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: {
        email: verificationToken.identifier,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    // Archive le token
    await prisma.verificationToken.update({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        },
      },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    // 🔁 Envoie de l'événement à Inngest pour logger l'activité
    await inngest.send({
      name: 'user/email-verified',
      data: {
        userId: updatedUser.id,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
      },
    });

    return NextResponse.json({ message: "Token validé et archivé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
