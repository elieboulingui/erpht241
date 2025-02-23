import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth'; // Ta fonction d'authentification
import { NextResponse } from 'next/server'; // Utilisation de NextResponse

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Récupérer la session de l'utilisateur connecté
    const session = await auth(); // Assurez-vous que "auth()" fonctionne ici côté serveur
    console.log("Session récupérée:", session);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Utilisateur non connecté' }, { status: 401 });
    }

    const userEmail = 'classertiftestclassertiftest@gmail.com'; // Email que tu recherches
    console.log("Email de l'utilisateur:", userEmail);

    // Récupérer l'utilisateur par son email et ses organisations
    const userWithOrganisations = await prisma.user.findUnique({
      where: { email: userEmail }, // Chercher l'utilisateur par email
      include: {
        organisations: {
          where: {
            members: {
              some: {
                email: userEmail, // Vérifier que l'utilisateur est membre de l'organisation par son email
              },
            },
          },
        },
      },
    });

    if (!userWithOrganisations || !userWithOrganisations.organisations) {
      return NextResponse.json({ error: 'Aucune organisation trouvée ou utilisateur non membre d\'une organisation' }, { status: 404 });
    }

    console.log("Organisations récupérées:", userWithOrganisations.organisations);

    // Retourner les organisations en réponse
    return NextResponse.json(userWithOrganisations.organisations, { status: 200 });
  } catch (error) {
    console.error('Erreur dans la récupération des organisations:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des organisations' }, { status: 500 });
  }
}
