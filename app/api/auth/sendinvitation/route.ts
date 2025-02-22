import { auth } from '@/auth'; // Assurez-vous que la fonction auth() récupère l'utilisateur connecté
import { generateRandomToken } from '@/lib/generateRandomToken'; // Génère un token unique
import { NextResponse } from 'next/server';
import sendMail from '@/lib/sendmail'; // Importer la fonction sendMail
import prisma from '@/lib/prisma'; // Prisma pour accéder à la base de données
import bcrypt from 'bcryptjs'; // Pour le hachage du mot de passe

// Mot de passe par défaut
const DEFAULT_PASSWORD = 'password123'; // A adapter pour un mot de passe par défaut sécurisé

export async function POST(req: Request) {
  try {
    console.log('Début du traitement des invitations');
    
    // 1. Récupérer l'utilisateur authentifié
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
    }
    
    const userId = session.user.id;
    console.log('Utilisateur authentifié :', userId);

    // 2. Vérifier si l'utilisateur appartient déjà à une organisation
    const userWithOrganisations = await prisma.user.findUnique({
      where: { id: userId },
      include: { organisations: true },
    });
    console.log('Organisations de l\'utilisateur:', userWithOrganisations?.organisations);

    // 3. Trouver une organisation existante pour l'invitation
    const organisation = await prisma.organisation.findFirst({ take: 1 });
    if (!organisation) {
      return NextResponse.json({ error: 'Aucune organisation trouvée dans le système' }, { status: 400 });
    }

    const organisationId = organisation.id;
    console.log('Organisation trouvée :', organisation.name);

    // 4. Récupérer le corps de la requête (les invitations)
    let invitations = [];
    try {
      const body = await req.json();
      invitations = body.invitations || [];
      console.log('Invitations reçues :', invitations);
    } catch (error) {
      console.error("Erreur lors du parsing du JSON:", error);
      return NextResponse.json({ error: 'Le corps de la requête est invalide ou mal formé.' }, { status: 400 });
    }

    // 5. Vérifier si des invitations ont été fournies
    if (invitations.length === 0) {
      return NextResponse.json({ error: 'Aucune invitation fournie' }, { status: 400 });
    }

    // 6. Vérifier les invitations déjà envoyées
    const existingInvitations = await prisma.invitation.findMany({
      where: {
        email: { in: invitations.map((invitation: any) => invitation.email) },
        organisationId,
      },
    });

    const existingEmails = existingInvitations.map((invitation) => invitation.email);
    console.log('Emails déjà invités :', existingEmails);

    // 7. Filtrer les nouveaux emails qui n'ont pas encore été invités
    const newInvitations = invitations.filter(
      (invitation: any) => !existingEmails.includes(invitation.email)
    );

    if (newInvitations.length === 0) {
      return NextResponse.json({ error: 'Tous les utilisateurs ont déjà été invités' }, { status: 400 });
    }

    // 8. Traitement des nouvelles invitations, en envoyant les emails un à un
    for (const invitationData of newInvitations) {
      const { email, role } = invitationData;

      // 9. Vérifier si le rôle est valide (insensible à la casse)
      if (!['MEMBRE', 'ADMIN'].includes(role.toUpperCase())) {
        return NextResponse.json({ error: `Rôle ${role} non valide` }, { status: 400 });
      }
      console.log('Envoi de l\'invitation à :', email);

      // 10. Générer un token d'invitation unique
      const inviteToken = generateRandomToken();
      console.log('Token d\'invitation généré :', inviteToken);

      // 11. Créer un token de vérification dans la base de données
      await prisma.verificationToken.create({
        data: {
          identifier: email,       // Identifier est l'email de l'utilisateur invité
          token: inviteToken,      // Le token d'invitation généré
          expires: new Date(Date.now() + 3600000), // Expiration du token dans 1 heure
        },
      });

      // 12. Créer l'invitation dans la base de données
      const invitation = await prisma.invitation.create({
        data: {
          email,
          role,
          organisationId,
          invitedById: userId, // Associe l'utilisateur qui envoie l'invitation
        },
      });

      // 13. Vérifier si un utilisateur existe déjà avec cet email
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        console.log('Utilisateur existant trouvé :', user.email);
        
        // Associer l'utilisateur à l'organisation si l'utilisateur existe déjà
        await prisma.organisation.update({
          where: { id: organisationId },
          data: {
            members: {
              connect: { id: user.id }, // Connecter l'utilisateur existant à l'organisation
            },
          },
        });

        // Contenu de l'email pour un utilisateur existant
        const emailTemplate = `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invitation à rejoindre l'organisation HT241</title>
          </head>
          <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center;">
            <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 600px; width: 100%;">
              <h1 style="text-align: center; font-size: 24px; margin-bottom: 24px; font-weight: normal;">
                Vous êtes invité à rejoindre l'organisation HT241
              </h1>
              <p style="margin-bottom: 16px;">Bonjour ${email},</p>
              <p style="margin-bottom: 32px; line-height: 1.5;">
                Vous êtes invité à rejoindre l'organisation HT241 en tant que <strong>${role}</strong>.
              </p>
              <p style="margin-bottom: 16px; color: #333;">
                Vous avez déjà un compte. Cliquez sur le lien ci-dessous pour vérifier et accepter l'invitation :
              </p>
              <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/accept-invitation/${inviteToken}" 
                 style="display: block; width: fit-content; margin: 0 auto 32px; padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">
                Accepter l'invitation
              </a>
              <p style="margin-bottom: 16px; color: #333;">Ou vous pouvez copier et coller ce lien dans votre navigateur :</p>
              <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/accept-invitation/${inviteToken}" 
                 style="color: #0066cc; word-break: break-all; text-decoration: none; margin-bottom: 32px; display: block;">
                ${process.env.NEXT_PUBLIC_FRONTEND_URL}/accept-invitation/${inviteToken}
              </a>
            </div>
          </body>
          </html>
        `;
        
        // Envoyer l'email d'invitation pour un utilisateur existant
        await sendMail({
          to: email,
          name: 'HT241 Team',   
          subject: 'Invitation à rejoindre l\'organisation HT241',
          body: emailTemplate,
        });
      } else {
        console.log('Aucun utilisateur trouvé, création d\'un nouvel utilisateur');

        // Créer un nouvel utilisateur avec un mot de passe par défaut
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10); 

        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role: role.toUpperCase(),
            name: email.split('@')[0],
          },
        });

        console.log('Nouvel utilisateur créé :', user.email);
        
        // Associer le nouvel utilisateur à l'organisation
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
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invitation à rejoindre l'organisation HT241</title>
          </head>
          <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center;">
            <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 600px; width: 100%;">
              <h1 style="text-align: center; font-size: 24px; margin-bottom: 24px; font-weight: normal;">
                Vous êtes invité à rejoindre l'organisation HT241
              </h1>
              <p style="margin-bottom: 16px;">Bonjour ${email},</p>
              <p style="margin-bottom: 32px; line-height: 1.5;">
                Vous êtes invité à rejoindre l'organisation HT241 en tant que <strong>${role}</strong>.
              </p>
              <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/accept-invitation/${inviteToken}" 
                 style="display: block; width: fit-content; margin: 0 auto 32px; padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">
                Accepter l'invitation
              </a>
              <p style="margin-bottom: 16px; color: #333;">Ou vous pouvez copier et coller ce lien dans votre navigateur :</p>
              <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/accept-invitation/${inviteToken}" 
                 style="color: #0066cc; word-break: break-all; text-decoration: none; margin-bottom: 32px; display: block;">
                ${process.env.NEXT_PUBLIC_FRONTEND_URL}/accept-invitation/${inviteToken}
              </a>
            </div>
          </body>
          </html>
        `;
        
        // Envoyer l'email d'invitation pour un nouvel utilisateur
        await sendMail({
          to: email,
          name: 'HT241 Team',
          subject: 'Invitation à rejoindre l\'organisation HT241',
          body: emailTemplate,
        });
      }
    }

    return NextResponse.json(
      { message: `Invitation${newInvitations.length > 1 ? 's' : ''} envoyée${newInvitations.length > 1 ? 's' : ''} avec succès.` },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur générée:', error); // Affiche l'objet d'erreur complet
    return NextResponse.json({ error: 'Une erreur s\'est produite lors de l\'envoi des invitations.' }, { status: 500 });
  }
}
