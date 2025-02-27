
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get('search') || ''; // Le terme de recherche
  const page = parseInt(url.searchParams.get('page') || '1', 10); // Page courante (par défaut 1)
  const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Nombre d'éléments par page (par défaut 10)

  try {
    const session = await auth(); // Logique d'authentification
    if (!session || !session.user.id) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 });
    }

    const userId = session.user.id;

    // Compter le nombre total d'organisations
    const totalCount = await prisma.organisation.count({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { id: userId } } },
        ],
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    // Récupérer les organisations avec pagination, et inclure le logo et les membres
    const organisations = await prisma.organisation.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { id: userId } } },
        ],
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        members: {
          select: {
            id: true,
            name: true,
            role: true, // Sélectionner uniquement les champs nécessaires
          },
        },
      },
    });

    return new Response(
      JSON.stringify({
        organisations: organisations.map(org => ({
          ...org,
          logo: org.logo || '/images/default-logo.png', // Assurez-vous d'utiliser un logo par défaut si aucun logo n'est défini
        })),
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des organisations:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne' }), { status: 500 });
  }
}
