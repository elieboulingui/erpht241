import prisma from '@/lib/prisma'; // Assurez-vous que vous avez une instance Prisma correctement configurée.

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get('search') || ''; // Le terme de recherche
  const page = parseInt(url.searchParams.get('page') || '1', 10); // Page courante (par défaut 1)
  const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Nombre d'éléments par page (par défaut 10)

  try {
    // Compter le nombre total d'organisations pour la pagination
    const totalCount = await prisma.organisation.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive', // Recherche insensible à la casse
        },
      },
    });

    // Récupérer les organisations avec pagination
    const organisations = await prisma.organisation.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip: (page - 1) * limit, // Calcul du décalage en fonction de la page et du nombre d'éléments par page
      take: limit, // Limiter le nombre d'éléments récupérés
    });

    return new Response(
      JSON.stringify({
        organisations,
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit), // Calcul du nombre total de pages
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des organisations:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne' }), { status: 500 });
  }
}
