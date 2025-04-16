import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user.id) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const organisationId = searchParams.get('id');

    if (!organisationId) {
      return new Response(JSON.stringify({ error: 'ID de l organisation manquant' }), { status: 400 });
    }

    // Récupérer les membres de l'organisation spécifiée
    const organisation = await prisma.organisation.findUnique({
      where: {
        id: organisationId,
      },
      select: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!organisation) {
      return new Response(JSON.stringify({ error: 'Organisation introuvable' }), { status: 404 });
    }
  console.log(organisation)
    return new Response(JSON.stringify(organisation.members), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne' }), { status: 500 });
  }
}
