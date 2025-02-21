import prisma from '@/lib/prisma'; // Assurez-vous que vous avez une instance Prisma correctement configurée
import { auth } from '@/auth'; // Assurez-vous d'importer votre gestion d'authentification

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get('search') || ''; // Le terme de recherche
  const page = parseInt(url.searchParams.get('page') || '1', 10); // Page courante (par défaut 1)
  const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Nombre d'éléments par page (par défaut 10)

  try {
    // Récupérer la session de l'utilisateur authentifié
    const session = await auth(); // Vous devrez implémenter votre propre logique d'authentification
    if (!session || !session.user.id) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 });
    }

    const userId = session.user.id; // ID de l'utilisateur authentifié

    // Compter le nombre total d'organisations associées à cet utilisateur
    const totalCount = await prisma.organisation.count({
      where: {
        OR: [
          { ownerId: userId }, // L'utilisateur est le propriétaire de l'organisation
          { members: { some: { id: userId } } }, // L'utilisateur est membre de l'organisation
        ],
        name: {
          contains: search,
          mode: 'insensitive', // Recherche insensible à la casse
        },
      },
    });

    // Récupérer les organisations avec pagination
    const organisations = await prisma.organisation.findMany({
      where: {
        OR: [
          { ownerId: userId }, // L'utilisateur est le propriétaire de l'organisation
          { members: { some: { id: userId } } }, // L'utilisateur est membre de l'organisation
        ],
        name: {
          contains: search,
          mode: 'insensitive', // Recherche insensible à la casse
        },
      },
      skip: (page - 1) * limit, // Calcul du décalage pour la pagination
      take: limit, // Limiter le nombre d'éléments récupérés
      include: {
        members: true, // Inclure les membres de l'organisation
      },
    });

    return new Response(
      JSON.stringify({
        organisations,
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit), // Nombre total de pages pour la pagination
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des organisations:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne' }), { status: 500 });
  }
}
