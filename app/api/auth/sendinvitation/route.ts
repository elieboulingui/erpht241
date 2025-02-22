import { auth } from '@/auth'; // Assurez-vous que la fonction auth() récupère l'utilisateur connecté
import { generateRandomToken } from '@/lib/generateRandomToken'; // Importer la fonction pour générer un token unique
import { NextResponse } from 'next/server';
import sendMail from '@/lib/sendmail'; // Importer la fonction sendMail
import prisma from '@/lib/prisma'; // Prisma pour accéder à la base de données
import bcrypt from 'bcryptjs'; // Pour le hachage du mot de passe

const DEFAULT_PASSWORD = 'password123'; // Mot de passe par défaut

export async function POST(req: Request) {
  try {
    // 1. Récupérer l'utilisateur authentifié
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
    }
    const userId = session.user.id;

    // 2. Vérifier si l'utilisateur appartient déjà à une organisation
    const userWithOrganisations = await prisma.user.findUnique({
      where: { id: userId },
      include: { organisations: true },
    });

    const organisation = await prisma.organisation.findFirst({ take: 1 });
    if (!organisation) {
      return NextResponse.json({ error: 'Aucune organisation trouvée dans le système' }, { status: 400 });
    }

    const organisationId = organisation.id;

    // 3. Récupérer les invitations de la requête
    let invitations = [];
    try {
      const body = await req.json();
      invitations = body.invitations || [];
    } catch (error) {
      return NextResponse.json({ error: 'Le corps de la requête est invalide ou mal formé.' }, { status: 400 });
    }

    if (invitations.length === 0) {
      return NextResponse.json({ error: 'Aucune invitation fournie' }, { status: 400 });
    }

    // 4. Vérifier les invitations déjà envoyées
    const existingInvitations = await prisma.invitation.findMany({
      where: {
        email: { in: invitations.map((invitation: any) => invitation.email) },
        organisationId,
      },
    });

    const existingEmails = existingInvitations.map((invitation) => invitation.email);

    // 5. Filtrer les nouvelles invitations non envoyées
    const newInvitations = invitations.filter(
      (invitation: any) => !existingEmails.includes(invitation.email)
    );

    if (newInvitations.length === 0) {
      return NextResponse.json({ error: 'Tous les utilisateurs ont déjà été invités' }, { status: 400 });
    }

    // 6. Traitement des nouvelles invitations, génération du token et envoi d'email
    for (const invitationData of newInvitations) {
      const { email, role } = invitationData;

      if (!['MEMBRE', 'ADMIN'].includes(role.toUpperCase())) {
        return NextResponse.json({ error: `Rôle ${role} non valide` }, { status: 400 });
      }

      // 7. Générer un token unique pour l'invitation
      const inviteToken = generateRandomToken();

      // 8. Créer un token de vérification dans la base de données
      await prisma.verificationToken.create({
        data: {
          identifier: email,       
          token: inviteToken,      
          expires: new Date(Date.now() + 3600000), // Expiration dans 1 heure
        },
      });

      // 9. Créer l'invitation dans la base de données
    // 12. Créer l'invitation dans la base de données avec le token et la date d'expiration
const invitation = await prisma.invitation.create({
  data: {
    email,
    role,
    organisationId,
    invitedById: userId, // Associe l'utilisateur qui envoie l'invitation
    token: inviteToken,  // Ajoutez le token généré ici
    tokenExpiresAt: new Date(Date.now() + 3600000),  // Date d'expiration du token (1 heure)
  },
});


      // 10. Vérifier si l'utilisateur existe déjà dans la base de données
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        // L'utilisateur existe déjà, associer à l'organisation
        await prisma.organisation.update({
          where: { id: organisationId },
          data: {
            members: {
              connect: { id: user.id },
            },
          },
        });

        // Contenu de l'email pour un utilisateur existant
        const emailTemplate = `
          <html>
          <body>
            <p>Bonjour ${email},</p>
            <p>Vous êtes invité à rejoindre l'organisation HT241 en tant que ${role}.</p>
            <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/accept-invitation/${inviteToken}">Accepter l'invitation</a>
            <p> votre mots de passe par default est ${DEFAULT_PASSWORD}</p>
          </body>
          </html>
        `;

        // Envoyer l'email d'invitation
        await sendMail({
          to: email,
          name: 'HT241 Team',  // Ajouter le champ 'name'
          subject: 'Invitation à rejoindre l\'organisation HT241',
          body: emailTemplate,
        });
        
      } else {
        // L'utilisateur n'existe pas, créer un nouvel utilisateur
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role: role.toUpperCase(),
            name: email.split('@')[0],
          },
        });

        // Associer à l'organisation
        await prisma.organisation.update({
          where: { id: organisationId },
          data: {
            members: {
              connect: { id: user.id },
            },
          },
        });

        // Contenu de l'email pour un nouvel utilisateur
        const emailTemplate = `
          <html>
          <body>
            <p>Bonjour ${email},</p>
            <p>Vous êtes invité à rejoindre l'organisation HT241 en tant que ${role}.</p>
            <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/accept-invitation/${inviteToken}">Accepter l'invitation</a>
          </body>
          </html>
        `;

        // Envoyer l'email d'invitation
        await sendMail({
          to: email,
          name: 'HT241 Team',  // Ajouter le champ 'name'
          subject: 'Invitation à rejoindre l\'organisation HT241',
          body: emailTemplate,
        });
        
      }
    }

    return NextResponse.json({
      message: `Invitation${newInvitations.length > 1 ? 's' : ''} envoyée${newInvitations.length > 1 ? 's' : ''} avec succès.`,
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur générée:', error);
    return NextResponse.json({ error: 'Une erreur s\'est produite lors de l\'envoi des invitations.' }, { status: 500 });
  }
}
