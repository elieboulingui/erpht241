// app/api/listing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
 // Assurez-vous que vous utilisez le bon import

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Récupérer l'utilisateur authentifié
    const session = await auth();

    // Vérifiez que la session est valide (non null)
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour accéder à cette ressource." },
        { status: 401 }
      );
    }

    const email = session.user.email;

    // Récupérer l'utilisateur à partir de la base de données avec l'email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organisations: {
          include: {
            members: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    // Si l'utilisateur n'est pas trouvé
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    // Vérification si l'utilisateur a le rôle ADMIN
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Vous n'avez pas les droits d'accès." },
        { status: 403 }
      );
    }

    // Retourner les organisations de l'utilisateur
    return NextResponse.json({ organizations: user.organisations });
  } catch (error) {
    console.error('Erreur lors de la récupération des organisations:', error);
    return NextResponse.json(
      { error: 'Erreur du serveur' },
      { status: 500 }
    );
  }
}
