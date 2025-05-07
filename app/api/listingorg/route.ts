import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get('search') || '';
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  try {
    const session = await auth();

    if (!session || !session.user.id || !session.user.email) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Récupérer les invitations non archivées où l'utilisateur est invité
    const invitations = await prisma.invitation.findMany({
      where: {
        email: userEmail,
        isArchived: false,
        organisation: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
      select: {
        organisationId: true,
      },
    });

    const invitedOrganisationIds = invitations.map((inv) => inv.organisationId);

    // Compter le nombre d'organisations
    const totalOwnerCount = await prisma.organisation.count({
      where: {
        ownerId: userId,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    const totalMemberCount = await prisma.organisation.count({
      where: {
        members: { some: { id: userId } },
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    const totalInvitedCount = await prisma.organisation.count({
      where: {
        id: { in: invitedOrganisationIds },
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    const totalCount = totalOwnerCount + totalMemberCount + totalInvitedCount;

    const organisations = await prisma.organisation.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { id: userId } } },
          { id: { in: invitedOrganisationIds } },
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
            role: true,
          },
        },
      },
    });

    return new Response(
      JSON.stringify({
        organisations: organisations.map((org) => ({
          ...org,
          logo: org.logo || '/images/default-logo.png',
        })),
        totalCount,
        totalOwnerCount,
        totalMemberCount,
        totalInvitedCount,
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
