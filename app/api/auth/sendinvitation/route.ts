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

      // 11. Si l'utilisateur n'existe pas, le créer
      if (!user) {
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);  // Hachage du mot de passe par défaut

        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword, // Utilisation du mot de passe haché par défaut
            role: role.toUpperCase(),  // Rôle passé dans l'invitation
            name: '',  // Vous pouvez ajouter des informations supplémentaires ici
            organisations: {
              connect: { id: organisationId },  // Lier l'utilisateur à l'organisation
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      // Préparer l'email HTML avec la nouvelle structure
      let emailTemplate = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vérification de l'email</title>
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center;">
          <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 600px; width: 100%;">
              <h1 style="text-align: center; font-size: 24px; margin-bottom: 24px; font-weight: normal;">Vérification de l'email</h1>
              <p style="margin-bottom: 16px;">Bonjour ${email},</p>
              <p style="margin-bottom: 32px; line-height: 1.5;">Pour finaliser votre inscription, vous devez vérifier votre adresse e-mail.</p>
              <a href="https://erpht241.vercel.app/accept-invitation/${inviteToken}" style="display: block; width: fit-content; margin: 0 auto 32px; padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">Vérifier l'email</a>
              <p style="margin-bottom: 16px; color: #333;">Ou copiez et collez cette URL dans votre navigateur :</p>
              <a href="https://erpht241.vercel.app/accept-invitation/${inviteToken}" style="color: #0066cc; word-break: break-all; text-decoration: none; margin-bottom: 32px; display: block;">https://erpht241.vercel.app/accept-invitation/${inviteToken}</a>
              <!-- Utilisateur déjà existant, afficher le mot de passe par défaut -->
              <div style="margin-bottom: 32px;">
                <p style="margin-bottom: 8px;">Votre mot de passe par défaut est :</p>
                <p style="font-family: monospace; font-size: 18px; margin: 0; color: #333;">${DEFAULT_PASSWORD}</p>
              </div>
              <p style="color: #666; font-size: 14px; line-height: 1.5; border-top: 1px solid #eee; padding-top: 24px; margin: 0;">Si vous ne souhaitez pas vérifier votre email ou si vous n'avez pas demandé ceci, ignorez et supprimez ce message. Veuillez ne pas transférer cet email à quelqu'un d'autre.</p>
          </div>
      </body>
      </html>
      `;

      // Envoyer l'email d'invitation avec la structure HTML
      await sendMail({
        to: email,
        name: 'HT241 Team',
        subject: 'Vérification de l\'email',
        body: emailTemplate,
      });
    }

    return NextResponse.json({
      message: `Invitation${newInvitations.length > 1 ? 's' : ''} envoyée${newInvitations.length > 1 ? 's' : ''} avec succès.`,
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur générée:', error);
    return NextResponse.json({ error: 'Une erreur s\'est produite lors de l\'envoi des invitations.' }, { status: 500 });
  }
}
