import { auth } from '@/auth';
import { generateRandomToken } from '@/lib/generateRandomToken';
import { NextResponse } from 'next/server';
import sendMail from '@/lib/sendmail';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const DEFAULT_PASSWORD = 'password123';
const VALID_ROLES = ['MEMBRE', 'ADMIN', 'READ'];

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
    }
    const userId = session.user.id;

    const organisation = await prisma.organisation.findFirst({ take: 1 });
    if (!organisation) {
      return NextResponse.json({ error: 'Aucune organisation trouvée dans le système' }, { status: 400 });
    }

    const organisationId = organisation.id;

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

    const existingInvitations = await prisma.invitation.findMany({
      where: {
        email: { in: invitations.map((invitation: any) => invitation.email) },
        organisationId,
      },
    });

    const existingEmails = existingInvitations.map((invitation: { email: any; }) => invitation.email);

    const newInvitations = invitations.filter(
      (invitation: any) => !existingEmails.includes(invitation.email)
    );

    if (newInvitations.length === 0) {
      return NextResponse.json({ error: 'Tous les utilisateurs ont déjà été invités' }, { status: 400 });
    }

    for (const invitationData of newInvitations) {
      let { email, role } = invitationData;

      if (!VALID_ROLES.includes(role.toUpperCase())) {
        role = 'READ';
        console.warn(`Rôle ${role} non valide, utilisation du rôle par défaut 'READ'.`);
      }

      const inviteToken = generateRandomToken();

      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: inviteToken,
          expires: new Date(Date.now() + 3600000),
        },
      });

      const invitation = await prisma.invitation.create({
        data: {
          email,
          role,
          organisationId,
          invitedById: userId,
          token: inviteToken,
          tokenExpiresAt: new Date(Date.now() + 3600000),
          accessType: 'READ',
        },
      });

      // ✅ Journal d’activité : création d’invitation
      await prisma.activityLog.create({
        data: {
          action: 'INVITATION_CREATED',
          entityType: 'Invitation',
          entityId: invitation.id,
          newData: invitation,
          userId: userId,
          createdByUserId: userId,
          organisationId: organisationId,
          invitationId: invitation.id,
          relatedUserId: null,
        },
      });

      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role: role.toUpperCase(),
            name: '',
            organisations: {
              connect: { id: organisationId },
            },
          },
        });

        // ✅ Journal d’activité : création d’utilisateur
        await prisma.activityLog.create({
          data: {
            action: 'USER_CREATED_VIA_INVITE',
            entityType: 'User',
            entityId: user.id,
            newData: user,
            userId: userId,
            createdByUserId: userId,
            organisationId: organisationId,
            relatedUserId: user.id,
          },
        });
      }

      const emailTemplate = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Vérification de l'email</title></head>
<body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: sans-serif;">
  <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
    <h1 style="text-align: center;">Vérification de l'email</h1>
    <p>Bonjour ${email},</p>
    <p>Pour finaliser votre inscription dans l'organisation <strong>${organisation.name}</strong>, vous devez vérifier votre adresse e-mail.</p>
    <p>Votre rôle dans l'organisation est : <strong>${role}</strong>.</p>
    <a href="https://erpht241.vercel.app/accept-invitation/${inviteToken}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 4px;">Vérifier l'email</a>
    <p>Ou copiez/collez cette URL dans votre navigateur :</p>
    <p><a href="https://erpht241.vercel.app/accept-invitation/${inviteToken}">https://erpht241.vercel.app/accept-invitation/${inviteToken}</a></p>
    <p>Mot de passe par défaut : <code>${DEFAULT_PASSWORD}</code></p>
  </div>
</body>
</html>`;

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
