import { auth } from '@/auth';
import { generateRandomToken } from '@/lib/generateRandomToken';
import { NextResponse } from 'next/server';
import sendMail from '@/lib/sendmail';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { inngest } from '@/inngest/client';

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

    const body = await req.json();
    const invitations = body.invitations || [];

    if (invitations.length === 0) {
      return NextResponse.json({ error: 'Aucune invitation fournie' }, { status: 400 });
    }

    const existingInvitations = await prisma.invitation.findMany({
      where: {
        email: { in: invitations.map((inv: any) => inv.email) },
        organisationId,
      },
    });

    const existingEmails = existingInvitations.map(inv => inv.email);
    const newInvitations = invitations.filter((inv: { email: string }) => !existingEmails.includes(inv.email));

    if (newInvitations.length === 0) {
      return NextResponse.json({ error: 'Tous les utilisateurs ont déjà été invités' }, { status: 400 });
    }

    for (const { email, role: rawRole } of newInvitations) {
      const role = VALID_ROLES.includes(rawRole.toUpperCase()) ? rawRole.toUpperCase() : 'READ';
      const inviteToken = generateRandomToken();
      const tokenExpires = new Date(Date.now() + 3600000); // 1 heure

      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: inviteToken,
          expires: tokenExpires,
        },
      });

      const invitation = await prisma.invitation.create({
        data: {
          email,
          role,
          organisationId,
          invitedById: userId,
          token: inviteToken,
          tokenExpiresAt: tokenExpires,
          accessType: 'READ',
        },
      });

      await inngest.send({
        name: 'invitation/created',
        data: {
          invitationId: invitation.id,
          userId,
          organisationId,
          email,
          role,
        },
      });

      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role,
            name: '',
            organisations: {
              connect: { id: organisationId },
            },
          },
        });

        await inngest.send({
          name: 'user/created-via-invite',
          data: {
            userId: user.id,
            createdByUserId: userId,
            organisationId,
            email,
            role,
          },
        });
      }

      const emailTemplate = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Invitation à rejoindre l'organisation</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
    h1 { text-align: center; font-size: 24px; }
    p { line-height: 1.6; }
    .btn { display: inline-block; padding: 12px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    .footer { margin-top: 30px; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Vous êtes invité sur HT241</h1>
    <p>Bonjour ${email},</p>
    <p>Vous avez été invité(e) à rejoindre l'organisation <strong>${organisation.name}</strong> avec le rôle : <strong>${role}</strong>.</p>
    <p>Veuillez cliquer sur le bouton ci-dessous pour accepter l'invitation et activer votre compte :</p>
    <p style="text-align: center;">
      <a class="btn" href="https://erpht241.vercel.app/accept-invitation/${inviteToken}">Accepter l'invitation</a>
    </p>
    <p>Ou copiez/collez ce lien dans votre navigateur :</p>
    <p><a href="https://erpht241.vercel.app/accept-invitation/${inviteToken}">https://erpht241.vercel.app/accept-invitation/${inviteToken}</a></p>
    <p>Mot de passe temporaire : <code>${DEFAULT_PASSWORD}</code></p>
    <hr>
    <p class="footer">Si vous ne vous attendiez pas à recevoir cette invitation, vous pouvez ignorer ce message.</p>
  </div>
</body>
</html>
`;

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
